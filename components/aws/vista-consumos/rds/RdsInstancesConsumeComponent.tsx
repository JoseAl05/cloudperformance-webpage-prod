'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AWS_RDS } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

const RDS_DB_TYPES: Record<string, string> = {
    'rds-pg': 'postgresql',
    'rds-mysql': 'mysql',
    'rds-oracle': 'oracle',
    'rds-sqlserver': 'sqlserver',
    'rds-mariadb': 'mariadb',
}

interface RdsInstancesConsumeComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
    instancesService?: string
}

/** Consumo RDS: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/rds/*). */
export const RdsInstancesConsumeComponent = ({ startDate, endDate, instance, region, instancesService }: RdsInstancesConsumeComponentProps) => {
    // El backend valida db_type contra el motor RDS
    const dbType = instancesService ? RDS_DB_TYPES[instancesService] ?? '' : ''
    return (
        <ConsumptionView
            config={AWS_RDS}
            enabled={!!instance}
            disabledText="No se ha seleccionado ninguna instancia."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                resource: instance,
                db_type: dbType,
            }}
        />
    )
}
