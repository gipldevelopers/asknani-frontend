"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Shield,
  Star,
  Clock,
  Heart,
} from "lucide-react";
import Image from "next/image";
import SearchBarWithSuggestions from "../Helper/SearchBarWithSuggestions";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Kids playing in daycare",
  },
  {
    img: "https://images.unsplash.com/photo-1567746455504-cb3213f8f5b8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Teachers with children",
  },
  {
    img: "https://images.unsplash.com/photo-1722247480078-4fffd0ab166f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Learning activities",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative bg-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 xl:py-20 grid lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
        {/* LEFT: Text Content */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              <Heart className="h-4 w-4 mr-1" /> Trusted by 10,000+ Parents
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Perfect Daycare
              </span>{" "}
              for Your Child
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
              Discover trusted providers across India with verified reviews,
              real-time availability, and easy bookings — all in one platform.
            </p>
          </div>

          {/* Search Bar */}
          <div className="space-y-4">
            <SearchBarWithSuggestions inputClass="flex-grow rounded-2xl bg-white border border-gray-200 shadow-lg" />

            {/* Popular searches */}
            {/* <div className="flex flex-wrap gap-2">
              <span className="text-gray-500 text-sm">Popular:</span>
              {[
                "Daycare near me",
                "Preschool",
                "Baby care",
                "After school",
              ].map((tag, i) => (
                <button
                  key={i}
                  className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div> */}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2 text-gray-700 p-2 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">Verified Providers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 p-2 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Parent Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 p-2 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">
                Real-Time Availability
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Image Slider */}
        <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
            >
              <Image
                fill
                src={slide.img}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          ))}

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg z-30 transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg z-30 transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === current
                    ? "bg-white scale-125"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
