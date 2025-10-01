"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, User, Building2 } from "lucide-react";
import useAuthStore from "@/stores/AuthStore";
import { useRouter } from "next/navigation";
import useDaycareAuthStore from "@/stores/ProvidersStore";
import { useEffect } from "react";
import Link from "next/link";

// ✅ use store logout
export function ProfilePopover() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };
  const { daycare, fetchDaycare } = useDaycareAuthStore();

  useEffect(() => {
    fetchDaycare();
  }, [fetchDaycare]);

  const { user } = useAuthStore();
  return (
    <Popover className="p-2">
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-2 lg:px-3 flex items-center gap-2 p-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Text only on large screens (your original block) */}
          <div className="hidden lg:flex lg:flex-col lg:items-start lg:leading-tight text-left">
            <span className="text-sm font-semibold text-gray-900">
              {user?.full_name}
            </span>
            <span className="text-xs text-gray-500">{daycare?.name}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {" "}
              {user?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <div className="text-sm font-semibold"> {user?.full_name}</div>
            <div className="text-xs text-muted-foreground">{daycare?.name}</div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="py-2">
          <Link href={"/providers/settings"}>
          <button className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          </Link>
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
