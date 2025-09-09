// components/ChatListItem.js
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChatListItem({ chat }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chats/daycare/${chat.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="relative flex-shrink-0 mr-3">
        <Image
          width={48}
          height={48}
          src={chat.avatar}
          alt={chat.daycareName}
          className="h-12 w-12 rounded-full object-cover"
        />
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{chat.daycareName}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">{chat.timestamp}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-white text-xs font-medium h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}