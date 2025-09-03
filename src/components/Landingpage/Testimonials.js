"use client";
import { useEffect, useRef } from "react";

export default function Testimonials() {
    const scrollRef = useRef(null);
    const testimonials = [
        {
            id: 1,
            initials: "AP",
            name: "Anita Patel",
            rating: 5,
            feedback:
                "I found the perfect preschool for my son in Mumbai. The process was so simple and transparent. Highly recommend CareFinder!",
        },
        {
            id: 2,
            initials: "RS",
            name: "Ravi Sharma",
            rating: 5,
            feedback:
                "The verified reviews gave me full confidence. My daughter settled into her daycare in Bengaluru within days, and she absolutely loves it.",
        },
        {
            id: 3,
            initials: "KM",
            name: "Kavya Menon",
            rating: 5,
            feedback:
                "Booking a tour online saved me so much time. The team was responsive, and I could directly connect with the daycare in Kochi.",
        },
        {
            id: 4,
            initials: "SS",
            name: "Suresh Singh",
            rating: 4,
            feedback:
                "Great platform to explore multiple daycares in Delhi NCR. Found a secure and friendly place for my twins.",
        },
    ];
    useEffect(() => {
        const scrollContainer = scrollRef.current;

        let scrollAmount = 0;
        const scrollStep = 1; // pixels per frame
        const scrollDelay = 20; // ms between frames

        const scrollInterval = setInterval(() => {
            if (scrollContainer) {
                scrollAmount += scrollStep;
                scrollContainer.scrollLeft = scrollAmount;

                // Reset when reached end (infinite effect)
                if (
                    scrollAmount >=
                    scrollContainer.scrollWidth / 2
                ) {
                    scrollAmount = 0;
                }
            }
        }, scrollDelay);

        return () => clearInterval(scrollInterval);
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        What Parents Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Hear from parents who found their perfect daycare
                        through CareFinder
                    </p>
                </div>

                {/* Auto-scrolling container */}
                <div className="overflow-hidden">
                    <div className="flex gap-6 animate-scroll">
                        {/* Duplicate testimonials for seamless loop */}
                        {[...testimonials, ...testimonials].map((t, idx) => (
                            <div
                                key={idx}
                                className="min-w-[300px] max-w-sm bg-gray-50 p-6 rounded-xl flex-shrink-0"
                            >
                                {/* Avatar */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-4">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{t.name}</h4>
                                        <div className="flex text-amber-500">
                                            {[...Array(t.rating)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className="w-4 h-4 fill-current"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback */}
                                <p className="text-gray-600">"{t.feedback}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

