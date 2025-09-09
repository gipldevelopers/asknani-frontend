// app/profile/page.js
"use client";
import { useState } from "react";
import { Edit3, Camera, Save, X, User, Phone, Mail, MapPin, Calendar, Shield, Bell, CreditCard, FileText, Heart, LogOut, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ParentProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const bookings = {
        upcoming: [
            {
                id: 1,
                daycareName: "Sunshine Kids Daycare",
                date: "2023-11-15",
                time: "09:00 AM - 05:00 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1200,
                address: "123 MG Road, Bengaluru",
                image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 3
            },
            {
                id: 2,
                daycareName: "Little Explorers Preschool",
                date: "2023-11-18",
                time: "08:30 AM - 04:30 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1500,
                address: "456 Koramangala, Bengaluru",
                image: "https://images.unsplash.com/photo-1590086782957-93c06ef2b8ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 6
            },
            {
                id: 3,
                daycareName: "Bright Beginnings Center",
                date: "2023-11-20",
                time: "10:00 AM - 06:00 PM",
                childName: "Rahul Sharma",
                status: "pending",
                price: 1350,
                address: "789 Indiranagar, Bengaluru",
                image: "https://images.unsplash.com/photo-1618835962148-cf2c2f52fbc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 8
            },
            {
                id: 4,
                daycareName: "Happy Tots Childcare",
                date: "2023-11-22",
                time: "09:00 AM - 05:00 PM",
                childName: "Rahul Sharma",
                status: "confirmed",
                price: 1100,
                address: "321 Jayanagar, Bengaluru",
                image: "https://images.unsplash.com/photo-1592503254549-d3d2c4a01d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                daysLeft: 10
            }
        ],
        past: [
            {
                id: 5,
                daycareName: "Rainbow Learning Center",
                date: "2023-10-20",
                time: "08:00 AM - 04:00 PM",
                childName: "Rahul Sharma",
                status: "completed",
                price: 1400,
                address: "654 Whitefield, Bengaluru",
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 5
            },
            {
                id: 6,
                daycareName: "Tiny Steps Daycare",
                date: "2023-10-15",
                time: "09:30 AM - 05:30 PM",
                childName: "Rahul Sharma",
                status: "completed",
                price: 1250,
                address: "987 HSR Layout, Bengaluru",
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 4
            }
        ],
        cancelled: [
            {
                id: 7,
                daycareName: "Playful Pandas Daycare",
                date: "2023-10-10",
                time: "09:30 AM - 05:30 PM",
                childName: "Rahul Sharma",
                status: "cancelled",
                price: 1300,
                address: "555 Electronic City, Bengaluru",
                image: "https://images.unsplash.com/photo-1541692646449-57b2d6ffc2ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
        ]
    };
    // Sample parent data
    const [parentData, setParentData] = useState({
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 98765 43210",
        address: "123 Koramangala, Bengaluru, Karnataka 560034",
        dob: "1990-05-15",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        emergencyContact: {
            name: "Priya Sharma",
            relationship: "Spouse",
            phone: "+91 98765 12345"
        },
        notificationPreferences: {
            email: true,
            sms: true,
            push: false
        }
    });

    const [children, setChildren] = useState([
        {
            id: 1,
            name: "Aarav Sharma",
            age: "3 years",
            dob: "2020-08-10",
            allergies: "None",
            specialNeeds: "None",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            name: "Anika Sharma",
            age: "1.5 years",
            dob: "2022-03-22",
            allergies: "Dairy",
            specialNeeds: "None",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ]);

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, you would save the data to your backend here
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data if needed
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-white shadow-sm border-gray-200 border-b">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <div className="flex items-center space-x-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover flex items-center"
                                    >
                                        <Save className="h-4 w-4 mr-1" />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover flex items-center"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <Image
                                        width={32}
                                        height={32}
                                        src={parentData.profileImage}
                                        alt={parentData.name}
                                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    {isEditing && (
                                        <button className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white hover:bg-primary-hover">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{parentData.name}</h2>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {parentData.email}
                                </p>
                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-4 w-4 mr-2" />
                                        <span>{parentData.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{parentData.address}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>DOB: {parentData.dob}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-primary" />
                                Emergency Contact
                            </h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={parentData.emergencyContact.name}
                                            onChange={(e) => setParentData({
                                                ...parentData,
                                                emergencyContact: {
                                                    ...parentData.emergencyContact,
                                                    name: e.target.value
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                        <input
                                            type="text"
                                            value={parentData.emergencyContact.relationship}
                                            onChange={(e) => setParentData({
                                                ...parentData,
                                                emergencyContact: {
                                                    ...parentData.emergencyContact,
                                                    relationship: e.target.value
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={parentData.emergencyContact.phone}
                                            onChange={(e) => setParentData({
                                                ...parentData,
                                                emergencyContact: {
                                                    ...parentData.emergencyContact,
                                                    phone: e.target.value
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">{parentData.emergencyContact.name}</p>
                                    <p className="text-gray-600">{parentData.emergencyContact.relationship}</p>
                                    <p className="text-gray-600">{parentData.emergencyContact.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Tabs Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="flex border-b border-gray-200">
                                {["personal", "children", "documents"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 px-2 py-3 text-sm font-medium relative flex items-center justify-center ${activeTab === tab ? "text-primary" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        {tab === "personal" && <User className="h-4 w-4 mr-2" />}
                                        {tab === "children" && <Heart className="h-4 w-4 mr-2" />}
                                        {tab === "documents" && <FileText className="h-4 w-4 mr-2" />}
                                        <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Personal Information Tab */}
                            {activeTab === "personal" && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={parentData.name}
                                                    onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{parentData.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={parentData.email}
                                                    onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{parentData.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={parentData.phone}
                                                    onChange={(e) => setParentData({ ...parentData, phone: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{parentData.phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={parentData.dob}
                                                    onChange={(e) => setParentData({ ...parentData, dob: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{parentData.dob}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            {isEditing ? (
                                                <textarea
                                                    value={parentData.address}
                                                    onChange={(e) => setParentData({ ...parentData, address: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{parentData.address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Children Tab */}
                            {activeTab === "children" && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
                                            + Add Child
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {children.map((child) => (
                                            <div key={child.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                                                <Image
                                                    width={16}
                                                    height={16}
                                                    src={child.photo}
                                                    alt={child.name}
                                                    className="h-16 w-16 rounded-lg object-cover mr-4"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{child.name}</h4>
                                                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">Age:</span> {child.age}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">DOB:</span> {child.dob}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Allergies:</span> {child.allergies}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Special Needs:</span> {child.specialNeeds}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-primary hover:text-primary-hover">
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {/* Documents Tab */}
                            {activeTab === "documents" && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">My Documents</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 text-gray-400 mr-3" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Aadhaar Card</h4>
                                                    <p className="text-sm text-gray-600">Uploaded on 12 Oct 2023</p>
                                                </div>
                                            </div>
                                            <button className="text-primary hover:text-primary-hover text-sm font-medium">
                                                Download
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 text-gray-400 mr-3" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">PAN Card</h4>
                                                    <p className="text-sm text-gray-600">Uploaded on 12 Oct 2023</p>
                                                </div>
                                            </div>
                                            <button className="text-primary hover:text-primary-hover text-sm font-medium">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                    <button className="mt-6 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10">
                                        + Upload Document
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                                    My Bookings
                                </h3>
                                {bookings.upcoming.length > 0 && (
                                    <Link
                                        href="/profile/my-bookings"
                                        className="text-sm font-medium text-primary hover:text-primary-hover flex items-center"
                                    >
                                        View all
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                )}
                            </div>

                            {bookings.upcoming.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Booking Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <div className="bg-primary/20 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm text-gray-600">Upcoming</p>
                                            <p className="font-semibold text-gray-900">{bookings.upcoming.length}</p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                            <div className="bg-green-500/20 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <p className="text-sm text-gray-600">Completed</p>
                                            <p className="font-semibold text-gray-900">{bookings.past.length}</p>
                                        </div>

                                        <div className="bg-red-50 rounded-lg p-3 text-center">
                                            <div className="bg-red-500/20 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            </div>
                                            <p className="text-sm text-gray-600">Cancelled</p>
                                            <p className="font-semibold text-gray-900">{bookings.cancelled.length}</p>
                                        </div>
                                    </div>

                                    {/* Next Booking */}
                                    <div className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-900">Next Booking</h4>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                {bookings.upcoming[0].daysLeft} days left
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <Image
                                                width={10}
                                                height={10}
                                                src={bookings.upcoming[0].image}
                                                alt={bookings.upcoming[0].daycareName}
                                                className="h-10 w-10 rounded-lg object-cover mr-3"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {bookings.upcoming[0].daycareName}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {bookings.upcoming[0].date} • {bookings.upcoming[0].time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="bg-gray-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
                                        <Calendar className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-4">No upcoming bookings</p>
                                    <Link
                                        href="/daycares"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover inline-block"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            )}
                        </div>
                        {/* Logout Button */}
                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center text-red-500 hover:text-red-600 font-medium">
                                <LogOut className="h-4 w-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}