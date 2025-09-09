import { create } from "zustand";

const useUIStore = create((set) => ({
    // 🔹 Navbar States
    isProfileOpen: false,
    isMobileMenuOpen: false,
    isCityDropdownOpen: false,
    isMobileSearchOpen: false,
    selectedCity: "New Delhi",
    citySearchQuery: "",
    unreadCount: 3, // demo

    // 🔹 Auth State (later replace with real auth integration)
    isLoggedIn: true,

    // 🔹 Actions
    toggleProfile: () => set((state) => ({ isProfileOpen: !state.isProfileOpen })),
    closeProfile: () => set({ isProfileOpen: false }),

    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),

    toggleCityDropdown: () => set((state) => ({ isCityDropdownOpen: !state.isCityDropdownOpen })),
    closeCityDropdown: () => set({ isCityDropdownOpen: false }),

    toggleMobileSearch: () => set((state) => ({ isMobileSearchOpen: !state.isMobileSearchOpen })),
    closeMobileSearch: () => set({ isMobileSearchOpen: false }),

    setSelectedCity: (city) => set({ selectedCity: city, isCityDropdownOpen: false, citySearchQuery: "" }),
    setCitySearchQuery: (query) => set({ citySearchQuery: query }),

    setUnreadCount: (count) => set({ unreadCount: count }),
    setAuth: (status) => set({ isLoggedIn: status }),
}));

export default useUIStore;
