"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, ArrowRight, Image as ImageIcon, FileText } from "lucide-react";

export default function MessageThreadPage() {
  const { id } = useParams(); // contact ID from URL
  const [messages, setMessages] = useState([
    {
      id: "m1",
      type: "incoming",
      content: "Hello! I’d like to know about your daycare services.",
      timestamp: "2025-09-08T10:30:00Z",
    },
    {
      id: "m2",
      type: "outgoing",
      content: "Sure! We have full-day and half-day programs. Would you like to schedule a tour?",
      timestamp: "2025-09-08T10:32:00Z",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMsg = {
      id: `m${messages.length + 1}`,
      type: "outgoing",
      content: newMessage,
      attachments,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setAttachments([]);
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto border rounded-lg">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <h2 className="font-semibold">Chat with Contact {id}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 shadow ${
                msg.type === "outgoing"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white"
              }`}
            >
              {msg.content && <p className="text-sm">{msg.content}</p>}

              {/* attachments */}
              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map((file, idx) => {
                    const isImage = file.type?.startsWith("image/");
                    return (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="h-20 w-20 object-cover rounded"
                          />
                        ) : (
                          <div className="flex items-center gap-1 text-blue-600 underline">
                            <FileText className="h-4 w-4" /> {file.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                className={`text-[10px] mt-1 ${
                  msg.type === "outgoing" ? "text-primary-foreground/70" : "text-gray-500"
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <label className="cursor-pointer">
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
          />
        </label>
        <Textarea
          placeholder="Type your message..."
          className="flex-1 resize-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim() && attachments.length === 0}>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Preview attachments before sending */}
      {attachments.length > 0 && (
        <div className="p-2 border-t flex gap-2 overflow-x-auto bg-muted/20">
          {attachments.map((file, idx) => {
            const isImage = file.type?.startsWith("image/");
            return (
              <div key={idx} className="relative">
                {isImage ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center border rounded bg-white text-xs px-1">
                    {file.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
