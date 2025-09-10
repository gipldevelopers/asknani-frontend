// components/provider-dashboard/bookings.jsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Clock, User, MapPin, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function BookingsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const bookings = [
    {
      id: 1,
      parentName: "Priya Sharma",
      children: ["Aarav Sharma", "Anika Sharma"],
      date: "2023-11-15",
      time: "09:00 AM - 05:00 PM",
      status: "confirmed",
      address: "123 Koramangala, Bengaluru",
      price: 2500
    },
    {
      id: 2,
      parentName: "Rahul Verma",
      children: ["Vihaan Verma"],
      date: "2023-11-16",
      time: "08:30 AM - 04:30 PM",
      status: "pending",
      address: "456 Indiranagar, Bengaluru",
      price: 1500
    },
    {
      id: 3,
      parentName: "Neha Patel",
      children: ["Aryan Patel", "Myra Patel"],
      date: "2023-11-17",
      time: "10:00 AM - 06:00 PM",
      status: "confirmed",
      address: "789 HSR Layout, Bengaluru",
      price: 3000
    }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all your daycare bookings</p>
        </div>
        <Link href={"/providers/bookings/new"}>
          <Button>New Booking</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              {/* <Button variant="outline">Export</Button> */}
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {["all", "confirmed", "pending", "cancelled", "completed"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.parentName}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.children.join(", ")}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch lg:self-center">
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold text-lg">₹{booking.price}</p>
                    <p className="text-sm text-gray-600">Full day</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/providers/bookings/details/${123}`)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/providers/bookings/edit/${123}`)}>Edit Booking</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}