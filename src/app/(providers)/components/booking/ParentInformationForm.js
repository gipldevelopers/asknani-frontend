import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputField from './reusable/InputField';
import { User, Mail, Phone } from 'lucide-react';

const ParentInformationForm = ({ parentInfo, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...parentInfo, [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
                <CardDescription>Enter details about the parent or guardian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Full Name"
                        value={parentInfo.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Parent's full name"
                        required
                        icon={User}
                    />
                    <InputField
                        label="Relationship to Child"
                        value={parentInfo.relationship}
                        onChange={(e) => handleChange('relationship', e.target.value)}
                        placeholder="Mother, Father, Guardian, etc."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Email"
                        type="email"
                        value={parentInfo.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="parent@example.com"
                        required
                        icon={Mail}
                    />
                    <InputField
                        label="Phone Number"
                        type="tel"
                        value={parentInfo.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 9876543210"
                        required
                        icon={Phone}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                        placeholder="Full address"
                        value={parentInfo.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={2}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ParentInformationForm;