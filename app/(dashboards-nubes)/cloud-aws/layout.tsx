'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AwsLayout({ children }: LayoutProps) {
    const { loading, canAccessFullDashboardAws, canAccessPdfReportAws, currentPlanName } = useFeatureAccess();

    return (
        <PlanAccessGate
            serviceName="Amazon Web Services"
            loading={loading}
            canAccessFullDashboard={canAccessFullDashboardAws}
            canAccessPdfReport={canAccessPdfReportAws}
            planName={currentPlanName}
        >
            {children}
        </PlanAccessGate>
    );
}
