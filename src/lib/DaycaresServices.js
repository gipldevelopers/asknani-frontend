// lib/DaycaresServices.js
import API from "./api";

export const DaycaresServices = {
  // Get all cities with approved daycares
  getCities: () => API.get("/daycares/cities"),

  // Get all approved daycares
  getDaycares: (params = {}) => API.get("/daycares", { params }),

  // Search daycares with query params
  searchDaycares: (params = {}) => API.get("/daycares/search", { params }),

  // Get single daycare by slug
  getDaycare: (slug) => API.get(`/daycares/${slug}`),

  // Get top-rated daycares
  getTopDaycares: () => API.get("/daycares/top"),

  // Get featured daycares
  getFeaturedDaycares: () => API.get("/daycares/featured"),
  
};
