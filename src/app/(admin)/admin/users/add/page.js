"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/lib/api";
import toast from "react-hot-toast";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "parent",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/users", form);
      toast.success("User created successfully");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);

      // ✅ Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Flatten all errors into a single string
        const messages = Object.values(errors)
          .flat()
          .join(" | ");
        toast.error(messages);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create new user");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Role</Label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="parent">Parent</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
}
