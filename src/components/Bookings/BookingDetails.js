import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function BookingDetails({ booking }) {
  if (!booking) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No booking selected
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      {/* Header */}

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{booking.childName}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span>{booking.date}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-gray-500" />
          <span>{booking.time}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span>{booking.address}</span>
        </div>

        {booking.reason && booking.status === "cancelled" && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <XCircle className="h-5 w-5" />
            <span>{booking.reason}</span>
          </div>
        )}

        {booking.status === "completed" && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Visit completed successfully</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        {booking.status === "upcoming" && (
          <>
            <button className="px-4 py-2 text-sm rounded-lg border text-gray-700 hover:bg-gray-100">
              Cancel Booking
            </button>
            <button className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-hover">
              Reschedule
            </button>
          </>
        )}
      </div>
    </div>
  );
}
