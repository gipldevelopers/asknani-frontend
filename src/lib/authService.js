// lib/authService.js
import API from "./api";

export const register = (payload) => API.post("/auth/register", payload);
export const login = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials, {
      withCredentials: true,
    });
    return { success: true, data: res.data }; // always return data
  } catch (err) {
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
