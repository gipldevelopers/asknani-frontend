// app/my-bookings/page.js
"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ClockIcon,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import API from "@/lib/api";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    API.get("/parent/bookings")
      .then((response) => {
        setBookings({
          upcoming: response.data.bookings.upcoming || [],
          past: response.data.bookings.past || [], // if you add past later
        });
      })
      .catch((error) => {
        console.error("Failed to fetch bookings:", error);
        setBookings({ upcoming: [], past: [] });
      });
  }, []);
  const filteredBookings =
    bookings[activeTab]?.filter(
      (booking) =>
        booking.daycareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
    const options = { weekday: "short", day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Booking Cards */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            <>
              {filteredBookings.slice(0, visibleCount).map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        {/* <Image
                          width={16}
                          height={16}
                          src={booking.image || "https://placehold.co/400x250"}
                          alt={booking.daycareName || "Daycare"}
                          className="h-16 w-16 rounded-lg object-cover"
                        /> */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.daycareName || "-"}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.address || "-"}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center text-sm font-medium">
                              {getStatusIcon(booking.status)}
                              <span
                                className={`ml-1 ${
                                  booking.status === "confirmed"
                                    ? "text-green-600"
                                    : booking.status === "pending"
                                    ? "text-yellow-600"
                                    : booking.status === "cancelled"
                                    ? "text-red-600"
                                    : "text-primary"
                                }`}
                              >
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{booking.price ?? "0"}
                        </div>
                        <div className="text-sm text-gray-500">
                          for {booking.daysLeft + 1} day(s)
                        </div>
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
                          <span>
                            {booking.time && booking.time !== " - "
                              ? booking.time
                              : "N/A"}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Child:</span>{" "}
                          {booking.childName || "-"}
                        </div>
                           <div className="text-gray-600">
                          <span className="font-medium">Booking Code:</span>{" "}
                          {booking.bookingCode || "-"}
                        </div>
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
                {searchQuery ? "No bookings found" : `No ${activeTab} bookings`}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : `You don't have any ${activeTab} bookings yet`}
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
