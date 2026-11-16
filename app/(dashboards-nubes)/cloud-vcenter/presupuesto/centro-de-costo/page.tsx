import { CentroDeCostoComponent } from '@/components/presupuesto/centro-de-costo/CentroDeCostoComponent';
import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';

export default function VCenterCostCentersPage() {
  return (
    <BudgetPageShell title="Gestión de Presupuesto" description="Administración de centros de costo para vCenter.">
      <CentroDeCostoComponent cloud="vCenter" showTags={false} />
    </BudgetPageShell>
  );
}
