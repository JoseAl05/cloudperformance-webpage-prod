'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { AWS_ASG_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface ConsumoEC2AsgHorarioComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

export const ConsumoEC2AsgHorarioComponent = ({ startDate, endDate, instance, region }: ConsumoEC2AsgHorarioComponentProps) => (
    <WorkingHoursView
        config={AWS_ASG_WH}
        enabled={!!instance}
        disabledText="No se ha seleccionado ninguna instancia."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region,
            instances: instance,
        }}
    />
);
