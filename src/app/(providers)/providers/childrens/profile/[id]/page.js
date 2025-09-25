// app/providers/childrens/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Heart,
  FileText,
  Stethoscope,
  Plus,
  Edit,
  Shield,
  Bell,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import API from "@/lib/api";

const ChildrenProfilePage = () => {
  const [child, setChild] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Single useEffect for data fetching
  useEffect(() => {
    // Check for `id` only after the component has hydrated on the client
    if (id) {
      fetchChildData(id);
    } else {
      setLoading(false);
      console.log("ID from params:", searchParams);

      // Optional: Add a redirect if the ID is missing after initial load
      // router.push('/providers/childrens');
    }
  }, [id, searchParams]);

  // Keep state in sync with URL
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchChildData = async (id) => {
    try {
      const response = await API.get(`/children/${id}`);
      setChild(response.data);
      // Assuming your API response for child includes a 'notes' array
      setNotes(response.data.notes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeactivateChild = async () => {
    if (
      window.confirm(
        `Are you sure you want to ${
          child.status === "active" ? "deactivate" : "activate"
        } this child?`
      )
    ) {
      setIsDeactivating(true);
      try {
        const response = await API.patch(`/children/${child.id}/status`);
        setChild(response.data.child);
        alert(
          `Child status updated to ${response.data.child.status} successfully.`
        );
      } catch (err) {
        alert(err.message);
      } finally {
        setIsDeactivating(false);
      }
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await API.post(`/children/${child.id}/notes`, {
        content: newNote,
      });
      // Assuming your note API returns the created note object
      setNotes((prevNotes) => [response.data, ...prevNotes]);
      setNewNote("");
      alert("Note added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg">Loading child profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700">Error</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No child data found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/providers/childrens">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Child Profile</h1>
            <p className="text-muted-foreground">
              Detailed information and management
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant={child.status === "active" ? "destructive" : "default"}
            onClick={handleDeactivateChild}
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {child.status === "active" ? "Deactivate Child" : "Activate Child"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child Summary Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={child.photo} alt={child.full_name} />
                  <AvatarFallback>
                    {child.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{child.full_name}</h2>
                      <p className="text-muted-foreground">
                        {formatDate(child.dob)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        child.status === "active" ? "default" : "outline"
                      }
                    >
                      {child.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Parent</p>
                      <p className="font-medium">
                        {child.parent?.full_name || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">
                        {child.gender || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Allergies</p>
                      <p className="font-medium">{child.allergies || "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Special Needs
                      </p>
                      <p className="font-medium">
                        {child.special_needs || "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check-In/Out Card (This part requires a new API route to handle check-ins) */}
          <Card>
            <CardHeader>
              <CardTitle>Check-In / Check-Out</CardTitle>
              <CardDescription>Manage daily attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Status
                  </p>
                  <p className="text-lg font-semibold">Checked Out</p>
                </div>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical Records</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Child Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Personal Details</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Full Name:
                              </span>{" "}
                              {child.full_name}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Date of Birth:
                              </span>{" "}
                              {formatDate(child.dob)}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Gender:
                              </span>{" "}
                              {child.gender || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Records Tab (Needs backend support) */}
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>
                    Health documents and medical history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medical records available</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medical Record
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Child Notes</CardTitle>
                  <CardDescription>
                    Observations and important information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notes.length > 0 ? (
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div key={note.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{note.content}</p>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(note.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By: {note.author || "Teacher"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No notes available</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <Label htmlFor="new-note">Add New Note</Label>
                    <Textarea
                      id="new-note"
                      placeholder="Enter your observations about the child..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                    <Button onClick={handleAddNote} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parent Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Contact</CardTitle>
              <CardDescription>Quick communication options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{child.parent?.full_name || "N/A"}</span>
                  </div>
                  <Badge variant="outline">Primary</Badge>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{child.parent?.phone || "N/A"}</span>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{child.parent?.email || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`tel:${child.parent?.phone || ""}`}>
                    <Phone className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`mailto:${child.parent?.email || ""}`}>
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`sms:${child.parent?.phone || ""}`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Information */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">
                Emergency Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">
                    {child.emergency_contact || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-red-700" />
                  <span>Emergency Contact</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center mb-1">
                  <Heart className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">Allergies</span>
                </div>
                <div className="text-sm">{child.allergies || "None"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full">
                <Stethoscope className="h-4 w-4 mr-2" />
                Add Medical Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildrenProfilePage;
