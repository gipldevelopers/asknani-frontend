import API from "./api";

export const fetchDaycareDetails = async (slug) => {
  try {
    const response = await API.get(`/daycares/${slug}`);
    return response.data.daycare;
  } catch (error) {
    // If the DaycareController@show returns 404, we treat it as not found
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching daycare details:", error);
    throw error;
  }
};

export const submitBooking = async (bookingData) => {
  try {
    // A placeholder for a dedicated booking endpoint (not in DaycareController)
    const response = await API.post(`/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error submitting booking:", error);
    throw error;
  }
};

export const scheduleDaycareTour = async (tourData) => {
  try {
    // A placeholder for a dedicated tour endpoint (not in DaycareController)
    const response = await API.post(`/parent/tours`, tourData);
    return response.data;
  } catch (error) {
    console.error("Error scheduling tour:", error);
    throw error;
  }
};

export const submitDaycareReview = async (daycareId, reviewData) => {
  try {
    // A placeholder for a dedicated review endpoint (not in DaycareController)
    const response = await API.post(
      `/daycares/${daycareId}/reviews`,
      reviewData
    );
    return response.data.review;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const fetchDaycareReviews = async (daycareId) => {
  try {
    const response = await API.get(`/daycares/${daycareId}/reviews`);
    // Assuming the backend returns an array of reviews
    return response.data.reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Return empty array on failure to prevent app crash
    return [];
  }
};
