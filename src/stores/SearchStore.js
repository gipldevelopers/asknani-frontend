// stores/SearchStore.js
import { create } from "zustand";
import { DaycaresServices } from "@/lib/DaycaresServices";

const useSearchStore = create((set, get) => ({
  // States
  results: [],
  featuredDaycares: [],
  topDaycares: [],
  cities: [],
  facilities: [], // For frontend categories
  loading: false,
  error: null,
  hasSearched: false,

  // Filter states
  searchQuery: "",
  selectedCity: "All Cities",
  selectedCategories: [],
  minRating: 0,
  maxPrice: 1000,
  sortBy: "relevance",

  // Actions
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedCategories: (cats) => set({ selectedCategories: cats }),
  setMinRating: (r) => set({ minRating: r }),
  setMaxPrice: (p) => set({ maxPrice: p }),
  setSortBy: (sort) => set({ sortBy: sort }),

  // Toggle single category
  toggleCategory: (category) => {
    const { selectedCategories, fetchResults } = get();
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    set({ selectedCategories: newCategories });
    fetchResults(); // Auto-search when toggling categories
  },

  // Clear all filters
  clearFilters: () => {
    set({
      searchQuery: "",
      selectedCity: "All Cities",
      selectedCategories: [],
      minRating: 0,
      maxPrice: 1000,
      sortBy: "relevance",
    });
  },

  // Fetch initial data (cities, featured, top daycares)
  fetchInitialData: async () => {
    set({ loading: true });

    try {
      const [citiesRes, featuredRes, topRes] = await Promise.all([
        DaycaresServices.getCities(),
        DaycaresServices.getFeaturedDaycares(),
        DaycaresServices.getTopDaycares(),
      ]);

      // Extract unique facilities from featured daycares for categories
      const allFacilities =
        featuredRes.data.daycares?.flatMap((d) => d.facilities || []) || [];
      const uniqueFacilities = [...new Set(allFacilities)];

      set({
        cities: citiesRes.data.cities || [],
        featuredDaycares: featuredRes.data.daycares || [],
        topDaycares: topRes.data.daycares || [],
        facilities: uniqueFacilities,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load initial data",
        loading: false,
      });
    }
  },

  // Search with debouncing support
  fetchResults: async () => {
    const {
      searchQuery,
      selectedCity,
      selectedCategories,
      minRating,
      maxPrice,
      sortBy,
      cities,
    } = get();

    // Don't search if no meaningful filters are applied
    if (
      !searchQuery &&
      selectedCity === "All Cities" &&
      selectedCategories.length === 0 &&
      minRating === 0 &&
      maxPrice === 1000
    ) {
      set({ results: [], hasSearched: false });
      return;
    }

    set({ loading: true, error: null, hasSearched: true });

    try {
      // Convert city name to ID if needed
      let cityId = undefined;
      if (selectedCity !== "All Cities") {
        const city = cities.find((c) => c.name === selectedCity);
        cityId = city?.id;
      }

      const params = {
        search: searchQuery || undefined,
        city_id: cityId,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        min_rating: minRating > 0 ? minRating : undefined,
        max_price: maxPrice < 1000 ? maxPrice : undefined,
        sort: sortBy !== "relevance" ? sortBy : undefined,
      };

      // Clean undefined params
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const response = await DaycaresServices.searchDaycares(params);

      set({
        results: response.data.daycares || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Search failed",
        loading: false,
        results: [],
      });
    }
  },

  // Get single daycare details
  fetchDaycareDetails: async (slug) => {
    set({ loading: true });
    try {
      const response = await DaycaresServices.getDaycare(slug);
      return response.data.daycare;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load daycare details",
        loading: false,
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSearchStore;
