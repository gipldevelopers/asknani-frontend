// components/AdBanner.js
"use client";
import { useState, useEffect } from "react";
import { X, ChevronRight, Star, Shield, Calendar, Clock } from "lucide-react";
import Image from "next/image";

export default function AdPopUp() {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(10); // Countdown timer for special offer

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && isVisible) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVisible]);

  // Close the banner
  const closeBanner = () => {
    setIsVisible(false);
  };

  // Prevent the banner from showing if already closed
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-white to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-100">
        {/* Close button */}
        <button
          onClick={closeBanner}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 transition-all hover:scale-110 shadow-sm"
          aria-label="Close banner"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-5">
          {/* Image/Visual Section */}
          <div className="md:col-span-2 relative">
            <Image
              fill
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
              alt="Special offer for daycare services"
              className="w-full h-48 md:h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent md:bg-gradient-to-r md:from-indigo-900/70 md:to-transparent flex items-end md:items-center p-6">
              <div className="text-white">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm ml-2">4.9/5 (2,483 reviews)</span>
                </div>
                <h3 className="text-xl font-bold">Trusted by 10,000+ Parents</h3>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Countdown timer */}
              <div className="flex justify-center items-center mb-4">
                <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Offer ends in: </span>
                  <span className="font-bold ml-1">{countdown}:00</span>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-600">
                  Special Limited Time Offer!
                </span>
              </h2>

              {/* Benefits */}
              <ul className="space-y-3 mb-6">
                {[
                  { icon: Shield, text: "Get 20% off on your first month enrollment" },
                  { icon: Calendar, text: "Free registration (worth ₹1,500)" },
                  { icon: Star, text: "Priority waiting list access" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <item.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center">
                Claim Your Discount Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-colors">
                Learn More
              </button>
            </div>

            {/* Footnote */}
            <p className="text-xs text-gray-500 text-center mt-4">
              *Offer valid for first-time customers only. Terms and conditions apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}