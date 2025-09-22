import { useState, useEffect } from "react";
import { daycareApi } from "../services/daycareApi";

export const useDaycare = () => {
  const [daycareData, setDaycareData] = useState({
    name: "",
    tagline: "",
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
    images: [], // Represents file objects for new uploads
  });

  const [cities, setCities] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // This function fetches all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all cities and facilities concurrently
      const [citiesRes, facilitiesRes] = await Promise.all([
        daycareApi.getCities(),
        daycareApi.getFacilities(),
      ]);

      console.log("Cities response:", citiesRes);
      console.log("Facilities response:", facilitiesRes);

      setCities(citiesRes.data);
      setAllFacilities(facilitiesRes.data);
      
      // Fetch the provider's daycare data
      const daycareRes = await daycareApi.getDaycare();
      const existingDaycare = daycareRes.data.daycare;

      if (existingDaycare) {
        // Map backend data to frontend state
        const formattedDaycare = {
          ...existingDaycare,
          // Handle cases where nested arrays might be null
          tags: existingDaycare.tags.map(t => t.tag) || [],
          images: existingDaycare.photos.map((p) => ({ url: p.image_path })) || [],
          facilities: existingDaycare.facilities.map((f) => f.id) || [],
          staff: existingDaycare.staff || [],
          certifications: existingDaycare.certifications || [],
        };
        setDaycareData(formattedDaycare);
      }
    } catch (err) {
      setError("Failed to fetch initial data. Please try again.");
      console.error("Error fetching initial data:", err);
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

      const formData = new FormData();
    // create slug from name
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // Append simple fields
      formData.append("name", data.name);
      formData.append("slug", slug);
      formData.append("tagline", data.tagline);
      formData.append("about", data.about);
      formData.append("short_desc", data.short_desc);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      if (data.city_id) {
          formData.append("city_id", data.city_id);
      }
      formData.append("website", data.website);
      formData.append("hours", data.hours);
      formData.append("map_embed_src", data.map_embed_src);
      formData.append("policies", data.policies);

      // Append arrays for backend processing
      // Tags: simple array of strings
      data.tags.forEach(tag => formData.append("tags[]", tag));
      // Facilities: simple array of IDs
      data.facilities.forEach(facilityId => formData.append("facilities[]", facilityId));
      // Services: simple array of objects with 'name'
  
      // Staff: array of objects
      data.staff.forEach((s, index) => {
          formData.append(`staff[${index}][name]`, s.name);
          formData.append(`staff[${index}][role]`, s.role);
          formData.append(`staff[${index}][experience]`, s.experience);
          formData.append(`staff[${index}][qualifications]`, s.qualifications);
          formData.append(`staff[${index}][image]`, s.image);
      });
      // Certifications: array of objects
      data.certifications.forEach((c, index) => {
          formData.append(`certifications[${index}][name]`, c.name);
          formData.append(`certifications[${index}][description]`, c.description);
      });
      // Images: append only new file objects
      data.images.forEach(image => {
        if (image.file) {
          formData.append("photos[]", image.file);
        }
      });
      
      // Send data to backend
      const response = await daycareApi.saveDaycare(formData);

      if (response.status === 201) {
          // Re-fetch data to ensure the UI is in sync with the backend
          await fetchData();
      }
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError(err.message || "An unexpected error occurred while saving.");
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
    cities,
    allFacilities,
    loading,
    saving,
    error,
    saveDaycare,
  };
};
