// src/app/admin/facilities/add/page.jsx (or wherever your component is located)

"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast"; // assuming you have react-hot-toast installed
import { Button } from "@/components/ui/button"; // using shadcn for a better button
import { Input } from "@/components/ui/input"; // using shadcn for a better input
import * as LucideIcons from "lucide-react";
import { facilityService } from "@/lib/schemas/facilityService";

 // Import the new service

export default function AddFacilityForm() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the service to make the API call
      const response = await facilityService.addFacility({ name, icon });
      toast.success(response.message || "Facility added successfully!");
      
      // Reset form states on success
      setName("");
      setIcon("");
      setSearch("");
    } catch (error) {
      console.error("Error adding facility:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconKeys = Object.keys(LucideIcons);

  // Filter icons by search and limit to 10
  const filteredIcons = iconKeys
    .filter((key) => key.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6">
      {/* Facility Name */}
      <Input
        type="text"
        placeholder="Facility name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Search Box for Icons */}
      <Input
        type="text"
        placeholder="Search icon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Icon Results (show max 10) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 border p-2 rounded">
        {filteredIcons.map((key) => {
          const Icon = LucideIcons[key];
          return (
            <Button
              type="button"
              variant="outline"
              key={key}
              onClick={() => setIcon(key)}
              className={`flex flex-col items-center h-auto py-2 px-1 text-xs ${
                icon === key ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{key}</span>
            </Button>
          );
        })}
        {filteredIcons.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500">
            No icons found
          </p>
        )}
      </div>

      {/* Preview Selected */}
      {icon && (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
          <p className="font-semibold text-sm">Selected Icon:</p>
          {(() => {
            const Icon = LucideIcons[icon];
            return <Icon className="w-6 h-6 text-blue-600" />;
          })()}
          <span className="text-sm font-mono">{icon}</span>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting || !name || !icon}>
        {isSubmitting ? "Adding..." : "Add Facility"}
      </Button>
    </form>
  );
}