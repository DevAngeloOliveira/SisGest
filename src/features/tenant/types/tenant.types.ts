export interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

export interface TenantTheme {
    primaryColor: string;
    logo?: string;
}

export interface TenantSettings {
    customFields: CustomField[];
    theme: TenantTheme;
}

export interface Tenant {
    id: string;
    name: string;
    domain: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
    settings: TenantSettings;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
} 