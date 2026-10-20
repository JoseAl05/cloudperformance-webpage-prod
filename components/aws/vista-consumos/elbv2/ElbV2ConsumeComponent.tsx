'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_ELB } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface ElbV2ConsumeComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

export const ElbV2ConsumeComponent = ({ startDate, endDate, instance, region }: ElbV2ConsumeComponentProps) => {
    return (
        <ConsumptionView
            config={AWS_ELB}
            enabled={!!instance}
            disabledText="No se ha seleccionado ningún Load Balancer."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                resource: instance,
            }}
        />
    )
}
