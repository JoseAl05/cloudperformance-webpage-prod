import { PresupuestoMensualComponent } from '@/components/presupuesto/presupuesto-mensual/PresupuestoMensualComponent';
import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';

export default function VCenterMonthlyBudgetPage() {
  return (
    <BudgetPageShell title="Gestión de Presupuesto" description="Administración del presupuesto mensual de vCenter en moneda local.">
      <PresupuestoMensualComponent cloud="vCenter" currency="COP" />
    </BudgetPageShell>
  );
}
