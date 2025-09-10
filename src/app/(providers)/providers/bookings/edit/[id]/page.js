'use client';

import { useState, useEffect } from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChildInformationForm from '@/app/(providers)/components/booking/ChildInformationForm';
import ParentInformationForm from '@/app/(providers)/components/booking/ParentInformationForm';
import BookingDetailsForm from '@/app/(providers)/components/booking/BookingDetailsForm';

import { useParams } from 'next/navigation';

// In a real application, this would be a function to fetch data from an API
const fetchBookingData = (id) => {
    // This is mock data for demonstration
    return {
        childInfo: {
            fullName: 'Aarav Sharma',
            age: '3',
            gender: 'male',
            dob: new Date('2020-05-15'),
            specialRequirements: 'No allergies'
        },
        parentInfo: {
            fullName: 'Rahul Sharma',
            relationship: 'Father',
            email: 'rahul@example.com',
            phone: '+91 9876543210',
            address: '123 Main St, Bangalore'
        },
        bookingDetails: {
            packageId: 'pkg1',
            days: 5,
            startDate: new Date('2023-09-01'),
            endDate: new Date('2023-09-05'),
            pickupTime: '09:00',
            dropoffTime: '17:00',
            notes: 'Please ensure nap time at 1 PM'
        }
    };
};

const packages = [
    { id: 'pkg1', name: 'Full Day Care', price: 1200 },
    { id: 'pkg2', name: 'Half Day Care', price: 800 },
    { id: 'pkg3', name: 'Weekly Package', price: 6000 },
    { id: 'pkg4', name: 'After School Care', price: 700 }
];

const EditBookingPage = () => {
    const params = useParams();
    const bookingId = params.id;
    const [loading, setLoading] = useState(true);

    const [childInfo, setChildInfo] = useState(null);
    const [parentInfo, setParentInfo] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        const data = fetchBookingData(bookingId);
        setChildInfo(data.childInfo);
        setParentInfo(data.parentInfo);
        setBookingDetails(data.bookingDetails);
        setLoading(false);
    }, [bookingId]);

    const calculateTotal = () => {
        if (!bookingDetails) return 0;
        const selectedPackage = packages.find(pkg => pkg.id === bookingDetails.packageId);
        if (!selectedPackage) return 0;
        return selectedPackage.price * (bookingDetails.days || 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!childInfo || !parentInfo || !bookingDetails) return;
        const bookingData = {
            childInfo,
            parentInfo,
            bookingDetails,
            total: calculateTotal()
        };
        console.log(`Updated booking (ID: ${bookingId}) data:`, bookingData);
        alert('Booking updated successfully!');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Booking</h1>
                <p className="text-muted-foreground">Update booking details for a child (ID: {bookingId})</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ChildInformationForm childInfo={childInfo} onChange={setChildInfo} />
                <ParentInformationForm parentInfo={parentInfo} onChange={setParentInfo} />
                <BookingDetailsForm bookingDetails={bookingDetails} onChange={setBookingDetails} packages={packages} />
                
                <Card>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button">Cancel</Button>
                        <Button type="submit">Update Booking</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default EditBookingPage;