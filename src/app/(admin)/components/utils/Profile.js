"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import useAuthStore from "@/stores/AuthStore";
import { useRouter } from "next/navigation";

export function ProfilePopover() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Fallback values
  const userName = user?.full_name || "Unknown User";
  const userRole = user?.role?.toUpperCase() || "USER";
  const profilePhoto = user?.profile_photo
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profile_photo}`
    : null;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Popover className="p-2">
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-2 lg:px-3 flex items-center gap-2"
        >
          <Avatar className="h-8 w-8">
            {profilePhoto ? (
              <AvatarImage src={profilePhoto} alt={userName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>

          <div className="hidden lg:flex lg:flex-col lg:items-start lg:leading-tight text-left">
            <span className="text-sm font-semibold text-gray-900">{userName}</span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {profilePhoto ? (
              <AvatarImage src={profilePhoto} alt={userName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{userName}</div>
            <div className="text-xs text-muted-foreground">{userRole}</div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="py-2">
          <button className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>

        <Separator />

        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
