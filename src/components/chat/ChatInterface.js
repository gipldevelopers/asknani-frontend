// components/ChatInterface.js
"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Smile, ArrowLeft, Video, Phone, MoreVertical, Search, Clock, MapPin } from "lucide-react";

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm interested in enrolling my daughter in your daycare. Could you tell me more about your programs for 3-year-olds?",
            sender: "parent",
            timestamp: "10:30 AM",
            read: true
        },
        {
            id: 2,
            text: "Of course! We have a wonderful preschool program for 3-year-olds that focuses on social skills, early literacy, and creative play. We'd be happy to give you a tour of our facility.",
            sender: "provider",
            timestamp: "10:32 AM",
            read: true
        },
        {
            id: 3,
            text: "That sounds perfect. When would be a good time for a tour?",
            sender: "parent",
            timestamp: "10:33 AM",
            read: true
        },
        {
            id: 4,
            text: "We have availability tomorrow between 10 AM - 2 PM, or Thursday between 9 AM - 11 AM. Would either of those work for you?",
            sender: "provider",
            timestamp: "10:35 AM",
            read: true
        },
        {
            id: 5,
            text: "Tomorrow at 10 AM would be great. Looking forward to it!",
            sender: "parent",
            timestamp: "10:36 AM",
            read: false
        }
    ]);
    const inputRef = useRef(null); // 👈 ref for the input wrapper

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Sample daycare info
    const daycareInfo = {
        name: "Sunshine Kids Daycare",
        lastSeen: "2 minutes ago",
        avatar: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    };

    const scrollToInput = () => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToInput();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            id: messages.length + 1,
            text: newMessage,
            sender: "parent",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");

        // Simulate provider typing and response
        setIsTyping(true);
        setTimeout(() => {
            const response = {
                id: messages.length + 2,
                text: "Great! We'll see you tomorrow at 10 AM. Please bring your ID for security check-in.",
                sender: "provider",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: false
            };
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <button className="mr-2 md:hidden">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center">
                        <img
                            src={daycareInfo.avatar}
                            alt={daycareInfo.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">{daycareInfo.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Last seen {daycareInfo.lastSeen}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Phone className="h-5 w-5 text-primary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <MapPin className="h-5 w-5 text-primary" />
                    </button>
                    {/* <button className="p-2 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button> */}
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "parent" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${message.sender === "parent"
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <div className={`text-xs mt-1 flex justify-end ${message.sender === "parent" ? "text-blue-100" : "text-gray-500"}`}>
                                    {message.timestamp}
                                    {message.sender === "parent" && (
                                        <span className="ml-1">
                                            {message.read ? "✓✓" : "✓"}
                                        </span>
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
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div ref={inputRef} className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full py-3 pl-4 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />

                    </div>
                    <div className="ml-2 flex">
                        {newMessage ? (
                            <button
                                onClick={handleSendMessage}
                                className="p-3 bg-primary rounded-full hover:bg-primary-hover transition"
                            >
                                <Send className="h-5 w-5 text-white" />
                            </button>
                        ) : (null)}
                    </div>
                </div>
            </div>
        </div>
    );
}