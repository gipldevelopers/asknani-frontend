//...
import Cookies from "js-cookie";
import {
  login as apiLogin,
  me as apiMe,
  logout as apiLogout,
  refresh as apiRefresh,
} from "@/lib/authService";
import toast from "react-hot-toast";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,

  setToken: (token) => {
    try {
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
      const user = jwtDecode(token);
      set({ token, user, isLoggedIn: true });
    } catch (e) {
      console.error("Invalid token set", e);
    }
  },

  loadToken: async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // The API interceptor will handle token refreshes, so we only need to set the user from the decoded token.
        // The subsequent api call will either succeed or trigger the refresh.
        set({ token, user: decoded, isLoggedIn: true });
      } catch {
        // If the token is invalid (malformed, etc.), clear it.
        get().logout();
      }
    }
  },

  login: async (credentials) => {
    set({ loading: true });
    try {
      const res = await apiLogin(credentials); // already returns {success, data}

      if (res.success && res.data.token) {
        const token = res.data.token;
        Cookies.set("token", token, { secure: true, sameSite: "Strict" });
        const user = jwtDecode(token);
        set({ token, user, isLoggedIn: true, loading: false });
        toast.success(res.data.message || "Logged in successfully");
        return { success: true, data: res.data };
      } else {
        set({ loading: false });
        toast.error(res.data?.message || "Login failed");
        return { success: false, error: res.error || res.data };
      }
    } catch (err) {
      set({ loading: false });
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed";
      toast.error(msg);
      return { success: false, error: err };
    }
  },

  logout: async () => {
    try {
      // Again, withCredentials is not needed here
      await apiLogout();
    } catch (e) {
      // ignore errors
    }
    Cookies.remove("token");
    set({ token: null, user: null, isLoggedIn: false });
    toast.success("Logged out");
  },

  // This method becomes unnecessary due to the interceptor
  refreshToken: async () => {
    // This is handled by the axios interceptor now.
    // The only place this logic should exist is in the API interceptor.
  },
}));

export default useAuthStore;
