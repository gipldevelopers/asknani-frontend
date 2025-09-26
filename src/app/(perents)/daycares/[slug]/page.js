// app/daycares/[slug]/page.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Heart,
  CheckCircle,
  X,
  CalendarCheck,
  Camera,
  User,
  MessageCircle,
  Share2,
  Loader2,
  CreditCard,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import API from "@/lib/api";

// --------------------------- Dummy Data ---------------------------

function getEmbedUrl(normalUrl) {
  try {
    if (normalUrl.includes("/maps")) {
      return normalUrl.replace("/maps", "/maps/embed");
    }
    return normalUrl;
  } catch (err) {
    console.error("Invalid Maps URL", err);
    return "";
  }
}

const currency = (n) => `₹${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --------------------------- Main Component ---------------------------
export default function DaycareDetailPage({ params }) {
  const { slug } = React.use(params);
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Local State
  const [selectedImage, setSelectedImage] = useState(null);
  const [faved, setFaved] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [packages, setPackages] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = daycare?.images || [];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch daycare details by slug
        const daycareRes = await API.get(`/daycares/${slug}`);
        const fetchedDaycare = daycareRes.data.daycare;
        setDaycare(fetchedDaycare);
        setSelectedImage(fetchedDaycare.images[0]);
        const logFootfall = async () => {
          try {
            const response = await API.post(
              `/daycares/${fetchedDaycare.id}/footfall`
            );
            console.log("Footfall logged:", response.data);
          } catch (error) {
            console.error("Failed to log footfall:", error);
          }
        };

        logFootfall();
        // 2️⃣ Fetch packages for this daycare
        const packagesRes = await API.get(
          `/daycares/packages/list?id=${fetchedDaycare.id}`
        );
        const pkgList = packagesRes.data.packages || [];

        // Randomly mark one package as popular if none
        if (!pkgList.some((p) => p.popular) && pkgList.length > 0) {
          const randomIndex = Math.floor(Math.random() * pkgList.length);
          pkgList.forEach((p, i) => (p.popular = i === randomIndex));
        }
        setPackages(pkgList);
      } catch (err) {
        console.log(err);

        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadData();
  }, [slug]);

  // Accessibility: lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      showReviewModal || showTourModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showReviewModal, showTourModal]);

  // Handlers
  const submitReview = (reviewData) => {
    const newReview = {
      id: `r${Date.now()}`,
      ...reviewData,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    setDaycare((prev) => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
      reviewCount: prev.reviewCount + 1,
    }));

    setShowReviewModal(false);
    alert("Review submitted successfully!");
  };

  const scheduleTour = (tourData) => {
    setShowTourModal(false);
    alert(
      `Tour scheduled for ${tourData.date} at ${tourData.time}! We'll send a confirmation shortly.`
    );
  };

  // Render Logic
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Daycare Details...</span>
      </div>
    );
  }

  if (error || !daycare) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <X className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Daycare Not Found</h1>
        <p className="text-gray-600">
          {error || "The daycare you're looking for doesn't exist."}
        </p>
        <Button asChild className="mt-6">
          <Link href="/daycares">Browse Daycares</Link>
        </Button>
      </div>
    );
  }

  const d = daycare;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {d.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {d.shortDesc}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="font-semibold">{d.rating.toFixed(1)}</span>
                <span>({d.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{d.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFaved((s) => !s)}
              className={cn(
                "h-10 w-10",
                faved ? "text-red-500 border-red-200" : "text-gray-600"
              )}
            >
              <Heart className={cn("h-5 w-5", faved && "fill-current")} />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 px-6">
                  Book Now
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Quick Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose how you'd like to proceed
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Button onClick={() => setShowTourModal(true)}>
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      Schedule a Tour
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/booking/${d.slug}`}>
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

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <section className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-black">
                {/* Main Image */}
                <div className="h-80 w-full relative overflow-hidden flex items-center justify-center">
                  {images.length > 0 ? (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        images[selectedIndex].url
                      }
                      alt={`Daycare image ${selectedIndex + 1}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                      <Camera className="h-16 w-16 text-gray-300" />
                      <span className="ml-2 text-gray-400">Daycare Images</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="absolute right-4 top-4 flex gap-2 z-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    Virtual Tour
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        i === selectedIndex
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={process.env.NEXT_PUBLIC_BACKEND_URL + img.url}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {img.isFeatured && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          ★
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overview Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                {d.shortDesc} Located at {d.address}. We provide a safe,
                nurturing environment where children can learn, play, and grow
                under the care of our experienced staff.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Safety & Security
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {d.safety.join(" • ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Qualified Staff
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {d.staff.length} background-checked caregivers with
                      certifications
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Facilities & Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {d.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl">Meet Our Team</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {d.staff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {staff.role} •
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {staff.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{staff.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Booking Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Choose from our flexible packages designed to meet your family's
                needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {d.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={cn(
                      "border rounded-lg p-4 transition-all hover:shadow-md",
                      pkg.popular
                        ? "border-primary border-2 bg-white"
                        : "border-gray-200 bg-white"
                    )}
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
                    <div className="text-sm text-gray-600 mb-3">
                      {pkg.hours}
                      <br />
                      {pkg.description}
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link href={`/booking/${d.slug}?package=${pkg.id}`}>
                        Select Package
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl">Parent Reviews</CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(true)}
              >
                Write a Review
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {d.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center font-semibold text-blue-600">
                          {review.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {review.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(review.date), "MMMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Quick Info Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Starting from</div>
                    <div className="text-3xl font-bold text-primary">
                      {currency(d.priceFrom)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold">{d.rating}</span>
                      <span className="text-gray-600">({d.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => setShowTourModal(true)}
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Schedule a Tour
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/booking/${d.slug}`}>Book & Pay Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/chats/daycare/${d.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Daycare
                    </Link>
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
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Weekdays</span>
                  <span className="font-semibold">
                    {d.operatingHours.weekdays}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Weekends</span>
                  <span className="font-semibold">
                    {d.operatingHours.weekends}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Safety Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Safety & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {d.safety.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {d.address}
                </p>
                <div className="h-40 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
                  <iframe
                    src={getEmbedUrl(d.mapUrl)} // 👈 user’s normal URL converted to embed
                    width="400"
                    height="160"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <a href={d.mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Open in Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>

      {/* Tour Modal */}
      <TourModal
        open={showTourModal}
        onOpenChange={setShowTourModal}
        daycare={d}
        onSchedule={scheduleTour}
      />

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSubmit={submitReview}
      />
    </div>
  );
}

// --------------------------- Tour Modal Component ---------------------------
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Tour at {daycare?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tour-date">Date *</Label>
              <input
                type="date"
                id="tour-date"
                className="w-full p-2 border rounded-md"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour-time">Time *</Label>
              <select
                id="tour-time"
                className="w-full p-2 border rounded-md"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select time</option>
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-name">Your Name *</Label>
            <input
              id="tour-name"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-phone">Phone Number *</Label>
            <input
              id="tour-phone"
              type="tel"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour-notes">Additional Notes</Label>
            <textarea
              id="tour-notes"
              className="w-full p-2 border rounded-md"
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-name">Your Name *</Label>
            <input
              id="review-name"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">Your Review *</Label>
            <textarea
              id="review-comment"
              className="w-full p-2 border rounded-md"
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
