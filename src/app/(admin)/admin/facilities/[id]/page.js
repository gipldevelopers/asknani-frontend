"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";

export default function FacilityDetailPage({ params }) {
  const { id } = params;

  // Dummy data - in real app fetch from API
  const [facility, setFacility] = useState({
    id,
    name: "Playground",
    icon: "Play",
  });

  const Icon = LucideIcons[facility.icon] || LucideIcons.HelpCircle;

  const handleSave = () => {
    console.log("Saving facility:", facility);
    // Call API here
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Facility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon className="w-6 h-6 text-blue-600" />
            <span className="text-gray-600">{facility.icon}</span>
          </div>
          <Input
            value={facility.name}
            onChange={(e) =>
              setFacility({ ...facility, name: e.target.value })
            }
            placeholder="Facility Name"
          />
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
