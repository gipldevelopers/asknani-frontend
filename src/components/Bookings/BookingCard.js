import { Calendar, Clock, MapPin, CheckCircle, XCircle, ClockIcon } from "lucide-react";

export default function BookingCard({ booking, activeTab, onAction }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-primary" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Image */}
      <img
        src={booking.image}
        alt={booking.daycareName}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{booking.daycareName}</h3>
          <span className="flex items-center text-sm">
            {getStatusIcon(booking.status)}
            <span className="ml-1 capitalize">{booking.status}</span>
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {booking.address}
        </div>

        {/* Date / Time */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {booking.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {booking.time}
          </div>
        </div>

        {/* Child */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Child:</span> {booking.childName}
        </div>

        {/* Price */}
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">₹{booking.price}</span>
          <p className="text-xs text-gray-500">per day</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t flex flex-col sm:flex-row gap-2 p-4">
        {activeTab === "upcoming" && booking.status === "confirmed" && (
          <>
            <button
              onClick={() => onAction("reschedule", booking)}
              className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Reschedule
            </button>
            <button
              onClick={() => onAction("cancel", booking)}
              className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        )}

        {activeTab === "past" && !booking.rating && (
          <button
            onClick={() => onAction("review", booking)}
            className="w-full px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-hover"
          >
            Rate & Review
          </button>
        )}
      </div>
    </div>
  );
}
