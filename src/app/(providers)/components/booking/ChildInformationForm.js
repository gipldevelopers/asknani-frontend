import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputField from './reusable/InputField';
import SelectField from './reusable/SelectField';
import DatePickerField from './reusable/DatePickerField';
import { User } from 'lucide-react';

const ChildInformationForm = ({ childInfo, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...childInfo, [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Child Information</CardTitle>
                <CardDescription>Enter details about the child</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <InputField
                        label="Full Name"
                        value={childInfo.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Child's full name"
                        required
                        icon={User}
                    />
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Gender"
                        value={childInfo.gender}
                        onValueChange={(value) => handleChange('gender', value)}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' }
                        ]}
                        placeholder="Select gender"
                        
                        required
                    />
                    <DatePickerField
                        label="Date of Birth"
                        date={childInfo.dob}
                        onDateChange={(date) => handleChange('dob', date)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Special Requirements</Label>
                    <Textarea
                        placeholder="Allergies, medications, special needs, etc."
                        value={childInfo.specialRequirements}
                        onChange={(e) => handleChange('specialRequirements', e.target.value)}
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ChildInformationForm;