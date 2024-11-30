import { createContext, useContext, useState, ReactNode } from 'react';
import { Tenant } from '../types/tenant.types';
import { tenantService } from '../services/tenant.service';

interface TenantContextData {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantContext = createContext<TenantContextData>({} as TenantContextData);

export function TenantProvider({ children }: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    const storedTenant = localStorage.getItem('@sisgest:tenant');
    return storedTenant ? JSON.parse(storedTenant) : null;
  });

  const setTenant = async (tenant: Tenant) => {
    try {
      const config = await tenantService.getTenantConfig();
      document.documentElement.setAttribute('data-theme', config.theme);
      localStorage.setItem('@sisgest:tenant', JSON.stringify(tenant));
      setCurrentTenant(tenant);
    } catch (error) {
      console.error('Error setting tenant:', error);
    }
  };

  const clearTenant = () => {
    localStorage.removeItem('@sisgest:tenant');
    setCurrentTenant(null);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setTenant,
        clearTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
} 