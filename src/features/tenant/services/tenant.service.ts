import { Tenant } from '../types/tenant.types';

export interface TenantConfig {
    theme: string;
    features: string[];
}

class TenantService {
    private storageKey = '@sisgest:tenant';

    async getCurrentTenant(): Promise<Tenant | null> {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    async setCurrentTenant(tenant: Tenant): Promise<void> {
        localStorage.setItem(this.storageKey, JSON.stringify(tenant));
    }

    async getTenantConfig(): Promise<TenantConfig> {
        return {
            theme: 'light',
            features: ['dashboard', 'users', 'projects']
        };
    }
}

export const tenantService = new TenantService(); 