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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Users,
  TrendingUp,
  Package,
  IndianRupee,
  Loader2,
} from "lucide-react";
import API from "@/lib/api";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    hours: "",
    description: "",
    price: "",
    age_group: "",
    max_children: "",
  });

  const formatCurrency = (amount) => {
    // Handle potential NaN or non-number values gracefully
    const value = Number(amount);
    if (isNaN(value)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  const calculateAnalytics = (data) => {
    const totalBookings = data.reduce(
      (acc, pkg) => acc + formatNumber(pkg.bookingsCount),
      0
    );
    const activePackages = data.filter((pkg) => pkg.is_active).length;
    const totalRevenue = data.reduce(
      (acc, pkg) =>
        acc + formatNumber(pkg.price) * formatNumber(pkg.bookingsCount),
      0
    );
    const averagePrice = data.length > 0 ? totalRevenue / data.length : 0;
    const mostPopularPackage = data.sort(
      (a, b) => formatNumber(b.bookingsCount) - formatNumber(a.bookingsCount)
    )[0];

    setAnalytics({
      totalPackages: data.length,
      activePackages,
      totalBookings,
      totalRevenue,
      averagePrice,
      mostPopularPackage,
    });
  };

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.get("/provider/packages");
      const data = response.data;
      setPackages(data);
      calculateAnalytics(data);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch packages."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setFormData({
      title: "",
      hours: "",
      description: "",
      price: "",
      age_group: "",
      max_children: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      hours: pkg.hours,
      description: pkg.description,
      price: pkg.price,
      age_group: pkg.age_group,
      max_children: pkg.max_children,
    });
    setIsDialogOpen(true);
  };

  const handleSavePackage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const packageData = {
        ...formData,
        price: formatNumber(formData.price),
        max_children: formatNumber(formData.max_children),
      };

      if (editingPackage) {
        await API.put(`/provider/packages/${editingPackage.id}`, packageData);
      } else {
        await API.post("/provider/packages", packageData);
      }
      await fetchPackages();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("API Save Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to save package."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (pkg) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = pkg.is_active ? "deactivate" : "activate";
      await API.put(`/provider/packages/${pkg.id}/${endpoint}`);
      await fetchPackages();
    } catch (err) {
      console.error("API Toggle Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to toggle package status."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await API.delete(`/provider/packages/${id}`);
      await fetchPackages();
    } catch (err) {
      console.error("API Delete Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete package."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Packages Management</h1>
          <p className="text-muted-foreground">
            Create and manage your daycare packages
          </p>
        </div>
        <Button onClick={handleAddPackage} className="mt-4 md:mt-0">
      <Plus className="h-4 w-4 mr-2" /> Add New Package 
        </Button>
      </div>
      {/* Conditional Rendering based on state */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading packages...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8 border rounded-md p-4">
          <p className="font-medium">Error!</p>
          <p>{error}</p>
          <Button onClick={fetchPackages} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No packages yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first package to start receiving bookings
          </p>
          <Button onClick={handleAddPackage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Package
          </Button>
        </div>
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Packages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalPackages}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.activePackages} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalBookings}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all packages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Popular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">
                  {analytics.mostPopularPackage?.title || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(analytics.mostPopularPackage?.bookingsCount)}{" "}
                  bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Package Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.averagePrice)}
                </div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>
          </div>

          {/* Packages List */}
          <div className="grid grid-cols-1 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`overflow-hidden ${
                  !pkg.is_active ? "opacity-70" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        {pkg.title}
                        {!pkg.is_active && (
                          <Badge variant="outline" className="ml-2">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {pkg.hours} • {pkg.age_group} • Max {pkg.max_children}{" "}
                        children
                      </CardDescription>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(pkg.price)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{pkg.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatNumber(pkg.bookingsCount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Bookings
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatNumber(pkg.popularity)}/5
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Popularity
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatCurrency(
                            formatNumber(pkg.price) *
                              formatNumber(pkg.bookingsCount)
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Revenue
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {analytics.totalBookings > 0
                            ? `${Math.round(
                                (formatNumber(pkg.bookingsCount) /
                                  analytics.totalBookings) *
                                  100
                              )}%`
                            : "0%"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Of total bookings
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-3 flex justify-between">
                  <Button
                    variant={pkg.is_active ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(pkg)}
                  >
                    {pkg.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      {/* Add/Edit Package Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Update your package details below."
                : "Fill in the details for your new package."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">
                Hours
              </Label>
              <Input
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="9am-6pm"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₹)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age_group" className="text-right">
                Age Group
              </Label>
              <Input
                id="age_group"
                name="age_group"
                value={formData.age_group}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="2-5 years"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_children" className="text-right">
                Max Children
              </Label>
              <Input
                id="max_children"
                name="max_children"
                type="number"
                value={formData.max_children}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>
              {editingPackage ? "Update Package" : "Add Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesPage;
