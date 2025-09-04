"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Users,
  Briefcase,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-5">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png" // 👉 put this in /public
                  alt="Marketplace Logo"
                  width={140}
                  height={45}
                  className="rounded-lg"
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-lg">
              Connecting parents with the perfect daycare providers. Making
              childcare discovery simple and reliable.
            </p>

            {/* Newsletter subscription */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">
                STAY UP TO DATE
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                />
                <button className="bg-primary hover:bg-primary px-4 py-3 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-700 hover:bg-primary h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-primary h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-primary h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-primary h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Parents */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-400" />
              For Parents
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Browse Daycares
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Safety Standards
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-indigo-400" />
              For Providers
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  List Your Daycare
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Provider Resources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-indigo-400" />
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2023 askNani. All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>

          {/* App badges */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
            >
              <svg fill="#ffffff" className="h-6 w-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"></path> </g></svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-sm font-medium text-white">App Store</div>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
            >
              <svg fill="#ffffff" className="h-6 w-6 mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5_logos</title><path d="M48,59.49v393a4.33,4.33,0,0,0,7.37,3.07L260,256,55.37,56.42A4.33,4.33,0,0,0,48,59.49Z"></path><path d="M345.8,174,89.22,32.64l-.16-.09c-4.42-2.4-8.62,3.58-5,7.06L285.19,231.93Z"></path><path d="M84.08,472.39c-3.64,3.48.56,9.46,5,7.06l.16-.09L345.8,338l-60.61-57.95Z"></path><path d="M449.38,231l-71.65-39.46L310.36,256l67.37,64.43L449.38,281C468.87,270.23,468.87,241.77,449.38,231Z"></path></g></svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">GET IT ON</div>
                <div className="text-sm font-medium text-white">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
