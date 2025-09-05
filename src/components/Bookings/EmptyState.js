"use client";
import { Calendar } from "lucide-react";

export default function EmptyState({ activeTab, searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-gray-200">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
      <p className="text-gray-500 text-center">
        {searchQuery
          ? "Try a different search term"
          : `You don't have any ${activeTab} bookings yet`}
      </p>
    </div>
  );
}
