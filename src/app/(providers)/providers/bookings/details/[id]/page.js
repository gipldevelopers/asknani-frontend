"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  IndianRupee,
  Download,
  MessageSquare,
  Edit,
  Printer,
  ArrowLeft,
  Shield,
  Heart,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const BookingDetailsPage = () => {
  // Sample booking data - in a real app this would come from API or props
  const booking = {
    id: 'BK20230915001',
    status: 'confirmed',
    parent: {
      id: 'P001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul Sharma'
    },
    child: {
      id: 'C001',
      name: 'Aarav Sharma',
      age: 3,
      specialRequirements: 'No allergies. Prefers afternoon nap at 1:30 PM.'
    },
    package: {
      id: 'PKG1',
      name: 'Full Day Care',
      hours: '9:00 AM - 6:00 PM',
      price: 1200,
      days: 5
    },
    schedule: {
      startDate: '2023-09-18',
      endDate: '2023-09-22',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      pickupTime: '9:00 AM',
      dropoffTime: '6:00 PM'
    },
    payment: {
      status: 'paid',
      method: 'Credit Card',
      transactionId: 'TXN123456789',
      amount: 6000,
      paidDate: '2023-09-15',
      invoiceNumber: 'INV-2023-0915'
    },
    daycare: {
      id: 'DC001',
      name: 'Sunshine Daycare Center',
      address: '123 Main Street, Bangalore, Karnataka 560001',
      phone: '+91 8012345678'
    },
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-09-15T10:30:00Z',
    notes: 'Parent requested to avoid nuts in meals. Child enjoys outdoor activities.'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'outline', text: 'Pending' },
      'confirmed': { variant: 'default', text: 'Confirmed' },
      'in-progress': { variant: 'secondary', text: 'In Progress' },
      'completed': { variant: 'success', text: 'Completed' },
      'cancelled': { variant: 'destructive', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'outline', text: 'Pending' },
      'paid': { variant: 'success', text: 'Paid' },
      'failed': { variant: 'destructive', text: 'Failed' },
      'refunded': { variant: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would download the invoice PDF
    console.log('Downloading invoice for booking:', booking.id);
    alert('Invoice download started!');
  };

  const handlePrintSummary = () => {
    // In a real app, this would print the booking summary
    console.log('Printing summary for booking:', booking.id);
    window.print();
  };

  const handleSendMessage = () => {
    // In a real app, this would open a chat with the parent
    console.log('Opening chat with parent:', booking.parent.id);
  };

  const handleEditBooking = () => {
    // In a real app, this would navigate to edit booking page
    console.log('Editing booking:', booking.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/providers/bookings">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrintSummary}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <Button onClick={handleEditBooking}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Booking Status</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{formatDate(booking.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(booking.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Child Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Child Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.child.name}`} />
                  <AvatarFallback>{booking.child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.child.name}</h3>
                  <p className="text-muted-foreground">{booking.child.age} years old</p>

                  {booking.child.specialRequirements && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Special Requirements</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{booking.child.specialRequirements}</p>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Additional Notes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(booking.schedule.startDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(booking.schedule.endDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Drop-off Time</p>
                  <p className="font-medium">{booking.schedule.dropoffTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pick-up Time</p>
                  <p className="font-medium">{booking.schedule.pickupTime}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Days</p>
                <div className="flex flex-wrap gap-2">
                  {booking.schedule.days.map((day, index) => (
                    <Badge key={index} variant="secondary">{day}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{booking.package.name}</h3>
                  <p className="text-muted-foreground">{booking.package.hours}</p>
                  <p className="text-muted-foreground mt-2">{booking.package.days} days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold flex items-center justify-end">
                    <IndianRupee className="h-5 w-5" />
                    {booking.package.price}/day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Parent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src={booking.parent.image} />
                  <AvatarFallback>{booking.parent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{booking.parent.name}</h3>
                  <p className="text-sm text-muted-foreground">Parent</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.parent.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.parent.phone}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleSendMessage}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getPaymentStatusBadge(booking.payment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{booking.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium text-sm">{booking.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number</span>
                  <span className="font-medium">{booking.payment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {booking.payment.amount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daycare Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Daycare Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">{booking.daycare.name}</h3>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.daycare.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.daycare.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Documents
              </Button>
              {booking.status === 'confirmed' && (
                <Button variant="default" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              )}
              {booking.status === 'in-progress' && (
                <Button variant="default" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Check Out
                </Button>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <Button variant="destructive" className="w-full">
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;