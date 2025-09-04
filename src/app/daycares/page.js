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

// ------------------ Sample data (replace with API later) ------------------
const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const categories = [
  "Playground",
  "Educational Programs",
  "Meals Included",
  "STEM Curriculum",
  "Outdoor Activities",
  "Flexible Hours",
  "Arts & Crafts",
  "Security Cameras",
  "Music Classes",
  "Organic Meals",
];

const daycares = [
  {
    id: 1,
    name: "Sunshine Kids Daycare",
    rating: 4.8,
    reviewCount: 124,
    price: "₹800/day",
    location: "Bandra, Mumbai",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Playground", "Educational Programs", "Meals Included"],
    city: "Mumbai",
    isFeatured: true,
    isRecommended: true,
  },
  {
    id: 2,
    name: "Little Explorers Academy",
    rating: 4.9,
    reviewCount: 98,
    price: "₹950/day",
    location: "Whitefield, Bangalore",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1176&q=80",
    features: ["STEM Curriculum", "Outdoor Activities", "Flexible Hours"],
    city: "Bangalore",
    isFeatured: true,
    isRecommended: false,
  },
  {
    id: 3,
    name: "Happy Tots Childcare",
    rating: 4.7,
    reviewCount: 87,
    price: "₹700/day",
    location: "Saket, Delhi",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Arts & Crafts", "Nap Rooms", "Security Cameras"],
    city: "Delhi",
    isFeatured: false,
    isRecommended: true,
  },
  {
    id: 4,
    name: "Bright Beginnings Center",
    rating: 4.6,
    reviewCount: 112,
    price: "₹850/day",
    location: "Gachibowli, Hyderabad",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Multilingual Staff", "Music Classes", "Organic Meals"],
    city: "Hyderabad",
    isFeatured: true,
    isRecommended: false,
  },
  {
    id: 5,
    name: "Tiny Steps Preschool",
    rating: 4.5,
    reviewCount: 76,
    price: "₹750/day",
    location: "Adyar, Chennai",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1160&q=80",
    features: ["Yoga Classes", "Nutritious Food", "Safe Environment"],
    city: "Chennai",
    isFeatured: false,
    isRecommended: true,
  },
  {
    id: 6,
    name: "Rainbow Kids Zone",
    rating: 4.9,
    reviewCount: 135,
    price: "₹900/day",
    location: "Salt Lake, Kolkata",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Indoor Play Area", "Learning Toys", "Trained Staff"],
    city: "Kolkata",
    isFeatured: true,
    isRecommended: false,
  },
  {
    id: 7,
    name: "Little Angels Daycare",
    rating: 4.7,
    reviewCount: 92,
    price: "₹820/day",
    location: "Koregaon Park, Pune",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Creative Activities", "Safe Transport", "Regular Updates"],
    city: "Pune",
    isFeatured: false,
    isRecommended: true,
  },
  {
    id: 8,
    name: "Blossom Childcare",
    rating: 4.8,
    reviewCount: 105,
    price: "₹780/day",
    location: "Navrangpura, Ahmedabad",
    image:
      "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?auto=format&fit=crop&w=1170&q=80",
    features: ["Air Conditioned", "CCTV Monitoring", "Learning Materials"],
    city: "Ahmedabad",
    isFeatured: true,
    isRecommended: true,
  },
  {
    id: 9,
    name: "Kiddie Haven",
    rating: 4.4,
    reviewCount: 68,
    price: "₹720/day",
    location: "MG Road, Bangalore",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Storytelling", "Dance Classes", "Healthy Snacks"],
    city: "Bangalore",
    isFeatured: false,
    isRecommended: false,
  },
  {
    id: 10,
    name: "Tender Care Preschool",
    rating: 4.9,
    reviewCount: 142,
    price: "₹920/day",
    location: "Andheri, Mumbai",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    features: ["Early Learning", "Play-based Curriculum", "Parent App"],
    city: "Mumbai",
    isFeatured: true,
    isRecommended: true,
  },
];

// Derived discovery sections
const featuredDaycares = daycares.filter((d) => d.isFeatured);

// ------------------ Helpers ------------------
const parsePrice = (p) => {
  const num = parseInt(String(p).replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ------------------ Component ------------------
export default function DaycareListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // UI state
  const [showFilters, setShowFilters] = useState(false); // mobile sheet
  const [viewMode, setViewMode] = useState("grid"); // grid | list (compact)
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(searchQuery, 250);
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All Cities"
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("categories")?.split(",") || []
  );
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("rating")) || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("price")) || 1000
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "relevance"
  ); // relevance | price_asc | price_desc | rating

  // Discovery carousels refs
  const citiesScrollRef = useRef(null);
  const categoriesScrollRef = useRef(null);

  // Derived: are we currently filtering/searching? If yes, hide discovery/featured sections
  const isFiltering = useMemo(() => {
    return (
      (debouncedSearch && debouncedSearch.trim().length > 0) ||
      selectedCity !== "All Cities" ||
      selectedCategories.length > 0 ||
      minRating > 0 ||
      maxPrice < 1000
    );
  }, [debouncedSearch, selectedCity, selectedCategories, minRating, maxPrice]);

  // Sync URL (replace to avoid history spam)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (minRating > 0) params.set("rating", String(minRating));
    if (maxPrice < 1000) params.set("price", String(maxPrice));
    if (sortBy !== "relevance") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [debouncedSearch, selectedCity, selectedCategories, minRating, maxPrice, sortBy, router]);

  // Filtering + sorting
  const filteredDaycares = useMemo(() => {
    let results = [...daycares];

    if (selectedCity !== "All Cities") {
      results = results.filter((d) => d.city === selectedCity);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length) {
      results = results.filter((d) =>
        selectedCategories.every((c) => d.features.includes(c))
      );
    }

    if (minRating > 0) {
      results = results.filter((d) => d.rating >= minRating);
    }

    if (maxPrice < 1000) {
      results = results.filter((d) => parsePrice(d.price) <= maxPrice);
    }

    // sort
    results.sort((a, b) => {
      if (sortBy === "price_asc") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price_desc") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "rating") return b.rating - a.rating;
      // relevance (basic heuristic): rating desc then reviews desc
      return b.rating - a.rating || b.reviewCount - a.reviewCount;
    });

    return results;
  }, [debouncedSearch, selectedCity, selectedCategories, minRating, maxPrice, sortBy]);

  // Infinite load (button + intersection)
  const loadMoreRef = useRef(null);
  useEffect(() => {
    setVisibleCount(12); // reset when filters change
  }, [debouncedSearch, selectedCity, selectedCategories, minRating, maxPrice, sortBy]);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((v) => v + 12);
          setLoadingMore(false);
        }, 250);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [filteredDaycares.length]);

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
    } catch { }
  }, [favs]);
  const toggleFav = (id) =>
    setFavs((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleCategory = (c) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedCategories([]);
    setMinRating(0);
    setMaxPrice(1000);
    setSortBy("relevance");
    setShowFilters(false);
  };

  const scrollHoriz = (ref, dir) => {
    if (!ref.current) return;
    const amt = dir === "left" ? -280 : 280;
    ref.current.scrollBy({ left: amt, behavior: "smooth" });
  };

  const Count = filteredDaycares.length;
  const showing = Math.min(visibleCount, Count);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar (mobile-first) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
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

            <button
              onClick={() => setShowFilters(true)}
              className="shrink-0 inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Active filter chips */}
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
            {minRating > 0 && <Chip onClear={() => setMinRating(0)}>{minRating}+ ⭐</Chip>}
            {maxPrice < 1000 && (
              <Chip onClear={() => setMaxPrice(1000)}>≤ ₹{maxPrice}/day</Chip>
            )}
            {(debouncedSearch || selectedCity !== "All Cities" || selectedCategories.length || minRating > 0 || maxPrice < 1000) && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary underline underline-offset-2 ml-auto"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Discovery rows (hidden when filtering/searching) */}
        {!isFiltering && (
          <section className="space-y-6 mb-2">
            {/* Cities carousel */}
            <Card title="Browse by City" action={
              <div className="flex gap-2">
                <IconButton aria-label="Scroll left" onClick={() => scrollHoriz(citiesScrollRef, "left")}>
                  <ChevronLeft className="h-5 w-5" />
                </IconButton>
                <IconButton aria-label="Scroll right" onClick={() => scrollHoriz(citiesScrollRef, "right")}>
                  <ChevronRight className="h-5 w-5" />
                </IconButton>
              </div>
            }>
              <div ref={citiesScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {indianCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${selectedCity === city
                      ? "bg-primary text-white"
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
        <section className="space-y-6 mb-2">
          <Card title="Popular Features">
            <div ref={categoriesScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${selectedCategories.includes(c)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Card>
        </section>
        {!isFiltering && (
          featuredDaycares.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold mb-3">Featured Daycares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredDaycares.slice(0, 6).map((d) => (
                  <FeaturedCard key={d.id} d={d} favs={favs} onFav={toggleFav} />
                ))}
              </div>
            </section>
          )
        )}

        {/* Results header */}
        <section className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-gray-900">
              {Count} result{Count !== 1 ? "s" : ""}
              {selectedCity !== "All Cities" && ` in ${selectedCity}`}
            </h2>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="sr-only">
                Sort
              </label>
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

              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md px-2 py-1 text-sm ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md px-2 py-1 text-sm ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {Count > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDaycares.slice(0, showing).map((d) => (
                    <ResultCard key={d.id} d={d} favs={favs} onFav={toggleFav} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col divide-y rounded-xl bg-white shadow-sm border border-gray-100">
                  {filteredDaycares.slice(0, showing).map((d) => (
                    <CompactRow key={d.id} d={d} favs={favs} onFav={toggleFav} />
                  ))}
                </div>
              )}

              {/* Infinite load trigger */}
              {showing < Count && (
                <div className="flex justify-center mt-8">
                  <button
                    ref={loadMoreRef}
                    onClick={() => setVisibleCount((v) => v + 12)}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-50"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />} Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </section>
      </main>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl">
            <div className="mx-auto max-w-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-medium">City</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="All Cities">All Cities</option>
                    {indianCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Minimum rating</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`rounded-lg px-3 py-2 text-sm ${minRating === r
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Max price per day</label>
                  <input
                    type="range"
                    min={500}
                    max={1000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>₹500</span>
                    <span className="font-medium">₹{maxPrice}</span>
                    <span>₹1000</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleCategory(c)}
                        className={`rounded-full px-3 py-1.5 text-xs ${selectedCategories.includes(c)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Sort by</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 mt-4 flex gap-2 bg-white py-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #4f46e5; cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px; width: 18px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: none;
        }
      `}</style>
    </div>
  );
}

// ------------------ UI Atoms ------------------
function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
      {children}
      <button aria-label="Remove filter" className="rounded-full p-0.5 hover:bg-gray-200" onClick={onClear}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function IconButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full border p-2 hover:bg-gray-50"
      {...props}
    >
      {children}
    </button>
  );
}

function RatingStars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

function FeaturedCard({ d, favs, onFav }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={d.image} alt={d.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-medium text-white">Featured</span>
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow ${favs.has(d.id) ? "text-red-500" : "text-gray-500"
            }`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-sm font-semibold">{d.name}</h4>
          <span className="text-sm font-semibold text-primary">{d.price}</span>
        </div>
        <div className="mb-1 flex items-center text-xs text-gray-600">
          <MapPin className="mr-1 h-3.5 w-3.5" /> {d.location}
        </div>
        <div className="flex items-center justify-between">
          <RatingStars rating={d.rating} />
          <span className="text-xs text-gray-500">({d.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ d, favs, onFav }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {d.isFeatured && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-medium text-white">
            Featured
          </span>
        )}
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow ${favs.has(d.id) ? "text-red-500" : "text-gray-500"
            }`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
            {d.name}
          </h3>
          <p className="shrink-0 text-base font-bold text-primary">{d.price}</p>
        </div>
        <div className="mb-2 flex items-center text-sm text-gray-600">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{d.location}</span>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <RatingStars rating={d.rating} />
          <span className="text-xs text-gray-500">({d.reviewCount})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {d.features.slice(0, 3).map((f, i) => (
            <span key={i} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {f}
            </span>
          ))}
          {d.features.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              +{d.features.length - 3} more
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href={"/daycares/sunshine-montessori-and-daycare"}>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary">
              View details
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactRow({ d, favs, onFav }) {
  return (
    <article className="flex items-center gap-3 p-3">
      <div className="relative h-16 w-20 overflow-hidden rounded-lg">
        <img src={d.image} alt="" className="h-full w-full object-cover" />
        {d.isFeatured && (
          <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">
            Featured
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-gray-900">{d.name}</h3>
          <p className="shrink-0 text-sm font-bold text-primary">{d.price}</p>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-600">
          <RatingStars rating={d.rating} />
          <span>({d.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-center text-xs text-gray-600">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <span className="truncate">{d.location}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          aria-label="Save to favourites"
          onClick={() => onFav(d.id)}
          className={`rounded-full border p-2 hover:bg-gray-50 ${favs.has(d.id) ? "text-red-500" : "text-gray-600"
            }`}
        >
          <Heart className="h-4 w-4" />
        </button>
        <Link href={"/daycares/new-page"}>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-white hover:bg-primary">
            View
          </button>
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <Search className="mx-auto h-10 w-10 text-gray-300" />
      <h3 className="mt-3 text-lg font-semibold text-gray-800">No daycares found</h3>
      <p className="mt-1 text-sm text-gray-600">Try changing or clearing filters to see more options.</p>
      <button
        onClick={onReset}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary"
      >
        Clear all filters
      </button>
    </div>
  );
}
