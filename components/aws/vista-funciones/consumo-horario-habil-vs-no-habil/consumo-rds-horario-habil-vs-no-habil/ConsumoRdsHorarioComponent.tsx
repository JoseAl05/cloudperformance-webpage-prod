'use client'

import { useMemo } from 'react';
import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { awsRdsWorkingHours } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface ConsumoRdsHorarioComponentProps {
    startDate: Date
    endDate?: Date
    instance: string
    region: string
    dbType?: string
}

export const ConsumoRdsHorarioComponent = ({ startDate, endDate, instance, region, dbType }: ConsumoRdsHorarioComponentProps) => {
    const config = useMemo(() => awsRdsWorkingHours(dbType), [dbType]);
    return (
        <WorkingHoursView
            config={config}
            enabled={!!instance}
            disabledText="No se ha seleccionado ninguna instancia."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                region,
                instances: instance,
                db_type: dbType,
            }}
        />
    );
};
