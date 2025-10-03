import useAuthStore from "@/stores/AuthStore";
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: false,
});

// Attach token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response queue for refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Helper to logout safely and show toast
const safeLogout = (message = "Session expired. Please login again.") => {
  const { logout } = useAuthStore.getState();
  if (logout) logout();
  toast.error(message);
};

API.interceptors.response.use(
  (res) => {
    // Case 1: backend returns success: false with authentication message
    if (
      res.data?.success === false &&
      res.data?.message === "Authentication required."
    ) {
      safeLogout(res.data?.message || "Session expired. Please login again.");
      return Promise.reject(res.data);
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // If no response or not HTTP error, reject
    if (!originalRequest || !err.response) return Promise.reject(err);

    const status = err.response.status;

    // Case 2: 401 or 403 errors
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // Skip refresh for certain endpoints
      const skipRefresh = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
      ];
      const isSkipEndpoint = skipRefresh.some((url) =>
        originalRequest.url.includes(url)
      );
      if (isSkipEndpoint) {
        safeLogout();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await API.post("/auth/refresh");
        const newToken = refreshResponse.data.token;

        if (newToken) {
          localStorage.setItem("token", newToken);
          API.defaults.headers.common.Authorization = "Bearer " + newToken;
          processQueue(null, newToken);
        }

        isRefreshing = false;
        originalRequest.headers.Authorization = "Bearer " + newToken;
        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        safeLogout("Session expired. Please login again."); // show toast
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
