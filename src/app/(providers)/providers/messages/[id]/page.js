"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Send, Paperclip } from "lucide-react";
import { contactsAPI } from "@/lib/contacts-api";

export default function ProviderChat() {
  const { id: parentId } = useParams(); // parent ID from route
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [daycareId, setDaycareId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll down
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load contact info + messages
  useEffect(() => {
    if (parentId) fetchContactInfoAndMessages();
  }, [parentId]);

  const fetchContactInfoAndMessages = async () => {
    try {
      setLoading(true);
      const providerResponse = await contactsAPI.getContacts();

      if (providerResponse.status === "success") {
        const contact = providerResponse.contacts.find(
          (c) => String(c.parent_id) === String(parentId)
        );

        if (contact) {
          setContactInfo(contact);
          setDaycareId(contact.daycare_id);

          // Fetch ALL messages first time
          await fetchMessages(contact.daycare_id, parentId, false);
        }
      }
    } catch (err) {
      console.error("Fetch contact/messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Polling (only new messages)
  useEffect(() => {
    if (!daycareId || !parentId) return;
    const interval = setInterval(
      () => fetchMessages(daycareId, parentId, true),
      3000
    );
    return () => clearInterval(interval);
  }, [daycareId, parentId, messages]);

  // Fetch messages
  const fetchMessages = async (
    daycare = daycareId,
    parent = parentId,
    onlyNew = false
  ) => {
    if (!daycare || !parent) return;

    try {
      const lastId =
        onlyNew && messages.length > 0
          ? Math.max(...messages.map((m) => m.id))
          : 0;

      const res = await contactsAPI.getContactMessages(daycare, parent, lastId);

      if (res.status === "success" && res.messages.length > 0) {
        const formattedMessages = res.messages.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          attachments: msg.file_info ? [msg.file_info] : [],
          timestamp: msg.timestamp || msg.created_at,
          read: msg.seen,
          pending: false,
        }));

        setMessages((prev) => {
          if (!onlyNew) {
            // First load → replace entire list
            return formattedMessages.sort((a, b) => a.id - b.id);
          }
          // Polling → add only new
          const newMsgs = formattedMessages.filter(
            (m) => !prev.some((msg) => msg.id === m.id)
          );
          return [...prev, ...newMsgs].sort((a, b) => a.id - b.id);
        });
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!daycareId || !parentId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId,
      sender: "daycare",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
      pending: true,
      attachments: attachments.map((f) => ({
        file_name: f.name,
        file_url: URL.createObjectURL(f),
      })),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");
    setAttachments([]);
    setSending(true);

    try {
      const messageData = {
        daycare_id: daycareId,
        receiver_id: parseInt(parentId),
        text: tempMsg.text,
        type: attachments.length > 0 ? "file" : "text",
      };

      if (attachments.length > 0) {
        const uploaded = await Promise.all(
          attachments.map((f) => contactsAPI.uploadFile(f))
        );
        messageData.file_info = uploaded;
      }

      await contactsAPI.sendMessage(messageData);
      await contactsAPI.markAsSeen(daycareId, parentId);

      // Refresh with latest messages from backend
      await fetchMessages(daycareId, parentId, false);
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)] items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100 flex justify-between">
        <h2 className="font-semibold">
          {contactInfo ? contactInfo.name : `Parent #${parentId}`}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "parent" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                  msg.sender === "parent"
                    ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    : "bg-primary text-white rounded-tr-none"
                }`}
              >
                {msg.text && <p className="text-sm">{msg.text}</p>}

                {msg.attachments?.length > 0 &&
                  msg.attachments.map((f, i) => (
                    <a
                      key={i}
                      href={f.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline block mt-1"
                    >
                      {f.file_name}
                    </a>
                  ))}

                <div
                  className={`text-xs mt-1 flex justify-end ${
                    msg.sender === "parent" ? "text-gray-500" : "text-blue-100"
                  }`}
                >
                  {msg.timestamp}{" "}
                  {msg.sender === "daycare" &&
                    (msg.read ? "✓✓" : msg.pending ? "..." : "✓")}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <label className="cursor-pointer">
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setAttachments([...e.target.files])}
          />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 py-2 px-4 rounded-full border border-gray-200 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={sending || (!newMessage.trim() && attachments.length === 0)}
          className="p-2 bg-primary rounded-full text-white"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
