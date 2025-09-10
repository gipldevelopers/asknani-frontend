import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IndianRupee, Plus, Minus } from 'lucide-react';
import SelectField from './reusable/SelectField';
import DatePickerField from './reusable/DatePickerField';

const packages = [
    { id: 'pkg1', name: 'Full Day Care', price: 1200 },
    { id: 'pkg2', name: 'Half Day Care', price: 800 },
    { id: 'pkg3', name: 'Weekly Package', price: 6000 },
    { id: 'pkg4', name: 'After School Care', price: 700 }
];

const BookingDetailsForm = ({ bookingDetails, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...bookingDetails, [field]: value });
    };

    const calculateTotal = () => {
        const selectedPackage = packages.find(pkg => pkg.id === bookingDetails.packageId);
        if (!selectedPackage) return 0;

        const basePrice = selectedPackage.price;
        const days = bookingDetails.days || 1;
        return basePrice * days;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
                <CardDescription>Select package and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Select Package"
                        value={bookingDetails.packageId}
                        onValueChange={(value) => handleChange('packageId', value)}
                        options={packages.map(pkg => ({
                            value: pkg.id,
                            label: `${pkg.name} - ₹${pkg.price}/day`
                        }))}
                        placeholder="Choose a package"
                        required
                    />

                    <div className="space-y-2">
                        <Label>Number of Days</Label>
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleChange('days', Math.max(1, (bookingDetails.days || 1) - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={bookingDetails.days || 1}
                                onChange={(e) => handleChange('days', parseInt(e.target.value) || 1)}
                                className="mx-2 w-16 text-center"
                                min="1"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleChange('days', (bookingDetails.days || 1) + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePickerField
                        label="Start Date"
                        date={bookingDetails.startDate}
                        onDateChange={(date) => handleChange('startDate', date)}
                        required
                    />
                    <DatePickerField
                        label="End Date"
                        date={bookingDetails.endDate}
                        onDateChange={(date) => handleChange('endDate', date)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Pickup Time"
                        value={bookingDetails.pickupTime}
                        onValueChange={(value) => handleChange('pickupTime', value)}
                        options={[
                            { value: '08:00', label: '8:00 AM' },
                            { value: '08:30', label: '8:30 AM' },
                            { value: '09:00', label: '9:00 AM' },
                            { value: '09:30', label: '9:30 AM' },
                            { value: '10:00', label: '10:00 AM' }
                        ]}
                        placeholder="Select pickup time"
                        required
                    />
                    <SelectField
                        label="Dropoff Time"
                        value={bookingDetails.dropoffTime}
                        onValueChange={(value) => handleChange('dropoffTime', value)}
                        options={[
                            { value: '16:00', label: '4:00 PM' },
                            { value: '16:30', label: '4:30 PM' },
                            { value: '17:00', label: '5:00 PM' },
                            { value: '17:30', label: '5:30 PM' },
                            { value: '18:00', label: '6:00 PM' }
                        ]}
                        placeholder="Select dropoff time"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                        placeholder="Any special instructions for this booking"
                        value={bookingDetails.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={2}
                    />
                </div>

                {bookingDetails.packageId && (
                    <Card className="bg-muted">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">Total Amount</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {bookingDetails.days || 1} day(s) × ₹{
                                            packages.find(pkg => pkg.id === bookingDetails.packageId)?.price
                                        }
                                    </p>
                                </div>
                                <div className="text-2xl font-bold flex items-center">
                                    <IndianRupee className="h-5 w-5" />
                                    {calculateTotal()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

export default BookingDetailsForm;