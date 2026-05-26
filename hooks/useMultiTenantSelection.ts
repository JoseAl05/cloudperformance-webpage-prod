import { useState } from 'react';

export type CloudProvider = 'azure' | 'aws' | 'gcp';

export interface MultiTenantSelection {
    azure: string[];
    aws: string[];
    gcp: string[];
}

export interface CloudAccount {
    id: string;
    alias: string;
    db: string;
}

export const useMultiTenantSelection = () => {
    const [selectedTenants, setSelectedTenants] = useState<MultiTenantSelection>({
        azure: [],
        aws: [],
        gcp: []
    });

    const toggleTenant = (cloud: CloudProvider, tenantId: string) => {
        setSelectedTenants(prev => {
            const current = prev[cloud];
            if (current.includes(tenantId)) {
                return { ...prev, [cloud]: current.filter(id => id !== tenantId) };
            }
            return { ...prev, [cloud]: [...current, tenantId] };
        });
    };

    const autoSelectIfSingle = (cloud: CloudProvider, tenants: CloudAccount[]) => {
        if (tenants.length === 1) {
            setSelectedTenants(prev => ({ ...prev, [cloud]: [tenants[0].id] }));
        }
    };

    const isTenantSelected = (cloud: CloudProvider, tenantId: string): boolean => {
        return selectedTenants[cloud].includes(tenantId);
    };

    return {
        selectedTenants,
        toggleTenant,
        autoSelectIfSingle,
        isTenantSelected
    };
};