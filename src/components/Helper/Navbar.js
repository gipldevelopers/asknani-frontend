"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = false; // 🔑 Replace with real auth state later
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/daycares", label: "Browse Daycares" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/placeholder.jpg" // 👉 put this in /public
              alt="Marketplace Logo"
              width={140}
              height={45}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 ml-10">
            {/* Nav Links */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative font-medium text-gray-700 transition-colors
                    ${pathname === link.href ? "text-indigo-600 after:w-full" : "hover:text-indigo-600"}
                    after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2.5px] after:bg-indigo-600 after:transition-all after:duration-300
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form action={"/daycares"} method="get" className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search daycares..."
                  name="search"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                />
              </div>
            </form>

            {/* CTA / Profile */}
            <div className="ml-6">
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
                      className="rounded-full border border-gray-200 hover:scale-105 transition transform"
                    />
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-up">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                        My Profile
                      </Link>
                      <Link href="/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                        My Bookings
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                        Settings
                      </Link>
                      <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/get-started"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
            >
              <svg
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Search in Mobile Menu */}
            <form action={"/daycares"} method="get">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search daycares..."
                  name="search"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                />
              </div>
            </form>

            {/* Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    block px-4 py-3 rounded-lg font-medium transition-colors
                    ${pathname === link.href ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA / Profile in Mobile */}
            <div className="border-t border-gray-200 pt-6 mt-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <Link href="/profile" className="block w-full text-center px-5 py-3 bg-white border border-gray-200 text-gray-800 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    My Profile
                  </Link>
                  <Link href="/bookings" className="block w-full text-center px-5 py-3 bg-white border border-gray-200 text-gray-800 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    My Bookings
                  </Link>
                  <button className="w-full text-center px-5 py-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/get-started"
                  className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}