"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Eye, Calendar, User, CreditCard, Building, IndianRupee, Receipt, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

const PaymentsListPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    uniqueDaycares: 0,
  });

  // Sample data - in a real app this would come from an API
  useEffect(() => {
    const samplePayments = [
      {
        id: 'PY001',
        daycareName: 'Sunshine Daycare Center',
        daycareId: 'DC001',
        parentName: 'Rahul Sharma',
        parentId: 'P001',
        childName: 'Aarav Sharma',
        childAge: 3,
        bookingDate: '2023-08-15',
        bookingDays: ['Mon', 'Wed', 'Fri'],
        package: {
          id: 'PKG1',
          title: 'Full Day Care',
          hours: '9am-6pm',
          price: 12000
        },
        subtotal: 12000,
        serviceFee: 1200,
        total: 13200,
        status: 'confirmed',
        paymentMethod: 'card',
        paymentStatus: 'completed',
        razorpayPaymentId: 'rzp_123456789',
        createdAt: '2023-08-10T10:30:00Z',
        updatedAt: '2023-08-10T10:35:00Z'
      },
      {
        id: 'PY002',
        daycareName: 'Little Stars Preschool',
        daycareId: 'DC002',
        parentName: 'Priya Patel',
        parentId: 'P002',
        childName: 'Ananya Patel',
        childAge: 4,
        bookingDate: '2023-08-20',
        bookingDays: ['Tue', 'Thu'],
        package: {
          id: 'PKG2',
          title: 'Half Day Care',
          hours: '9am-1pm',
          price: 8000
        },
        subtotal: 8000,
        serviceFee: 800,
        total: 8800,
        status: 'pending',
        paymentMethod: 'upi',
        paymentStatus: 'pending',
        razorpayPaymentId: '',
        createdAt: '2023-08-12T14:20:00Z',
        updatedAt: '2023-08-12T14:20:00Z'
      },
      {
        id: 'PY003',
        daycareName: 'Happy Kids Daycare',
        daycareId: 'DC003',
        parentName: 'Vikram Singh',
        parentId: 'P003',
        childName: 'Vihaan Singh',
        childAge: 2,
        bookingDate: '2023-08-25',
        bookingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        package: {
          id: 'PKG3',
          title: 'Weekly Package',
          hours: '8am-5pm',
          price: 15000
        },
        subtotal: 15000,
        serviceFee: 1500,
        total: 16500,
        status: 'completed',
        paymentMethod: 'netbanking',
        paymentStatus: 'completed',
        razorpayPaymentId: 'rzp_987654321',
        createdAt: '2023-08-05T09:15:00Z',
        updatedAt: '2023-08-15T16:45:00Z'
      },
      {
        id: 'PY004',
        daycareName: 'Sunshine Daycare Center',
        daycareId: 'DC001',
        parentName: 'Neha Gupta',
        parentId: 'P004',
        childName: 'Advik Gupta',
        childAge: 5,
        bookingDate: '2023-09-01',
        bookingDays: ['Mon', 'Wed', 'Fri'],
        package: {
          id: 'PKG1',
          title: 'Full Day Care',
          hours: '9am-6pm',
          price: 12000
        },
        subtotal: 12000,
        serviceFee: 1200,
        total: 13200,
        status: 'cancelled',
        paymentMethod: 'card',
        paymentStatus: 'refunded',
        razorpayPaymentId: 'rzp_456789123',
        createdAt: '2023-08-18T11:40:00Z',
        updatedAt: '2023-08-20T13:25:00Z'
      }
    ];

    setPayments(samplePayments);
    setFilteredPayments(samplePayments);
  }, []);

  // Filter payments based on search term and filters
  useEffect(() => {
    let result = payments;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(payment =>
        payment.daycareName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }

    // Apply payment status filter
    if (paymentStatusFilter !== 'all') {
      result = result.filter(payment => payment.paymentStatus === paymentStatusFilter);
    }

    setFilteredPayments(result);
  }, [searchTerm, statusFilter, paymentStatusFilter, payments]);

  // Calculate summary metrics
  useEffect(() => {
    if (payments.length > 0) {
      const totalRevenue = payments.reduce((sum, p) => sum + p.total, 0);
      const completedPayments = payments.filter(p => p.paymentStatus === 'completed').length;
      const pendingPayments = payments.filter(p => p.paymentStatus === 'pending').length;
      const uniqueDaycares = new Set(payments.map(p => p.daycareId)).size;

      setSummary({
        totalRevenue,
        completedPayments,
        pendingPayments,
        uniqueDaycares,
      });
    }
  }, [payments]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
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
      pending: { variant: 'outline', text: 'Pending' },
      confirmed: { variant: 'secondary', text: 'Confirmed' },
      completed: { variant: 'default', text: 'Completed' },
      cancelled: { variant: 'destructive', text: 'Cancelled' },
      refunded: { variant: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'outline', text: 'Payment Pending' },
      processing: { variant: 'secondary', text: 'Processing' },
      completed: { variant: 'default', text: 'Paid' },
      failed: { variant: 'destructive', text: 'Failed' },
      refunded: { variant: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: <CreditCard className="h-4 w-4" />,
      upi: <IndianRupee className="h-4 w-4" />,
      netbanking: <Building className="h-4 w-4" />,
      wallet: <Receipt className="h-4 w-4" />
    };

    return icons[method] || <CreditCard className="h-4 w-4" />;
  };

  const handleViewDetails = (paymentId) => {
    // Navigate to payment details page or show modal
    console.log('View details for payment:', paymentId);
  };

  const handleDownloadInvoice = (paymentId) => {
    // Generate and download invoice
    console.log('Download invoice for payment:', paymentId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage and track all payments</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}>
            {viewMode === 'card' ? 'Table View' : 'Card View'}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total value of all payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Payments
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Number of successful payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Number of payments awaiting action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Daycare Centers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueDaycares}</div>
            <p className="text-xs text-muted-foreground">
              Centers with at least one payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search payments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Booking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
      </div>

      {/* Payments List */}
      {viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Payment #{payment.id}</CardTitle>
                    <CardDescription>
                      {formatDate(payment.createdAt)} • {payment.daycareName}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(payment.status)}
                    {getPaymentStatusBadge(payment.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Parent & Child</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {payment.parentName} • {payment.childName} ({payment.childAge} yrs)
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Booking Details</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Starts {formatDate(payment.bookingDate)} • {payment.package.title}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Payment Method</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="ml-1 capitalize">{payment.paymentMethod}</span>
                      {payment.razorpayPaymentId && (
                        <span className="ml-2">• ID: {payment.razorpayPaymentId}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 py-3 flex justify-between">
                <div>
                  <span className="font-semibold">{formatCurrency(payment.total)}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    (Fees: {formatCurrency(payment.serviceFee)})
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/providers/payments/details/${payment.id}`}>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(payment.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  </Link>
                  <Button size="sm" onClick={() => handleDownloadInvoice(payment.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Parent & Child</TableHead>
                <TableHead>Daycare</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">#{payment.id}</TableCell>
                  <TableCell>
                    <div>{payment.parentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.childName} ({payment.childAge} yrs)
                    </div>
                  </TableCell>
                  <TableCell>{payment.daycareName}</TableCell>
                  <TableCell>
                    <div>{payment.package.title}</div>
                    <div className="text-sm text-muted-foreground">{payment.package.hours}</div>
                  </TableCell>
                  <TableCell>{formatDate(payment.bookingDate)}</TableCell>
                  <TableCell>{formatCurrency(payment.total)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="ml-1">{getPaymentStatusBadge(payment.paymentStatus)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(payment.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleDownloadInvoice(payment.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No payments found</div>
          <Button onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setPaymentStatusFilter('all');
          }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentsListPage;
