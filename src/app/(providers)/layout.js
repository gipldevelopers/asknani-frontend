// components/provider-dashboard/layout.jsx
"use client";
import { useState } from "react";
import {
    Home,
    Calendar,
    Users,
    DollarSign,
    MessageSquare,
    Star,
    Settings,
    Menu,
    X,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: "Dashboard", href: "providers/dashboard", icon: Home, current: true },
        { name: "Bookings", href: "providers/bookings", icon: Calendar, current: false },
        { name: "Children", href: "#", icon: Users, current: false },
        { name: "Payments", href: "#", icon: DollarSign, current: false },
        { name: "Messages", href: "#", icon: MessageSquare, current: false },
        { name: "Reviews", href: "#", icon: Star, current: false },
        { name: "Settings", href: "#", icon: Settings, current: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <h1 className="text-2xl font-bold text-primary">DayCarePro</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${item.current
                                                        ? 'bg-primary text-white'
                                                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                                    }`}
                                            >
                                                <item.icon className="h-6 w-6 shrink-0" />
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-6 pb-4">
                        <div className="flex h-16 items-center justify-between">
                            <h1 className="text-2xl font-bold text-primary">DayCarePro</h1>
                            <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <nav className="mt-8">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${item.current
                                                            ? 'bg-primary text-white'
                                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

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
                            <Button variant="ghost" className="relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                    3
                                </span>
                            </Button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                            <div className="flex items-center gap-x-2">
                                <img
                                    className="h-8 w-8 rounded-full bg-gray-50"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                                <div className="hidden lg:flex lg:flex-col lg:items-start lg:leading-tight">
                                    <span className="text-sm font-semibold text-gray-900">Rajesh Kumar</span>
                                    <span className="text-xs text-gray-500">Sunshine Daycare</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}