// components/provider-dashboard/bookings.jsx
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MapPin,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Adjust the path to your API file
import { Alert, AlertDescription } from "@/components/ui/alert";
import API from "@/lib/api";

export default function BookingsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Your API endpoint might be different - adjust based on your Laravel routes
        const response = await API.get("/provider/bookings");
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      booking.parent?.name?.toLowerCase().includes(searchLower) ||
      booking.child?.name?.toLowerCase().includes(searchLower) ||
      booking.booking_code?.toLowerCase().includes(searchLower) ||
      booking.daycare?.name?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (packageData) => {
    if (!packageData?.price) return "₹0";
    return `₹${packageData.price}`;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.put(`/bookings/${bookingId}`, {
        status: "cancelled",
      });

      // Refresh the bookings list
      const response = await API.get("/provider/bookings");
      setBookings(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">
            Manage all your daycare bookings ({filteredBookings.length} found)
          </p>
        </div>
        <Link href={"/providers/bookings/new"}>
          <Button>New Booking</Button>
        </Link>
      </div>

 

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">
                {bookings.length === 0
                  ? "No bookings found"
                  : "No bookings match your filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.parent?.full_name || "Unknown Parent"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.child?.full_name || "Unknown Child"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Booking Code: {booking.booking_code}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {formatDate(booking.start_date)} -{" "}
                          {formatDate(booking.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {formatTime(booking.dropoff_time)} -{" "}
                          {formatTime(booking.pickup_time)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">
                          {booking.daycare?.address || "Address not available"}
                        </span>
                      </div>
                    </div>

                    {booking.special_requirements && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Special Requirements:</strong>{" "}
                        {booking.special_requirements}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-stretch lg:self-center">
                    <div className="text-right min-w-[100px]">
                      <p className="font-semibold text-lg">
                        {formatPrice(booking.package)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.package?.title || "Package"}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/providers/bookings/details/${booking.id}`
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/providers/bookings/edit/${booking.id}`
                            )
                          }
                        >
                          Edit Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        {booking.status !== "cancelled" && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
