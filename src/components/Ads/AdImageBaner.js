// components/AdBanner.js
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdImageBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsVisible(false), 300); // wait for animation before unmount
    };

    if (!isVisible) return null;

    return (
        <div
            className={`w-full flex justify-center bg-indigo-50 transition-all duration-300 ${isClosing ? "translate-y-[-100%] opacity-0" : "translate-y-0 opacity-100"
                }`}
        >
            <div className="relative w-full max-w-4xl group">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Close ad"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
                               1.414L8.586 10l-1.293 1.293a1 1 0 
                               101.414 1.414L10 11.414l1.293 1.293a1 
                               1 0 001.414-1.414L11.414 10l1.293-1.293a1 
                               1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {/* Ad Banner */}
                <div className="overflow-hidden rounded-2xl transition-all duration-300 mx-4 my-4">
                    <Link
                        href="#"
                        className="block relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl"
                        aria-label="Special offer - Learn more"
                    >
                        <Image 
                        width={800}
                        height={120}
                        unoptimized
                            className="w-full h-[120px] object-cover"
                            src="/Investor-banner.webp"
                            alt="Special offer - 20% off on first month enrollment at selected daycares"
                        />

                        {/* Text overlay for smaller screens */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:hidden">
                            <p className="text-white text-sm font-medium text-center">
                                Special Offer - 20% Off First Month!
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
