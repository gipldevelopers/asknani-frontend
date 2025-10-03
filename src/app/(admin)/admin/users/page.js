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
import { Users } from "lucide-react";
import API from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users?page=${pageNum}&per_page=10`);
      setUsers(res.data.data.data); // users array
      setPagination(res.data.data); // pagination info
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleVerify = async (userId) => {
    try {
      await API.post(`/admin/users/${userId}/verify`);
      toast.success("User verified successfully!");
      fetchUsers(page);
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify user");
    }
  };

  // Generate array of page numbers for better pagination
  const getPageNumbers = () => {
    if (!pagination.last_page) return [];
    const totalPages = pagination.last_page;
    const maxPagesToShow = 5;
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    start = Math.max(1, end - maxPagesToShow + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/admin/users/add">
          <Button>Add User</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="hover:underline"
                        >
                          {user.full_name}
                        </Link>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.is_verified ? "Active" : "Pending"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                 
                        {!user.is_verified && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleVerify(user.id)}
                          >
                            Verify
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.prev_page_url}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>

                {getPageNumbers().map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.next_page_url}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
