'use client'

import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import ClientSelectorComponent from '@/components/profile/ClientSelectorComponent'

export default function AlertsClientSelector() {
    const { isGlobalAdmin, connectionData, currentPlanName } = useFeatureAccess()
    
    if (!isGlobalAdmin) return null;

    const clientName = connectionData?.client || '...';

    return (
        <div className="flex flex-col items-end">
            <ClientSelectorComponent />
            <p className="text-xs text-gray-500 mt-1">
                Visualizando: {clientName} (Plan: {currentPlanName?.toUpperCase()})
            </p>
        </div>
    )
}