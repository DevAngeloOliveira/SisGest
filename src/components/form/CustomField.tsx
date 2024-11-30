import { CustomField as ICustomField } from '../../features/tenant/types/tenant.types';

interface CustomFieldProps {
    field: ICustomField;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

export function CustomField({ field, value, onChange, error }: CustomFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = field.type === 'number' ? Number(e.target.value) : e.target.value;
        onChange(newValue);
    };

    const renderField = () => {
        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <input
                        type={field.type}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                    />
                );
            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Selecione...</option>
                        {field.options?.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        required={field.required}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField()}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
} 