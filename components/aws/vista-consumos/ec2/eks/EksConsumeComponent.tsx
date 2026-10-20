'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_EKS } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface EksConsumeComponentProps {
    startDate: Date
    endDate?: Date
    eksAsgInstance?: string
    region: string
}

export const EksConsumeComponent = ({ startDate, endDate, eksAsgInstance, region }: EksConsumeComponentProps) => {
    return (
        <ConsumptionView
            config={AWS_EKS}
            enabled={!!eksAsgInstance}
            disabledText="No se ha seleccionado ninguna instancia."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                resource: eksAsgInstance,
            }}
        />
    )
}
