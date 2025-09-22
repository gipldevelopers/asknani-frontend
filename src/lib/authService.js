// lib/authService.js
import API from "./api";

export const register = (payload) => API.post("/auth/register", payload);
export const login = async (credentials) => {
  try {
    console.log("Sending credentials:", credentials); // ✅ log payload
    const res = await API.post("/auth/login", credentials, {
      withCredentials: true,
    });
    console.log("Login response:", res.data); // ✅ see exact response
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    return { success: false, error: err };
  }
};

export const me = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");
export const refresh = () => API.post("/auth/refresh");
export const verifyEmail = (token) =>
  API.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
export const forgotPassword = (payload) =>
  API.post("/auth/forgot-password", payload);
export const resetPassword = (payload) =>
  API.post("/auth/reset-password", payload);
