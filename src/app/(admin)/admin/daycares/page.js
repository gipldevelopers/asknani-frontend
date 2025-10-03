"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { School } from "lucide-react";
import API from "@/lib/api";

export default function DaycaresPage() {
  const [daycares, setDaycares] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDaycares = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/daycares"); // Laravel endpoint
      // Access the `data` inside the paginated response
      setDaycares(res.data.data || []);
    } catch (error) {
      console.error("Error fetching daycares:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaycares();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daycares</h1>
        <Link href="/admin/daycares/add">
          <Button>Add Daycare</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daycare List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name & Image</TableHead>
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
                    <TableCell className="flex items-center gap-2">
                      {daycare.featured_image ? (
                        <img
                          src={
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
                            "/storage/" +
                            daycare.featured_image
                          }
                          alt={daycare.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <School className="w-6 h-6 text-gray-400" />
                      )}
                      <Link
                        href={`/admin/daycares/${daycare.id}`}
                        className="font-medium hover:underline"
                      >
                        {daycare.name}
                      </Link>
                    </TableCell>
                    <TableCell>{daycare.city}</TableCell>
                    <TableCell>{daycare.owner?.name}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
