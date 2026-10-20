'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface OpenIALayoutProps {
    children: React.ReactNode;
}

export default function OpenIALayout({ children }: OpenIALayoutProps) {
    const { loading, isGlobalAdmin, connectionData, currentPlanName } = useFeatureAccess();
    const canAccessOpenai = isGlobalAdmin || connectionData.isOpenaiActive;

    return (
        <PlanAccessGate
            serviceName="OpenAI"
            loading={loading}
            canAccessFullDashboard={canAccessOpenai}
            canAccessPdfReport={canAccessOpenai}
            planName={currentPlanName}
            showPdfReport={false}
        >
            {children}
        </PlanAccessGate>
    );
}
