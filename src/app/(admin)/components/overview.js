"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  School,
  Users,
  BadgeCheck,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";
import Link from "next/link";
import API from "@/lib/api";
 // <-- your API helper

export default function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickReports, setQuickReports] = useState({});

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get("/admin/dashboard/overview");
        const data = res.data;

        // map backend response into UI format
        const formattedStats = [
          {
            title: "Total Cities",
            value: data.stats.totalCities,
            change: "+0", // TODO: add trend calculation if needed
            trend: "up",
            icon: Building2,
            description: "Added this month",
          },
          {
            title: "Registered Daycares",
            value: data.stats.registeredDaycares,
            change: "+0",
            trend: "up",
            icon: School,
            description: "Active listings",
          },
          {
            title: "Users",
            value: data.stats.users,
            change: "+0",
            trend: "up",
            icon: Users,
            description: "Parents & Providers",
          },
          {
            title: "Pending Approvals",
            value: data.stats.pendingApprovals,
            change: "-0",
            trend: "down",
            icon: BadgeCheck,
            description: "Daycares waiting",
          },
        ];

        setStats(formattedStats);
        setRecentActivities(data.recentActivities || []);
        setQuickReports(data.quickReports || {});
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, Admin! Here&apos;s the platform overview.
          </p>
        </div>
        <Link href="/admin/cities/new">
          <Button>Add New City</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.change} from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest registrations & updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.status === "approved"
                            ? "Daycare approved"
                            : "New daycare registered"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.name} - {activity.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.createdAt}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>Recent platform insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Most Active City</p>
                <p className="text-sm text-gray-500">
                  {quickReports.mostActiveCity || "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Top Rated Daycare</p>
                <p className="text-sm text-gray-500">
                  {quickReports.topRatedDaycare || "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">New Users This Week</p>
                <p className="text-sm text-gray-500">
                  {quickReports.newUsersThisWeek || 0}
                </p>
              </div>
            </div>
            <Link href={"/admin/reports"}>
              <Button variant="outline" className="w-full mt-4">
                View Detailed Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
