"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  CalendarDays,
  X,
  CheckCircle,
  Clock4,
} from "lucide-react";
import { useTours } from "@/stores/useTours";
import toast from "react-hot-toast";

export default function TourScheduledPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    tours,
    stats,
    loading,
    error,
    updateTourStatus,
    getTodayTours,
    getUpcomingTours,
    searchTours,
    refreshData,
  } = useTours();

  const todayTours = getTodayTours();
  const upcomingTours = getUpcomingTours();
  const filteredTours = searchTours(searchTerm, statusFilter);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { variant: "default", text: "Scheduled" },
      completed: { variant: "secondary", text: "Completed" },
      cancelled: { variant: "destructive", text: "Cancelled" },
    };

    const config = statusConfig[status] || { variant: "outline", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getParentInfo = (tour) => {
    return {
      name: tour.parent?.full_name || tour.parent_name || "N/A",
      email: tour.parent?.email || tour.parent_email || "N/A",
      phone: tour.parent?.phone || tour.parent_phone || "N/A",
    };
  };

  const getChildInfo = (tour) => {
    return {
      name: tour.child?.full_name || tour.child_name || "N/A",
      age: tour.child?.age || tour.child_age || "N/A",
    };
  };

  if (loading && tours.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading tours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">Error</div>
            <h3 className="text-lg font-medium mb-2">{error}</h3>
            <Button onClick={refreshData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Tours</h1>
          <p className="text-muted-foreground">
            Manage and track facility tours
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <Clock4 className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All scheduled tours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Yet to be conducted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully conducted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="all">All Tours ({tours.length})</TabsTrigger>
        </TabsList>

        {/* All Tours Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Tours</CardTitle>
            </CardHeader>
            <CardContent>
              
              {filteredTours.length > 0 ? (
                <div className="divide-y">
                  {filteredTours.map((tour) => {
                    const parent = getParentInfo(tour);
                    const child = getChildInfo(tour);

                    return (
                      <div key={tour.id} className="py-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{parent.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {child.name}{" "}
                             
                              </div>
                              <div className="flex items-center mt-1 text-sm">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                {formatDate(
                                  tour.date_time || tour.tour_date
                                )}
                            
                                <span className="mx-2">•</span>
                                {getStatusBadge(tour.status)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${parent.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${parent.email}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        {tour.notes && (
                          <div className="mt-2 ml-12">
                            <p className="text-sm text-muted-foreground">
                              {tour.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tours found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search query"
                      : "No tours have been scheduled yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
