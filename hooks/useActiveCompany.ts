'use client'

import { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useClientContext } from '@/components/context/ClientContext';

export const useActiveCompany = () => {
    const { user } = useSession();
    const { isGlobalAdmin, companiesList, setSelectedCompany } = useFeatureAccess();
    const { selectedCompany } = useClientContext();
    const activeClient = user?.active_client ?? null;

    useEffect(() => {
        if (!isGlobalAdmin || selectedCompany || !activeClient) return;
        const active = companiesList.find((company) => company.name === activeClient);
        if (active) setSelectedCompany(active);
    }, [isGlobalAdmin, selectedCompany, activeClient, companiesList, setSelectedCompany]);

    return { activeCompanyName: selectedCompany?.name ?? activeClient };
};
