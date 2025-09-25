// app/profile/page.js
"use client";
import { useEffect, useState } from "react";
import {
  Edit3,
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import API from "@/lib/api";
import AddChildPopover from "@/components/Bookings/AddChild";

export default function ParentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [children, setChildren] = useState([]);
  const [parentData, setParentData] = useState(null);

  // Fetch parent profile
  useEffect(() => {
    API.get("/parent/profile").then((res) => {
      setParentData(res.data.data);
      setChildren(res.data.data.children || []); // children already inside parent
    });
  }, []);

  const handleSave = () => {
    API.put("/parent/profile", parentData).then(() => {
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!parentData) return <div className="p-6">Loading...</div>;

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
                <h2 className="text-xl font-bold text-gray-900">
                  {parentData.full_name}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  {parentData.email}
                </p>
                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{parentData.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {parentData.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>DOB: {parentData.dob || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="flex border-b border-gray-200">
                {["personal", "children"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-3 text-sm font-medium relative flex items-center justify-center ${
                      activeTab === tab
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "personal" && <User className="h-4 w-4 mr-2" />}
                    {tab === "children" && <Heart className="h-4 w-4 mr-2" />}
                    <span className="hidden sm:inline">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Personal Information */}
              {activeTab === "personal" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={parentData.full_name || ""}
                          onChange={(e) =>
                            setParentData({
                              ...parentData,
                              full_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{parentData.full_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={parentData.email || ""}
                          onChange={(e) =>
                            setParentData({
                              ...parentData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{parentData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={parentData.phone || ""}
                          onChange={(e) =>
                            setParentData({
                              ...parentData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {parentData.phone || "N/A"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={parentData.dob || ""}
                          onChange={(e) =>
                            setParentData({
                              ...parentData,
                              dob: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {parentData.dob || "N/A"}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          value={parentData.address || ""}
                          onChange={(e) =>
                            setParentData({
                              ...parentData,
                              address: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {parentData.address || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Children Tab */}
              {activeTab === "children" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      My Children
                    </h3>
                
                    <AddChildPopover
                      onChildAdded={(child) =>
                        setChildren([...children, child])
                      }
                    />
                  </div>
                  <div className="space-y-6">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-start p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {child.full_name}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">DOB:</span>{" "}
                              {child.dob}
                            </div>
                            <div>
                              <span className="text-gray-600">Gender:</span>{" "}
                              {child.gender}
                            </div>
                            <div>
                              <span className="text-gray-600">Allergies:</span>{" "}
                              {child.allergies || "None"}
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Special Needs:
                              </span>{" "}
                              {child.special_needs || "None"}
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
