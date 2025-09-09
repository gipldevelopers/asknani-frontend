"use client";
import { useState } from "react";
import {
    Home,
    Calendar,
    Users,

    MessageSquare,
    Star,
    Settings,
    Menu,
    Bell,
    IndianRupee,
    Package,
    CircleFadingPlus,
    Binoculars
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItems from "./components/utils/NavItems";
import { MobileNav } from "./components/utils/MobileNav";
import Logo from "./components/utils/Logo";
import { ProfilePopover } from "./components/utils/Profile";
import { NotificationPopover } from "./components/utils/Notifications";
import ProviderFooter from "./components/utils/Footer";


export default function ProviderDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: "Dashboard", href: "/providers/dashboard", icon: Home },
        { name: "Bookings", href: "/providers/bookings", icon: Calendar, count: 3, hasUnread: true },
        { name: "Children", href: "/providers/childrens", icon: Users },
        { name: "Payments", href: "/providers/payments", icon: IndianRupee },
        { name: "Packages", href: "/providers/packages", icon: Package },
        { name: "Contents", href: "/providers/contents", icon: CircleFadingPlus },
        { name: "Messages", href: "/providers/messages", icon: MessageSquare },
        { name: "Tour Scheduled", href: "/providers/tour-scheduled", icon: Binoculars },
        { name: "Reviews", href: "/providers/reviews", icon: Star, count: 2, hasUnread: true },
        { name: "Settings", href: "#", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <Logo />
                    <NavItems navigation={navigation} />
                </div>
            </div>

            {/* Mobile sidebar */}
            <MobileNav navigation={navigation} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

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
                            <NotificationPopover />
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                            <ProfilePopover />
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
                <ProviderFooter/>
            </div>
        </div>
    );
}