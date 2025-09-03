// components/HeroBanner.js
"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Shield, Clock } from "lucide-react";

const slides = [
  {
    title: "Find the Perfect Daycare for Your Child",
    desc: "Discover trusted daycares with verified reviews, real-time availability, and seamless booking",
    img: "https://images.unsplash.com/photo-1541692645447-48f2c9a15474?auto=format&fit=crop&w=1440&q=80",
    overlay: "bg-gradient-to-r from-indigo-700/80 via-purple-700/60 to-black/70"
  },
  {
    title: "Trusted Providers Across India",
    desc: "Choose from hundreds of licensed providers with transparent details and parent feedback",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1440&q=80",
    overlay: "bg-gradient-to-r from-teal-700/80 via-blue-700/60 to-black/70"
  },
  {
    title: "Book Easily, Anytime",
    desc: "A modern platform designed for busy parents. Find care options that fit your schedule",
    img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1440&q=80",
    overlay: "bg-gradient-to-r from-amber-700/80 via-orange-700/60 to-black/70"
  }
];

// Fallback gradient for when images don't load
const fallbackGradients = [
  "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500",
  "bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700",
  "bg-gradient-to-r from-amber-500 via-orange-600 to-red-600"
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Auto-scroll every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
        >
          {/* Background Image with Fallback */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          />
          
          {/* Preload images */}
          <img 
            src={slide.img} 
            alt="" 
            className="hidden" 
            onLoad={() => handleImageLoad(index)}
          />
          
          {/* Fallback gradient if image not loaded */}
          {!imagesLoaded[index] && (
            <div className={`absolute inset-0 ${fallbackGradients[index]}`} />
          )}
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${slide.overlay}`} />

          {/* Content */}
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl opacity-90">
              {slide.desc}
            </p>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-5 w-5 mr-2 text-amber-400" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-5 w-5 mr-2 text-amber-400" />
                <span>Parent Reviews</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-5 w-5 mr-2 text-amber-400" />
                <span>Real-Time Availability</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-8 w-full max-w-2xl bg-white rounded-full shadow-2xl p-2 flex">
              <div className="flex items-center pl-4 pr-2 text-gray-500">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search by location, daycare name, or features..."
                className="flex-grow px-2 py-4 text-gray-700 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-all transform hover:scale-105">
                Search
              </button>
            </div>

            {/* Quick Filters */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Preschool', 'Daycare', 'Playgroup', 'Babysitter', 'After School'].map((filter) => (
                <button
                  key={filter}
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm cursor-pointer"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-md z-30 backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-md z-30 backdrop-blur-sm transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}