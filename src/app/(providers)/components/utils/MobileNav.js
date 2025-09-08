"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "./Logo";

export const MobileNav = ({ navigation, sidebarOpen, setSidebarOpen }) => {
    const pathname = usePathname();

    return (
        <>
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-900/80"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-6 pb-4">
                        {/* Header */}
                        <div className="flex h-16 items-center justify-between">
                            <Logo />
                            <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Nav */}
                        <nav className="mt-8">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => {
                                            const isActive =
                                                pathname === item.href || pathname.startsWith(item.href);

                                            return (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={`group flex items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${isActive
                                                                ? "bg-primary text-white"
                                                                : "text-gray-700 hover:text-primary hover:bg-gray-50"
                                                            }`}
                                                        onClick={() => setSidebarOpen(false)} // auto-close on click
                                                    >
                                                        <div className="flex items-center gap-x-3">
                                                            <item.icon className="h-6 w-6 shrink-0" />
                                                            {item.name}
                                                        </div>

                                                        {/* Notification Badge */}
                                                        {item.count ? (
                                                            <span
                                                                className={`ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-medium ${item.hasUnread
                                                                        ? "bg-red-500 text-white"
                                                                        : "bg-gray-300 text-gray-700"
                                                                    }`}
                                                            >
                                                                {item.count}
                                                            </span>
                                                        ) : null}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};
