"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, ArrowRight, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { contactsAPI } from "@/lib/contacts-api";


export default function MessageThreadPage() {
  const { id } = useParams(); // parent ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [daycareId, setDaycareId] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages and contact info
  useEffect(() => {
    if (id) {
      fetchContactInfoAndMessages();
      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [id]);

  const fetchContactInfoAndMessages = async () => {
    try {
      setLoading(true);
      
      // First, get daycare ID from provider info
      const providerResponse = await contactsAPI.getContacts();
      if (providerResponse.status === 'success') {
        const contact = providerResponse.contacts.find(c => c.parent_id == id);
        if (contact) {
          setContactInfo(contact);
          setDaycareId(contact.daycare_id); // Assuming daycare_id is available in contact info
        }
      }

      await fetchMessages();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!daycareId) return;
    
    try {
      const lastId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) : 0;
      const response = await contactsAPI.getContactMessages(daycareId, id, lastId);
      
      if (response.status === 'success') {
        const formattedMessages = response.messages.map(msg => ({
          id: msg.id,
          type: msg.provider_id ? 'outgoing' : 'incoming',
          content: msg.text,
          attachments: msg.file_info ? [msg.file_info] : [],
          timestamp: msg.created_at,
          seen: msg.seen
        }));
        
        setMessages(prev => {
          const newMessages = formattedMessages.filter(newMsg => 
            !prev.some(existingMsg => existingMsg.id === newMsg.id)
          );
          return [...prev, ...newMessages];
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !daycareId) return;

    setSending(true);
    
    try {
      const messageData = {
        daycare_id: daycareId,
        text: newMessage.trim(),
        receiver_id: parseInt(id),
        type: attachments.length > 0 ? 'file' : 'text'
      };

      // Handle file attachments
      if (attachments.length > 0) {
        const fileUploadPromises = attachments.map(file => 
          contactsAPI.uploadFile(file)
        );
        
        const uploadResults = await Promise.all(fileUploadPromises);
        messageData.file_info = uploadResults.map(result => ({
          file_name: result.file_name,
          file_url: result.file_url,
          file_size: result.file_size,
          mime_type: result.mime_type
        }));
      }

      await contactsAPI.sendMessage(messageData);
      
      // Add message optimistically to UI
      const optimisticMessage = {
        id: Date.now(), // Temporary ID until real one comes from server
        type: 'outgoing',
        content: newMessage.trim(),
        attachments: messageData.file_info || [],
        timestamp: new Date().toISOString(),
        seen: false
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");
      setAttachments([]);
      
      // Mark messages as seen
      await contactsAPI.markAsSeen(daycareId, id);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (max 10MB each)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto border rounded-lg items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto border rounded-lg">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div>
          <h2 className="font-semibold">
            {contactInfo ? `Chat with ${contactInfo.name}` : `Contact #${id}`}
          </h2>
          {contactInfo && (
            <p className="text-sm text-muted-foreground">
              {contactInfo.childName} ({contactInfo.childAge} years)
            </p>
          )}
        </div>
        {contactInfo && (
          <div className="text-sm text-muted-foreground">
            {contactInfo.email} • {contactInfo.phone}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="text-center text-xs text-muted-foreground my-4">
                {formatDate(dateMessages[0].timestamp)}
              </div>
              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 shadow ${
                      msg.type === "outgoing"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white border"
                    }`}
                  >
                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}

                    {/* Attachments */}
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((file, idx) => {
                          const isImage = file.mime_type?.startsWith("image/") || 
                                        file.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              {isImage ? (
                                <div className="relative h-20 w-20">
                                  <Image
                                    src={file.file_url || URL.createObjectURL(file)}
                                    alt="Attachment"
                                    fill
                                    className="object-cover rounded"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <a 
                                  href={file.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 border rounded bg-background hover:bg-muted"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="text-xs max-w-[200px] truncate">
                                    {file.file_name || file.name}
                                  </span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-1 flex items-center gap-1 ${
                        msg.type === "outgoing" ? "text-primary-foreground/70" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                      {msg.type === 'outgoing' && (
                        <span>{msg.seen ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t bg-background">
        {/* Preview attachments before sending */}
        {attachments.length > 0 && (
          <div className="mb-3 p-2 border rounded-lg bg-muted/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Attachments ({attachments.length})</span>
              <Button variant="ghost" size="sm" onClick={() => setAttachments([])}>
                Clear all
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {attachments.map((file, idx) => {
                const isImage = file.type?.startsWith("image/");
                const objectUrl = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative group">
                    {isImage ? (
                      <div className="relative h-16 w-16">
                        <Image
                          src={objectUrl}
                          alt="Preview"
                          fill
                          className="object-cover rounded border"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center border rounded bg-white text-xs px-1 break-words">
                        {file.name}
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeAttachment(idx)}
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Paperclip className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleAttachmentChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </label>
          <Textarea
            placeholder="Type your message..."
            className="flex-1 resize-none min-h-[40px] max-h-[120px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sending}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={(!newMessage.trim() && attachments.length === 0) || sending}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}