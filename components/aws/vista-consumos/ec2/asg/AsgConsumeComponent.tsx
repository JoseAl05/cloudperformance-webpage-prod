'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_ASG } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface AsgConsumeComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

export const AsgConsumeComponent = ({ startDate, endDate, instance, region }: AsgConsumeComponentProps) => {
    return (
        <ConsumptionView
            config={AWS_ASG}
            enabled={!!instance}
            disabledText="No se ha seleccionado ninguna instancia."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                resource: instance,
            }}
        />
    )
}
