"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DaycaresServices } from "@/lib/DaycaresServices";

export default function FeaturedDaycares() {
  const router = useRouter();
  const [featuredDaycares, setFeaturedDaycares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await DaycaresServices.getFeaturedDaycares();
        // ensure it's an array
        setFeaturedDaycares(res.data.daycares || []);
      } catch (err) {
        console.error("Failed to fetch featured daycares:", err);
        setFeaturedDaycares([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Hide section if no featured daycares
  if (!featuredDaycares.length) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Featured Daycares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exceptional childcare providers with outstanding reviews
            and premium facilities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredDaycares.map((daycare) => (
            <div
              onClick={() => router.push(`/daycares/${daycare.slug}`)}
              key={daycare.id}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  fill
                  src={
                    daycare.featured_photo
                      ? `${process.env.NEXT_PUBLIC_API_BASE}/${daycare.featured_photo}`
                      : "/placeholder.png"
                  }
                  alt={daycare.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                  {daycare.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  📍 {daycare.city || "Unknown"}
                </p>
                <p className="text-xl font-bold text-primary mb-4">
                  Rating: {daycare.rating || 0}
                </p>
                <Link href={`/daycares/${daycare.slug}`}>
                  <button className="mt-auto w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:primary-hover transition-colors shadow">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
