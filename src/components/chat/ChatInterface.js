"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Clock, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import API from "@/lib/api";

export default function ChatInterface({ daycare, parentId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Keep track of last fetched backend message ID
  const lastIdRef = useRef(0);

  const fetchMessages = async () => {
    if (!daycare?.id) return;

    try {
      const res = await API.get(`/chat/${daycare.id}/messages`, {
        params: { last_id: lastIdRef.current, parent_id: parentId },
      });

      const newMessages = res.data.messages || [];

      if (newMessages.length > 0) {
        // Update lastIdRef with the highest backend ID
        lastIdRef.current = Math.max(...newMessages.map((m) => m.id));

        const uniqueMessages = newMessages.filter(
          (m) =>
            !messages.some(
              (msg) => msg.id === m.id || (msg.pending && msg.text === m.text)
            )
        );

        setMessages((prev) =>
          prev
            .map((msg) =>
              msg.pending && uniqueMessages.some((um) => um.text === msg.text)
                ? {
                    ...uniqueMessages.find((um) => um.text === msg.text),
                    pending: false,
                  }
                : msg
            )
            .concat(
              uniqueMessages.filter(
                (um) => !prev.some((msg) => msg.text === um.text && msg.pending)
              )
            )
        );
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // Poll messages every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [daycare]);

  // Mark messages as seen
  useEffect(() => {
    if (daycare?.id) {
      API.post(`/chat/${daycare.id}/seen`);
    }
  }, [daycare]);

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg = {
      id: tempId, // use this as temporary unique id
      tempId,
      text: newMessage,
      sender: "parent",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
      pending: true, // temporary flag
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    setIsTyping(true);

    try {
      await API.post("/chat/send", {
        daycare_id: daycare.id,
        text: tempMsg.text,
        type: "text",
        receiver_id: null,
      });

      setIsTyping(false);
      fetchMessages(); // fetch new messages from backend
    } catch (err) {
      console.error("Send message error:", err);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Image
            width={40}
            height={40}
            src={
              daycare?.images?.[0]?.url
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${daycare.images[0].url}`
                : "/default-avatar.png"
            }
            alt={daycare?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{daycare?.name}</h3>
            <p className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last seen {daycare?.lastSeen || "online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone className="h-5 w-5 text-primary" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MapPin className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="text-center text-gray-400 mt-10">
              No messages yet. Start the conversation!
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={msg.pending ? msg.tempId : `msg-${msg.id}-${index}`}
              className={`flex ${
                msg.sender === "parent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                  msg.sender === "parent"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={`text-xs mt-1 flex justify-end ${
                    msg.sender === "parent" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {msg.timestamp}
                  {msg.sender === "parent" && (
                    <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none px-4 py-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 py-3 pl-4 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {newMessage && (
            <button
              onClick={handleSendMessage}
              className="ml-2 p-3 bg-primary rounded-full hover:bg-primary-hover transition"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
