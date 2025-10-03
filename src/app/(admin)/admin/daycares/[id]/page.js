"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import API from "@/lib/api";

export default function DaycareDetailPage() {
  const { id } = useParams();
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDaycare = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/admin/daycares/${id}`);
        setDaycare(res.data?.daycare ?? null); // <-- Use res.data.daycare
      } catch (err) {
        console.error("Error fetching daycare:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDaycare();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!daycare)
    return (
      <div className="p-6 text-center text-red-500">Daycare not found</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {daycare.name || "Unnamed Daycare"}
        </h1>
        <Badge
          variant={daycare.status === "approved" ? "success" : "secondary"}
        >
          {daycare.status?.toUpperCase() || "UNKNOWN"}
        </Badge>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-semibold">City:</span>{" "}
            {daycare.location ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">Owner:</span>{" "}
            {daycare.owner?.name ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {daycare.phone ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {daycare.email ?? "N/A"}
          </p>
          {daycare.website && (
            <p>
              <span className="font-semibold">Website:</span>{" "}
              <a
                href={daycare.website}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {daycare.website}
              </a>
            </p>
          )}
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {daycare.address ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">Tagline:</span>{" "}
            {daycare.tagline ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">About:</span>{" "}
            {daycare.about ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold">Policies:</span>{" "}
            {daycare.policies ?? "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Images */}
      {daycare.images?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto py-2">
              {daycare.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-32 h-32 flex-shrink-0 rounded-md border overflow-hidden relative cursor-pointer"
                  onClick={() =>
                    setSelectedImage(
                      img.url.startsWith("http")
                        ? img.url
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`
                    )
                  }
                >
                  {img.url ? (
                    <img
                      src={
                        img.url.startsWith("http")
                          ? img.url
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`
                      }
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                      NA
                    </div>
                  )}
                  {img.isFeatured && (
                    <span className="absolute top-1 left-1 px-1 text-xs font-semibold bg-blue-600 text-white rounded">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-3xl p-0 bg-transparent shadow-none">
            <img
              src={selectedImage}
              alt="Full Image"
              className="w-full h-auto rounded-md"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Packages & Staff Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Packages */}
        <TabsContent value="packages">
          {daycare.packages?.length > 0 ? (
            <div className="space-y-2">
              {daycare.packages.map((pkg) => (
                <Card key={pkg.id} className="border">
                  <CardContent>
                    <h3 className="font-semibold">{pkg.title}</h3>
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                    <p className="font-semibold mt-1">Price: ₹{pkg.price}</p>
                    <Badge variant={pkg.popular ? "destructive" : "secondary"}>
                      {pkg.popular ? "Popular" : "Standard"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No packages available.</p>
          )}
        </TabsContent>

        {/* Staff */}
        <TabsContent value="staff">
          {daycare.staff?.length > 0 ? (
            <div className="space-y-2">
              {daycare.staff.map((s) => (
                <Card key={s.id} className="border">
                  <CardContent>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-600">{s.role}</p>
                    <p>{s.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No staff added.</p>
          )}
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          {daycare.reviews?.length > 0 ? (
            <div className="space-y-2">
              {daycare.reviews.map((r) => (
                <Card key={r.id} className="border">
                  <CardContent>
                    <p className="font-semibold">{r.name}</p>
                    <p>Rating: {r.rating} ⭐</p>
                    <p className="text-sm text-gray-600">{r.text}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
