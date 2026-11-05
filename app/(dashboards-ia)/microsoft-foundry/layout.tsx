'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface LayoutProps {
    children: React.ReactNode;
}

export default function MicrosoftFoundryLayout({ children }: LayoutProps) {
    const { loading, canAccessFullDashboardAzure, canAccessPdfReportAzure, currentPlanName } = useFeatureAccess();

    return (
        <PlanAccessGate
            serviceName="Microsoft Foundry"
            loading={loading}
            canAccessFullDashboard={canAccessFullDashboardAzure}
            canAccessPdfReport={canAccessPdfReportAzure}
            planName={currentPlanName}
            showPdfReport={false}
        >
            {children}
        </PlanAccessGate>
    );
}
