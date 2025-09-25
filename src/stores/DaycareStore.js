// stores/DaycareStore.js
import { create } from "zustand";
import { DaycaresServices } from "@/lib/DaycaresServices";

const useDaycareStore = create((set) => ({
  cities: [],
  loading: false,
  error: null,

  fetchCities: async () => {
    try {
      set({ loading: true, error: null });
      const response = await DaycaresServices.getCities();
      set({ cities: response.data.cities || [] });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch cities";
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  getTotalDaycares: () => {
    const { cities } = useDaycareStore.getState();
    return cities.reduce(
      (sum, city) => sum + (city.approved_daycares_count || 0),
      0
    );
  },
}));

export default useDaycareStore;
