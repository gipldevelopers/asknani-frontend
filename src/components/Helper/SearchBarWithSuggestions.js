"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import useSearchStore from "@/stores/SearchStore";
import Link from "next/link";

export default function SearchBarWithSuggestions({ inputClass = "" }) {
  const { searchQuery, setSearchQuery, fetchResults, results } =
    useSearchStore();
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch.trim().length > 0) {
        setSearchQuery(localSearch);
        fetchResults();
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, fetchResults, setSearchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={`flex items-center overflow-hidden shadow-sm ${inputClass}`}
      >
        <input
          type="text"
          placeholder="Search daycares, services, tags..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm focus:outline-none"
        />
        <div className="px-3 bg-indigo-50 flex items-center  justify-center">
          <Search size={18} className="text-indigo-600" />
        </div>
      </div>

      {showSuggestions && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {results.map((d) => (
            <Link
              key={d.id}
              href={`/daycares/${d.slug}`}
              className="px-4 py-3 hover:bg-indigo-50 transition flex items-center gap-3"
              onClick={() => setShowSuggestions(false)}
            >
              <img
                src={
                  process.env.NEXT_PUBLIC_BACKEND_URL +
                  "/storage/" +
                  d.featured_photo
                }
                alt={d.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium text-gray-900">{d.name}</h4>
                <p className="text-sm text-gray-500">
                  {d.city} · ⭐ {d.rating || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showSuggestions &&
        results.length === 0 &&
        localSearch.trim().length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-gray-500">
            No daycares found
          </div>
        )}
    </div>
  );
}
