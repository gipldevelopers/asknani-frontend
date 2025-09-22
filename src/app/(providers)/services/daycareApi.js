import API from "@/lib/api";

export const daycareApi = {
  // Get daycare data for the current provider
  getDaycare: () => API.get("/provider/daycare/status"),

  // Create or update daycare
  saveDaycare: (data) =>
    API.post("/provider/daycare/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Get a list of all cities
  getCities: () => API.get("/cities"),

  // Get a list of all facilities
  getFacilities: () => API.get("/provider/facilities"),
};
