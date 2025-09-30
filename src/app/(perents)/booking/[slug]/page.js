// app/(parents)/daycares/[slug]/page.js
"use client";

import React, { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  User,
  Calendar,
  CheckCircle,
  Star,
  MapPin,
  Plus,
  Trash2,
  Clock,
  Baby,
  Phone,
  Shield,
  Smartphone,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import AddChildPopover from "@/components/Bookings/AddChild";
import toast from "react-hot-toast";
import API from "@/lib/api";

// Currency formatter
const currency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BookingPage({ params }) {
  const slug = React.use(params).slug;

  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package");

  // State variables
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking form state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // Parent information - initialize with empty strings instead of undefined
  const [parentInfo, setParentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    relationship: "Parent",
    full_name: "", // Added this field to match your input
  });

  // Children management
  const [children, setChildren] = useState([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    age: 1,
    gender: "male",
    allergies: "",
    specialNeeds: "",
  });

  // Booking flow
  const [specialReq, setSpecialReq] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiUrl, setUpiUrl] = useState(null);
  const [upiID, setUpiID] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  // Fetch daycare details by slug
  useEffect(() => {
    const fetchDaycare = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/daycares/${slug}`);
        const daycareData = res.data.daycare;
        setDaycare(daycareData);

        // Set default package if packageId is provided in URL
        if (packageId && daycareData.packages) {
          const defaultPackage = daycareData.packages.find(
            (pkg) => pkg.id === packageId
          );
          if (defaultPackage) {
            setSelectedPackage(defaultPackage);
          } else if (daycareData.packages && daycareData.packages.length > 0) {
            // Fallback to first package if packageId not found
            setSelectedPackage(daycareData.packages[0]);
          }
        } else if (daycareData.packages && daycareData.packages.length > 0) {
          // Set first package as default
          setSelectedPackage(daycareData.packages[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching daycare:", err);
        setError("Failed to load daycare details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDaycare();
    }
  }, [slug, packageId]);

  const fetchUserData = async () => {
    try {
      // Fetch parent profile
      const parentRes = await API.get("/parent/profile");
      if (parentRes.data.data) {
        setParentInfo((prev) => ({
          ...prev,
          ...parentRes.data.data,
          name: parentRes.data.data.full_name || "", // Map full_name to name
          emergencyContact: parentRes.data.data.emergencyContact || "",
          full_name: parentRes.data.data.full_name || "", // Keep full_name as well
        }));
      }

      // Fetch children
      const childrenRes = await API.get("/parent/children");
      if (childrenRes.data.data && childrenRes.data.data.length > 0) {
        setChildren(childrenRes.data.data);
        // Auto-select first child
        setSelectedChild(childrenRes.data.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      // Continue with empty form if API fails
    }
  };

  // Fetch parent profile and children
  useEffect(() => {
    fetchUserData();
  }, []);

  function getAge(dob) {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Child management functions
  const handleAddChild = async () => {
    if (!newChild.name.trim()) return;

    try {
      // If you have an API endpoint to add children
      const res = await API.post("/children", newChild);
      const addedChild = res.data.data;

      setChildren((prev) => [...prev, addedChild]);
      setSelectedChild(addedChild.id);
      setNewChild({
        name: "",
        age: 1,
        gender: "male",
        allergies: "",
        specialNeeds: "",
      });
      setShowAddChild(false);
    } catch (err) {
      console.error("Error adding child:", err);
      // Fallback: add locally if API fails
      const localChild = {
        id: Date.now(),
        ...newChild,
      };
      setChildren((prev) => [...prev, localChild]);
      setSelectedChild(localChild.id);
      setNewChild({
        name: "",
        age: 1,
        gender: "male",
        allergies: "",
        specialNeeds: "",
      });
      setShowAddChild(false);
    }
  };

  // Booking flow functions
  const handleProceedToPayment = () => {
    if (!selectedChild || !selectedDate || !selectedPackage) {
      alert("Please fill in all required fields: child, date, and package.");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const summaryPayload = {
        child_id: selectedChild,
        daycare_id: daycare.id,
        package_id: selectedPackage.id,
        date: selectedDate,
        start_time: selectedTime,
        end_time: calculateEndTime(selectedTime, selectedPackage),
        total_amount: totalAmount,
      };

      const BookingPayload = {
        child_id: selectedChild,
        daycare_id: daycare.id,
        package_id: selectedPackage.id,
        start_date: selectedDate, // corrected
        end_date: selectedDate, // corrected
        pickup_time: selectedTime,
        dropoff_time: calculateEndTime(selectedTime, selectedPackage),
        days: ["0"], // example
        special_requirements: "",
        notes: "",
      };

      // First call: booking summary
      const summaryResponse = await API.post(
        "parent/booking/summary",
        summaryPayload
      );

      // Second call: actual booking
      const bookingResponse = await API.post("parent/bookings", BookingPayload);

      // ✅ Both must succeed
      if (
        (summaryResponse.data.message || summaryResponse.data.success) &&
        bookingResponse.data.message
      ) {
        toast.success("Booking confirmed successfully!");
        console.log("Summary:", summaryResponse.data);
        console.log("Booking:", bookingResponse.data);

        // Payment details from summary
        if (summaryResponse.data.payment) {
          setUpiID(summaryResponse.data.payment.upi_id);
          setUpiUrl(summaryResponse.data.payment.upi_qr);
        } else {
          setUpiID(null);
          setUpiUrl(null);
        }
        setBookingCode(bookingResponse.data.booking.booking_code);
        setBookingId(bookingResponse.data.booking.id);
        setShowConfirmation(false);
        setShowPayment(true);
      } else {
        toast.warning("Booking processed, but something unexpected happened.");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  // Helper function to calculate end time based on package duration
  const handlePayment = async (method) => {
    setIsSubmitting(true);

    try {
      // Prepare payload according to backend validation
      const paymentPayload = {
        booking_id: bookingId,
        method: method,
        transaction_id: bookingCode,
        amount: selectedPackage.price,
        status: "pending",
      };

      console.log("Payment payload:", paymentPayload);

      // Call backend API
      const response = await API.post("parent/payment", paymentPayload);

      if (response.data.success) {
        toast.success("Payment recorded successfully!");
        setShowPayment(false);
        setIsDialogOpen(true); // Show booking/payment success dialog
      } else {
        toast.error(response.data.message || "Payment failed.");
      }

      setIsSubmitting(false);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(
        err.response?.data?.message || "Payment failed. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime, pkg) => {
    if (!startTime || !pkg) return "";
    const start = new Date(`2000-01-01T${startTime}`);
    const durationHours = parseInt(pkg.duration) || 2; // Default to 2 hours if not specified
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    return format(end, "HH:mm");
  };

  // Calculate total amount
  const totalAmount = selectedPackage ? selectedPackage.price : 0;

  // Get selected child data
  const selectedChildData = children.find(
    (child) => child.id === selectedChild
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button asChild>
            <Link href="/daycares">Browse Daycares</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!daycare) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">Daycare not found</div>
          <Button asChild>
            <Link href="/daycares">Browse Daycares</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/daycares/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Daycare
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="text-sm text-gray-600">
                Secure your child's spot at {daycare.name}
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              <Shield className="h-3 w-3 mr-1" />
              Secure Booking
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daycare Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {daycare.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-amber-400" />
                        <span className="text-xs font-semibold">
                          {daycare.rating || "4.5"}
                        </span>
                        <span className="text-xs text-gray-600">
                          ({daycare.reviewCount || "50"} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {daycare.location || daycare.address}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {daycare.address}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Selected Package
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Parent/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-name">Full Name *</Label>
                    <Input
                      id="parent-name"
                      value={parentInfo.name || ""} // Ensure value is never undefined
                      onChange={(e) =>
                        setParentInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email Address *</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      disabled
                      value={parentInfo.email || ""} // Ensure value is never undefined
                      onChange={(e) =>
                        setParentInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-phone">Phone Number *</Label>
                    <Input
                      id="parent-phone"
                      type="tel"
                      disabled
                      value={parentInfo.phone || ""} // Ensure value is never undefined
                      onChange={(e) =>
                        setParentInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact">
                      Emergency Contact *
                    </Label>
                    <Input
                      id="emergency-contact"
                      type="tel"
                      value={parentInfo.emergencyContact || ""} // Ensure value is never undefined
                      onChange={(e) =>
                        setParentInfo((prev) => ({
                          ...prev,
                          emergencyContact: e.target.value,
                        }))
                      }
                      placeholder="+91 98765 43211"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to Child *</Label>
                  <Select
                    value={parentInfo.relationship || "Parent"} // Ensure value is never undefined
                    onValueChange={(value) =>
                      setParentInfo((prev) => ({
                        ...prev,
                        relationship: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Grandparent">Grandparent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Children Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-pink-600" />
                  Child Information
                </CardTitle>

                <AddChildPopover onChildAdded={() => fetchUserData()} />
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Baby className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No children added yet</p>

                    <AddChildPopover onChildAdded={() => fetchUserData()} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <RadioGroup
                      value={selectedChild || ""} // Ensure value is never undefined
                      onValueChange={setSelectedChild}
                    >
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem
                              value={child.id}
                              id={`child-${child.id}`}
                            />
                            <Label
                              htmlFor={`child-${child.id}`}
                              className="cursor-pointer"
                            >
                              <div className="font-medium">
                                {child.full_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {getAge(child.dob)} years •{" "}
                                {child.gender === "male" ? "Boy" : "Girl"}
                                {child.allergies &&
                                  child.allergies !== "None" &&
                                  ` • Allergies: ${child.allergies}`}
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Package Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Select Package
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {daycare.packages &&
                    daycare.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={cn(
                          "border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                          selectedPackage?.id === pkg.id
                            ? "border-primary bg-blue-50"
                            : "border-gray-200 bg-white"
                        )}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        {pkg.popular && (
                          <Badge className="mb-2 bg-primary">
                            Most Popular
                          </Badge>
                        )}
                        <div className="font-semibold text-gray-900">
                          {pkg.title}
                        </div>
                        <div className="text-2xl font-bold text-primary my-2">
                          {currency(pkg.price)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {pkg.hours}
                          </div>
                          <div>{pkg.description}</div>
                          <div className="text-xs text-gray-500">
                            {pkg.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-date">Start Date *</Label>
                    <Input
                      id="booking-date"
                      type="date"
                      value={selectedDate || ""} // Ensure value is never undefined
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-time">Preferred Time *</Label>
                    <Select
                      value={selectedTime || ""} // Ensure value is never undefined
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special-requests">Special Requests</Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Any special requirements, allergies, or notes for the daycare staff..."
                    value={specialReq || ""} // Ensure value is never undefined
                    onChange={(e) => setSpecialReq(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod || "upi"} // Ensure value is never undefined
                  onValueChange={setPaymentMethod}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={cn(
                        "border-2 rounded-lg p-4 cursor-pointer",
                        paymentMethod === "upi"
                          ? "border-primary bg-blue-50"
                          : "border-gray-200"
                      )}
                    >
                      <RadioGroupItem
                        value="upi"
                        id="upi"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="upi"
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <Smartphone className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-medium">UPI Payment</div>
                          <div className="text-sm text-gray-600">
                            Pay instantly with UPI
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Summary */}
              <Card className="bg-white shadow-lg border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedChildData && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Child:</span>
                        <span className="font-medium">
                          {selectedChildData.full_name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Age:</span>
                        <span>{getAge(selectedChildData.dob)} years</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">
                        {selectedPackage?.title || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedPackage?.duration || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span>
                        {selectedDate
                          ? format(new Date(selectedDate), "MMM d, yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span>{selectedTime || "-"}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-primary text-lg">
                        {currency(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={
                      !selectedChild || !selectedDate || !selectedPackage
                    }
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Your booking is secure and encrypted
                  </div>
                </CardContent>
              </Card>

              {/* Support Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      Need help? Call +91 1800-123-4567
                    </div>
                    <div className="text-xs text-gray-500">
                      24/7 customer support available
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Add Child Dialog */}
      <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="child-name">Child's Name *</Label>
              <Input
                id="child-name"
                value={newChild.name || ""} // Ensure value is never undefined
                onChange={(e) =>
                  setNewChild((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter child's full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="child-age">Age *</Label>
                <Select
                  value={newChild.age?.toString() || "1"} // Ensure value is never undefined
                  onValueChange={(value) =>
                    setNewChild((prev) => ({ ...prev, age: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-gender">Gender *</Label>
                <Select
                  value={newChild.gender || "male"} // Ensure value is never undefined
                  onValueChange={(value) =>
                    setNewChild((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-allergies">Allergies</Label>
              <Input
                id="child-allergies"
                value={newChild.allergies || ""} // Ensure value is never undefined
                onChange={(e) =>
                  setNewChild((prev) => ({
                    ...prev,
                    allergies: e.target.value,
                  }))
                }
                placeholder="List any allergies (if none, type 'None')"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-special-needs">Special Needs</Label>
              <Textarea
                id="child-special-needs"
                value={newChild.specialNeeds || ""} // Ensure value is never undefined
                onChange={(e) =>
                  setNewChild((prev) => ({
                    ...prev,
                    specialNeeds: e.target.value,
                  }))
                }
                placeholder="Any special needs or requirements"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddChild(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddChild} disabled={!newChild.name.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Booking Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daycare:</span>
                  <span className="font-medium">{daycare.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Child:</span>
                  <span>{selectedChildData?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span>
                    {selectedPackage?.title} -{" "}
                    {currency(selectedPackage?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span>
                    {selectedDate
                      ? format(new Date(selectedDate), "MMMM d, yyyy")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTime || "-"}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary">{currency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>
                Your spot will be reserved for 15 minutes during payment
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Edit Details
            </Button>
            <Button onClick={handleConfirmBooking}>
              <CreditCard className="h-4 w-4 mr-2" />
              Confirm & Pay {currency(totalAmount)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {paymentMethod === "upi" && (
              <div className="text-center space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-lg text-primary mb-2">
                    {currency(totalAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Scan QR code to pay with UPI
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    {upiUrl ? (
                      // Show actual QR code image from URL
                      <img
                        src={upiUrl}
                        alt="UPI QR Code"
                        className="h-24 w-24 mx-auto mb-2"
                      />
                    ) : (
                      // Show placeholder/loading QR icon
                      <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-2 animate-pulse" />
                    )}
                    <div className="text-xs text-gray-500">
                      QR Code for UPI Payment
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Amount: {currency(totalAmount)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handlePayment("upi")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4 mr-2 inline-block" />
                        I've Paid via UPI
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-gray-500">
                    Or use UPI ID: {upiID}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              Your payment is secure and encrypted
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Booking Confirmed! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <p className="font-semibold">Your booking has been confirmed!</p>
              <p className="text-sm text-gray-600 mt-2">
                A confirmation email has been sent to {parentInfo.email}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                Booking Code: <strong>{bookingCode}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => router.push("/parents/bookings")}
            >
              View My Bookings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
