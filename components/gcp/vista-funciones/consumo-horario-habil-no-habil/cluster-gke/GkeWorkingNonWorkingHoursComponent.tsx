'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { GCP_GKE_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface GkeWorkingNonWorkingHoursComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
}

export const GkeWorkingNonWorkingHoursComponent = ({ startDate, endDate, resourceId }: GkeWorkingNonWorkingHoursComponentProps) => (
    <WorkingHoursView
        config={GCP_GKE_WH}
        enabled={!!resourceId}
        disabledText="No se ha seleccionado ninguna instancia."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            instances: resourceId,
        }}
    />
);
