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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import API from "@/lib/api";
import GuardianSearchAndSelect from "@/app/(providers)/components/GuardianSearchAndSelect";
import useDaycareAuthStore from "@/stores/ProvidersStore";

export default function NewBookingForm() {
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { daycare, fetchDaycare } = useDaycareAuthStore();
  // New state for child creation and optional fields
  const [isAddingNewChild, setIsAddingNewChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [notes, setNotes] = useState("");

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
    fetchDaycare();
    fetchPackages();
  }, []);

  // Fetch children when a guardian is selected
  useEffect(() => {
    const fetchChildren = async () => {
      if (selectedGuardian) {
        setFormLoading(true);
        try {
          const response = await API.get(
            `/provider/parents/${selectedGuardian.id}/children`
          );
          setChildren(response.data);
        } catch (err) {
          setError(err.message || "Failed to load children.");
        } finally {
          setFormLoading(false);
        }
      } else {
        setChildren([]);
        setSelectedChild(null);
      }
    };
    fetchChildren();
  }, [selectedGuardian]);

  const handleCreateBooking = async () => {
    // Clear any previous messages
    setError(null);
    setSuccessMessage(null);

    // Frontend validation: ensure all required fields are selected
    if (!selectedGuardian || !selectedPackage || !selectedDate) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!selectedChild && !newChildName) {
      setError("Please select a child or provide a new child's name.");
      return;
    }

    setIsSubmitting(true);

    try {
      let childId = selectedChild?.id;

      if (isAddingNewChild) {
        // First, create the new child
        const childData = {
          name: newChildName,
          age: newChildAge,
        };
        const childResponse = await API.post(
          `/parents/${selectedGuardian.id}/children`,
          childData
        );
        childId = childResponse.data.id;
      }

      const bookingData = {
        daycare_id: daycare.id, // Assuming daycare_id is 1 for this example
        parent_id: selectedGuardian.id,
        child_id: childId,
        package_id: selectedPackage.id,
        start_date: format(selectedDate, "yyyy-MM-dd"),
        end_date: format(selectedDate, "yyyy-MM-dd"),
        pickup_time: pickupTime || null,
        dropoff_time: dropoffTime || null,
        notes: notes || null,
      };

      const response = await API.post("/provider/bookings", bookingData);
      setSuccessMessage(
        response.data.message || "Booking created successfully!"
      );
      // Optionally reset the form after successful booking
      setSelectedGuardian(null);
      setSelectedChild(null);
      setChildren([]);
      setNewChildName("");
      setNewChildAge("");
      setPickupTime("");
      setDropoffTime("");
      setNotes("");
      setSelectedPackage(null);
      setSelectedDate(null);
      setIsAddingNewChild(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create booking."
      );
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
            onGuardianSelect={(guardian) => {
              setSelectedGuardian(guardian);
              setSelectedChild(null);
              setIsAddingNewChild(false);
            }}
            selectedGuardian={selectedGuardian}
            isFormLoading={formLoading}
          />

          {selectedGuardian && (
            <div className="space-y-4">
              <Button
                onClick={() => setIsAddingNewChild(false)}
                variant={isAddingNewChild ? "outline" : "default"}
              >
                Select Existing Child
              </Button>
              <Button
                onClick={() => {
                  setIsAddingNewChild(true);
                  setSelectedChild(null);
                }}
                variant={isAddingNewChild ? "default" : "outline"}
              >
                Add New Child
              </Button>

              {isAddingNewChild ? (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="text-xl font-semibold">New Child Details</h3>
                    <input
                      type="text"
                      placeholder="Child's Name"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Child's Age (Optional)"
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="text-xl font-semibold">Select Child</h3>
                    {children.length > 0 ? (
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedChild?.id || ""}
                        onChange={(e) => {
                          const child = children.find(
                            (c) => c.id === parseInt(e.target.value)
                          );
                          setSelectedChild(child);
                        }}
                      >
                        <option value="">-- Select a child --</option>
                        {children.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.full_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No children found for this guardian. Please add a new
                        one.
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {(selectedChild || isAddingNewChild) && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Select Daycare Package
                </h3>
                {packages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPackage?.id === pkg.id
                            ? "border-primary ring-2 ring-primary"
                            : "hover:border-primary"
                        }`}
                      >
                        <h4 className="font-medium">{pkg.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{pkg.price}
                        </p>
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
                <h3 className="text-xl font-semibold">Booking Details</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <input
                  type="time"
                  placeholder="Pickup Time (Optional)"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />

                <input
                  type="time"
                  placeholder="Dropoff Time (Optional)"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />

                <textarea
                  placeholder="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-4">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 text-green-500 mt-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateBooking}
            disabled={
              !selectedGuardian ||
              !selectedPackage ||
              !selectedDate ||
              isSubmitting ||
              (!selectedChild && !newChildName)
            }
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Create Booking"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
