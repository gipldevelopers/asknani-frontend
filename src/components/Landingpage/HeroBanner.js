// components/HeroBanner.js
"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Shield, Star, Clock } from "lucide-react";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Kids playing in daycare"
  },
  {
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Teachers with children"
  },
  {
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Learning activities"
  }
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
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT (Static) */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Find the <span className="text-primary">Perfect Daycare</span> <br />
            for Your Child
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Discover trusted providers across India with verified reviews, real-time availability, and easy bookings — all in one platform.
          </p>

          {/* Search Bar */}
          <div className="flex w-full max-w-lg bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
            <div className="flex items-center px-4 text-gray-500">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Enter location, daycare name..."
              className="flex-grow px-3 py-3 text-gray-700 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 font-medium hover:opacity-90 transition-all">
              Search
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm">Verified Providers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Parent Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-indigo-500" />
              <span className="text-sm">Real-Time Availability</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT (Image Slider) */}
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.img}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100 z-20" : "opacity-0 z-10"
                }`}
            />
          ))}

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow z-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow z-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
