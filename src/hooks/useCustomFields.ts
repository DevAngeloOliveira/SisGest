import { useState } from 'react';
import { useTenant } from '../features/tenant/hooks/useTenant';

export function useCustomFields() {
    const { currentTenant } = useTenant();
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fields = currentTenant?.settings?.customFields || [];

    const setValue = (fieldId: string, value: any) => {
        setValues(prev => ({
            ...prev,
            [fieldId]: value
        }));

        // Limpa o erro quando o valor é alterado
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach(field => {
            if (field.required && !values[field.id]) {
                newErrors[field.id] = `O campo ${field.label} é obrigatório`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setValues({});
        setErrors({});
    };

    return {
        fields,
        values,
        errors,
        setValue,
        validate,
        reset
    };
} 