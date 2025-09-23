// components/provider-dashboard/packages.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import API from "@/lib/api";

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.get("/packages");
      setPackages(response.data);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading packages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto" />
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daycare Packages</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No packages found. Add a new package to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <p className="text-xl font-semibold text-primary">
                  ₹{pkg.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {pkg.type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duration:</span>{" "}
                  {pkg.duration}
                </p>
                {/* Add more package details as needed */}
                <Button variant="outline" className="w-full mt-4">
                  Edit Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}