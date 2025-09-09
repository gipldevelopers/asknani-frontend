// components/CategorySlider.js
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Baby, Users, GraduationCap, Heart, Clock, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const categories = [
  {
    icon: Baby,
    title: "Infant Care",
    subtitle: "6 weeks - 18 months",
    description: "Specialized care for your little ones",
    color: "bg-pink-500",
    count: "150+ centers"
  },
  {
    icon: Users,
    title: "Toddler Care",
    subtitle: "18 months - 3 years",
    description: "Active learning and play",
    color: "bg-blue-500",
    count: "200+ centers"
  },
  {
    icon: GraduationCap,
    title: "Preschool",
    subtitle: "3 - 5 years",
    description: "School readiness programs",
    color: "bg-green-500",
    count: "180+ centers"
  },
  {
    icon: Heart,
    title: "Special Needs",
    subtitle: "All ages",
    description: "Specialized inclusive care",
    color: "bg-purple-500",
    count: "80+ centers"
  },
  {
    icon: Clock,
    title: "Extended Hours",
    subtitle: "6 AM - 8 PM",
    description: "For working parents",
    color: "bg-orange-500",
    count: "120+ centers"
  },
  {
    icon: Utensils,
    title: "Meal Programs",
    subtitle: "Nutritious meals",
    description: "Healthy food options",
    color: "bg-amber-500",
    count: "90+ centers"
  },
  {
    icon: Baby,
    title: "Weekend Care",
    subtitle: "Saturday & Sunday",
    description: "Weekend childcare options",
    color: "bg-teal-500",
    count: "60+ centers"
  },
  {
    icon: Users,
    title: "Drop-in Care",
    subtitle: "Flexible hours",
    description: "Occasional childcare needs",
    color: "bg-indigo-500",
    count: "110+ centers"
  }
];

const CategorySlider = () => {
  const { push } = useRouter();


  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  //on click redirect 
  const handleCategoryClick = (category) => {
    push(`/daycares?categories=${category.title}`);
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === categories.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === categories.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? categories.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect daycare program that matches your child's age and needs
          </p>
        </div>

        {/* Slider Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Slider Track */}
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="flex-shrink-0 w-1/4 px-3" onClick={() => handleCategoryClick(category)}>

                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-2 cursor-pointer border border-gray-100">
                    <div className="flex flex-col items-center text-center">

                      <div className={`p-4 rounded-full ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-2">
                        {category.subtitle}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                        {category.count}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/daycares">
            <button className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary transition-colors font-medium shadow-md hover:shadow-lg">
              View All Categories
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;