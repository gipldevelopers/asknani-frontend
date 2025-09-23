"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { createCity, getCities, getCity } from "@/lib/schemas/cityService";

// Define the form schema using Zod for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  state: z.string().optional(),
  country: z.string().optional(),
  image: z
    .string()
    .url({ message: "Image must be a valid URL." })
    .optional()
    .or(z.literal("")),
});

export default function CityManagementPage() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCity, setIsFetchingCity] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      country: "India",
      image: "",
    },
  });

  // Load cities with a loading state
  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const res = await getCities();
      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error.response?.data || error);
      toast.error("❌ Failed to load cities.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load a single city
  const fetchCity = async (slug) => {
    setIsFetchingCity(true);
    try {
      const res = await getCity(slug);
      setSelectedCity(res.data);
    } catch (error) {
      console.error("Error fetching city:", error.response?.data || error);
      toast.error("❌ Failed to fetch city details.");
    } finally {
      setIsFetchingCity(false);
    }
  };

  // Create city using react-hook-form
  const onSubmit = async (data) => {
    try {
      const res = await createCity(data);
      toast.success("✅ " + res.data.message);
      form.reset(); // Reset form fields
      fetchCities(); // Refresh the list of cities
    } catch (error) {
      toast.error(
        "❌ " + (error.response?.data?.error || "Failed to create city")
      );
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div className="p-6 space-y-8 container mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">City Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create City Form Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create New City</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create City"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* City List and Details */}
        <div>
          {/* City List Section */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>All Cities</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              ) : (
                <Table>
                  <TableCaption>A list of all cities.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Country</TableHead>
                    </TableRow>
                  </TableHeader>
               <TableBody>
  {cities.length > 0 ? (
    cities.map((city) => (
      <TableRow key={city.id}>
        <TableCell>
          <Dialog
            onOpenChange={(open) => !open && setSelectedCity(null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="link"
                onClick={() => fetchCity(city.slug)}
                className="p-0"
              >
                {city.name}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-md md:max-w-lg">
              {isFetchingCity ? (
                <div className="flex flex-col items-center justify-center p-4 space-y-4">
                  <Skeleton className="h-8 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-32 w-full mt-4" />
                </div>
              ) : (
                selectedCity && (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedCity.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                      <p>
                        <strong>State:</strong>{" "}
                        {selectedCity.state || "N/A"}
                      </p>
                      <p>
                        <strong>Country:</strong>{" "}
                        {selectedCity.country || "N/A"}
                      </p>
                      {selectedCity.image && (
                        <div className="mt-4">
                          <img
                            src={selectedCity.image}
                            alt={selectedCity.name}
                            className="w-full max-h-48 object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )
              )}
            </DialogContent>
          </Dialog>
        </TableCell>
        <TableCell>{city.state || "N/A"}</TableCell>
        <TableCell>{city.country || "N/A"}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} className="text-center">
        No cities found.
      </TableCell>
    </TableRow>
  )}
</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
