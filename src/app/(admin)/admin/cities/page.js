"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CitiesPage() {
  const [cities, setCities] = useState([
    { id: 1, name: "Ahmedabad", status: "Active" },
    { id: 2, name: "Surat", status: "Active" },
    { id: 3, name: "Rajkot", status: "Inactive" },
  ]);

  const [newCity, setNewCity] = useState("");

  const addCity = () => {
    if (newCity.trim() !== "") {
      setCities([...cities, { id: cities.length + 1, name: newCity, status: "Active" }]);
      setNewCity("");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cities</h1>

        {/* Add City Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add City</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new city</DialogTitle>
              <DialogDescription>Enter the city name below to add it to the list.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  City Name
                </Label>
                <Input
                  id="name"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Vadodara"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addCity}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cities Table */}
      <Card>
        <CardHeader>
          <CardTitle>City List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell>{city.id}</TableCell>
                  <TableCell>
                    <Link href={`/admin/cities/${city.id}`} className="text-blue-600 hover:underline">
                      {city.name}
                    </Link>
                  </TableCell>
                  <TableCell>{city.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>
                          {city.status === "Active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
