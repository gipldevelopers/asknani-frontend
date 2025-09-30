"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  Calendar,
  User,
  CreditCard,
  Building,
  IndianRupee,
  Receipt,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  CheckCheck,
  Search,
} from "lucide-react";
import Link from "next/link";
import API from "@/lib/api";
import useDaycareAuthStore from "@/stores/ProvidersStore";
import toast from "react-hot-toast";

const PaymentsListPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    uniqueDaycares: 0,
  });
  const { daycare, fetchDaycare } = useDaycareAuthStore();

  useEffect(() => {
    fetchDaycare();
  }, []);
  const fetchPayments = async () => {
    try {
      const response = await API.get(`/provider/payments/${daycare.id}`);
      const data = response.data?.payments || [];
      setPayments(data);
      setFilteredPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setPayments([]);
      setFilteredPayments([]);
    }
  };
  useEffect(() => {
    if (!daycare?.id) return;

    fetchPayments();
  }, [daycare]);

  // Filter payments based on search term and filters
  useEffect(() => {
    let result = payments;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment?.daycareName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment?.parentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment?.childName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment?.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((payment) => payment?.status === statusFilter);
    }

    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      result = result.filter(
        (payment) => payment?.paymentStatus === paymentStatusFilter
      );
    }

    setFilteredPayments(result);
  }, [searchTerm, statusFilter, paymentStatusFilter, payments]);

  // Calculate summary metrics
  useEffect(() => {
    if (payments.length > 0) {
      const totalRevenue = payments.reduce(
        (sum, p) => sum + (p?.total || 0),
        0
      );
      const completedPayments = payments.filter(
        (p) => p?.paymentStatus === "paid"
      ).length;
      const pendingPayments = payments.filter(
        (p) => p?.paymentStatus === "pending"
      ).length;
      const uniqueDaycares = new Set(
        payments.map((p) => p?.daycareId).filter(Boolean)
      ).size;

      setSummary({
        totalRevenue,
        completedPayments,
        pendingPayments,
        uniqueDaycares,
      });
    } else {
      setSummary({
        totalRevenue: 0,
        completedPayments: 0,
        pendingPayments: 0,
        uniqueDaycares: 0,
      });
    }
  }, [payments]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "outline", text: "Pending" },
      confirmed: { variant: "secondary", text: "Confirmed" },
      completed: { variant: "default", text: "Completed" },
      cancelled: { variant: "destructive", text: "Cancelled" },
      refunded: { variant: "secondary", text: "Refunded" },
    };

    const config = statusConfig[status] || {
      variant: "outline",
      text: status || "Unknown",
    };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "outline", text: "Payment Pending" },
      processing: { variant: "secondary", text: "Processing" },
      completed: { variant: "default", text: "Paid" },
      failed: { variant: "destructive", text: "Failed" },
      refunded: { variant: "secondary", text: "Refunded" },
    };

    const config = statusConfig[status] || {
      variant: "outline",
      text: status || "Unknown",
    };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: <CreditCard className="h-4 w-4" />,
      upi: <IndianRupee className="h-4 w-4" />,
      netbanking: <Building className="h-4 w-4" />,
      wallet: <Receipt className="h-4 w-4" />,
    };

    return icons[method] || <CreditCard className="h-4 w-4" />;
  };

  const handleMarkAsPaid = async (transactionId) => {
    try {
      // Show loading toast
      toast.loading("Marking payment as completed...", { id: "markPayment" });

      // Call your Laravel API
      const response = await API.post(
        `/provider/payments/mark-paid/${transactionId}`,
        {
          method: "upi", // optional: you can adjust if needed
          amount: 1500, // optional: only if you want to override
        }
      );

      // Check the Laravel response inside response.data
      if (response.data.success) {
        toast.success(response.data.message || "Payment marked as completed", {
          id: "markPayment",
        });

        // Optional: refresh payments table or UI

        fetchPayments();
      } else {
        toast.error(response.data.message || "Failed to mark payment", {
          id: "markPayment",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while marking payment", {
        id: "markPayment",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage and track all payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalRevenue)}
            </div>
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
            <div className="text-2xl font-bold">
              {summary.completedPayments}
            </div>
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
              Total Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
      </div>

      <Card>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payments found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Parent & Child</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    #{payment.razorpayPaymentId}
                  </TableCell>
                  <TableCell>
                    <div>{payment.parentName || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.childName || "N/A"} ({payment.childAge || 0} yrs)
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{payment.package?.title || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.package?.hours || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(payment.bookingDate)}</TableCell>
                  <TableCell>{formatCurrency(payment.total)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleMarkAsPaid(payment.razorpayPaymentId)
                        }
                      >
                        <CheckCircle className="h-4 w-4" /> Payment Done
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default PaymentsListPage;
