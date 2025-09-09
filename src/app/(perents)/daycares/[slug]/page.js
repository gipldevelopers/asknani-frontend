"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";

// --------------------------- Sample data (replace with API) ---------------------------
const sampleDaycare = {
    id: 101,
    slug: "sunshine-montessori-mumbai",
    name: "Sunshine Montessori & Daycare",
    shortDesc: "Caring, secure, and joyful early learning for ages 6 months to 6 years.",
    rating: 4.8,
    reviewCount: 214,
    priceFrom: 700,
    location: "Bandra West, Mumbai",
    address: "12 Palm Grove, Bandra West, Mumbai, Maharashtra",
    phone: "+91-9876543210",
    images: [
        "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?auto=format&fit=crop&w=1200&q=80",
    ],
    gallery: [
        // more images
    ],
    features: ["CCTV", "Nutritious Meals", "Outdoor Play", "Qualified Teachers", "Parent App"],
    staff: [
        { id: 1, name: "Asha Patel", role: "Head Teacher", bio: "10+ years experience in early childhood education.", badge: "ECCE Certified" },
        { id: 2, name: "Rohit Sharma", role: "Assistant", bio: "First aid certified, experienced with infants.", badge: "First Aid" },
    ],
    packages: [
        { id: "p1", title: "Half Day", price: 700, hours: "8:30am - 1:30pm", description: "Snack included" },
        { id: "p2", title: "Full Day", price: 1200, hours: "8:30am - 6:30pm", description: "Lunch + Snacks" },
        { id: "p3", title: "Monthly", price: 22000, hours: "Monthly plan", description: "Discounted long-term plan" },
    ],
    availability: {
        // simple calendar stub: date->availableSlots
        "2025-09-03": { capacity: 6, total: 12 },
        "2025-09-04": { capacity: 0, total: 12 },
    },
    safety: ["Background-checked staff", "Fire-safety drills", "CCTV monitoring"],
    policies: "All medications must be declared. Sick children must remain at home.",
    reviews: [
        { id: 1, name: "Meera", rating: 5, text: "Wonderful staff and communication.", date: "2025-07-02" },
        { id: 2, name: "Rahul", rating: 4, text: "Very caring but pickup queue can be long.", date: "2025-06-20" },
    ],
    mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18...",
};

// --------------------------- Utilities ---------------------------
const currency = (n) => `₹${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --------------------------- Component ---------------------------
export default function DaycareDetailPage({ daycare = sampleDaycare }) {
    const [selectedImage, setSelectedImage] = useState(daycare.images[0]);
    const [selectedPackage, setSelectedPackage] = useState(daycare.packages[1]);
    const [bookingDate, setBookingDate] = useState("");
    const [childName, setChildName] = useState("");
    const [childAge, setChildAge] = useState(2);
    const [specialReq, setSpecialReq] = useState("");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [faved, setFaved] = useState(false);
    const [reviews, setReviews] = useState(daycare.reviews || []);
    const [capacityInfo, setCapacityInfo] = useState(daycare.availability || {});

    // Accessibility: lock scroll when modal open
    useEffect(() => {
        document.body.style.overflow = showBookingModal || showReviewModal ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [showBookingModal, showReviewModal]);

    // TODO: Replace with API call to refresh availability for selected date
    const getCapacityForDate = (dateStr) => capacityInfo[dateStr] || null;

    const startBooking = () => {
        // Basic validation
        if (!bookingDate) return alert("Please pick a date");
        if (!childName) return alert("Please provide child's name");

        // open confirm modal
        setShowBookingModal(true);
    };

    const confirmBooking = async () => {
        // Hook here: call booking API, process payment, save booking
        // For demo, simulate success
        setShowBookingModal(false);
        alert("Booking confirmed! A receipt has been sent to your email.");
        // push to booking history, update capacity locally
        setCapacityInfo((p) => {
            const next = { ...p };
            if (!next[bookingDate]) next[bookingDate] = { capacity: 0, total: 12 };
            next[bookingDate].capacity = Math.max(0, next[bookingDate].capacity - 1);
            return next;
        });
    };

    const submitReview = (r) => {
        // In real app: send to API and await moderation
        setReviews((s) => [{ id: Date.now(), ...r }, ...s]);
        setShowReviewModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* top hero */}
            {/* top hero */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left content */}
                    <div className="flex-1">
                        <h1 className="text-base sm:text-lg font-semibold truncate">{daycare.name}</h1>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{daycare.shortDesc}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="font-medium">{daycare.rating.toFixed(1)}</span>
                                <span>({daycare.reviewCount})</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{daycare.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setFaved((s) => !s)}
                            className={`rounded-full border p-2 ${faved ? "text-red-500" : "text-gray-600"}`}
                            aria-pressed={faved}
                        >
                            <Heart className="h-5 w-5" />
                        </button>
                        <Link href={"#packages"} >
                            <button
                                className="rounded-lg bg-primary px-3 py-2 text-xs sm:text-sm text-white whitespace-nowrap cursor-pointer"
                            >
                                Book a Visit
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* left column: gallery & details */}
                <section className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="h-64 w-full relative">
                            <Image fill src={selectedImage} alt="gallery" className="h-full w-full object-cover" />
                            <div className="absolute right-3 top-3 flex gap-2">
                                <button className="rounded-md bg-white/90 px-2 py-1 text-xs">Virtual tour</button>
                                <button className="rounded-md bg-white/90 px-2 py-1 text-xs">Share</button>
                            </div>
                        </div>
                        <div className="p-3 border-t border-gray-500 overflow-x-auto flex gap-2 scrollbar-hide">
                            {daycare.images.map((img) => (
                                <button key={img} onClick={() => setSelectedImage(img)} className="shrink-0">
                                    <Image alt="image" width={28} height={20} src={img} className={`h-20 w-28 object-cover rounded-md ${selectedImage === img ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-100'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Overview & features */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3 border border-gray-100">
                        <h2 className="text-base font-semibold">Overview</h2>
                        <p className="text-sm text-gray-700">{daycare.shortDesc} — {daycare.address}.</p>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div>
                                    <div className="text-sm font-medium">Safety</div>
                                    <div className="text-xs text-gray-600">{daycare.safety.join(' • ')}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <div className="text-sm font-medium">Staff</div>
                                    <div className="text-xs text-gray-600">{daycare.staff.length} qualified caregivers</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Facilities & Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {daycare.features.map((f) => (
                                    <span key={f} className="text-xs rounded-full bg-gray-100 px-3 py-1">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Staff */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between"  >
                            <h3 className="text-base font-semibold">Meet the team</h3>
                            <button className="text-sm text-primary" id="packages">View all</button>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            {daycare.staff.map((s) => (
                                <div key={s.id} className="flex gap-3 items-center">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                                    <div>
                                        <div className="text-sm font-medium">{s.name}</div>
                                        <div className="text-xs text-gray-600">{s.role} · {s.badge}</div>
                                        <div className="text-xs text-gray-500">{s.bio}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing & packages */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100" >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">Pricing & packages</h3>
                            <div className="text-sm text-gray-600">Starting from <span className="font-semibold">{currency(daycare.priceFrom)}</span></div>
                        </div>

                        <div className="mt-3 grid gap-3">
                            {daycare.packages.map((p) => (
                                <label key={p.id} className={`flex items-center justify-between rounded-lg border border-gray-200 p-3 ${selectedPackage.id === p.id ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium">{p.title} <span className="text-xs text-gray-500">· {p.hours}</span></div>
                                        <div className="text-xs text-gray-600">{p.description}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold">{currency(p.price)}</div>
                                        <input type="radio" name="pkg" checked={selectedPackage.id === p.id} onChange={() => setSelectedPackage(p)} className="hidden" />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Availability & calendar */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">Check availability</h3>
                            <div className="text-xs text-gray-500">Real-time capacity</div>
                        </div>

                        <div className="mt-3">
                            <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full rounded-lg border border-gray-200 p-2" />
                            <div className="mt-2 text-sm">
                                {bookingDate ? (
                                    (() => {
                                        const cap = getCapacityForDate(bookingDate);
                                        if (!cap) return <div className="text-xs text-gray-500">No data for selected date.</div>
                                        return (
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">Capacity: <span className="font-semibold">{cap.capacity}/{cap.total}</span></div>
                                                <div>
                                                    {cap.capacity > 0 ? <span className="text-sm text-green-600">Slots available</span> : <span className="text-sm text-red-500">Full</span>}
                                                </div>
                                            </div>
                                        )
                                    })()
                                ) : (
                                    <div className="text-xs text-gray-500">Pick a date to check available slots.</div>
                                )}
                            </div>

                            <div className="mt-3 grid gap-2">
                                <input type="text" placeholder="Child's Name" value={childName} onChange={(e) => setChildName(e.target.value)} className="rounded-lg border border-gray-200 p-2" />
                                <input type="number" min={0} placeholder="Child's Age (years)" value={childAge} onChange={(e) => setChildAge(Number(e.target.value))} className="rounded-lg border-gray-200 border p-2" />
                                <textarea placeholder="Special requirements (allergies, meds, notes)" value={specialReq} onChange={(e) => setSpecialReq(e.target.value)} className="rounded-lg border border-gray-200 p-2" rows={3} />
                                <button onClick={startBooking} className="rounded-lg bg-primary px-4 py-2 text-white">Book & Pay</button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">Parent reviews</h3>
                            <button onClick={() => setShowReviewModal(true)} className="text-sm text-primary">Write a review</button>
                        </div>
                        <div className="mt-3 space-y-3">
                            {reviews.map(r => (
                                <div key={r.id} className="rounded-lg border border-gray-300 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">{r.name[0]}</div>
                                            <div>
                                                <div className="text-sm font-medium">{r.name}</div>
                                                <div className="text-xs text-gray-500">{r.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-amber-400" />
                                            <span className="text-sm font-medium">{r.rating}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700">{r.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

                {/* right column: sticky booking sidebar */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">From</div>
                                    <div className="text-xl font-bold text-primary">{currency(daycare.priceFrom)}</div>
                                </div>
                                <div className="text-right text-sm text-gray-600">{daycare.rating} <Star className="inline h-4 w-4 text-amber-400" /></div>
                            </div>

                            <div className="mt-3 space-y-2">
                                <button className="w-full rounded-lg bg-primary px-4 py-2 text-white cursor-pointer">Request a Visit</button>
                                <Link href={"/chats/daycare/1"}>
                                    <button className="w-full cursor-pointer rounded-lg border border-gray-200 px-4 py-2">Message Daycare</button>
                                </Link>
                                {/* <a className="block text-center text-sm text-gray-600 mt-1" href={`tel:${daycare.phone}`}><Phone className="inline h-4 w-4 mr-1" /> Call</a> */}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                            <h4 className="text-sm font-semibold">Safety & certifications</h4>
                            <ul className="mt-2 space-y-2 text-xs text-gray-600">
                                {daycare.safety.map((s) => (<li key={s} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> {s}</li>))}
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                            <h4 className="text-sm font-semibold">Location</h4>
                            <p className="text-xs text-gray-600 mt-2">{daycare.address}</p>
                            <div className="mt-3 h-36 w-full bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">Map placeholder</div>
                            <a className="mt-2 inline-flex items-center gap-1 text-sm text-primary" href="#" onClick={(e) => { e.preventDefault(); window.open(daycare.mapEmbedSrc, '_blank') }}>Open in maps <ArrowUpRight className="h-4 w-4" /></a>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Booking confirm modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowBookingModal(false)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-lg">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold">Confirm booking</h3>
                            <button onClick={() => setShowBookingModal(false)} className="p-2 rounded-full"><X /></button>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                            <div><strong>Daycare:</strong> {daycare.name}</div>
                            <div><strong>Package:</strong> {selectedPackage.title} — {currency(selectedPackage.price)}</div>
                            <div><strong>Date:</strong> {bookingDate}</div>
                            <div><strong>Child:</strong> {childName} ({childAge} yrs)</div>
                            <div><strong>Notes:</strong> {specialReq || '—'}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => confirmBooking()} className="flex-1 rounded-lg bg-primary px-4 py-2 text-white">Pay & Confirm</button>
                            <button onClick={() => setShowBookingModal(false)} className="flex-1 rounded-lg border px-4 py-2">Cancel</button>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Payments powered by your chosen gateway (integrate real gateway on server).</div>
                    </div>
                </div>
            )}

            {/* Review modal */}
            {showReviewModal && (
                <ReviewModal onClose={() => setShowReviewModal(false)} onSubmit={submitReview} />
            )}

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none }
      `}</style>
        </div>
    );
}

// --------------------------- Review Modal ---------------------------
function ReviewModal({ onClose, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [name, setName] = useState("");

    const handle = () => {
        if (!name) return alert('Please add your name');
        if (!text) return alert('Add a short review');
        onSubmit({ name, rating, text, date: new Date().toISOString().slice(0, 10) });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Write a review</h3>
                    <button onClick={onClose} className="p-2 rounded-full"><X /></button>
                </div>
                <div className="mt-3 space-y-3">
                    <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border p-2" />
                    <div className="flex items-center gap-2">
                        {[5, 4, 3, 2, 1].map(n => (
                            <button key={n} onClick={() => setRating(n)} className={`rounded-full p-2 ${rating === n ? 'bg-amber-100' : ''}`}>{n} ⭐</button>
                        ))}
                    </div>
                    <textarea placeholder="Share your experience" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border p-2" rows={4} />
                    <div className="flex gap-2">
                        <button onClick={handle} className="flex-1 rounded-lg bg-primary px-4 py-2 text-white">Submit review</button>
                        <button onClick={onClose} className="flex-1 rounded-lg border px-4 py-2">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
