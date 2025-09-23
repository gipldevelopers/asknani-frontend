// components/provider-dashboard/new-booking-form.jsx
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import API from "@/lib/api";
import GuardianSearchAndSelect from "@/app/(providers)/components/GuardianSearchAndSelect";
import ChildSearchAndSelect from "@/app/(providers)/components/ChildSearchAndSelect";

export default function NewBookingForm() {
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch packages on component load
  useEffect(() => {
    const fetchPackages = async () => {
      setFormLoading(true);
      try {
        const response = await API.get("/provider/packages");
        setPackages(response.data);
      } catch (err) {
        setError(err.message || "Failed to load packages.");
      } finally {
        setFormLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Fetch available dates when child or guardian is selected
  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (selectedGuardian) {
        setFormLoading(true);
        try {
          // You need to create this API endpoint to get available dates
          const response = await API.get("/availabilities");
          const dates = response.data.map(item => ({
            id: item.id,
            date: new Date(item.date),
            isAvailable: item.is_available,
          }));
          setAvailableDates(dates);
        } catch (err) {
          setError(err.message || "Failed to load available dates.");
        } finally {
          setFormLoading(false);
        }
      }
    };
    fetchAvailableDates();
  }, [selectedGuardian]);

  const handleCreateBooking = async () => {
    if (!selectedGuardian || !selectedChild || !selectedPackage || !selectedDate) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const selectedAvailability = availableDates.find(
      (slot) => slot.date.toDateString() === selectedDate.toDateString() && slot.isAvailable
    );
    
    if (!selectedAvailability) {
        setError("The selected date is not available. Please choose another.");
        setIsSubmitting(false);
        return;
    }

    try {
      const bookingData = {
        parent_id: selectedGuardian.id,
        child_id: selectedChild.id,
        package_id: selectedPackage.id,
        start_date: format(selectedDate, 'yyyy-MM-dd'),
        end_date: format(selectedDate, 'yyyy-MM-dd'), // Assuming single-day booking for simplicity
        availability_id: selectedAvailability.id,
      };

      const response = await API.post("/bookings", bookingData);
      alert("Booking created successfully!");
      console.log("Booking created:", response.data);
      // Reset form or redirect
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create booking.");
      console.error("Booking creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
          <CardDescription>
            Step-by-step guide to adding a new child and a booking.
          </CardDescription>
        </CardHeader> 
        <CardContent className="space-y-6">
          <GuardianSearchAndSelect
            onGuardianSelect={setSelectedGuardian}
            selectedGuardian={selectedGuardian}
            isFormLoading={formLoading}
          />
          
          {selectedGuardian && (
            <ChildSearchAndSelect
              onChildSelect={setSelectedChild}
              selectedChild={selectedChild}
              isFormLoading={formLoading}
              guardianId={selectedGuardian.id}
            />
          )}

          {selectedChild && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold">Select Daycare Package</h3>
                {packages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPackage?.id === pkg.id ? "border-primary ring-2 ring-primary" : "hover:border-primary"
                        }`}
                      >
                        <h4 className="font-medium">{pkg.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{pkg.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        No packages available.
                    </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedPackage && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold">Select Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const isAvailable = availableDates.some(
                          (slot) => slot.date.toDateString() === date.toDateString() && slot.isAvailable
                        );
                        return !isAvailable;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-4">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateBooking}
            disabled={!selectedGuardian || !selectedChild || !selectedPackage || !selectedDate || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              'Create Booking'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}