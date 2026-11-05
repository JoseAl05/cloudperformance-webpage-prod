'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { GCP_COMPUTE_ENGINE_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface CeWorkingNonWorkingHoursComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
}

export const CeWorkingNonWorkingHoursComponent = ({ startDate, endDate, resourceId }: CeWorkingNonWorkingHoursComponentProps) => (
    <WorkingHoursView
        config={GCP_COMPUTE_ENGINE_WH}
        enabled={!!resourceId}
        disabledText="No se ha seleccionado ninguna instancia."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            instances: resourceId,
        }}
    />
);
