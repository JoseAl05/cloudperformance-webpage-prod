import { BudgetPageShell } from '@/components/vcenter/presupuesto/BudgetPageShell';
import { ResourceAssignmentsComponent } from '@/components/vcenter/presupuesto/ResourceAssignmentsComponent';

export default function VCenterResourceAssignmentsPage() {
  return (
    <BudgetPageShell title="Asignación de Recursos" description="Relaciona los recursos facturados con sus centros de costo.">
      <ResourceAssignmentsComponent />
    </BudgetPageShell>
  );
}
