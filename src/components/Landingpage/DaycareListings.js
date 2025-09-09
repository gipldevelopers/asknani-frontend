// components/DaycareListings.js
"use client";
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Filter, Star, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
];

const daycares = [
  {
    id: 1,
    name: "Sunshine Kids Daycare",
    rating: 4.8,
    reviewCount: 124,
    price: "₹800/day",
    location: "Bandra, Mumbai",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Playground", "Educational Programs", "Meals Included"],
    city: "Mumbai"
  },
  {
    id: 2,
    name: "Little Explorers Academy",
    rating: 4.9,
    reviewCount: 98,
    price: "₹950/day",
    location: "Whitefield, Bangalore",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
    features: ["STEM Curriculum", "Outdoor Activities", "Flexible Hours"],
    city: "Bangalore"
  },
  {
    id: 3,
    name: "Happy Tots Childcare",
    rating: 4.7,
    reviewCount: 87,
    price: "₹700/day",
    location: "Saket, Delhi",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Arts & Crafts", "Nap Rooms", "Security Cameras"],
    city: "Delhi"
  },
  {
    id: 4,
    name: "Bright Beginnings Center",
    rating: 4.6,
    reviewCount: 112,
    price: "₹850/day",
    location: "Gachibowli, Hyderabad",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Multilingual Staff", "Music Classes", "Organic Meals"],
    city: "Hyderabad"
  },
  {
    id: 5,
    name: "Tiny Steps Preschool",
    rating: 4.5,
    reviewCount: 76,
    price: "₹750/day",
    location: "Adyar, Chennai",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
    features: ["Yoga Classes", "Nutritious Food", "Safe Environment"],
    city: "Chennai"
  },
  {
    id: 6,
    name: "Rainbow Kids Zone",
    rating: 4.9,
    reviewCount: 135,
    price: "₹900/day",
    location: "Salt Lake, Kolkata",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Indoor Play Area", "Learning Toys", "Trained Staff"],
    city: "Kolkata"
  },
  {
    id: 7,
    name: "Little Angels Daycare",
    rating: 4.7,
    reviewCount: 92,
    price: "₹820/day",
    location: "Koregaon Park, Pune",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Creative Activities", "Safe Transport", "Regular Updates"],
    city: "Pune"
  },
  {
    id: 8,
    name: "Blossom Childcare",
    rating: 4.8,
    reviewCount: 105,
    price: "₹780/day",
    location: "Navrangpura, Ahmedabad",
    image: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    features: ["Air Conditioned", "CCTV Monitoring", "Learning Materials"],
    city: "Ahmedabad"
  }
];

export default function DaycareListings() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredDaycares, setFilteredDaycares] = useState(daycares);
  const searchRef = useRef(null);

  // Handle click outside to collapse search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter daycares based on search and city
  useEffect(() => {
    let results = daycares;

    if (selectedCity !== 'All Cities') {
      results = results.filter(daycare => daycare.city === selectedCity);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(daycare =>
        daycare.name.toLowerCase().includes(query) ||
        daycare.location.toLowerCase().includes(query) ||
        daycare.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    setFilteredDaycares(results);
  }, [searchQuery, selectedCity]);

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Recommended Daycares
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}

            {/* City Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{selectedCity}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilters(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-20 w-48">
                    <div className="font-medium text-gray-700 mb-2">Select City</div>
                    <div className="max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCity('All Cities');
                          setShowFilters(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md ${selectedCity === 'All Cities' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        All Cities
                      </button>
                      {indianCities.map(city => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setShowFilters(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-md ${selectedCity === city ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Map View Button
        <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Filter size={16} />
          <span>More Filters</span>
        </button> */}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {filteredDaycares.length} daycare{filteredDaycares.length !== 1 ? 's' : ''} found
          {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
          {searchQuery && ` for "${searchQuery}"`}
        </div>

        {/* Daycare Cards */}
        {filteredDaycares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDaycares.map(daycare => (
              <div key={daycare.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                {/* Image Section */}
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  <img
                    src={daycare.image}
                    alt={daycare.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center text-amber-600 text-sm font-medium shadow-sm">
                    <Star size={14} className="fill-amber-400 mr-1" />
                    {daycare.rating}
                  </div>
                </div>

                {/* Content Section - Scrollable if needed */}
                <div className="p-4 flex flex-col flex-grow overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{daycare.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{daycare.location}</span>
                  </div>
                  <p className="text-lg font-bold text-primary mb-3">{daycare.price}</p>

                  {/* Scrollable Features Section */}
                  <div className="mb-4 overflow-y-auto max-h-32 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {daycare.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Additional Info (if any) */}
                    <div className="mt-3 text-sm text-gray-600">
                      <p>✓ Safe & secure environment</p>
                      <p>✓ Certified caretakers</p>
                      <p>✓ Daily activity reports</p>
                      <p>✓ Regular health checkups</p>
                    </div>
                  </div>
                </div>

                {/* Sticky Button at Bottom */}
                <div className="p-4 pt-0 mt-auto sticky bottom-0 bg-white border-t border-gray-100">
                  <Link href={`/daycares/${daycare.id}`}>

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
            <h3 className="text-xl font-medium text-gray-700 mb-2">No daycares found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {filteredDaycares.length > 0 && (
          <div className="text-center mt-10">
            <button className="px-6 py-3 border border-primary text-primary rounded-full hover:bg-indigo-50 transition-colors font-medium">
              Load More Daycares
            </button>
          </div>
        )}
      </div>
    </section>
  );
}