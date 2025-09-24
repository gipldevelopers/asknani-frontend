import API from "./api";

// services/Daycares_Api.js

export const DaycaresServices = {
  // Get all tours for provider
  getCities: () => API.get("/daycares/cities"),
};
