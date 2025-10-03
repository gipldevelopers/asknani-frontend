"use client";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  Settings,
  Menu,
  Building2,
  School,
  BadgeCheck,
  ClipboardList,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItems from "./NavItems";
import { MobileNav } from "./MobileNav";
import { NotificationPopover } from "./Notifications";
import { ProfilePopover } from "./Profile";
import BrandCard from "./Logo";
import ProviderFooter from "./Footer";
import useAuthStore from "@/stores/AuthStore";

const ProviderDashboardLayout = ({ children }) => {
  const loadToken = useAuthStore((state) => state.loadToken);

  useEffect(() => {
    loadToken(); // ✅ load token once on app mount
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminNavigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },

    // Cities Management
    { name: "Cities", href: "/admin/cities", icon: Building2 },

    { name: "Facilities", href: "/admin/facilities", icon: ClipboardList },

    // Daycares
    { name: "Daycares", href: "/admin/daycares", icon: School },

    // Users
    { name: "Users", href: "/admin/users", icon: Users },

    // Approvals
    { name: "Approvals", href: "/admin/approvals", icon: BadgeCheck },

    // Reports
    // { name: "Reports", href: "/admin/reports", icon: ClipboardList },

    // // Analytics / Traffic
    // { name: "Analytics", href: "/admin/analytics", icon: Activity },

    // Settings
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {" "}
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <BrandCard />
          <NavItems navigation={adminNavigation} />
        </div>
      </div>
      {/* Mobile sidebar */}
      <MobileNav
        navigation={adminNavigation}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="-m-2.5 p-2.5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
   
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <ProfilePopover />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <ProviderFooter />
      </div>
    </>
  );
};

export default ProviderDashboardLayout;
