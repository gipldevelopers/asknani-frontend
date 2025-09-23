"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";
import { facilityService } from "@/lib/schemas/facilityService";

// Assuming you have an API helper

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch facilities from the API
  const fetchFacilities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await facilityService.getFacilities(); // Call the API helper
      setFacilities(response); // Adjust this line based on your API response structure
    } catch (err) {
      console.error("Failed to fetch facilities:", err);
      setError("Failed to load facilities. Please try again later.");
      toast.error("Failed to load facilities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Conditional rendering based on state
  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="w-12">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-5 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-16 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center text-destructive">
              {error}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (facilities.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground"
            >
              No facilities found.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    // Render facilities list
    return (
      <TableBody>
        {facilities.map((facility) => {
          const Icon = LucideIcons[facility.icon] || LucideIcons.HelpCircle;
          return (
            <TableRow key={facility.id}>
              <TableCell>{facility.id}</TableCell>
              <TableCell>
                <Icon className="w-5 h-5 text-blue-600" />
              </TableCell>
              <TableCell>{facility.name}</TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/facilities/${facility.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facilities</h1>
        <Link href="/admin/facilities/add">
          <Button>Add Facility</Button>
        </Link>
      </div>

      {/* Facilities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {renderContent()}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
