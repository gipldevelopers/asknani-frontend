import BookingDetails from '@/components/Bookings/BookingDetails'
import React from 'react'

const page = () => {
    // Dummy booking data
    const booking = {
        id: 1,
        childName: "Aarav Sharma",
        daycareName: "Little Stars Preschool",
        address: "Bandra West, Mumbai",
        date: "2025-09-10",
        time: "10:30 AM",
        status: "upcoming", // try "completed" or "cancelled" too
        reason: "Parent requested reschedule" // only for cancelled
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <BookingDetails booking={booking} />
        </div>
    )
}

export default page
