"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = false; // replace later with real auth state

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 space-x-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png" // 👉 keep logo in /public
              alt="Logo"
              width={140}
              height={45}
              className="object-contain"
            />
          </Link>

          {/* Location + Search */}
          <div className="flex-1 flex items-center max-w-3xl">
            {/* Location Selector */}
            <button className="flex items-center space-x-2 px-4 py-2 rounded-l-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-medium">
              <MapPin size={18} className="text-primary" />
              <span>New Delhi</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for daycares, services..."
                className="w-full pl-11 pr-4 py-2 rounded-r-full border border-l-0 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
          </div>

          {/* CTA / Profile */}
          <div className="ml-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src="/avatar-placeholder.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-200 hover:scale-105 transition"
                  />
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      My Bookings
                    </Link>
                    <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/get-started"
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-full shadow hover:shadow-md hover:bg-primary/90 transition"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
