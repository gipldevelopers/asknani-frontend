// app/provider/children/page.jsx
"use client";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, User, Calendar, Heart, AlertCircle, FileText, MoreVertical, Download, Upload } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ChildrenManagementPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Sample children data
    const children = [
        {
            id: 1,
            name: "Aarav Sharma",
            age: "3 years",
            dob: "2020-08-10",
            parent: "Priya Sharma",
            status: "active",
            allergies: "None",
            specialNeeds: "None",
            emergencyContact: "+91 98765 43210",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            attendance: "95%",
            lastCheckIn: "2023-11-14 08:45 AM",
            medicalRecords: ["Vaccination Record", "Health Checkup"],
            notes: "Loves drawing and story time"
        },
        {
            id: 2,
            name: "Anika Sharma",
            age: "1.5 years",
            dob: "2022-03-22",
            parent: "Priya Sharma",
            status: "active",
            allergies: "Dairy",
            specialNeeds: "None",
            emergencyContact: "+91 98765 43210",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            attendance: "88%",
            lastCheckIn: "2023-11-14 09:15 AM",
            medicalRecords: ["Vaccination Record"],
            notes: "Needs nap after lunch"
        },
        {
            id: 3,
            name: "Vihaan Verma",
            age: "4 years",
            dob: "2019-05-15",
            parent: "Rahul Verma",
            status: "inactive",
            allergies: "Peanuts",
            specialNeeds: "None",
            emergencyContact: "+91 98765 12345",
            photo: "https://images.unsplash.com/photo-1549056572-75914d6d7e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            attendance: "78%",
            lastCheckIn: "2023-11-10 08:30 AM",
            medicalRecords: ["Allergy Action Plan", "Vaccination Record"],
            notes: "Excels in group activities"
        }
    ];

    const filteredChildren = children.filter(child => {
        const matchesSearch = child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.parent.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        return matchesSearch && child.status === activeTab;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case "active":
                return "default";
            case "inactive":
                return "secondary";
            case "pending":
                return "outline";
            default:
                return "outline";
        }
    };

    const stats = [
        { label: "Total Children", value: children.length, icon: User },
        { label: "Active Today", value: "18", icon: Calendar },
        { label: "Medical Alerts", value: "3", icon: AlertCircle },
        { label: "Attendance Rate", value: "92%", icon: Heart },
    ];

    return (

        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Children Management</h1>
                    <p className="text-gray-600">Manage all children enrolled in your daycare</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Child
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Child</DialogTitle>
                            <DialogDescription>
                                Fill in the details to add a new child to your daycare.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="First Name" />
                                <Input placeholder="Last Name" />
                            </div>
                            <Input placeholder="Date of Birth" type="date" />
                            <Input placeholder="Parent/Guardian Name" />
                            <Input placeholder="Emergency Contact" />
                            <Input placeholder="Allergies (if any)" />
                            <Input placeholder="Special Needs (if any)" />
                        </div>
                        <Button className="w-full">Add Child</Button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search children or parents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>

                        </div>
                    </div>

                    <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Children</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Children List */}
            <div className="space-y-4">
                {filteredChildren.map((child) => (
                    <Card key={child.id}>
                        <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Child Photo and Basic Info */}
                                <div className="flex items-start space-x-4">
                                    <Image
                                        width={64}
                                        height={64}
                                        src={child.photo}
                                        alt={child.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-lg">{child.name}</h3>
                                            <Badge variant={getStatusVariant(child.status)}>
                                                {child.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {child.age} • {child.parent}&apos;s child
                                        </p>
                                        <p className="text-sm text-gray-600">DOB: {child.dob}</p>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-900">Health Information</p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Allergies:</span> {child.allergies}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Special Needs:</span> {child.specialNeeds}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Attendance</p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Rate:</span> {child.attendance}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Last Check-in:</span> {child.lastCheckIn}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 self-stretch lg:self-center">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            View Profile
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Check-in/Check-out</DropdownMenuItem>
                                                <DropdownMenuItem>View Medical Records</DropdownMenuItem>
                                                <DropdownMenuItem>Add Note</DropdownMenuItem>
                                                <DropdownMenuItem>Message Parent</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Remove Child
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                                        Emergency: {child.emergencyContact}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FileText className="h-4 w-4 mr-1 text-blue-500" />
                                        {child.medicalRecords.length} medical records
                                    </div>
                                    {child.notes && (
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Notes:</span> {child.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredChildren.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="bg-gray-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No children found' : 'No children registered'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first child'}
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Add First Child</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Child</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to add a new child to your daycare.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="First Name" />
                                        <Input placeholder="Last Name" />
                                    </div>
                                    <Input placeholder="Date of Birth" type="date" />
                                    <Input placeholder="Parent/Guardian Name" />
                                    <Input placeholder="Emergency Contact" />
                                </div>
                                <Button className="w-full">Add Child</Button>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </div>

    );
}