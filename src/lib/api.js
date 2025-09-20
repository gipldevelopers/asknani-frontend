import axios from "axios";
import Cookies from "js-cookie"; // <-- Import Cookies
// ... other imports

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true, // <-- Correctly enable this for cookie-based auth
});

// Attach token to every request
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Get token from cookies, not localStorage
    const token = Cookies.get("token"); // <-- Get from cookies
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to attempt refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!originalRequest || !err.response) return Promise.reject(err);

    // Skip refresh for login, register, forgot-password, reset-password
    const skipRefresh = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];
    const isSkipEndpoint = skipRefresh.some((url) => originalRequest.url.includes(url));

    if (err.response.status === 401 && !originalRequest._retry && !isSkipEndpoint) {
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err2) => Promise.reject(err2));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await API.post("/auth/refresh");
        const newToken = refreshResponse.data.token;

        if (newToken) {
          Cookies.set("token", newToken, { secure: true, sameSite: "Strict" });
          API.defaults.headers.common.Authorization = "Bearer " + newToken;
          processQueue(null, newToken);
        }

        isRefreshing = false;
        originalRequest.headers.Authorization = "Bearer " + newToken;
        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        Cookies.remove("token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);


export default API;