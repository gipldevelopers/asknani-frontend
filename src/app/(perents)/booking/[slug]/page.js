// app/booking/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  Users,
  Baby,
  Phone,
  Mail,
  Shield,
  QrCode,
  Smartphone,
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

// Dummy data
const dummyDaycares = [
  {
    id: "1",
    slug: "sunshine-daycare",
    name: "Sunshine Daycare Center",
    rating: 4.8,
    reviewCount: 127,
    location: "Mumbai",
    address: "123 Main Street, Bandra West, Mumbai 400050",
    phone: "+91 98765 43210",
    images: ["/placeholder-daycare-1.jpg"],
    packages: [
      {
        id: "p1",
        title: "Half Day",
        price: 700,
        hours: "8:30am - 1:30pm",
        description: "Snack included",
        popular: false,
        duration: "5 hours",
      },
      {
        id: "p2",
        title: "Full Day",
        price: 1200,
        hours: "8:30am - 6:30pm",
        description: "Lunch + Snacks",
        popular: true,
        duration: "10 hours",
      },
      {
        id: "p3",
        title: "Monthly",
        price: 22000,
        hours: "Monthly plan",
        description: "Discounted long-term plan",
        popular: false,
        duration: "1 month",
      },
    ],
  },
];

const currency = (n) => `₹${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function BookingPage({ params }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package");

  const [daycare, setDaycare] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    age: 2,
    gender: "male",
    allergies: "",
    specialNeeds: "",
  });
  const [parentInfo, setParentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    relationship: "Parent",
  });
  const [bookingDate, setBookingDate] = useState("");
  const [specialReq, setSpecialReq] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const foundDaycare = dummyDaycares.find((d) => d.slug === slug);
    if (foundDaycare) {
      setDaycare(foundDaycare);
      const pkg = packageId
        ? foundDaycare.packages.find((p) => p.id === packageId)
        : foundDaycare.packages.find((p) => p.popular) ||
          foundDaycare.packages[0];
      setSelectedPackage(pkg);
    }

    // Set default children
    setChildren([
      {
        id: "1",
        name: "Aarav Sharma",
        age: 3,
        gender: "male",
        allergies: "None",
        specialNeeds: "",
      },
      {
        id: "2",
        name: "Anaya Patel",
        age: 2,
        gender: "female",
        allergies: "Dairy",
        specialNeeds: "",
      },
    ]);

    // Set default parent info
    setParentInfo({
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 43211",
      relationship: "Father",
    });

    // Set default booking date (tomorrow)
    setBookingDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  }, [slug, packageId]);

  const handleAddChild = () => {
    if (newChild.name.trim()) {
      const child = {
        id: `child-${Date.now()}`,
        ...newChild,
      };
      setChildren((prev) => [...prev, child]);
      setSelectedChild(child.id);
      setNewChild({
        name: "",
        age: 2,
        gender: "male",
        allergies: "",
        specialNeeds: "",
      });
      setShowAddChild(false);
    }
  };

  const handleRemoveChild = (childId) => {
    setChildren((prev) => prev.filter((child) => child.id !== childId));
    if (selectedChild === childId) {
      setSelectedChild(children.length > 1 ? children[0].id : null);
    }
  };

  const handleProceedToPayment = () => {
    if (
      !selectedChild ||
      !bookingDate ||
      !parentInfo.name ||
      !parentInfo.phone
    ) {
      alert("Please fill in all required fields");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    setShowConfirmation(false);
    setShowPayment(true);
  };

  const handlePayment = async (method) => {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowPayment(false);
    alert("Payment successful! Booking confirmed.");
    // Redirect to success page
  };

  if (!daycare || !selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const selectedChildData = children.find((c) => c.id === selectedChild);
  const totalAmount = selectedPackage.price;

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
                          {daycare.rating}
                        </span>
                        <span className="text-xs text-gray-600">
                          ({daycare.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {daycare.location}
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
                      value={parentInfo.name}
                      onChange={(e) =>
                        setParentInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email Address *</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      value={parentInfo.email}
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
                      value={parentInfo.phone}
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
                      value={parentInfo.emergencyContact}
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
                    value={parentInfo.relationship}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddChild(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Baby className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No children added yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowAddChild(true)}
                    >
                      Add Your First Child
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <RadioGroup
                      value={selectedChild}
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
                              <div className="font-medium">{child.name}</div>
                              <div className="text-sm text-gray-600">
                                {child.age} years •{" "}
                                {child.gender === "male" ? "Boy" : "Girl"}
                                {child.allergies &&
                                  child.allergies !== "None" &&
                                  ` • Allergies: ${child.allergies}`}
                              </div>
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChild(child.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                  {daycare.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={cn(
                        "border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                        selectedPackage.id === pkg.id
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 bg-white"
                      )}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.popular && (
                        <Badge className="mb-2 bg-primary">Most Popular</Badge>
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
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-duration">Duration</Label>
                    <Input
                      id="booking-duration"
                      value={selectedPackage.duration}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special-requests">Special Requests</Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Any special requirements, allergies, or notes for the daycare staff..."
                    value={specialReq}
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
                  value={paymentMethod}
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
                    <div
                      className={cn(
                        "border-2 rounded-lg p-4 cursor-pointer",
                        paymentMethod === "card"
                          ? "border-primary bg-blue-50"
                          : "border-gray-200"
                      )}
                    >
                      <RadioGroupItem
                        value="card"
                        id="card"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="card"
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">
                            Pay with card
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
                          {selectedChildData.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Age:</span>
                        <span>{selectedChildData.age} years</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">
                        {selectedPackage.title}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedPackage.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span>
                        {bookingDate
                          ? format(new Date(bookingDate), "MMM d, yyyy")
                          : "-"}
                      </span>
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
                    disabled={!selectedChild || !bookingDate}
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
                value={newChild.name}
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
                  value={newChild.age.toString()}
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
                  value={newChild.gender}
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
                value={newChild.allergies}
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
                value={newChild.specialNeeds}
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
                  <span>{selectedChildData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span>
                    {selectedPackage.title} - {currency(selectedPackage.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span>{format(new Date(bookingDate), "MMMM d, yyyy")}</span>
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
              Confirm & Pay
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
            {paymentMethod === "upi" ? (
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
                    <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-2" />
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4 mr-2" />
                        I've Paid via UPI
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-gray-500">
                    Or use UPI ID: sunshine-daycare@oksbi
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Doe" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handlePayment("card")}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : `Pay ${currency(totalAmount)}`}
                </Button>
              </div>
            )}

            <div className="text-center text-xs text-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              Your payment is secure and encrypted
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
