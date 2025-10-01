"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import API from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/AuthStore";

export default function DashboardOverview() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingTours, setUpcomingTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await API.get("/provider/daycare/status");
        const { status } = res.data;
        if (status === "not_created" || status === "incomplete") {
          router.replace("/providers/contents");
        }
      } catch (error) {
        router.replace("/providers/contents");
      }
    };
    checkStatus();
  }, [router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/provider/dashboard/stats");
        const data = res.data;

      setStats([
  {
    title: "Total Bookings",
    value: data.stats.totalBookings,
    icon: Calendar,
    description: "This month",
  },
  {
    title: "Active Children",
    value: data.stats.activeChildren,
    icon: Users,
    description: "Currently enrolled",
  },
  {
    title: "Revenue",
    value: data.stats.revenue, // already has ₹ symbol
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Average Rating",
    value: data.stats.averageRating,
    icon: Star,
    description: `From ${data.stats.totalReviews} reviews`,
  },
]);


        setRecentBookings(data.recentBookings);
        setUpcomingTours(data.upcomingTours);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <Link href="/providers/bookings/new">
          <Button>New Booking</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle>{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              You have {recentBookings.length} new bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{b.childName}</p>
                      <p className="text-sm text-gray-500">
                        {b.parentName} - {b.childCount} children
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(b.startDate).toLocaleString()}
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tours */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTours.map((t) => (
                <div key={t.id} className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">{t.childName}</p>
                      <p className="text-sm text-gray-500">{t.packageTitle}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {new Date(t.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
            <Link href={"/providers/tour-scheduled"}>
              <Button variant="outline" className="w-full mt-4">
                View Full Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
