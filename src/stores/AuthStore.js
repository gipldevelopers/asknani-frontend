import { create } from "zustand";
import { jwtDecode } from "jwt-decode"; // fix import
import {
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
  me as apiMe,
} from "@/lib/authService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,

  setToken: (token) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        Cookies.set("token", token, { path: "/" });
      }
      const user = jwtDecode(token);
      set({ token, user, isLoggedIn: true });
    } catch (e) {
      console.error("Invalid token set", e);
    }
  },

  loadToken: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        set({ token, user: decoded, isLoggedIn: true });

        // Fetch latest user data from backend
        try {
          const res = await apiMe();
          if (res?.data) {
            set({ user: res.data });
          }
        } catch (err) {
          console.error("Failed to fetch user info:", err);
          get().logout();
        }
      } catch {
        get().logout();
      }
    }
  },

  login: async (credentials) => {
    set({ loading: true });
    try {
      const res = await apiLogin(credentials);
      if (res?.data?.token) {
        get().setToken(res.data.token);

        // Fetch latest user info after login
        try {
          const meRes = await apiMe();
          if (meRes?.data) set({ user: meRes.data });
        } catch {}

        set({ loading: false });
        return { success: true, data: res.data };
      } else {
        set({ loading: false });
        return {
          success: false,
          error: res.data || { message: "Login failed" },
        };
      }
    } catch (err) {
      set({ loading: false });
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      return { success: false, error: { message } };
    }
  },

  logout: async () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
    set({ token: null, user: null, isLoggedIn: false });
    toast.success("Logged out");
  },

  refreshToken: async () => {
    try {
      const res = await apiRefresh();
      if (res?.data?.token) {
        get().setToken(res.data.token);
        // Fetch updated user info after refresh
        try {
          const meRes = await apiMe();
          if (meRes?.data) set({ user: meRes.data });
        } catch {}
      }
    } catch (e) {
      console.error("Token refresh failed", e);
      get().logout();
    }
  },
}));

export default useAuthStore;
