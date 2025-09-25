"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import API from "@/lib/api"; // <-- your axios instance

export default function AddChildPopover({ onChildAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/parent/children", form);

      toast.success("Child added successfully ✅");

      // refresh parent page list
      if (onChildAdded) onChildAdded(res.data.data);

      setForm({ full_name: "", dob: "", gender: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add child ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter child's name"
              required
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Add Child"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
