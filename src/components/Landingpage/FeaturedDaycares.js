// components/FeaturedDaycares.js
export default function FeaturedDaycares() {
const featuredDaycares = [
  {
    id: 1,
    name: "Little Blossoms Preschool",
    rating: 4.9,
    reviewCount: 156,
    price: "₹1,500/day",
    location: "Mumbai, Maharashtra",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
    badge: "Premium",
  },
  {
    id: 2,
    name: "Bright Future Kids Academy",
    rating: 4.8,
    reviewCount: 132,
    price: "₹1,200/day",
    location: "Bengaluru, Karnataka",
    image:
      "https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&fit=crop&w=1170&q=80",
    badge: "Featured",
  },
  {
    id: 3,
    name: "Happy Hearts Play School",
    rating: 4.7,
    reviewCount: 98,
    price: "₹1,000/day",
    location: "Delhi, NCR",
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1170&q=80",
    badge: "Trusted",
  },
  // {
  //   id: 4,
  //   name: "Sunshine Kids World",
  //   rating: 4.6,
  //   reviewCount: 87,
  //   price: "₹1,100/day",
  //   location: "Hyderabad, Telangana",
  //   image:
  //     "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1170&q=80",
  //   badge: "Top Rated",
  // },
];

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Featured Daycares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exceptional childcare providers with outstanding reviews
            and premium facilities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredDaycares.map((daycare) => (
            <div
              key={daycare.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={daycare.image}
                  alt={daycare.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {daycare.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                {/* Title + Rating */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {daycare.name}
                  </h3>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-semibold">{daycare.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({daycare.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Location */}
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  📍 {daycare.location}
                </p>

                {/* Price */}
                <p className="text-xl font-bold text-indigo-600 mb-4">
                  {daycare.price}
                </p>

                {/* Button */}
                <button className="mt-auto w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow">
                  Book a Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
