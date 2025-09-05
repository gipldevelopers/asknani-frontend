"use client";
import { ChevronLeft, MoreVertical } from "lucide-react";

export default function BookingHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="p-2 mr-2 rounded-full hover:bg-gray-100 md:hidden">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
