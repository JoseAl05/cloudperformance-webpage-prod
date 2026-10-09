'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_NAT } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface NatGatewaysConsumeComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

/** Consumo NAT Gateways: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/nat-gateways/*). */
export const NatGatewaysConsumeComponent = ({ startDate, endDate, instance, region }: NatGatewaysConsumeComponentProps) => {
    return (
        <ConsumptionView
            config={AWS_NAT}
            enabled={!!instance}
            disabledText="No se ha seleccionado ningún NAT Gateway."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                resource: instance,
            }}
        />
    )
}
