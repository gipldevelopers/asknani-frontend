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

export default function TourScheduledPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [todayTours, setTodayTours] = useState([]);

  useEffect(() => {
    // Sample data - in a real app this would come from an API
    const sampleTours = [
      {
        id: 'T001',
        parentName: 'Rahul Sharma',
        parentEmail: 'rahul.sharma@email.com',
        parentPhone: '+91 9876543210',
        childName: 'Aarav Sharma',
        childAge: 3,
        tourDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        status: 'scheduled',
        duration: 30,
        notes: 'Interested in full-day program. Wants to see outdoor play area.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      },
      {
        id: 'T002',
        parentName: 'Priya Patel',
        parentEmail: 'priya.patel@email.com',
        parentPhone: '+91 9876543211',
        childName: 'Ananya Patel',
        childAge: 4,
        tourDate: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
        status: 'scheduled',
        duration: 45,
        notes: 'Looking for half-day program. Asked about meal options.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      },
      {
        id: 'T003',
        parentName: 'Vikram Singh',
        parentEmail: 'vikram.singh@email.com',
        parentPhone: '+91 9876543212',
        childName: 'Vihaan Singh',
        childAge: 2,
        tourDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        status: 'scheduled',
        duration: 30,
        notes: 'Interested in toddler program. Wants to meet head teacher.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      },
      {
        id: 'T004',
        parentName: 'Neha Gupta',
        parentEmail: 'neha.gupta@email.com',
        parentPhone: '+91 9876543213',
        childName: 'Advik Gupta',
        childAge: 5,
        tourDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        status: 'completed',
        duration: 45,
        notes: 'Tour completed. Liked facilities. Will decide by weekend.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      },
      {
        id: 'T005',
        parentName: 'Arun Kumar',
        parentEmail: 'arun.kumar@email.com',
        parentPhone: '+91 9876543214',
        childName: 'Aisha Kumar',
        childAge: 3,
        tourDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        status: 'cancelled',
        duration: 30,
        notes: 'Cancelled due to illness. Will reschedule next week.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      },
      {
        id: 'T006',
        parentName: 'Sneha Reddy',
        parentEmail: 'sneha.reddy@email.com',
        parentPhone: '+91 9876543215',
        childName: 'Reyansh Reddy',
        childAge: 4,
        tourDate: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
        status: 'scheduled',
        duration: 30,
        notes: 'Wants to know about after-school activities.',
        daycareId: 'DC001',
        daycareName: 'Sunshine Daycare Center',
        address: '123 Main Street, Bangalore'
      }
    ];

    setTours(sampleTours);

    // Filter today's tours
    const today = new Date().toDateString();
    const todaysTours = sampleTours.filter(tour => {
      const tourDate = new Date(tour.tourDate).toDateString();
      return tourDate === today && tour.status === 'scheduled';
    });
    setTodayTours(todaysTours);
  }, []);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = searchTerm === '' ||
      tour.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.childName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
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
      'noshow': { variant: 'outline', text: 'No Show' }
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleStatusChange = (tourId, newStatus) => {
    setTours(prev => prev.map(tour =>
      tour.id === tourId ? { ...tour, status: newStatus } : tour
    ));
  };

  const stats = {
    total: tours.length,
    scheduled: tours.filter(tour => tour.status === 'scheduled').length,
    completed: tours.filter(tour => tour.status === 'completed').length,
    today: todayTours.length
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Tours</h1>
          <p className="text-muted-foreground">Manage and track facility tours</p>
        </div>
        <Button>
          <CalendarDays className="h-4 w-4 mr-2" />
          Schedule New Tour
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
            <p className="text-xs text-muted-foreground">
              All scheduled tours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">
              Yet to be conducted
            </p>
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
            <CardTitle className="text-sm font-medium">Today&apos;s Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="today">Today&apos;s Tours</TabsTrigger>
          <TabsTrigger value="all">All Tours</TabsTrigger>
        </TabsList>

        {/* Today's Tours Tab */}
        <TabsContent value="today">
          {todayTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayTours.map(tour => (
                <Card key={tour.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{tour.parentName}</CardTitle>
                        <CardDescription>
                          Tour for {tour.childName} ({tour.childAge} years)
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(tour.tourDate)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {tour.parentPhone}
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {tour.parentEmail}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {tour.address}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {tour.duration} minutes
                    </div>
                    {tour.notes && (
                      <div className="mt-2">
                        <Label className="text-sm">Notes</Label>
                        <p className="text-sm text-muted-foreground">{tour.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
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
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tours scheduled for today</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don&apos;t have any facility tours scheduled for today.
                </p>
                <Button>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule a Tour
                </Button>
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
                    <SelectItem value="noshow">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTours.length > 0 ? (
                <div className="divide-y">
                  {filteredTours.map(tour => (
                    <div key={tour.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{tour.parentName}</div>
                            <div className="text-sm text-muted-foreground">
                              {tour.childName} ({tour.childAge} years)
                            </div>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              {formatDate(tour.tourDate)}
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              {formatTime(tour.tourDate)}
                              <span className="mx-2">•</span>
                              {getStatusBadge(tour.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {tour.notes && (
                        <div className="mt-2 ml-12">
                          <p className="text-sm text-muted-foreground">{tour.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
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
            Upcoming Tours
          </CardTitle>
          <CardDescription>
            Tours scheduled for the next 7 days
          </CardDescription>
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
                {tours
                  .filter(tour => tour.status === 'scheduled')
                  .sort((a, b) => new Date(a.tourDate) - new Date(b.tourDate))
                  .slice(0, 5)
                  .map(tour => (
                    <tr key={tour.id} className="border-b">
                      <td className="py-3">
                        <div className="font-medium">{formatDate(tour.tourDate)}</div>
                        <div className="text-sm text-muted-foreground">{formatTime(tour.tourDate)}</div>
                      </td>
                      <td className="py-3">{tour.parentName}</td>
                      <td className="py-3">
                        {tour.childName} ({tour.childAge} yrs)
                      </td>
                      <td className="py-3">{tour.duration} min</td>
                      <td className="py-3">{getStatusBadge(tour.status)}</td>
                      <td className="py-3 text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}