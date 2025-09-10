import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const SelectField = ({ label, value, onValueChange, options, placeholder, required = false }) => {
    return (
        <div className="space-y-2">
            <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
            <Select value={value} onValueChange={onValueChange}  required={required}>
                <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectField;