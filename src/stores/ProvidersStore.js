import { create } from "zustand";
import API from "@/lib/api";

const useDaycareAuthStore = create((set) => ({
  daycare: null,

  setDaycare: (daycare) => set({ daycare }),

  fetchDaycare: async () => {
    try {
      const response = await API.get("/provider/daycare/info");

      set({ daycare: response.data.daycare });
    
      
    } catch (err) {
      console.error("Error fetching daycare info:", err);
    }
  },
}));

export default useDaycareAuthStore;
