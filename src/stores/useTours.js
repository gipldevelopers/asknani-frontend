// hooks/useTours.js
import { tourService } from "@/lib/tourService";
import { useState, useEffect } from "react";

export const useTours = () => {
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tourService.getTours();

      // Handle both paginated and non-paginated responses
      const toursData = response.data.tours.data || response.data.tours || [];
      setTours(toursData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tours");
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await tourService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Update tour status
  const updateTourStatus = async (tourId, status, notes = "") => {
    try {
      const response = await tourService.updateTour(tourId, { status, notes });

      // Update local state
      setTours((prev) =>
        prev.map((tour) =>
          tour.id === tourId ? { ...tour, ...response.data.tour } : tour
        )
      );

      // Refresh stats
      await fetchStats();

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update tour";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Get today's tours
  const getTodayTours = () => {
    const today = new Date().toDateString();
    return tours.filter((tour) => {
      const tourDate = new Date(
        tour.tour_date || tour.scheduled_at || tour.tourDate
      ).toDateString();
      return tourDate === today && tour.status === "scheduled";
    });
  };

  // Get upcoming tours (next 7 days)
  const getUpcomingTours = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tours.filter((tour) => {
      const tourDate = new Date(
        tour.tour_date || tour.scheduled_at || tour.tourDate
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only
      return (
        tourDate >= today && tourDate <= nextWeek && tour.status === "scheduled"
      );
    });
  };

  // Search tours
  const searchTours = (searchTerm, statusFilter = "all") => {
    return tours.filter((tour) => {
      const matchesSearch =
        searchTerm === "" ||
        tour.parent?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.child_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tour.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  useEffect(() => {
    fetchTours();
    fetchStats();
  }, []);

  return {
    tours,
    stats,
    loading,
    error,
    fetchTours,
    updateTourStatus,
    getTodayTours,
    getUpcomingTours,
    searchTours,
    refreshData: () => {
      fetchTours();
      fetchStats();
    },
  };
};
