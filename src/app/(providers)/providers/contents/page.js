"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { useDaycare } from "../../hooks/useDaycare";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Reusable Image Upload Component
const ImageUpload = ({ images, onImagesChange, maxImages = 10 }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= maxImages) {
      const newImages = files.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      onImagesChange([...images, ...newImages]);
    } else {
      // Use a custom alert component or state to show a message
      console.error(`Maximum ${maxImages} images allowed`);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    if (newImages[index].url && newImages[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {(images || []).map((image, index) => (
          <div key={index} className="relative group h-40">
            <Image
              src={image.url || image}
              alt={`Daycare ${index + 1}`}
              width={200}
              height={150}
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Upload Image</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images
      </p>
    </div>
  );
};

// Reusable Tag Input Component
const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(tags || []).map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button onClick={() => removeTag(index)} className="ml-1">
              <Trash2 className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Reusable Facility Toggle Component
const FacilityToggle = ({ facility, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {/* You can use a dedicated icon library or simple icons here */}
        <span>{facility.name}</span>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={() => onToggle(facility.id)}
      />
    </div>
  );
};

// Reusable Staff Member Form Component
const StaffMemberForm = ({ staff, index, onChange, onRemove }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Staff Member #{index + 1}</CardTitle>
          <Button variant="outline" size="sm" onClick={onRemove} type="button">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`staff-name-${index}`}>Name</Label>
            <Input
              id={`staff-name-${index}`}
              value={staff?.name || ""}
              onChange={(e) => onChange(index, "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`staff-role-${index}`}>Role</Label>
            <Input
              id={`staff-role-${index}`}
              value={staff?.role || ""}
              onChange={(e) => onChange(index, "role", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-experience-${index}`}>Experience</Label>
          <Input
            id={`staff-experience-${index}`}
            value={staff?.experience || ""}
            onChange={(e) => onChange(index, "experience", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-qualifications-${index}`}>
            Qualifications
          </Label>
          <Input
            id={`staff-qualifications-${index}`}
            value={staff?.qualifications || ""}
            onChange={(e) => onChange(index, "qualifications", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-image-${index}`}>Image URL</Label>
          <Input
            id={`staff-image-${index}`}
            value={staff?.image || ""}
            onChange={(e) => onChange(index, "image", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Reusable Certification Form Component
const CertificationForm = ({ certification, index, onChange, onRemove }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
          <Button variant="outline" size="sm" onClick={onRemove} type="button">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`cert-name-${index}`}>Name</Label>
          <Input
            id={`cert-name-${index}`}
            value={certification?.name || ""}
            onChange={(e) => onChange(index, "name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`cert-desc-${index}`}>Description</Label>
          <Input
            id={`cert-desc-${index}`}
            value={certification?.description || ""}
            onChange={(e) => onChange(index, "description", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main Content Management Page
const ProvidersContentPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const {
    daycareData,
    setDaycareData,
    cities,
    allFacilities,
    loading,
    saving,
    error,
    saveDaycare,
  } = useDaycare();

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading daycare data...</span>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setDaycareData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityToggle = (facilityId) => {
    setDaycareData((prev) => {
      const isEnabled = prev.facilities.includes(facilityId);
      return {
        ...prev,
        facilities: isEnabled
          ? prev.facilities.filter((id) => id !== facilityId)
          : [...prev.facilities, facilityId],
      };
    });
  };

  const handleStaffChange = (index, field, value) => {
    setDaycareData((prev) => {
      const newStaff = [...(prev.staff || [])];
      newStaff[index] = { ...newStaff[index], [field]: value };
      return { ...prev, staff: newStaff };
    });
  };

  const addStaffMember = () => {
    setDaycareData((prev) => ({
      ...prev,
      staff: [
        ...(prev.staff || []),
        {
          name: "",
          role: "",
          experience: "",
          qualifications: "",
          image: "",
        },
      ],
    }));
  };

  const removeStaffMember = (index) => {
    setDaycareData((prev) => {
      const newStaff = [...(prev.staff || [])];
      newStaff.splice(index, 1);
      return { ...prev, staff: newStaff };
    });
  };

  const handleCertificationChange = (index, field, value) => {
    setDaycareData((prev) => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
  };

  const addCertification = () => {
    setDaycareData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          name: "",
          description: "",
        },
      ],
    }));
  };

  const removeCertification = (index) => {
    setDaycareData((prev) => {
      const newCerts = [...(prev.certifications || [])];
      newCerts.splice(index, 1);
      return { ...prev, certifications: newCerts };
    });
  };

  const handleSave = async () => {
    try {
      await saveDaycare(daycareData);
      // Replace with a more elegant UI notification
      alert("Daycare information saved successfully!");
    } catch (err) {
      // Error handled in the hook, but we catch it here to prevent app crash
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Error Banner */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Daycare Content Management</h1>
          <p className="text-muted-foreground">
            Manage your daycare listing information
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your daycare&apos;s basic information that appears in
                search results and listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Daycare Name</Label>
                <Input
                  id="name"
                  value={daycareData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("city_id", parseInt(value))
                  }
                  value={daycareData.city_id ? String(daycareData.city_id) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {(cities || []).map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={daycareData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Your Daycare</Label>
                <Textarea
                  id="about"
                  rows={5}
                  value={daycareData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={daycareData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={daycareData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={daycareData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={daycareData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={daycareData.hours}
                    onChange={(e) => handleInputChange("hours", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Age Groups</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(daycareData.ageGroups || []).map((group, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={group}
                        onChange={(e) => {
                          const newAgeGroups = [
                            ...(daycareData.ageGroups || []),
                          ];
                          newAgeGroups[index] = e.target.value;
                          handleInputChange("ageGroups", newAgeGroups);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newAgeGroups = [
                            ...(daycareData.ageGroups || []),
                          ];
                          newAgeGroups.splice(index, 1);
                          handleInputChange("ageGroups", newAgeGroups);
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    handleInputChange("ageGroups", [
                      ...(daycareData.ageGroups || []),
                      "New Age Group",
                    ])
                  }
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Age Group
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Tags & Keywords</Label>
                <TagInput
                  tags={daycareData.tags || []}
                  onTagsChange={(tags) => handleInputChange("tags", tags)}
                />
                <p className="text-sm text-muted-foreground">
                  These tags help parents find your daycare when searching our
                  platform.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policies">Policies</Label>
                <Textarea
                  id="policies"
                  rows={3}
                  value={daycareData.policies || ""}
                  onChange={(e) =>
                    handleInputChange("policies", e.target.value)
                  }
                  placeholder="Enter your daycare policies..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="map_embed_src">Map Embed Source</Label>
                <Input
                  id="map_embed_src"
                  value={daycareData.map_embed_src || ""}
                  onChange={(e) =>
                    handleInputChange("map_embed_src", e.target.value)
                  }
                  placeholder="https://maps.google.com/embed?..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Daycare Images</CardTitle>
              <CardDescription>
                Upload images of your daycare facility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={daycareData.images || []}
                onImagesChange={(images) => handleInputChange("images", images)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facilities & Amenities</CardTitle>
              <CardDescription>
                Select the facilities and amenities available at your daycare.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(allFacilities || []).map((facility) => (
                  <FacilityToggle
                    key={facility.id}
                    facility={facility}
                    isEnabled={(daycareData.facilities || []).includes(
                      facility.id
                    )}
                    onToggle={handleFacilityToggle}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Information</CardTitle>
              <CardDescription>
                Add information about your staff members to build trust with
                parents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(daycareData.staff || []).map((staff, index) => (
                <StaffMemberForm
                  key={index}
                  staff={staff}
                  index={index}
                  onChange={handleStaffChange}
                  onRemove={() => removeStaffMember(index)}
                />
              ))}
              <Button variant="outline" onClick={addStaffMember} type="button">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Accreditations</CardTitle>
              <CardDescription>
                Showcase your daycare&apos;s certifications and accreditations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(daycareData.certifications || []).map((cert, index) => (
                <CertificationForm
                  key={index}
                  certification={cert}
                  index={index}
                  onChange={handleCertificationChange}
                  onRemove={() => removeCertification(index)}
                />
              ))}
              <Button
                variant="outline"
                onClick={addCertification}
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProvidersContentPage;
