// components/Landingpage/DaycareListings.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Star, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DaycaresServices } from "@/lib/DaycaresServices";

export default function DaycareListings() {
  const router = useRouter();
  const searchRef = useRef(null);

  const [daycares, setDaycares] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await DaycaresServices.getCities();
        setCities(response.data.cities || []);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch daycares
  useEffect(() => {
    const fetchDaycares = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCity !== "All Cities") params.city = selectedCity;

        const response = await DaycaresServices.searchDaycares(params);
        setDaycares(response.data.daycares || []);
      } catch (err) {
        console.error("Failed to fetch daycares", err);
        setError("Failed to load daycares");
      } finally {
        setLoading(false);
      }
    };

    fetchDaycares();
  }, [searchQuery, selectedCity]);

  // Close city dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Recommended Daycares
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* City Filter */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{selectedCity}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showCityDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCityDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCityDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-20 w-48 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setShowCityDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md ${
                        selectedCity === "All Cities"
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All Cities
                    </button>
                    {cities.map((city) => (
                      <button
                        key={city.city}
                        onClick={() => {
                          setSelectedCity(city.city);
                          setShowCityDropdown(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          selectedCity === city.city
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {city.city} ({city.approved_daycares_count})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-full sm:w-64">
              <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search daycares..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {loading
            ? "Loading daycares..."
            : `${daycares.length} daycare${
                daycares.length !== 1 ? "s" : ""
              } found${
                selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""
              }${searchQuery ? ` for "${searchQuery}"` : ""}`}
        </div>

        {/* Daycare Cards */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : daycares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {daycares.map((d) => (
              <div
                key={d.id}
                onClick={() => router.push(`/daycares/${d.slug}`)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 flex flex-col cursor-pointer"
              >
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${d.featured_photo}`}
                    alt={d.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center text-amber-600 text-sm font-medium shadow-sm">
                    <Star size={14} className="fill-amber-400 mr-1" />
                    {d.rating || 0}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {d.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{d.city}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {d.short_desc}
                  </p>
                </div>

                <div className="p-4 pt-0 mt-auto sticky bottom-0 bg-white border-t border-gray-100">
                  <Link href={`/daycares/${d.slug}`}>
                    <button className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary transition-colors font-medium text-sm shadow-md">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No daycares found
            </h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </section>
  );
}
