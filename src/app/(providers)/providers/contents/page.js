"use client";
import { useState, useEffect } from "react";
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
import { Plus, Trash2, Upload, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { daycareApi } from "../../services/daycareApi";

// --- Mock Daycare API for self-contained example ---

// Validation schema matching backend
const validationRules = {
  name: { required: true, maxLength: 255 },
  tagline: { required: false, maxLength: 255 },
  short_desc: { required: false, maxLength: 500 },
  about: { required: false },
  address: { required: true },
  phone: { required: true },
  email: { required: true, type: "email" },
  city_id: { required: true },
  website: { required: false },
  hours: { required: false },
  policies: { required: false },
  map_embed_src: { required: false },
  tags: { required: false },
  facilities: { required: false },
  staff: {
    required: false,
    fields: {
      name: { required: true },
    },
  },
  certifications: {
    required: false,
    fields: {
      name: { required: true },
    },
  },
  images: { required: false, maxCount: 10 },
};

// Validation function
const validateField = (field, value, rules) => {
  const fieldRules = rules[field];
  const errors = [];

  if (!fieldRules) return errors;

  if (fieldRules.required) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      errors.push(`${field} is required`);
    }
  }

  if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
    errors.push(`${field} must be less than ${fieldRules.maxLength} characters`);
  }

  if (fieldRules.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push("Please enter a valid email address");
    }
  }

  if (fieldRules.maxCount && Array.isArray(value) && value.length > fieldRules.maxCount) {
    errors.push(`Maximum ${fieldRules.maxCount} ${field} allowed`);
  }

  return errors;
};

const validateForm = (data) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const fieldErrors = validateField(field, data[field], validationRules);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });

  // Validate nested objects
  if (data.staff && Array.isArray(data.staff)) {
    data.staff.forEach((staff, index) => {
      const staffErrors = validateField("name", staff.name, validationRules.staff.fields);
      if (staffErrors.length > 0) {
        errors[`staff[${index}].name`] = staffErrors;
      }
    });
  }

  if (data.certifications && Array.isArray(data.certifications)) {
    data.certifications.forEach((cert, index) => {
      const certErrors = validateField("name", cert.name, validationRules.certifications.fields);
      if (certErrors.length > 0) {
        errors[`certifications[${index}].name`] = certErrors;
      }
    });
  }

  return errors;
};

// Custom hook to handle all API logic and state management
export const useDaycare = () => {
  const [daycareData, setDaycareData] = useState({
    name: "",
    tagline: "",
    short_desc: "",
    about: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
    policies: "",
    map_embed_src: "",
    city_id: null,
    tags: [],
    facilities: [],
    staff: [],
    certifications: [],
    images: [],
  });
  const [featuredImageUrl, setFeaturedImageUrl] = useState(null);

  const [cities, setCities] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateCurrentData = () => {
    const errors = validateForm(daycareData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (field) => {
    return validationErrors[field]?.[0] || null;
  };

  const getStaffErrors = (index) => {
    const errors = {};
    Object.keys(validationErrors).forEach((key) => {
      if (key.startsWith(`staff[${index}]`)) {
        const field = key.replace(`staff[${index}].`, "");
        errors[field] = validationErrors[key]?.[0];
      }
    });
    return errors;
  };
  
  const getCertificationErrors = (index) => {
    const errors = {};
    Object.keys(validationErrors).forEach((key) => {
      if (key.startsWith(`certifications[${index}]`)) {
        const field = key.replace(`certifications[${index}].`, "");
        errors[field] = validationErrors[key]?.[0];
      }
    });
    return errors;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      const [citiesRes, facilitiesRes, daycareRes] = await Promise.all([
        daycareApi.getCities(),
        daycareApi.getFacilities(),
        daycareApi.getDaycare(),
      ]);

      setCities(citiesRes.data);
      setAllFacilities(facilitiesRes.data);
      const existingDaycare = daycareRes.data.daycare;

      if (existingDaycare) {
        const formattedDaycare = {
          ...existingDaycare,
          short_desc: existingDaycare.short_desc || "",
          tags: existingDaycare.tags?.map((t) => t.tag) ?? [],
          images:
            existingDaycare.photos?.map((p) => ({ url: p.image_path })) ?? [],
          facilities: existingDaycare.facilities?.map((f) => f.id) ?? [],
          staff: existingDaycare.staff ?? [],
          certifications: existingDaycare.certifications ?? [],
        };
        setDaycareData(formattedDaycare);
        
        const featuredPhoto = existingDaycare.photos?.find(p => p.is_featured);
        if (featuredPhoto) {
          setFeaturedImageUrl(featuredPhoto.image_path);
        } else if (existingDaycare.photos?.length > 0) {
          setFeaturedImageUrl(existingDaycare.photos[0].image_path);
        }
      }
    } catch (err) {
      setError("Failed to fetch initial data. Please try again.");
      console.error("Error fetching initial data:", err);
      toast.error("Failed to load daycare data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveDaycare = async (data) => {
    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      const errors = validateForm(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error("Please fix the errors in the form before saving");
        throw new Error("Validation failed");
      }

      const formData = new FormData();
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Append simple fields
      formData.append("name", data.name);
      formData.append("slug", slug);
      formData.append("tagline", data.tagline || "");
      formData.append("short_desc", data.short_desc || "");
      formData.append("about", data.about || "");
      formData.append("address", data.address || "");
      formData.append("phone", data.phone || "");
      formData.append("email", data.email || "");
      if (data.city_id) {
        formData.append("city_id", data.city_id);
      }
      formData.append("website", data.website || "");
      formData.append("hours", data.hours || "");
      formData.append("map_embed_src", data.map_embed_src || "");
      formData.append("policies", data.policies || "");

      // Append arrays
      data.tags.forEach((tag) => formData.append("tags[]", tag));
      data.facilities.forEach((facilityId) =>
        formData.append("facilities[]", facilityId)
      );

      // Staff: array of objects
      data.staff.forEach((s, index) => {
        formData.append(`staff[${index}][name]`, s.name);
        formData.append(`staff[${index}][role]`, s.role || "");
        formData.append(`staff[${index}][experience]`, s.experience || "");
        formData.append(
          `staff[${index}][qualifications]`,
          s.qualifications || ""
        );
        if (s.image) {
          formData.append(`staff[${index}][image]`, s.image);
        }
      });

      // Certifications: array of objects
      data.certifications.forEach((c, index) => {
        formData.append(`certifications[${index}][name]`, c.name);
        formData.append(
          `certifications[${index}][description]`,
          c.description || ""
        );
      });
      
      // Images: append ONLY new file objects
      const existingPhotoUrls = [];
      data.images.forEach((image) => {
        if (image.file) {
          formData.append("photos[]", image.file);
        } else if (image.url) {
          existingPhotoUrls.push(image.url);
        }
      });

      // Send the list of existing photo URLs and featured photo URL to backend
      existingPhotoUrls.forEach((url) => {
          formData.append("existing_photos_urls[]", url);
      });
      if (featuredImageUrl) {
        formData.append("featured_image_url", featuredImageUrl);
      }
      
      const response = await daycareApi.saveDaycare(formData);

      if (response.status === 201) {
        toast.success("Daycare information saved successfully!");
        await fetchData();
        return true;
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        const errorMessage = validationErrors.join(" ");
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.message !== "Validation failed") {
        const errorMsg =
          err.message || "An unexpected error occurred while saving.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
      console.error("Error saving daycare data:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    daycareData,
    setDaycareData,
    featuredImageUrl,
    setFeaturedImageUrl,
    cities,
    allFacilities,
    loading,
    saving,
    error,
    validationErrors,
    setValidationErrors,
    saveDaycare,
    validateCurrentData,
    getFieldError,
    getStaffErrors,
    getCertificationErrors,
  };
};

// Enhanced Input component with validation
const ValidatedInput = ({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  placeholder = "",
  required = false,
  ...props
}) => (
  <div className="space-y-2" data-field={id}>
    <Label htmlFor={id} className={required ? "required-field" : ""}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={error ? "border-red-500" : ""}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Enhanced Textarea component with validation
const ValidatedTextarea = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder = "",
  required = false,
  rows = 3,
  ...props
}) => (
  <div className="space-y-2" data-field={id}>
    <Label htmlFor={id} className={required ? "required-field" : ""}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={error ? "border-red-500" : ""}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Enhanced Select component with validation
const ValidatedSelect = ({
  label,
  value,
  onValueChange,
  error,
  children,
  required = false,
  placeholder = "Select an option",
  id,
}) => (
  <div className="space-y-2" data-field={id}>
    <Label htmlFor={id} className={required ? "required-field" : ""}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={error ? "border-red-500" : ""}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Image Upload Component with validation
const ImageUpload = ({ images, onImagesChange, featuredImageUrl, onSetFeatured, maxImages = 10, error }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= maxImages) {
      const newImages = files.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      onImagesChange([...images, ...newImages]);
      if (images.length === 0 && newImages.length > 0) {
        onSetFeatured(newImages[0].url);
      }
    } else {
      toast.error(`Maximum ${maxImages} images allowed`);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const removedImage = newImages.splice(index, 1)[0];
    
    if (removedImage.url && removedImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.url);
    }
    
    onImagesChange(newImages);

    if (removedImage.url === featuredImageUrl) {
        onSetFeatured(newImages.length > 0 ? newImages[0].url : null);
    }
  };
  
  const getImageUrl = (url) => {
    // Check if it's a full URL or a blob URL, which should not be modified
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    // Otherwise, it's a relative path from the database.
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${url}`;
  };

  return (
    <div data-field="images">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {(images || []).map((image, index) => (
          <div key={image.url || index} className="relative group h-40">
            <img
              src={getImageUrl(image.url)}
              alt={`Daycare ${index + 1}`}
              onError={(e) => { e.target.src = "https://placehold.co/400x300/F0F0F0/000000?text=Image+Error"; }}
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {image.url === featuredImageUrl ? (
                <Badge className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500 text-white">
                    <Star className="h-3 w-3 fill-white" /> Featured
                </Badge>
            ) : (
                <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSetFeatured(image.url)}
                >
                    <Star className="h-3 w-3 fill-primary mr-1" />
                    Set as Featured
                </Button>
            )}
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images
      </p>
    </div>
  );
};

// Tag Input Component
const TagInput = ({ tags, onTagsChange, error }) => {
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
    <div data-field="tags">
      <div className="flex gap-2 mb-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
          className={error ? "border-red-500" : ""}
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {(tags || []).map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Facility Toggle Component
const FacilityToggle = ({ facility, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <span>{facility.name}</span>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={() => onToggle(facility.id)}
      />
    </div>
  );
};

// Staff Member Form Component with validation
const StaffMemberForm = ({ staff, index, onChange, onRemove, errors }) => {
  return (
    <Card data-field={`staff[${index}]`} className={Object.keys(errors).length > 0 ? "border-red-200" : ""}>
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
          <ValidatedInput
            label="Name"
            id={`staff-name-${index}`}
            value={staff?.name || ""}
            onChange={(e) => onChange(index, "name", e.target.value)}
            error={errors?.name}
            required={true}
            data-field={`staff[${index}].name`}
          />
          <ValidatedInput
            label="Role"
            id={`staff-role-${index}`}
            value={staff?.role || ""}
            onChange={(e) => onChange(index, "role", e.target.value)}
            error={errors?.role}
            data-field={`staff[${index}].role`}
          />
        </div>
        <ValidatedInput
          label="Experience"
          id={`staff-experience-${index}`}
          value={staff?.experience || ""}
          onChange={(e) => onChange(index, "experience", e.target.value)}
          error={errors?.experience}
          data-field={`staff[${index}].experience`}
        />
        <ValidatedInput
          label="Qualifications"
          id={`staff-qualifications-${index}`}
          value={staff?.qualifications || ""}
          onChange={(e) => onChange(index, "qualifications", e.target.value)}
          error={errors?.qualifications}
          data-field={`staff[${index}].qualifications`}
        />
        <ValidatedInput
          label="Image URL"
          id={`staff-image-${index}`}
          value={staff?.image || ""}
          onChange={(e) => onChange(index, "image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          error={errors?.image}
          data-field={`staff[${index}].image`}
        />
      </CardContent>
    </Card>
  );
};

// Certification Form Component with validation
const CertificationForm = ({
  certification,
  index,
  onChange,
  onRemove,
  errors,
}) => {
  return (
    <Card data-field={`certifications[${index}]`} className={Object.keys(errors).length > 0 ? "border-red-200" : ""}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
          <Button variant="outline" size="sm" onClick={onRemove} type="button">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ValidatedInput
          label="Name"
          id={`cert-name-${index}`}
          value={certification?.name || ""}
          onChange={(e) => onChange(index, "name", e.target.value)}
          error={errors?.name}
          required={true}
          data-field={`certifications[${index}].name`}
        />
        <ValidatedTextarea
          label="Description"
          id={`cert-desc-${index}`}
          value={certification?.description || ""}
          onChange={(e) => onChange(index, "description", e.target.value)}
          error={errors?.description}
          rows={2}
          data-field={`certifications[${index}].description`}
        />
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
    featuredImageUrl,
    setFeaturedImageUrl,
    cities,
    allFacilities,
    loading,
    saving,
    error,
    validationErrors,
    setValidationErrors,
    saveDaycare,
    validateCurrentData,
    getFieldError,
    getStaffErrors,
    getCertificationErrors,
  } = useDaycare();

  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      if (firstErrorField.startsWith('staff')) {
        setActiveTab('staff');
      } else if (firstErrorField.startsWith('certifications')) {
        setActiveTab('certifications');
      } else if (firstErrorField.startsWith('images')) {
        setActiveTab('images');
      } else if (firstErrorField.startsWith('facilities')) {
        setActiveTab('facilities');
      } else {
        setActiveTab('basic');
      }
    }
  }, [validationErrors]);

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
    const newErrors = { ...validationErrors };
    delete newErrors[field];
    setValidationErrors(newErrors);
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
    const errorKey = `staff[${index}].${field}`;
    const newErrors = { ...validationErrors };
    delete newErrors[errorKey];
    setValidationErrors(newErrors);
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
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`staff[${index}]`)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const handleCertificationChange = (index, field, value) => {
    setDaycareData((prev) => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
    const errorKey = `certifications[${index}].${field}`;
    const newErrors = { ...validationErrors };
    delete newErrors[errorKey];
    setValidationErrors(newErrors);
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
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`certifications[${index}]`)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const handleSave = async () => {
    try {
      if (!validateCurrentData()) {
        return;
      }
      await saveDaycare(daycareData);
    } catch (err) {
      // Error handled in the hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                Update your daycare's basic information that appears in search
                results and listings. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ValidatedInput
                label="Daycare Name"
                id="name"
                value={daycareData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={getFieldError("name")}
                required={true}
              />

              <ValidatedSelect
                label="City"
                id="city_id"
                value={daycareData.city_id ? String(daycareData.city_id) : ""}
                onValueChange={(value) =>
                  handleInputChange("city_id", parseInt(value))
                }
                error={getFieldError("city_id")}
                required={true}
                placeholder="Select a city"
              >
                {(cities || []).map((city) => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {city.name}
                  </SelectItem>
                ))}
              </ValidatedSelect>

              <ValidatedInput
                label="Tagline"
                id="tagline"
                value={daycareData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                error={getFieldError("tagline")}
                placeholder="Brief tagline for your daycare"
              />

              <ValidatedTextarea
                label="Short Description"
                id="short_desc"
                value={daycareData.short_desc}
                onChange={(e) =>
                  handleInputChange("short_desc", e.target.value)
                }
                error={getFieldError("short_desc")}
                placeholder="A brief summary for search results (max 500 characters)"
                rows={2}
              />

              <ValidatedTextarea
                label="About Your Daycare"
                id="about"
                value={daycareData.about}
                onChange={(e) => handleInputChange("about", e.target.value)}
                error={getFieldError("about")}
                placeholder="Detailed description of your daycare"
                rows={5}
              />

              <ValidatedInput
                label="Address"
                id="address"
                value={daycareData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={getFieldError("address")}
                required={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Phone Number"
                  id="phone"
                  value={daycareData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={getFieldError("phone")}
                  required={true}
                />

                <ValidatedInput
                  label="Email Address"
                  id="email"
                  type="email"
                  value={daycareData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={getFieldError("email")}
                  required={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Website"
                  id="website"
                  value={daycareData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  error={getFieldError("website")}
                />

                <ValidatedInput
                  label="Operating Hours"
                  id="hours"
                  value={daycareData.hours}
                  onChange={(e) => handleInputChange("hours", e.target.value)}
                  error={getFieldError("hours")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags & Keywords</Label>
                <TagInput
                  tags={daycareData.tags || []}
                  onTagsChange={(tags) => handleInputChange("tags", tags)}
                  error={getFieldError("tags")}
                />
                <p className="text-sm text-muted-foreground">
                  These tags help parents find your daycare when searching our
                  platform.
                </p>
              </div>

              <ValidatedTextarea
                label="Policies"
                id="policies"
                value={daycareData.policies || ""}
                onChange={(e) => handleInputChange("policies", e.target.value)}
                error={getFieldError("policies")}
                placeholder="Enter your daycare policies..."
                rows={3}
              />

              <ValidatedInput
                label="Map Embed Source"
                id="map_embed_src"
                value={daycareData.map_embed_src || ""}
                onChange={(e) =>
                  handleInputChange("map_embed_src", e.target.value)
                }
                error={getFieldError("map_embed_src")}
                placeholder="https://maps.google.com/embed?..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Daycare Images</CardTitle>
              <CardDescription>
                Upload images of your daycare facility. Maximum 10 images
                allowed. The first image uploaded will be the featured image,
                but you can change it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={daycareData.images || []}
                onImagesChange={(images) => handleInputChange("images", images)}
                featuredImageUrl={featuredImageUrl}
                onSetFeatured={setFeaturedImageUrl}
                error={getFieldError("images")}
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
                parents. Staff name is required.
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
                  errors={getStaffErrors(index)}
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
                Showcase your daycare's certifications and accreditations.
                Certification name is required.
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
                  errors={getCertificationErrors(index)}
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

// Add this CSS for required field indicators
<style jsx>{`
  .required-field::after {
    content: " *";
    color: rgb(239, 68, 68);
  }
`}</style>
