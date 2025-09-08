"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0">
        {/* Header */}
        <div className="px-4 py-2 font-semibold text-sm">Notifications</div>
        <Separator />

        {/* Notifications list */}
        <div className="max-h-60 overflow-y-auto">
          <div className="px-4 py-3 text-sm hover:bg-accent cursor-pointer">
            📅 New booking request from <span className="font-medium">Anita</span>
          </div>
          <div className="px-4 py-3 text-sm hover:bg-accent cursor-pointer">
            💬 New message from <span className="font-medium">Rohit</span>
          </div>
          <div className="px-4 py-3 text-sm hover:bg-accent cursor-pointer">
            ⭐ Parent left you a new review
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
