// app/provider/children/page.jsx
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Plus,
  User,
  Calendar as CalendarIcon,
  Heart,
  AlertCircle,
  FileText,
  MoreVertical,
  Loader2,
} from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Import your reusable components and API helper
import API from "@/lib/api";
import ParentSearchAndSelect from "../../components/ParentSearchAndSelect";

export default function ChildrenManagementPage() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: undefined,
    gender: "",
    allergies: "",
    specialNeeds: "",
    emergencyContact: "",
    notes: "",
  });

  const fetchChildren = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.get("/provider/children");
      setChildren(response.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setError("Failed to load children. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateSelect = (date) => {
    setFormData((prevData) => ({ ...prevData, dob: date }));
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedParent) {
      setError("Please select or create a parent first.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        parent_id: selectedParent.id,
        full_name: formData.name,
        dob: formData.dob ? format(formData.dob, "yyyy-MM-dd") : null,
        gender: formData.gender,
        allergies: formData.allergies,
        special_needs: formData.specialNeeds,
        emergency_contact: formData.emergencyContact,
        notes: formData.notes,
      };
      await API.post("/provider/children", payload);
      setIsDialogOpen(false);
      setFormData({
        name: "",
        dob: undefined,
        gender: "",
        allergies: "",
        specialNeeds: "",
        emergencyContact: "",
        notes: "",
      });
      setSelectedParent(null);
      fetchChildren();
    } catch (err) {
      console.error("Failed to add child:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add child. Please check the details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (childId) => {
    setIsLoading(true);
    setError(null);
    try {
      await API.patch(`/provider/children/${childId}/status`, {
        status: "inactive",
      });
      fetchChildren();
    } catch (err) {
      console.error("Failed to update child status:", err);
      setError("Failed to update child status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveChild = async (childId) => {
    setIsLoading(true);
    setError(null);
    try {
      await API.patch(`/provider/children/${childId}/status`, {
        status: "removed",
      });
      fetchChildren();
    } catch (err) {
      console.error("Failed to remove child:", err);
      setError("Failed to remove child. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChildren = children.filter((child) => {
    const matchesSearch =
      child.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.parent?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()); // Corrected line
    const matchesTab = activeTab === "all" || child.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalChildren = children.length;
  const activeChildren = children.filter((c) => c.status === "active").length;
  const medicalAlerts = children.filter(
    (c) =>
      c.allergies?.toLowerCase() !== "none" ||
      c.specialNeeds?.toLowerCase() !== "none"
  ).length;
  const stats = [
    { label: "Total Children", value: totalChildren, icon: User },
    { label: "Active Children", value: activeChildren, icon: CalendarIcon },
    { label: "Medical Alerts", value: medicalAlerts, icon: AlertCircle },
    { label: "Attendance Rate", value: "92%", icon: Heart },
  ];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Children Management</h1>
          <p className="text-gray-600">
            Manage all children enrolled in your daycare
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-64 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Child</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new child to your daycare.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddChild}>
              <div className="grid gap-6 py-4">
                <ParentSearchAndSelect
                  onParentSelect={setSelectedParent}
                  selectedParent={selectedParent}
                  isChildLoading={isLoading}
                />
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Child Information
                    </h3>
                    <div className="grid gap-4">
                      <Input
                        placeholder="Child's Full Name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        required
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dob && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dob ? (
                              format(formData.dob, "PPP")
                            ) : (
                              <span>Pick a Date of Birth</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dob}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        placeholder="Gender"
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder="Allergies (e.g., Peanuts)"
                        name="allergies"
                        value={formData.allergies || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder="Special Needs"
                        name="specialNeeds"
                        value={formData.specialNeeds || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder="Emergency Contact"
                        name="emergencyContact"
                        value={formData.emergencyContact || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading || !selectedParent}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Add Child"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <Tabs
            defaultValue="all"
            className="mt-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">All Children</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-500">Loading children...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">{error}</h3>
        </div>
      ) : filteredChildren.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <CardContent>
            <div className="bg-gray-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No children found" : "No children registered"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first child"}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add First Child</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-full overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Child</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new child to your daycare.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddChild}>
                  <div className="grid gap-4 py-4">
                    <ParentSearchAndSelect
                      onParentSelect={setSelectedParent}
                      selectedParent={selectedParent}
                      isChildLoading={isLoading}
                    />
                    <Input
                      placeholder="Child's Full Name"
                      name="name"
                      onChange={handleInputChange}
                      required
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dob ? (
                            format(formData.dob, "PPP")
                          ) : (
                            <span>Pick a Date of Birth</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dob}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      placeholder="Gender"
                      name="gender"
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Allergies (e.g., Peanuts, Dairy)"
                      name="allergies"
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Special Needs (e.g., ADHD)"
                      name="specialNeeds"
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Emergency Contact"
                      name="emergencyContact"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Add Child"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChildren.map((child) => (
            <Card key={child.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      width={64}
                      height={64}
                      src={child.photo || "/placeholder-avatar.png"}
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
                        {child.age} • {child.parent?.full_name || "N/A"}&apos;s
                        child
                      </p>
                      <p className="text-sm text-gray-600">
                        DOB:{" "}
                        {child.dob
                          ? format(new Date(child.dob), "MM/dd/yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          Health Information
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Allergies:</span>{" "}
                          {child.allergies || "None"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Special Needs:</span>{" "}
                          {child.specialNeeds || "None"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Attendance</p>
                        <p className="text-gray-600">
                          <span className="font-medium">Rate:</span>{" "}
                          {child.attendance || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Last Check-in:</span>{" "}
                          {child.lastCheckIn || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 self-stretch lg:self-center">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/providers/childrens/profile/${child.id}`}
                        passHref
                      >
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Check-in/Check-out
                          </DropdownMenuItem>
                          <Link
                            href={`/providers/childrens/profile/${child.id}?tab=medical`}
                          >
                            <DropdownMenuItem>
                              View Medical Records
                            </DropdownMenuItem>
                          </Link>
                          <Link
                            href={`/providers/childrens/profile/${child.id}?tab=notes`}
                          >
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>Message Parent</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                              e.preventDefault();
                              handleRemoveChild(child.id);
                            }}
                          >
                            Remove Child
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                      Emergency: {child.emergencyContact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-1 text-blue-500" />
                      {child.medicalRecords?.length || 0} medical records
                    </div>
                    {child.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {child.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
