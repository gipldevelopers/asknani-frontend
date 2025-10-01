"use client";
import ChatInterface from "@/components/chat/ChatInterface";
import useAuthStore from "@/stores/AuthStore";
import API from "@/lib/api";
import { Star, MapPin, Phone, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ChatPage({ params }) {
  // Next.js 15: unwrap params
  const { uid: slug } = React.use(params);

  const [loading, setLoading] = useState(false);
  const [daycare, setDaycare] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDaycare = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/daycares/${slug}`);
        setDaycare(res.data.daycare);
      } catch (err) {
        setError("Failed to load daycare");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDaycare();
  }, [slug]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Please login to view daycare info.</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!daycare) return <div className="p-6">No daycare linked to this account.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={"/chats"}>
              <button className="p-2 mr-2 rounded-full hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{daycare?.name}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section – Daycare Details */}
        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-white shadow-sm border border-gray-400 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gray-200 flex items-center justify-center text-lg font-semibold text-indigo-600">
                {daycare?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{daycare?.name}</h2>
                <p className="text-xs text-gray-500">{daycare?.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-full">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={`star-${daycare?.id || slug}-${i + 1}`}
                  className={`h-4 w-4 ${
                    i + 1 <= (Number(daycare?.rating) || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="font-semibold ml-1">{daycare?.reviewCount} Reviews</span>
            </div>

            <p className="text-sm text-gray-700">{daycare?.shortDesc}</p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {daycare?.address}
            </div>

            <a
              href={`tel:${daycare?.phone}`}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
            >
              <Phone className="h-4 w-4" /> {daycare?.phone}
            </a>
          </div>
        </aside>

        {/* Right Section – Chat */}
        <section className="lg:col-span-1 flex flex-col rounded-2xl bg-white shadow-sm border border-gray-400 overflow-hidden">
          <div className="p-4">
            <ChatInterface daycare={daycare} parentId={user?.id} />
          </div>
        </section>
      </div>
    </div>
  );
}
