'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

interface AzureLayoutProps {
    children: React.ReactNode;
}

export default function AzureLayout({ children }: AzureLayoutProps) {
    const { loading, canAccessFullDashboardAzure, canAccessPdfReportAzure, currentPlanName } = useFeatureAccess();

    return (
        <PlanAccessGate
            serviceName="Azure"
            loading={loading}
            canAccessFullDashboard={canAccessFullDashboardAzure}
            canAccessPdfReport={canAccessPdfReportAzure}
            planName={currentPlanName}
            pdfAccent="blue"
            pdfFallbackPlanName="Starter (Freemium)"
        >
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </PlanAccessGate>
    );
}
