'use client'

import { useMemo } from 'react';
import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { gcpCloudSqlWorkingHours } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface CloudSqlWorkingNonWorkingHoursComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
    tagKey?: string | null;
    tagValue?: string | null;
    dbEngine?: string;
}

export const CloudSqlWorkingNonWorkingHoursComponent = ({
    startDate,
    endDate,
    projects,
    resourceId,
    tagKey,
    tagValue,
    dbEngine,
}: CloudSqlWorkingNonWorkingHoursComponentProps) => {
    const config = useMemo(() => gcpCloudSqlWorkingHours(dbEngine), [dbEngine]);
    return (
        <WorkingHoursView
            config={config}
            enabled={!!(projects || resourceId)}
            disabledText="No se ha seleccionado ningún proyecto o instancia."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                instances: resourceId || 'all',
                tagKey,
                tagValue,
            }}
        />
    );
};
