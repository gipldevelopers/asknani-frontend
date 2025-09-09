// components/CitiesSection.js
"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CitiesSection() {
    const scrollRef = useRef(null);

    const indianCities = [
        {
            name: "Delhi",
            count: "320+ daycares",
            image:
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Mumbai",
            count: "280+ daycares",
            image:
                "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1170&q=80",
        },
        {
            name: "Bengaluru",
            count: "245+ daycares",
            image:
                "https://plus.unsplash.com/premium_photo-1697729434815-40ab4970ebc1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Hyderabad",
            count: "210+ daycares",
            image:
                "https://images.unsplash.com/photo-1441911645956-df6e9bbc5496?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Chennai",
            count: "195+ daycares",
            image:
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1170&q=80",
        },
        {
            name: "Kolkata",
            count: "170+ daycares",
            image:
                "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?auto=format&fit=crop&w=1170&q=80",
        },
        {
            name: "Pune",
            count: "160+ daycares",
            image:
                "https://images.unsplash.com/photo-1553064483-f10fe837615f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Popular Cities in India
                    </h2>
                    <p className="text-lg text-gray-600">
                        Find trusted daycares near you
                    </p>
                </div>

                {/* Slider */}
                <div className="relative">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-indigo-50 hidden sm:block"
                    >
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </button>

                    {/* Cities List */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
                    >
                        {indianCities.map((city, index) => (
                            <div
                                key={index}
                                className="min-w-[220px] sm:min-w-[260px] relative snap-center rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group cursor-pointer"
                            >

                                <Image
                                    width={260}
                                    height={160}
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <Link href={`/daycares?city=${city.name}`} className="absolute inset-0 z-10" >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-lg font-bold">{city.name}</h3>
                                            <p className="text-sm">{city.count}</p>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-indigo-50 hidden sm:block"
                    >
                        <ChevronRight className="h-6 w-6 text-primary" />
                    </button>
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <Link href={"/daycares"}>
                        <button className="px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-primary transition">
                            View All Cities
                        </button>
                    </Link>
                </div>
            </div>

            {/* Hide scrollbar utility */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section >
    );
}
