import API from "./api";

// services/tourService.js

export const tourService = {
  // Get all tours for provider
  getTours: () => API.get("/provider/tours"),

  // Get single tour
  getTour: (id) => API.get(`/provider/tours/${id}`),

  // Update tour status
  updateTour: (id, data) => API.put(`/provider/tours/${id}`, data),

  // Get stats
  getStats: () => API.get("/provider/tours/stats"),
};
