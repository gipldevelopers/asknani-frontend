"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Phone, Mail, Search, Filter, CalendarDays, X, CheckCircle, Clock4 } from 'lucide-react';
import { useTours } from '@/stores/useTours';
import toast from 'react-hot-toast';

export default function TourScheduledPage() {
  const [activeTab, setActiveTab] = useState("today");
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
    refreshData
  } = useTours();

  const todayTours = getTodayTours();
  const upcomingTours = getUpcomingTours();
  const filteredTours = searchTours(searchTerm, statusFilter);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { variant: 'default', text: 'Scheduled' },
      'completed': { variant: 'secondary', text: 'Completed' },
      'cancelled': { variant: 'destructive', text: 'Cancelled' },
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleStatusChange = async (tourId, newStatus) => {
    const result = await updateTourStatus(tourId, newStatus);
    
    if (result.success) {
      toast.success(`Tour ${newStatus} successfully`);
    } else {
      toast.error(result.error || 'Failed to update tour status');
    }
  };

  const getParentInfo = (tour) => {
    return {
      name: tour.parent?.name || tour.parent_name || 'N/A',
      email: tour.parent?.email || tour.parent_email || 'N/A',
      phone: tour.parent?.phone || tour.parent_phone || 'N/A'
    };
  };

  const getChildInfo = (tour) => {
    return {
      name: tour.child?.name || tour.child_name || 'N/A',
      age: tour.child?.age || tour.child_age || 'N/A'
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
          <p className="text-muted-foreground">Manage and track facility tours</p>
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
            <CardTitle className="text-sm font-medium">Upcoming Tours</CardTitle>
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
            <p className="text-xs text-muted-foreground">Successfully conducted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="today">Today&apos;s Tours ({todayTours.length})</TabsTrigger>
          <TabsTrigger value="all">All Tours ({tours.length})</TabsTrigger>
        </TabsList>

        {/* Today's Tours Tab */}
        <TabsContent value="today">
          {todayTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayTours.map(tour => {
                const parent = getParentInfo(tour);
                const child = getChildInfo(tour);
                
                return (
                  <Card key={tour.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{parent.name}</CardTitle>
                          <CardDescription>
                            Tour for {child.name} {child.age && `(${child.age} years)`}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(tour.scheduled_at || tour.tour_date)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {parent.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {parent.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {tour.duration || 30} minutes
                      </div>
                      {tour.notes && (
                        <div className="mt-2">
                          <Label className="text-sm">Notes</Label>
                          <p className="text-sm text-muted-foreground">{tour.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${parent.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(tour.id, 'cancelled')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(tour.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tours scheduled for today</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don&apos;t have any facility tours scheduled for today.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Tours Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Tours</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tours..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTours.length > 0 ? (
                <div className="divide-y">
                  {filteredTours.map(tour => {
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
                                {child.name} {child.age && `(${child.age} years)`}
                              </div>
                              <div className="flex items-center mt-1 text-sm">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                {formatDate(tour.scheduled_at || tour.tour_date)}
                                <span className="mx-2">•</span>
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {formatTime(tour.scheduled_at || tour.tour_date)}
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
                            <p className="text-sm text-muted-foreground">{tour.notes}</p>
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
                    {searchTerm ? 'Try adjusting your search query' : 'No tours have been scheduled yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Tours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock4 className="h-5 w-5 mr-2" />
            Upcoming Tours (Next 7 Days)
          </CardTitle>
          <CardDescription>Tours scheduled for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date & Time</th>
                  <th className="text-left py-2">Parent</th>
                  <th className="text-left py-2">Child</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTours
                  .sort((a, b) => new Date(a.scheduled_at || a.tour_date) - new Date(b.scheduled_at || b.tour_date))
                  .slice(0, 5)
                  .map(tour => {
                    const parent = getParentInfo(tour);
                    const child = getChildInfo(tour);
                    
                    return (
                      <tr key={tour.id} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">{formatDate(tour.scheduled_at || tour.tour_date)}</div>
                          <div className="text-sm text-muted-foreground">{formatTime(tour.scheduled_at || tour.tour_date)}</div>
                        </td>
                        <td className="py-3">{parent.name}</td>
                        <td className="py-3">
                          {child.name} {child.age && `(${child.age} yrs)`}
                        </td>
                        <td className="py-3">{tour.duration || 30} min</td>
                        <td className="py-3">{getStatusBadge(tour.status)}</td>
                        <td className="py-3 text-right">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}