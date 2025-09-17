"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react"; // all icons here

export default function AddFacilityForm() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });

    setName("");
    setIcon("");
    setSearch("");
  };

  const iconKeys = Object.keys(LucideIcons);

  // Filter icons by search and limit to 10
  const filteredIcons = iconKeys
    .filter((key) => key.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Facility Name */}
      <input
        type="text"
        placeholder="Facility name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* Search Box for Icons */}
      <input
        type="text"
        placeholder="Search icon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* Icon Results (show max 10) */}
      <div className="grid grid-cols-5 gap-2 border p-2 rounded">
        {filteredIcons.map((key) => {
          const Icon = LucideIcons[key];
          return (
            <button
              type="button"
              key={key}
              onClick={() => setIcon(key)}
              className={`flex flex-col items-center p-2 rounded ${
                icon === key ? "bg-blue-100 border border-blue-500" : "hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{key}</span>
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <p className="col-span-5 text-sm text-gray-500">No icons found</p>
        )}
      </div>

      {/* Preview Selected */}
      {icon && (
        <div className="flex items-center gap-2 p-2 border rounded">
          {(() => {
            const Icon = LucideIcons[icon];
            return <Icon className="w-6 h-6 text-blue-600" />;
          })()}
          <span className="text-sm">{icon}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Facility
      </button>
    </form>
  );
}
