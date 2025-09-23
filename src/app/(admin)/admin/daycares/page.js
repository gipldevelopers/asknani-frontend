"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { School } from "lucide-react";

export default function DaycaresPage() {
  const [daycares] = useState([
    {
      id: 1,
      name: "Little Stars Preschool",
      city: "Ahmedabad",
      owner: "Rajesh Patel",
      status: "Active",
    },
    {
      id: 2,
      name: "Happy Kids Daycare",
      city: "Surat",
      owner: "Neha Sharma",
      status: "Pending",
    },
    {
      id: 3,
      name: "Bright Minds Academy",
      city: "Vadodara",
      owner: "Karan Mehta",
      status: "Inactive",
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daycares</h1>
        <Link href="/admin/daycares/add">
          <Button>Add Daycare</Button>
        </Link>
      </div>

      {/* Daycares Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daycare List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daycares.map((daycare) => (
                <TableRow key={daycare.id}>
                  <TableCell>{daycare.id}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <School className="w-4 h-4 text-blue-600" />
                    <Link
                      href={`/admin/daycares/${daycare.id}`}
                      className="hover:underline"
                    >
                      {daycare.name}
                    </Link>
                  </TableCell>
                  <TableCell>{daycare.city}</TableCell>
                  <TableCell>{daycare.owner}</TableCell>
                  <TableCell>{daycare.status}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/daycares/${daycare.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
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
