'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_EC2 } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface Ec2InstancesConsumeComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
}

/** Consumo EC2: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/ec2/*). */
export const Ec2InstancesConsumeComponent = ({ startDate, endDate, instance, region }: Ec2InstancesConsumeComponentProps) => {
    return (
        <ConsumptionView
            config={AWS_EC2}
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
