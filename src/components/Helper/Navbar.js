"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Menu, X, User } from "lucide-react";
import { MessageCircle } from "lucide-react";

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Surat", "Kanpur", "Nagpur", "Visakhapatnam", "Bhopal",
  "Patna", "Ludhiana", "Agra", "Nashik", "Vadodara"
];

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // demo


  const isLoggedIn = true; // replace later with real auth state
  const cityDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = indianCities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    setCitySearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="CareFinder Logo"
              width={140}
              height={40}
              priority
              className="object-contain h-10 w-auto"
            />
          </Link>

          {/* Desktop Search & City Selector */}
          <div className="hidden md:flex flex-1 items-center max-w-3xl mx-8">
            {/* City Selector */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-l-full border border-gray-300 bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-medium min-w-[140px]"
              >
                <MapPin size={18} className="text-indigo-600" />
                <span className="truncate max-w-[80px]">{selectedCity}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search cities..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedCity === city
                            ? "bg-indigo-50 text-primary-hover"
                            : ""
                            }`}
                        >
                          {city}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for daycares, services..."
                className="w-full pl-11 pr-4 py-2 rounded-r-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Right: Profile, Chat, Hamburger */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-indigo-600"
            >
              <Search size={22} />
            </button>

            {/* Chat Icon with Count */}
            {isLoggedIn ? (
              <div className="relative">
                <Link
                  href="/chats"
                  className="p-2 text-gray-500 hover:text-indigo-600 relative"
                >
                  <MessageCircle size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute mt-7 -top-1 -right-1 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full shadow">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            ) : null}

            {/* Profile / Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                      <User size={20} />
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-[111111]  border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile/my-bookings"
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
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-hover shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-indigo-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-2 mb-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search daycares..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-2 ">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="block text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Profile
                </Link>
                <Link
                  href="/profile/my-bookings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Bookings
                </Link>
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Log Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
