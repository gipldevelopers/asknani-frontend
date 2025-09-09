// app/chats/page.js
"use client";
import { useState } from "react";
import { Search, Filter, ChevronLeft, MoreHorizontal, MessageSquare } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import Link from "next/link";
import Image from "next/image";

export default function ChatsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeChat, setActiveChat] = useState(null);

  // Sample chat data
  const chats = [
    {
      id: 1,
      daycareName: "Sunshine Kids Daycare",
      lastMessage: "Great! We'll see you tomorrow at 10 AM",
      timestamp: "10:42 AM",
      unreadCount: 0,
      avatar: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isOnline: true
    },
    {
      id: 2,
      daycareName: "Little Explorers Preschool",
      lastMessage: "We have an opening for your son's age group",
      timestamp: "Yesterday",
      unreadCount: 3,
      avatar: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isOnline: false
    },
    {
      id: 3,
      daycareName: "Bright Beginnings Center",
      lastMessage: "Thanks for submitting the application form",
      timestamp: "Yesterday",
      unreadCount: 0,
      avatar: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isOnline: true
    },
    {
      id: 4,
      daycareName: "Happy Tots Childcare",
      lastMessage: "Could you provide the vaccination records?",
      timestamp: "Monday",
      unreadCount: 1,
      avatar: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isOnline: false
    },
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.daycareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "unread") {
      return matchesSearch && chat.unreadCount > 0;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Sidebar: Chat List */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Link href={"/"}>
                <button className="p-2 mr-2 rounded-full hover:bg-gray-100 md:hidden">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              {activeFilter === "unread" && (
                <span className="ml-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {chats.filter(chat => chat.unreadCount > 0).length}
                </span>
              )}
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Search + Filter */}
          <div className="px-4 pb-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={() =>
                  setActiveFilter(activeFilter === "unread" ? "all" : "unread")
                }
                className={`px-3 py-2 rounded-lg flex items-center transition ${activeFilter === "unread"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat List */}
        <main className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`cursor-pointer transition ${activeChat?.id === chat.id ? "bg-primary/5" : "hover:bg-gray-50"
                    }`}
                >
                  <ChatListItem chat={chat} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No messages found</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Your conversations will appear here"}
              </p>
            </div>
          )}
        </main>
      </aside>

      {/* Right Panel: Active Chat Preview */}
      <section className="hidden md:flex flex-1 items-center justify-center">
        {activeChat ? (
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-lg">
            <Image
              width={20}
              height={20}
              src={activeChat.avatar}
              alt={activeChat.daycareName}
              className="w-20 h-20 rounded-full mb-4 ring-4 ring-primary/10"
            />
            <h2 className="text-xl font-semibold text-gray-900">{activeChat.daycareName}</h2>
            <p className="text-gray-500 mt-2">{activeChat.lastMessage}</p>
            <button className="mt-6 px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition">
              Open Chat
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">Select a chat to view</p>
          </div>
        )}
      </section>
    </div>
  );
}
