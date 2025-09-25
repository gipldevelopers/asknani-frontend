// app/daycares/[slug]/page.js
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Calendar,
  Heart,
  CheckCircle,
  X,
  CalendarCheck,
  CreditCard,
  Camera,
  User,
  MessageCircle,
  Share2,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalComponents } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  fetchDaycareDetails,
  submitDaycareReview,
  scheduleDaycareTour,
  submitBooking,
  fetchDaycareReviews,
} from "@/lib/daycareApi"; // Import new API functions

// --------------------------- Utilities ---------------------------
// NOTE: This utility assumes your backend is at the same origin or has public storage.
const assetUrl = (path) =>
  path
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/storage") +
      "/storage/" +
      path
    : null;
const currency = (n) => `₹${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const mapApiDataToDaycareProps = (apiData, reviews) => {
  // Use the sample data structure as a fallback/template for fields not in API response
  const packagesSample = [
    {
      id: "p1",
      title: "Half Day",
      price: 700,
      hours: "8:30am - 1:30pm",
      description: "Snack included",
      popular: false,
    },
    {
      id: "p2",
      title: "Full Day",
      price: 1200,
      hours: "8:30am - 6:30pm",
      description: "Lunch + Snacks",
      popular: true,
    },
    {
      id: "p3",
      title: "Monthly",
      price: 22000,
      hours: "Monthly plan",
      description: "Discounted long-term plan",
      popular: false,
    },
  ];

  return {
    id: apiData.id,
    slug: apiData.slug,
    name: apiData.name || "Daycare Name Missing",
    shortDesc:
      apiData.short_desc || apiData.tagline || "No short description provided.",
    rating: apiData.rating ? Number(apiData.rating.toFixed(1)) : 0,
    reviewCount: reviews.length, // Dynamic count from fetched reviews
    priceFrom: packagesSample[0].price, // Fallback to a package price for quick view
    location: apiData.city?.name || "Unknown City",
    address: apiData.address || "Address not provided",
    phone: apiData.phone || "Not available",
    images: apiData.photos.map((p) => assetUrl(p.image_path)).filter(Boolean),
    features: apiData.facilities.map((f) => f.name),
    staff: apiData.staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role || "Staff Member",
      bio: s.bio || "Experienced caregiver.",
      badge: s.badge || "Verified",
    })),
    packages: packagesSample, // Hardcoded: packages logic needs its own API.
    availability: {
      "2025-09-03": { capacity: 6, total: 12 }, // Hardcoded: availability logic needs its own API.
      "2025-09-04": { capacity: 0, total: 12 },
    },
    safety: apiData.certifications.map((c) => c.name), // Using certifications as 'safety' list
    policies: apiData.policies || "Standard policies apply. Please inquire.",
    reviews: reviews,
    operatingHours: {
      // Hardcoded: hours logic needs its own API.
      weekdays: "7:00 AM - 7:00 PM",
      weekends: "8:00 AM - 6:00 PM",
    },
  };
};

// --------------------------- Main Component ---------------------------
export default function DaycareDetailPage({ params }) {
  const { slug } = params;
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedReviews, setFetchedReviews] = useState([]);

  // Local State (Initialised after daycare data is fetched)
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(2);
  const [specialReq, setSpecialReq] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [faved, setFaved] = useState(false);
  const [capacityInfo, setCapacityInfo] = useState({});

  // Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch Daycare Details
        const apiDetails = await fetchDaycareDetails(slug);

        if (!apiDetails) {
          setError("Daycare not found or is not approved.");
          setLoading(false);
          return;
        }

        // Step 2: Fetch Reviews using the fetched ID
        const reviews = await fetchDaycareReviews(apiDetails.id);
        setFetchedReviews(reviews);

        // Step 3: Map and set state
        const mappedData = mapApiDataToDaycareProps(apiDetails, reviews);
        setDaycare(mappedData);
        setSelectedImage(mappedData.images[0]);
        setSelectedPackage(
          mappedData.packages.find((p) => p.popular) || mappedData.packages[0]
        );
        setCapacityInfo(mappedData.availability);
      } catch (err) {
        setError("Failed to load daycare data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Accessibility: lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      showBookingModal || showReviewModal || showTourModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showBookingModal, showReviewModal, showTourModal]);

  const getCapacityForDate = useCallback(
    (dateStr) => capacityInfo[dateStr] || null,
    [capacityInfo]
  );

  // --- Handlers ---
  const startBooking = async () => {
    if (!bookingDate) {
      alert("Please pick a date");
      return;
    }
    if (!childName) {
      alert("Please provide child's name");
      return;
    }
    // Check if slots are available (simple check)
    const capacity = getCapacityForDate(bookingDate);
    if (capacity && capacity.capacity <= 0) {
      alert("This date is fully booked. Please select another date.");
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      const bookingData = {
        daycare_id: daycare.id,
        package_id: selectedPackage.id,
        booking_date: bookingDate,
        child_name: childName,
        child_age: childAge,
        special_requirements: specialReq,
        // Assuming user is authenticated and ID is passed implicitly via API interceptor
      };

      // API call to process booking (inferred function)
      await submitBooking(bookingData);

      setShowBookingModal(false);
      alert("Booking confirmed! A receipt has been sent to your email.");

      // Optimistically update local capacity
      setCapacityInfo((p) => {
        const next = { ...p };
        if (!next[bookingDate]) next[bookingDate] = { capacity: 0, total: 12 };
        next[bookingDate].capacity = Math.max(
          0,
          next[bookingDate].capacity - 1
        );
        return next;
      });
    } catch (error) {
      setShowBookingModal(false);
      alert("Failed to confirm booking. Please try again or contact support.");
    }
  };

  const submitReview = async (r) => {
    try {
      const newReview = await submitDaycareReview(daycare.id, r);
      // Optimistically add the new review to the list
      setFetchedReviews((s) => [newReview, ...s]);
      setDaycare((p) => ({
        ...p,
        reviewCount: p.reviewCount + 1,
        // Note: Real rating should be recalculated from API or on the backend
      }));
      setShowReviewModal(false);
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Failed to submit review. You might need to be logged in.");
    }
  };

  const scheduleTour = async (tourData) => {
    try {
      await scheduleDaycareTour({
        daycare_id: daycare.id,
        ...tourData,
      });
      setShowTourModal(false);
      alert(
        `Tour scheduled for ${tourData.date} at ${tourData.time}! We'll send a confirmation shortly.`
      );
    } catch (error) {
      alert("Failed to schedule tour. Please try again.");
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Daycare Details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <X className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error Loading Page</h1>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  // Use the mapped and non-null daycare object
  const d = daycare;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-semibold truncate">
              {d.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {d.shortDesc}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="font-medium">{d.rating.toFixed(1)}</span>
                <span>({d.reviewCount})</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{d.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFaved((s) => !s)}
              className={faved ? "text-red-500" : "text-gray-600"}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  Book a Visit
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Quick Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose how you&apos;d like to proceed
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Button onClick={() => setShowTourModal(true)}>
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      Schedule a Tour
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="#booking-section">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Book & Pay Now
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/chats/daycare/${d.id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message Daycare
                      </Link>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <section className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="h-64 w-full relative">
                <Image
                  fill
                  src={selectedImage || d.images[0] || "/placeholder.png"}
                  alt="Daycare gallery"
                  className="object-cover"
                />
                <div className="absolute right-3 top-3 flex gap-2">
                  <Button variant="secondary" size="sm">
                    Virtual tour
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="p-3 border-t flex gap-2 overflow-x-auto">
                {d.images.map((img, index) => (
                  <Button
                    key={img}
                    variant="ghost"
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "h-20 w-28 p-0 overflow-hidden rounded-md",
                      selectedImage === img && "ring-2 ring-primary"
                    )}
                  >
                    <Image
                      alt={`Gallery image ${index + 1}`}
                      width={112}
                      height={80}
                      src={img}
                      className="object-cover"
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">
                {d.shortDesc} — {d.address}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Safety & Security</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {d.safety.length > 0
                        ? d.safety.join(" • ")
                        : "Safety information not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Qualified Staff</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {d.staff.length} background-checked caregivers
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">
                  Facilities & Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {d.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Meet the Team</CardTitle>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.staff.map((staff) => (
                  <div key={staff.id} className="flex gap-3 items-start">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{staff.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {staff.role} •{" "}
                        <Badge variant="outline" className="text-xs">
                          {staff.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{staff.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Section */}
          <Card id="booking-section">
            <CardHeader>
              <CardTitle>Book Your Visit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Selection */}
              <div>
                <Label className="text-base font-medium">
                  Select a Package
                </Label>
                <RadioGroup
                  value={selectedPackage?.id}
                  onValueChange={(value) => {
                    const pkg = d.packages.find((p) => p.id === value);
                    setSelectedPackage(pkg);
                  }}
                  className="grid gap-3 mt-3"
                >
                  {d.packages.map((pkg) => (
                    <Label
                      key={pkg.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer",
                        selectedPackage?.id === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-muted"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={pkg.id} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium flex items-center gap-2">
                            {pkg.title}
                            {pkg.popular && (
                              <Badge variant="default" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {pkg.hours} • {pkg.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {currency(pkg.price)}
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Date Selection */}
              <div>
                <Label htmlFor="booking-date" className="text-base font-medium">
                  Select Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-3",
                        !bookingDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {bookingDate
                        ? format(new Date(bookingDate), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalComponents
                      mode="single"
                      selected={bookingDate ? new Date(bookingDate) : undefined}
                      onSelect={(date) =>
                        setBookingDate(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {bookingDate && (
                  <div className="mt-2 text-sm">
                    <CapacityDisplay
                      capacity={getCapacityForDate(bookingDate)}
                    />
                  </div>
                )}
              </div>

              {/* Child Information */}
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="child-name">Child&apos;s Name</Label>
                    <Input
                      id="child-name"
                      placeholder="Enter child's name"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="child-age">Child&apos;s Age</Label>
                    <Select
                      value={childAge.toString()}
                      onValueChange={(value) => setChildAge(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }, (_, i) => i).map((age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age === 0
                              ? "Under 1 year"
                              : `${age} year${age !== 1 ? "s" : ""}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special-requirements">
                    Special Requirements
                  </Label>
                  <Textarea
                    id="special-requirements"
                    placeholder="Any allergies, medications, or special notes..."
                    value={specialReq}
                    onChange={(e) => setSpecialReq(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={startBooking}
                className="w-full"
                size="lg"
                disabled={!selectedPackage || !bookingDate || !childName}
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>

          {/* Reviews Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parent Reviews</CardTitle>
              <Button variant="ghost" onClick={() => setShowReviewModal(true)}>
                Write a Review
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fetchedReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {review.name ? review.name[0] : "U"}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {review.name || "Anonymous Parent"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {review.date
                              ? format(new Date(review.date), "yyyy-MM-dd")
                              : "Date Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="font-medium text-sm">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.text}</p>
                  </div>
                ))}
                {fetchedReviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {" "}
            {/* Adjusted top for sticky header */}
            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Starting from
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {currency(d.priceFrom)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span className="font-medium">{d.rating}</span>
                      <span className="text-muted-foreground">
                        ({d.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => setShowTourModal(true)}
                  >
                    Schedule a Tour
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/chats/daycare/${d.id}`}>Message Daycare</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${d.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Weekdays</span>
                    <span className="font-medium">
                      {d.operatingHours.weekdays}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekends</span>
                    <span className="font-medium">
                      {d.operatingHours.weekends}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Safety Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Safety & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {d.safety.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {d.address}
                </p>
                <div className="h-32 bg-muted rounded-md flex items-center justify-center mb-3">
                  <span className="text-sm text-muted-foreground">
                    Map View
                  </span>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>

      {/* Booking Confirmation Modal */}
      {d && selectedPackage && (
        <BookingModal
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          daycare={d}
          selectedPackage={selectedPackage}
          bookingDate={bookingDate}
          childName={childName}
          childAge={childAge}
          specialReq={specialReq}
          onConfirm={confirmBooking}
        />
      )}

      {/* Schedule Tour Modal */}
      {d && (
        <TourModal
          open={showTourModal}
          onOpenChange={setShowTourModal}
          daycare={d}
          onSchedule={scheduleTour}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSubmit={submitReview}
      />
    </div>
  );
}

// --------------------------- Capacity Display Component ---------------------------
// (Keep this component as is)
function CapacityDisplay({ capacity }) {
  if (!capacity) {
    return (
      <div className="text-muted-foreground">
        No availability data for this date
      </div>
    );
  }

  const isAvailable = capacity.capacity > 0;
  const percentage = (capacity.capacity / capacity.total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">
          Capacity: {capacity.capacity}/{capacity.total}
        </span>
        <Badge variant={isAvailable ? "default" : "destructive"}>
          {isAvailable ? "Slots Available" : "Fully Booked"}
        </Badge>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all",
            percentage > 50
              ? "bg-green-500"
              : percentage > 20
              ? "bg-amber-500"
              : "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// --------------------------- Booking Modal Component ---------------------------
// (Keep this component as is)
function BookingModal({
  open,
  onOpenChange,
  daycare,
  selectedPackage,
  bookingDate,
  childName,
  childAge,
  specialReq,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Daycare</span>
              <span className="text-sm font-medium">{daycare.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Package</span>
              <span className="text-sm font-medium">
                {selectedPackage.title} - {currency(selectedPackage.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm font-medium">
                {bookingDate
                  ? format(new Date(bookingDate), "PPP")
                  : "Not selected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Child</span>
              <span className="text-sm font-medium">
                {childName} ({childAge} {childAge === 1 ? "year" : "years"})
              </span>
            </div>
            {specialReq && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="text-sm font-medium">{specialReq}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Total Amount</span>
              <span>{currency(selectedPackage.price)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay & Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------- Tour Modal Component ---------------------------
// (Keep this component as is)
function TourModal({ open, onOpenChange, daycare, onSchedule }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const availableTimes = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

  const handleSubmit = () => {
    if (!date || !time || !name || !phone) {
      alert("Please fill in all required fields");
      return;
    }
    onSchedule({ date, time, name, phone, notes });
  };

  // Use useEffect to reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setDate("");
      setTime("");
      setName("");
      setPhone("");
      setNotes("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Tour</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tour-date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(new Date(date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalComponents
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selectedDate) =>
                      setDate(
                        selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                      )
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour-time">Time *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-name">Your Name *</Label>
            <Input
              id="tour-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-phone">Phone Number *</Label>
            <Input
              id="tour-phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-notes">Additional Notes</Label>
            <Textarea
              id="tour-notes"
              placeholder="Any specific questions or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!date || !time || !name || !phone}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            Schedule Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------- Review Modal Component ---------------------------
// (Keep this component as is)
function ReviewModal({ open, onOpenChange, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      alert("Please fill in all fields");
      return;
    }
    onSubmit({
      name: name.trim(),
      rating,
      text: comment.trim(),
      // The date will be set on the server based on the API helper logic
    });
    setName("");
    setComment("");
    setRating(5);
  };

  // Use useEffect to reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setName("");
      setComment("");
      setRating(5);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-name">Your Name</Label>
            <Input
              id="review-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1 h-auto"
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">Your Review</Label>
            <Textarea
              id="review-comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !comment.trim()}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
