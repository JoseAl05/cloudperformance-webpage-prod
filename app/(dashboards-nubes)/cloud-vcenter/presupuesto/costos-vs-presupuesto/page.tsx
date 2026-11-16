'use client';

import { CostosVsPresupuestoComponent } from '@/components/shared/budget/CostosVsPresupuestoComponent';
import { FiltersComponent } from '@/components/general_presupuesto/filters/FiltersComponent';
import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';

interface VCenterBudgetFilterParams {
  startDate: Date;
  endDate?: Date;
  instance: string;
  region: string;
  selectedKey?: string | null;
  selectedValue?: string | null;
  anio?: string;
  centroDeCosto?: string;
}

const VCenterCostsVsBudgetContent = ({ anio, centroDeCosto }: VCenterBudgetFilterParams) => (
  <CostosVsPresupuestoComponent
    anio={anio}
    cloud="vcenter"
    centroDeCosto={centroDeCosto}
  />
);

export default function VCenterCostsVsBudgetPage() {
  return (
    <BudgetPageShell title="Costos vs Presupuesto vCenter" description="Compara el presupuesto con la prefactura real en moneda local.">
      <FiltersComponent
        Component={VCenterCostsVsBudgetContent}
        dateFilter={false}
        anioFilter
        centroDeCostoFilter
        cloudFilterType="vcenter"
      />
    </BudgetPageShell>
  );
}
