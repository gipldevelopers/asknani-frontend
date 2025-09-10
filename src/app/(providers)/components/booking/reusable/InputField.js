import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false, icon: Icon }) => {
    return (
        <div className="space-y-2">
            <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                <Input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={Icon ? "pl-9" : ""}
                    required={required}
                />
            </div>
        </div>
    );
};

export default InputField;