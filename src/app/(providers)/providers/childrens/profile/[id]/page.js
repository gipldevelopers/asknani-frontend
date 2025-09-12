"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  Heart,
  FileText,
  Stethoscope,
  Plus,
  Download,
  Edit,
  Shield,
  Bell,
  Utensils,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const ChildrenProfilePage = () => {

  const [newNote, setNewNote] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Keep state in sync with URL
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  // Sample child data
  const child = {
    id: 1,
    name: "Aarav Sharma",
    age: "3 years",
    dob: "2020-08-10",
    parent: "Priya Sharma",
    parentEmail: "priya.sharma@example.com",
    parentPhone: "+91 98765 43210",
    status: "active",
    allergies: "None",
    specialNeeds: "None",
    emergencyContact: "+91 98765 43210",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    attendance: "95%",
    lastCheckIn: "2023-11-14 08:45 AM",
    medicalRecords: [
      { id: 1, name: "Vaccination Record", date: "2023-01-15", type: "vaccination" },
      { id: 2, name: "Health Checkup", date: "2023-06-20", type: "checkup" },
      { id: 3, name: "Allergy Test", date: "2023-03-10", type: "test" }
    ],
    notes: [
      { id: 1, content: "Loves drawing and story time", date: "2023-11-10", author: "Teacher Anjali" },
      { id: 2, content: "Had mild fever today, parents informed", date: "2023-11-05", author: "Nurse Sunita" },
      { id: 3, content: "Excelled in group activities today", date: "2023-10-28", author: "Teacher Raj" }
    ]
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
    // In a real app, this would update the database
    console.log(isCheckedIn ? 'Checking out' : 'Checking in');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, this would add the note to the database
      console.log('Adding note:', newNote);
      setNewNote('');
      alert('Note added successfully!');
    }
  };

  const handleCallParent = () => {
    // In a real app, this would initiate a call
    console.log('Calling parent:', child.parentPhone);
    window.open(`tel:${child.parentPhone}`);
  };

  const handleEmailParent = () => {
    // In a real app, this would open email client
    console.log('Emailing parent:', child.parentEmail);
    window.open(`mailto:${child.parentEmail}`);
  };

  const handleMessageParent = () => {
    // In a real app, this would open messaging
    console.log('Messaging parent:', child.parentPhone);
    window.open(`sms:${child.parentPhone}`);
  };

  const handleDownloadRecord = (recordId) => {
    // In a real app, this would download the record
    console.log('Downloading record:', recordId);
    alert('Download started!');
  };

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
            <p className="text-muted-foreground">Detailed information and management</p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child Summary Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={child.photo} />
                  <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{child.name}</h2>
                      <p className="text-muted-foreground">{child.age} • {formatDate(child.dob)}</p>
                    </div>
                    <Badge variant={child.status === 'active' ? 'default' : 'outline'}>
                      {child.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Parent</p>
                      <p className="font-medium">{child.parent}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Attendance</p>
                      <p className="font-medium">{child.attendance}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Allergies</p>
                      <p className="font-medium">{child.allergies}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Special Needs</p>
                      <p className="font-medium">{child.specialNeeds}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check-In/Out Card */}
          <Card>
            <CardHeader>
              <CardTitle>Check-In / Check-Out</CardTitle>
              <CardDescription>Manage daily attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="text-lg font-semibold">
                    {isCheckedIn ? 'Checked In' : 'Checked Out'}
                  </p>
                  {isCheckedIn && (
                    <p className="text-sm text-muted-foreground">
                      Last check-in: {child.lastCheckIn}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleCheckInOut}
                  variant={isCheckedIn ? 'outline' : 'default'}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isCheckedIn ? 'Check Out' : 'Check In'}
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
                            <p><span className="text-muted-foreground">Full Name:</span> {child.name}</p>
                            <p><span className="text-muted-foreground">Age:</span> {child.age}</p>
                            <p><span className="text-muted-foreground">Date of Birth:</span> {formatDate(child.dob)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Emergency Contact</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Phone:</span> {child.emergencyContact}</p>
                            <p><span className="text-muted-foreground">Allergies:</span> {child.allergies}</p>
                            <p><span className="text-muted-foreground">Special Needs:</span> {child.specialNeeds}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Health Information</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Allergies:</span> {child.allergies}</p>
                            <p><span className="text-muted-foreground">Special Needs:</span> {child.specialNeeds}</p>
                            <p><span className="text-muted-foreground">Last Checkup:</span> June 20, 2023</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Preferences</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Favorite Activities:</span> Drawing, Story Time</p>
                            <p><span className="text-muted-foreground">Food Preferences:</span> Vegetarian</p>
                            <p><span className="text-muted-foreground">Nap Time:</span> 1:00 PM - 2:30 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Records Tab */}
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Health documents and medical history</CardDescription>
                </CardHeader>
                <CardContent>
                  {child.medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                      {child.medicalRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{record.name}</h4>
                              <p className="text-sm text-muted-foreground">Date: {formatDate(record.date)}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadRecord(record.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No medical records available</p>
                    </div>
                  )}
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
                  <CardDescription>Observations and important information</CardDescription>
                </CardHeader>
                <CardContent>
                  {child.notes.length > 0 ? (
                    <div className="space-y-4">
                      {child.notes.map((note) => (
                        <div key={note.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{note.content}</p>
                            <span className="text-sm text-muted-foreground">{formatDate(note.date)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">By: {note.author}</p>
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
                    <span>{child.parent}</span>
                  </div>
                  <Badge variant="outline">Primary</Badge>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{child.parentPhone}</span>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{child.parentEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleCallParent}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmailParent}>
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleMessageParent}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Information */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Emergency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">{child.emergencyContact}</span>
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
                <div className="text-sm">
                  {child.allergies}
                </div>
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
              <Button variant="outline" className="w-full">
                <Utensils className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Profile
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-medium">18/20 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Month</span>
                  <span className="font-medium">22/22 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-bold text-green-600">{child.attendance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildrenProfilePage;