// app/my-bookings/page.js
"use client";
import { useState } from "react";
import { Search, Calendar, MapPin, Clock, CheckCircle, XCircle, ClockIcon, AlertCircle, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(4);

    // Sample booking data
    const bookings = {
        upcoming: [
            {
                id: 1,
                daycareName: "Sunshine Kids Daycare",
                date: "2023-11-15",
                time: "09:00 AM - 05:00 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1200,
                address: "123 MG Road, Bengaluru",
                image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 3
            },
            {
                id: 2,
                daycareName: "Little Explorers Preschool",
                date: "2023-11-18",
                time: "08:30 AM - 04:30 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1500,
                address: "456 Koramangala, Bengaluru",
                image: "https://images.unsplash.com/photo-1590086782957-93c06ef2b8ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 6
            },
            {
                id: 3,
                daycareName: "Bright Beginnings Center",
                date: "2023-11-20",
                time: "10:00 AM - 06:00 PM",
                childName: "Rahul Sharma",
                status: "pending",
                price: 1350,
                address: "789 Indiranagar, Bengaluru",
                image: "https://images.unsplash.com/photo-1618835962148-cf2c2f52fbc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 8
            },
            {
                id: 4,
                daycareName: "Happy Tots Childcare",
                date: "2023-11-22",
                time: "09:00 AM - 05:00 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1100,
                address: "321 Jayanagar, Bengaluru",
                image: "https://images.unsplash.com/photo-1592503254549-d3d2c4a01d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 10
            }
        ],
        past: [
            {
                id: 5,
                daycareName: "Rainbow Learning Center",
                date: "2023-10-20",
                time: "08:00 AM - 04:00 PM",
                childName: "Rahul Sharma",
                status: "completed",
                price: 1400,
                address: "654 Whitefield, Bengaluru",
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 5
            },
            {
                id: 6,
                daycareName: "Tiny Steps Daycare",
                date: "2023-10-15",
                time: "09:30 AM - 05:30 PM",
                childName: "Rahul Sharma",
                status: "completed",
                price: 1250,
                address: "987 HSR Layout, Bengaluru",
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 4
            }
        ],
        cancelled: [
            {
                id: 7,
                daycareName: "Playful Pandas Daycare",
                date: "2023-10-10",
                time: "09:30 AM - 05:30 PM",
                childName: "Rahul Sharma",
                status: "cancelled",
                price: 1300,
                address: "555 Electronic City, Bengaluru",
                image: "https://images.unsplash.com/photo-1541692646449-57b2d6ffc2ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
        ]
    };

    const filteredBookings = bookings[activeTab].filter(booking =>
        booking.daycareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "pending":
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
            case "cancelled":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "completed":
                return <CheckCircle className="h-4 w-4 text-primary" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "confirmed":
                return "Confirmed";
            case "pending":
                return "Pending Approval";
            case "cancelled":
                return "Cancelled";
            case "completed":
                return "Completed";
            default:
                return "Unknown";
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                        <div className="flex items-center space-x-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Filter
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
                                New Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                    {["upcoming", "past", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-sm font-medium rounded-md flex-1 ${activeTab === tab
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === "upcoming" && (
                                <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                    {bookings.upcoming.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by daycare name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* Booking Cards */}
                <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                        <>
                            {filteredBookings.slice(0, visibleCount).map((booking) => (
                                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-start space-x-4">
                                                <Image
                                                    width={16}
                                                    height={16}
                                                    src={booking.image}
                                                    alt={booking.daycareName}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{booking.daycareName}</h3>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>{booking.address}</span>
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <div className="flex items-center text-sm font-medium">
                                                            {getStatusIcon(booking.status)}
                                                            <span className={`ml-1 ${booking.status === 'confirmed' ? 'text-green-600' :
                                                                booking.status === 'pending' ? 'text-yellow-600' :
                                                                    booking.status === 'cancelled' ? 'text-red-600' :
                                                                        'text-primary'}`}>
                                                                {getStatusText(booking.status)}
                                                            </span>
                                                        </div>
                                                        {booking.daysLeft && (
                                                            <span className="ml-3 text-sm text-gray-500">
                                                                • {booking.daysLeft} days left
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">₹{booking.price}</div>
                                                <div className="text-sm text-gray-500">for 1 day</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span>{formatDate(booking.date)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    <span>{booking.time}</span>
                                                </div>
                                                <div className="text-gray-600">
                                                    <span className="font-medium">Child:</span> {booking.childName}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {activeTab === "upcoming" && booking.status === "confirmed" && (
                                                    <>
                                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                            Reschedule
                                                        </button>
                                                        <button className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary-hover">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === "upcoming" && booking.status === "pending" && (
                                                    <>
                                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                            Edit
                                                        </button>
                                                        <button className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary-hover">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === "past" && !booking.rating && (
                                                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
                                                        Rate & Review
                                                    </button>
                                                )}
                                                {activeTab === "past" && booking.rating && (
                                                    <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20">
                                                        View Review
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {visibleCount < filteredBookings.length && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setVisibleCount((c) => c + 2)}
                                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center"
                                    >
                                        Show More Bookings
                                        <ChevronDown className="h-5 w-5 ml-2" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchQuery ? 'No bookings found' : `No ${activeTab} bookings`}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery ? 'Try adjusting your search query' : `You don't have any ${activeTab} bookings yet`}
                            </p>
                            {!searchQuery && activeTab === "upcoming" && (
                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover">
                                    Browse Daycares
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}