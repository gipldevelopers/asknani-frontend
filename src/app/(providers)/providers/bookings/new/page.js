'use client';

import { useState } from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChildInformationForm from '@/app/(providers)/components/booking/ChildInformationForm';
import ParentInformationForm from '@/app/(providers)/components/booking/ParentInformationForm';
import BookingDetailsForm from '@/app/(providers)/components/booking/BookingDetailsForm';

const packages = [
    { id: 'pkg1', name: 'Full Day Care', price: 1200 },
    { id: 'pkg2', name: 'Half Day Care', price: 800 },
    { id: 'pkg3', name: 'Weekly Package', price: 6000 },
    { id: 'pkg4', name: 'After School Care', price: 700 }
];

const NewBookingPage = () => {
    const [childInfo, setChildInfo] = useState({
        fullName: '',
        age: '',
        gender: '',
        dob: null,
        specialRequirements: ''
    });

    const [parentInfo, setParentInfo] = useState({
        fullName: '',
        relationship: '',
        email: '',
        phone: '',
        address: ''
    });

    const [bookingDetails, setBookingDetails] = useState({
        packageId: '',
        days: 1,
        startDate: null,
        endDate: null,
        pickupTime: '',
        dropoffTime: '',
        notes: ''
    });

    const calculateTotal = () => {
        const selectedPackage = packages.find(pkg => pkg.id === bookingDetails.packageId);
        if (!selectedPackage) return 0;
        return selectedPackage.price * (bookingDetails.days || 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            childInfo,
            parentInfo,
            bookingDetails,
            total: calculateTotal()
        };
        console.log('New booking data:', bookingData);
        alert('Booking created successfully!');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create New Booking</h1>
                <p className="text-muted-foreground">Add a new booking for a child</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ChildInformationForm childInfo={childInfo} onChange={setChildInfo} />
                <ParentInformationForm parentInfo={parentInfo} onChange={setParentInfo} />
                <BookingDetailsForm bookingDetails={bookingDetails} onChange={setBookingDetails} packages={packages} />
                
                <Card>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button">Cancel</Button>
                        <Button type="submit">Create Booking</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default NewBookingPage;