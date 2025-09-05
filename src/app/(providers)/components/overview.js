// components/provider-dashboard/overview.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, Star, ArrowUp, ArrowDown } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Total Bookings",
      value: "42",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      description: "This month"
    },
    {
      title: "Active Children",
      value: "28",
      change: "+5%",
      trend: "up",
      icon: Users,
      description: "Currently enrolled"
    },
    {
      title: "Revenue",
      value: "₹1,24,500",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      description: "From 24 reviews"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Rajesh! Here's what's happening today.</p>
        </div>
        <Button>New Booking</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>You have 12 new bookings this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New booking request</p>
                      <p className="text-sm text-gray-500">Priya Sharma - 2 children</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Today, 10:30 AM</p>
                    <Button variant="outline" size="sm" className="mt-1">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">Aarav & Anika Sharma</p>
                      <p className="text-sm text-gray-500">Full day care</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">10:00 AM</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View Full Calendar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}