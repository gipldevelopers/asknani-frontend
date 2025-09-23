import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CityDetailPage({ params }) {
  const { id } = params;

  // In real project, fetch city details from API/db
  const city = {
    id,
    name: "Ahmedabad",
    status: "Active",
    totalDaycares: 45,
    totalUsers: 1200,
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>City Details: {city.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>ID:</strong> {city.id}</p>
          <p><strong>Status:</strong> {city.status}</p>
          <p><strong>Total Daycares:</strong> {city.totalDaycares}</p>
          <p><strong>Total Users:</strong> {city.totalUsers}</p>

          <div className="flex space-x-2 mt-4">
            <Button>Edit</Button>
            <Button variant="destructive">
              {city.status === "Active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
