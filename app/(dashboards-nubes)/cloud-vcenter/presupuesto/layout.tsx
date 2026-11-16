'use client';

import type { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PlanAccessGate } from '@/components/shared/PlanAccessGate';

export default function VCenterBudgetLayout({ children }: { children: ReactNode }) {
  const { loading, canAccessPresupuesto, currentPlanName } = useFeatureAccess();

  return (
    <PlanAccessGate
      serviceName="Presupuestos vCenter"
      loading={loading}
      canAccessFullDashboard={canAccessPresupuesto}
      canAccessPdfReport={canAccessPresupuesto}
      planName={currentPlanName}
      showPdfReport={false}
    >
      {children}
    </PlanAccessGate>
  );
}
