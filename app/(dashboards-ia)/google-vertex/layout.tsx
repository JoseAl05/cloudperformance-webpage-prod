'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface LayoutProps {
    children: React.ReactNode;
}

export default function GoogleVertexLayout({ children }: LayoutProps) {
    const { loading, canAccessFullDashboardGcp, canAccessPdfReportGcp, currentPlanName } = useFeatureAccess();

    return (
        <PlanAccessGate
            serviceName="Google Vertex AI"
            loading={loading}
            canAccessFullDashboard={canAccessFullDashboardGcp}
            canAccessPdfReport={canAccessPdfReportGcp}
            planName={currentPlanName}
            showPdfReport={false}
        >
            {children}
        </PlanAccessGate>
    );
}
