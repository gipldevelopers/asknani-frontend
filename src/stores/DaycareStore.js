// hooks/useDaycares.js

import { DaycaresServices } from "@/lib/DaycaresServices";
import { useState, useEffect } from "react";

export const useDaycares = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities with approved daycares
  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DaycaresServices.getCities();

      // Handle response (assuming it’s { cities: [...] })
      setCities(response.data.cities || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch cities";
      setError(errorMsg);
      console.error("Error fetching cities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search/filter cities by name
  const searchCities = (searchTerm) => {
    return cities.filter((city) =>
      city.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get total approved daycares across all cities
  const getTotalDaycares = () => {
    return cities.reduce(
      (sum, city) => sum + (city.approved_daycares_count || 0),
      0
    );
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return {
    cities,
    loading,
    error,
    fetchCities,
    searchCities,
    getTotalDaycares,
    refreshData: fetchCities,
  };
};
