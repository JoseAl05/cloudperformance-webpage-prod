'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface LayoutProps {
    children: React.ReactNode;
}

export default function VcenterLayout({ children }: LayoutProps) {
    const {
        loading,
        canAccessFullDashboardVcenter,
        canAccessPdfReportVcenter,
        currentPlanName,
    } = useFeatureAccess();

    return (
        <PlanAccessGate
            serviceName="VMware vCenter"
            loading={loading}
            canAccessFullDashboard={canAccessFullDashboardVcenter}
            canAccessPdfReport={canAccessPdfReportVcenter}
            planName={currentPlanName}
            showPdfReport={false}
        >
            {children}
        </PlanAccessGate>
    );
}
