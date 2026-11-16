import { PresupuestoAnualComponent } from '@/components/presupuesto/presupuesto-anual/PresupuestoAnualComponent';
import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';

export default function VCenterAnnualBudgetPage() {
  return (
    <BudgetPageShell title="Gestión de Presupuesto" description="Administración del presupuesto anual de vCenter en moneda local.">
      <PresupuestoAnualComponent cloud="vCenter" currency="COP" />
    </BudgetPageShell>
  );
}
