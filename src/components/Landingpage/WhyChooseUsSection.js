// components/WhyChooseUsSection.js
"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Shield, DollarSign, Calendar, Star, MessageCircle } from "lucide-react";

export default function WhyChooseUsSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Why Daycare Providers Choose Our Platform
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Join hundreds of daycare centers across India that are growing their business
                        and simplifying operations with our comprehensive platform.
                    </p>
                </div>

                {/* Section 1: Business Growth */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="order-2 md:order-1">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full mr-4">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Grow Your Business</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Reach thousands of parents actively searching for quality daycare in your area.
                            Our platform connects you with families who value and are ready to pay for exceptional care.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <span>Access to a large pool of verified parents in your city</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <span>Increase enrollment with premium visibility options</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Star className="h-4 w-4 text-primary" />
                                </div>
                                <span>Build your reputation with verified reviews</span>
                            </li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-primary mb-2">87%</div>
                                <p className="text-gray-700">of providers report increased enrollment within 3 months</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Simplified Management */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Calendar className="h-12 w-12 text-accent" />
                                </div>
                                <p className="text-gray-700 font-semibold">Streamlined booking and calendar management</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-secondary/10 rounded-full mr-4">
                                <Shield className="h-8 w-8 text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Simplify Operations</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Our powerful admin tools help you manage enrollments, payments, and communications
                            all in one place - saving you time and reducing administrative work.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Calendar className="h-4 w-4 text-secondary" />
                                </div>
                                <span>Easy-to-use calendar for availability management</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <MessageCircle className="h-4 w-4 text-secondary" />
                                </div>
                                <span>Integrated messaging with parents</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <DollarSign className="h-4 w-4 text-secondary" />
                                </div>
                                <span>Automated billing and payment processing</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Section 3: Trust & Security */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-accent/10 rounded-full mr-4">
                                <Shield className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Trust & Security</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            We verify all parents and handle secure payments, so you can focus on what you do best -
                            providing exceptional care for children.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Shield className="h-4 w-4 text-accent" />
                                </div>
                                <span>Verified parent profiles with complete information</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-0.5">
                                    <DollarSign className="h-4 w-4 text-accent" />
                                </div>
                                <span>Secure payment processing with timely transfers</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Users className="h-4 w-4 text-accent" />
                                </div>
                                <span>Dedicated support team for provider assistance</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-6 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary mb-2">24/7</div>
                                <p className="text-gray-700">Platform monitoring and dedicated provider support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Provider Testimonials */}
                <div className="mt-20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            What Our Providers Say
                        </h3>
                        <p className="text-gray-600">
                            Hear from daycare centers already using our platform
                        </p>
                    </div>

                    <div className="relative">
                        {/* Left Button */}
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-indigo-50 hidden sm:block"
                        >
                            <ChevronLeft className="h-6 w-6 text-primary" />
                        </button>

                        {/* Testimonials List */}
                        <div
                            ref={scrollRef}
                            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
                        >
                            {[
                                {
                                    name: "Priya Sharma",
                                    daycare: "Little Stars Daycare, Delhi",
                                    content: "Since joining this platform, we've increased our enrollment by 40%. The parent quality is excellent, and the booking system saves us hours each week.",
                                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                },
                                {
                                    name: "Rajesh Kumar",
                                    daycare: "Bright Minds Preschool, Mumbai",
                                    content: "The payment system is seamless, and we get our transfers on time. It's made financial management so much easier for our center.",
                                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                },
                                {
                                    name: "Anjali Patel",
                                    daycare: "Sunshine Kids, Bengaluru",
                                    content: "I love how the platform handles verification. We only get serious inquiries from genuine parents, which saves us time and effort.",
                                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                },
                                {
                                    name: "Vikram Singh",
                                    daycare: "Tiny Tots Haven, Hyderabad",
                                    content: "The calendar management feature has eliminated double-bookings and scheduling conflicts. Our staff is less stressed and more organized.",
                                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                }
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="min-w-[300px] md:min-w-[400px] bg-gray-50 rounded-xl p-6 snap-center shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="h-12 w-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.daycare}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                                </div>
                            ))}
                        </div>

                        {/* Right Button */}
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-indigo-50 hidden sm:block"
                        >
                            <ChevronRight className="h-6 w-6 text-primary" />
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-primary text-white rounded-full shadow hover:bg-primary-hover transition font-semibold">
                        Register Your Daycare Center
                    </button>
                    <p className="text-gray-600 mt-4">Join our growing network of trusted daycare providers</p>
                </div>
            </div>

            {/* Hide scrollbar utility */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}