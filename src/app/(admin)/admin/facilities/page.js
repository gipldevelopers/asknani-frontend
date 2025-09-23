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
import * as LucideIcons from "lucide-react";

export default function FacilitiesPage() {
  const [facilities] = useState([
    { id: 1, name: "Playground", icon: "Play" },
    { id: 2, name: "Library", icon: "Book" },
    { id: 3, name: "CCTV", icon: "Camera" },
  ]);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => {
                const Icon =
                  LucideIcons[facility.icon] || LucideIcons.HelpCircle;
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
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
