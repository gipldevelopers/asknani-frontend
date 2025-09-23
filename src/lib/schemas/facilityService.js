import API from "../api";

export const facilityService = {
  addFacility: async (data) => {
    try {
      const response = await API.post("/provider/facilities", data);
      return response.data;
    } catch (error) {
      // Throw a user-friendly error message
      throw new Error(
        error.response?.data?.message || "Failed to add facility."
      );
    }
  },

  getFacilities: async () => {
    try {
      const response = await API.get("/provider/facilities");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch facilities."
      );
    }
  },

  getFacility: async (id) => {
    try {
      const response = await API.get(`/provider/facilities/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch facility details."
      );
    }
  },
};
