"use client"
import ChatInterface from '@/components/chat/ChatInterface'


import { Star, MapPin, Phone, ChevronLeft } from "lucide-react";
import Link from 'next/link';

// --------------------------- Chat Page ---------------------------
export default function ChatPage() {

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href={"/chats"}>
                            <button className="p-2 mr-2 rounded-full hover:bg-gray-100 ">
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </button>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">Sunshine Montessori</h1>

                    </div>

                </div>


            </header>
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Section – Daycare Details */}
                <aside className="lg:col-span-2">
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-400 p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-xl bg-gray-200 flex items-center justify-center text-lg font-semibold text-indigo-600">
                                SM
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Sunshine Montessori</h2>
                                <p className="text-xs text-gray-500">Bandra West, Mumbai</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-amber-400" />
                            4.8 (214 reviews)
                        </div>

                        <p className="text-sm text-gray-700">
                            Caring, secure, and joyful early learning for ages 6 months to 6 years.
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            12 Palm Grove, Bandra West, Mumbai
                        </div>

                        <a
                            href="tel:+919876543210"
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                        >
                            <Phone className="h-4 w-4" /> +91-9876543210
                        </a>
                    </div>
                </aside>

                {/* Right Section – Chat */}
                <section className="lg:col-span-1 flex flex-col rounded-2xl bg-white shadow-sm border border-gray-400 overflow-hidden">
                    <ChatInterface />
                </section>
            </div>
        </div>
    );
}


