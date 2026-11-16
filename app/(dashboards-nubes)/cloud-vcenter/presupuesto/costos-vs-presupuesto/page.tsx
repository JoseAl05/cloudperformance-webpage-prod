'use client';

import { CostosVsPresupuestoComponent } from '@/components/shared/budget/CostosVsPresupuestoComponent';
import { FiltersComponent } from '@/components/general_presupuesto/filters/FiltersComponent';
import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';

export default function VCenterCostsVsBudgetPage() {
  return (
    <BudgetPageShell title="Costos vs Presupuesto vCenter" description="Compara el presupuesto con la prefactura real en moneda local.">
      <FiltersComponent
        Component={CostosVsPresupuestoComponent}
        dateFilter={false}
        anioFilter
        centroDeCostoFilter
        cloudFilterType="vcenter"
      />
    </BudgetPageShell>
  );
}
