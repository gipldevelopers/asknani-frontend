"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  SlidersHorizontal,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useSearchStore from "@/stores/SearchStore";

// ===========================================
//             HELPER FUNCTIONS
// ===========================================
const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ===========================================
//             MAIN COMPONENT
// ===========================================
export default function DaycareListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Zustand store
  const {
    // States
    results,
    featuredDaycares,
    cities,
    facilities,
    loading,
    error,
    hasSearched,

    // Filter states
    searchQuery,
    selectedCity,
    selectedCategories,
    minRating,
    maxPrice,
    sortBy,

    // Actions
    setSearchQuery,
    setSelectedCity,
    setSelectedCategories,
    setMinRating,
    setMaxPrice,
    setSortBy,
    toggleCategory,
    clearFilters,
    fetchInitialData,
    fetchResults,
  } = useSearchStore();

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounced search
  const debouncedSearch = useDebouncedValue(searchQuery, 250);

  // Discovery carousels refs
  const citiesScrollRef = useRef(null);
  const categoriesScrollRef = useRef(null);

  // Initialize data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Sync URL and trigger search when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    if (minRating > 0) params.set("rating", String(minRating));
    if (maxPrice < 1000) params.set("price", String(maxPrice));
    if (sortBy !== "relevance") params.set("sort", sortBy);

    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });

    // Trigger search with debounce
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    debouncedSearch,
    selectedCity,
    selectedCategories,
    minRating,
    maxPrice,
    sortBy,
    router,
    fetchResults,
    searchQuery,
  ]);

  // Parse initial filters from URL on mount
  useEffect(() => {
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const categories = searchParams.get("categories");
    const rating = searchParams.get("rating");
    const price = searchParams.get("price");
    const sort = searchParams.get("sort");

    if (search) setSearchQuery(search);
    if (city) setSelectedCity(city);
    if (categories) setSelectedCategories(categories.split(","));
    if (rating) setMinRating(Number(rating));
    if (price) setMaxPrice(Number(price));
    if (sort) setSortBy(sort);
  }, [
    searchParams,
    setSearchQuery,
    setSelectedCity,
    setSelectedCategories,
    setMinRating,
    setMaxPrice,
    setSortBy,
  ]);

  // Derived: are we currently filtering/searching?
  const isFiltering = useMemo(() => {
    return (
      (searchQuery && searchQuery.trim().length > 0) ||
      selectedCity !== "All Cities" ||
      selectedCategories.length > 0 ||
      minRating > 0 ||
      maxPrice < 1000
    );
  }, [searchQuery, selectedCity, selectedCategories, minRating, maxPrice]);

  // Infinite load (button + intersection)
  const loadMoreRef = useRef(null);
  useEffect(() => {
    setVisibleCount(12); // reset when filters change
  }, [
    searchQuery,
    selectedCity,
    selectedCategories,
    minRating,
    maxPrice,
    sortBy,
  ]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || loading) return;

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < results.length) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((v) => v + 12);
          setLoadingMore(false);
        }, 250);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [results.length, visibleCount, loading]);

  // Favorites (persist to localStorage)
  const [favs, setFavs] = useState(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("fav_daycares");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("fav_daycares", JSON.stringify(Array.from(favs)));
    } catch {}
  }, [favs]);

  const toggleFav = (id) =>
    setFavs((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleClearFilters = () => {
    clearFilters();
    setShowFilters(false);
  };

  const scrollHoriz = (ref, dir) => {
    if (!ref.current) return;
    const amt = dir === "left" ? -280 : 280;
    ref.current.scrollBy({ left: amt, behavior: "smooth" });
  };

  const Count = results.length;
  const showing = Math.min(visibleCount, Count);

  // Format city names for display
  const cityNames = cities.map((city) => city.name);
  const allCities = ["All Cities", ...cityNames];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------ STICKY HEADER ------------------ */}
      <ListingsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowFilters={setShowFilters}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        minRating={minRating}
        setMinRating={setMinRating}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        handleClearFilters={handleClearFilters}
        isFiltering={isFiltering}
        Count={Count}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* ---------------------------------------------------- */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state - Initial Load */}
        {loading && !hasSearched && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Discovery rows (show only when no filtering is active) */}
        {!isFiltering && !loading && (
          <>
            {/* Cities carousel */}
            {cities.length > 0 && (
              <section className="space-y-6 mb-8">
                <Card
                  title="Browse by City"
                  action={
                    <div className="flex gap-2">
                      <IconButton
                        aria-label="Scroll cities left"
                        onClick={() => scrollHoriz(citiesScrollRef, "left")}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </IconButton>
                      <IconButton
                        aria-label="Scroll cities right"
                        onClick={() => scrollHoriz(citiesScrollRef, "right")}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </IconButton>
                    </div>
                  }
                >
                  <div
                    ref={citiesScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                  >
                    {allCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                          selectedCity === city
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* Features carousel */}
            {facilities.length > 0 && (
              <section className="space-y-6 mb-8">
                <Card title="Popular Features">
                  <div
                    ref={categoriesScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                  >
                    {facilities.map((facility) => (
                      <button
                        key={facility}
                        onClick={() => toggleCategory(facility)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                          selectedCategories.includes(facility)
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* Featured daycares */}
            {featuredDaycares.length > 0 && (
              <section className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured & Top Picks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredDaycares.slice(0, 6).map((d) => (
                    <FeaturedCard
                      key={d.id}
                      d={d}
                      favs={favs}
                      onFav={toggleFav}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Horizontal line separator */}
            <div className="border-t border-gray-200 my-8"></div>
          </>
        )}

        {/* Results section */}
        <section>
          {/* Results: Loading during search */}
          {loading && hasSearched ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : Count > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.slice(0, showing).map((d) => (
                    <ResultCard
                      key={d?.id}
                      d={d}
                      favs={favs}
                      onFav={toggleFav}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col divide-y rounded-2xl bg-white shadow-xl border border-gray-100">
                  {results.slice(0, showing).map((d) => (
                    <CompactRow
                      key={d.id}
                      d={d}
                      favs={favs}
                      onFav={toggleFav}
                    />
                  ))}
                </div>
              )}

              {/* Infinite load trigger */}
              {showing < Count && (
                <div className="flex justify-center mt-10">
                  <button
                    ref={loadMoreRef}
                    onClick={() => setVisibleCount((v) => v + 12)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2 text-base text-gray-700 hover:bg-gray-100 transition"
                    disabled={loadingMore}
                  >
                    {loadingMore && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}{" "}
                    Load more ({Count - showing} remaining)
                  </button>
                </div>
              )}
            </>
          ) : hasSearched && !loading ? (
            <EmptyState
              onReset={handleClearFilters}
              isFiltering={isFiltering}
            />
          ) : null}
        </section>
      </main>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Filter Daycares</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* City */}
                <FilterSection title="City">
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {allCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Minimum Rating">
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`rounded-lg px-3 py-2 text-sm transition ${
                          minRating === r
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {r === 0 ? "Any" : `${r}+ ⭐`}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Price */}
                <FilterSection title={`Max Price per Day: ₹${maxPrice}`}>
                  <input
                    type="range"
                    min={500}
                    max={1000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>₹500</span>
                    <span className="font-medium text-indigo-600">
                      ₹{maxPrice}
                    </span>
                    <span>₹1000+</span>
                  </div>
                </FilterSection>

                {/* Features */}
                {facilities.length > 0 && (
                  <FilterSection title="Features">
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility) => (
                        <button
                          key={facility}
                          onClick={() => toggleCategory(facility)}
                          className={`rounded-full px-3 py-1.5 text-xs transition ${
                            selectedCategories.includes(facility)
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {facility}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Sort */}
                <FilterSection title="Sort by">
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </FilterSection>

                {/* Actions */}
                <div className="sticky bottom-0 mt-8 flex gap-3 bg-white py-4 border-t border-gray-100">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for scrollbar and range input */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #4f46e5; /* indigo-600 */
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #4f46e5; /* indigo-600 */
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

// ===========================================
//             UI ATOMS & SUB-COMPONENTS
// ===========================================

// --- 1. ListingsHeader (Extracted Sticky Header) ---
function ListingsHeader({
  searchQuery,
  setSearchQuery,
  setShowFilters,
  selectedCity,
  setSelectedCity,
  selectedCategories,
  toggleCategory,
  minRating,
  setMinRating,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  handleClearFilters,
  isFiltering,
  Count,
  viewMode,
  setViewMode,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              aria-label="Search daycares"
              type="text"
              placeholder="Search by name, area or feature"
              className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="shrink-0 inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition"
            aria-label="Open filter settings"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters{" "}
            {isFiltering && (
              <span className="text-indigo-600 font-semibold">
                (
                {(searchQuery ? 1 : 0) +
                  (selectedCity !== "All Cities" ? 1 : 0) +
                  selectedCategories.length +
                  (minRating > 0 ? 1 : 0) +
                  (maxPrice < 1000 ? 1 : 0)}
                )
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {(isFiltering || Count > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {selectedCity !== "All Cities" && (
              <Chip onClear={() => setSelectedCity("All Cities")}>
                {selectedCity}
              </Chip>
            )}
            {selectedCategories.map((c) => (
              <Chip key={c} onClear={() => toggleCategory(c)}>
                {c}
              </Chip>
            ))}
            {minRating > 0 && (
              <Chip onClear={() => setMinRating(0)}>{minRating}+ ⭐</Chip>
            )}
            {maxPrice < 1000 && (
              <Chip onClear={() => setMaxPrice(1000)}>≤ ₹{maxPrice}/day</Chip>
            )}

            {/* Clear All button */}
            {isFiltering && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2 ml-auto p-1 px-2 rounded-full hover:bg-indigo-50 transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Secondary Bar with Count, Sort, and View Mode */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            {isFiltering
              ? `${Count} search result${Count !== 1 ? "s" : ""}`
              : `${Count} Daycares available`}
            {selectedCity !== "All Cities" && ` in ${selectedCity}`}
          </h2>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="sort"
                className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-gray-300 p-1 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md px-2 py-1 text-sm transition ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Switch to grid view"
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md px-2 py-1 text-sm transition ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Switch to compact list view"
              >
                Compact
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- 2. Chip (Active Filter Tag) ---
function Chip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/70 border border-indigo-200 px-3 py-1 text-xs text-indigo-800 font-medium">
      {children}
      <button
        aria-label="Remove filter"
        className="rounded-full p-0.5 ml-0.5 hover:bg-indigo-200 transition"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// --- 3. Card (General Container for Discovery) ---
function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// --- 4. IconButton (For Carousels) ---
function IconButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition"
      {...props}
    >
      {children}
    </button>
  );
}

// --- 5. RatingStars ---
function RatingStars({ rating }) {
  const safeRating = rating || 0;
  const full = Math.floor(safeRating);
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < full ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}

// --- 6. FeaturedCard (For Discovery Section) ---
function FeaturedCard({ d, favs, onFav }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition hover:shadow-xl">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          fill
          src={d.image || "/placeholder-daycare.jpg"}
          alt={d.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={true} // Priority for discovery items (above the fold)
        />
        <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
          Featured
        </span>
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-lg transition hover:scale-110 ${
            favs.has(d.id) ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-lg font-bold text-gray-900">
            {d.name}
          </h4>
          <span className="text-lg font-bold text-indigo-600 shrink-0">
            ₹{d.price || "₹0/day"}
          </span>
        </div>
        <div className="mb-2 flex items-center text-sm text-gray-600">
          <MapPin className="mr-1 h-4 w-4" /> {d.location || d.city}
        </div>
        <div className="flex items-center justify-between">
          <RatingStars rating={d.rating} />
          <span className="text-xs text-gray-500">
            ({d.reviewCount || 0} Reviews)
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 7. ResultCard (Grid View) ---
function ResultCard({ d, favs, onFav }) {
  // Safely extract features/facilities - adjust based on your actual API structure
  const getFeatures = () => {
    // Try different possible locations for features/facilities
    const features = d.facilities || d.features || d.tags || [];

    // If features is an array of objects, extract names
    if (features.length > 0 && typeof features[0] === "object") {
      return features
        .map((f) => f.name || f.title || f.facility_name || JSON.stringify(f))
        .slice(0, 3);
    }

    // If features is an array of strings, use as-is
    return features.slice(0, 3);
  };

  const displayFeatures = getFeatures();
  const totalFeatures = d.facilities || d.features || d.tags || [];
  const remainingCount = totalFeatures.length - displayFeatures.length;

  // Safely get image URL - adjust based on your photos array
  const getImageUrl = () => {
    // If there's a featured_photo field
    if (d.featured_photo) {
      if (typeof d.featured_photo === "string") {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${d.featured_photo}`;
      }
      if (typeof d.featured_photo === "object") {
        return (
          d.featured_photo.url ||
          d.featured_photo.image_path ||
          "/placeholder-daycare.jpg"
        );
      }
    }

    // If there's a photos array, use the first photo
    if (d.photos && d.photos.length > 0) {
      const firstPhoto = d.photos[0];
      if (typeof firstPhoto === "string") {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${firstPhoto}`;
      }
      if (typeof firstPhoto === "object") {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${firstPhoto.image_path}`;
      }
    }

    return "/placeholder-daycare.jpg";
  };

  // Get location display text
  const getLocation = () => {
    if (d.location) return d.location;
    if (d.city && typeof d.city === "object") return d.city.name;
    if (d.city) return d.city;
    return "Location not specified";
  };

  // Get price - adjust based on your API structure
  const getPrice = () => {
    return d.price || d.daily_rate || d.rate || "0";
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-xl">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          fill
          src={getImageUrl()}
          alt={d.name || "Daycare"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {d.isFeatured ||
          (d.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              Featured
            </span>
          ))}
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-110 ${
            favs.has(d.id) ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
            {d.name || "Unnamed Daycare"}
          </h3>
          <p className="shrink-0 text-xl font-bold text-indigo-600">
            ₹{getPrice()}/day
          </p>
        </div>
        <div className="mb-2 flex items-center text-sm text-gray-600">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{getLocation()}</span>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <RatingStars rating={d.rating} />
          <span className="text-xs text-gray-500">
            ({d.reviewCount || d.reviews_count || 0} reviews)
          </span>
        </div>
        {displayFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {displayFeatures.map((f, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {f}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/daycares/${d.slug || d.id}`}>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-md">
              View details
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

// --- 8. CompactRow (List View) ---
function CompactRow({ d, favs, onFav }) {
  return (
    <article className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
      <div className="relative h-20 w-24 overflow-hidden rounded-lg shrink-0">
        <Image
          fill
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${d.featured_photo}`}
          alt={d.name}
          className="h-full w-full object-cover"
          sizes="96px"
        />
        {d.isFeatured && (
          <span className="absolute left-1 top-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Featured
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-base font-bold text-gray-900">
            {d.name}
          </h3>
          <p className="shrink-0 text-base font-bold text-indigo-600">
            ₹{d.price || "₹0/day"}
          </p>
        </div>
        <div className="mt-0.5 flex items-center text-xs text-gray-600">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <span className="truncate">{d.location || d.city}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
          <RatingStars rating={d.rating} />
          <span>({d.reviewCount || 0})</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`rounded-full border p-2 hover:bg-gray-100 transition ${
            favs.has(d.id) ? "text-red-500" : "text-gray-600 hover:text-red-400"
          }`}
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
        <Link href={`/daycares/${d.slug || d.id}`}>
          <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 shadow-sm transition">
            View
          </button>
        </Link>
      </div>
    </article>
  );
}

// --- 9. EmptyState (For No Results) ---
function EmptyState({ onReset, isFiltering }) {
  return (
    <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-lg">
      <Search className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-xl font-bold text-gray-800">
        {isFiltering
          ? "No Daycares Match Your Filters"
          : "No Daycares Available"}
      </h3>
      <p className="mt-2 text-base text-gray-600">
        {isFiltering
          ? "The current search and filters returned no results. Try removing some criteria, checking your spelling, or broadening your search area."
          : "There are currently no daycares listed on the platform. Please check back later!"}
      </p>
      {isFiltering && (
        <button
          onClick={onReset}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-base font-medium text-white hover:bg-indigo-700 transition shadow-md"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

// --- 10. FilterSection (Mobile Filter Wrapper) ---
function FilterSection({ title, children }) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-gray-700">
        {title}
      </label>
      {children}
    </div>
  );
}
