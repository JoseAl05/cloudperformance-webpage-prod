'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { AWS_EC2_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface ConsumoEC2HorarioComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

export const ConsumoEC2HorarioComponent = ({ startDate, endDate, instance, region }: ConsumoEC2HorarioComponentProps) => (
    <WorkingHoursView
        config={AWS_EC2_WH}
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
