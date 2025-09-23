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
import { Building2 } from "lucide-react";

export default function DaycareApprovalsPage() {
  const [daycares, setDaycares] = useState([
    {
      id: 1,
      name: "Happy Kids Daycare",
      owner: "Priya Sharma",
      city: "Ahmedabad",
      status: "Pending",
    },
    {
      id: 2,
      name: "Bright Future Playhouse",
      owner: "Rajesh Patel",
      city: "Surat",
      status: "Pending",
    },
    {
      id: 3,
      name: "Little Stars Academy",
      owner: "Anita Mehta",
      city: "Vadodara",
      status: "Pending",
    },
  ]);

  const handleAction = (id) => {
    setDaycares((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: action } : d
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daycare Approvals</h1>
      </div>

      {/* Approval Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Daycares</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Daycare</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daycares.map((daycare) => (
                <TableRow key={daycare.id}>
                  <TableCell>{daycare.id}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <Link
                      href={`/admin/daycares/${daycare.id}`}
                      className="hover:underline"
                    >
                      {daycare.name}
                    </Link>
                  </TableCell>
                  <TableCell>{daycare.owner}</TableCell>
                  <TableCell>{daycare.city}</TableCell>
                  <TableCell>{daycare.status}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    {daycare.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleAction(daycare.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(daycare.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          daycare.status === "Approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {daycare.status}
                      </span>
                    )}
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
