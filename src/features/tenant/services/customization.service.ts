import { CustomField, Tenant } from '../types/tenant.types';

export interface CustomizationConfig {
    fields: { [entity: string]: CustomField[] };
    theme: {
        primary: string;
        logo?: string;
    };
}

class CustomizationService {
    private storageKey = '@sisgest:customization';

    async getCustomizationConfig(tenant: Tenant): Promise<CustomizationConfig> {
        const storedConfig = localStorage.getItem(`${this.storageKey}:${tenant.id}`);
        if (storedConfig) {
            return JSON.parse(storedConfig);
        }

        // Configuração padrão
        const defaultConfig: CustomizationConfig = {
            fields: {
                default: tenant.settings.customFields
            },
            theme: {
                primary: tenant.settings.theme.primaryColor,
                logo: tenant.settings.theme.logo
            }
        };

        localStorage.setItem(`${this.storageKey}:${tenant.id}`, JSON.stringify(defaultConfig));
        return defaultConfig;
    }

    async validateCustomFields(tenant: Tenant, entity: string, data: any): Promise<void> {
        const config = await this.getCustomizationConfig(tenant);
        const fields = config.fields[entity] || [];

        for (const field of fields) {
            if (field.required && !data[field.id]) {
                throw new Error(`Campo personalizado obrigatório: ${field.label}`);
            }

            if (data[field.id]) {
                switch (field.type) {
                    case 'number':
                        if (isNaN(Number(data[field.id]))) {
                            throw new Error(`Campo ${field.label} deve ser um número`);
                        }
                        break;
                    case 'date':
                        if (isNaN(Date.parse(data[field.id]))) {
                            throw new Error(`Campo ${field.label} deve ser uma data válida`);
                        }
                        break;
                }
            }
        }
    }
}

export const customizationService = new CustomizationService(); 