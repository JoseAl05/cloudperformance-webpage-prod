'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { GCP_FILESTORE_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface FilestoreWorkingNonWorkingHoursComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
}

export const FilestoreWorkingNonWorkingHoursComponent = ({ startDate, endDate, resourceId }: FilestoreWorkingNonWorkingHoursComponentProps) => (
    <WorkingHoursView
        config={GCP_FILESTORE_WH}
        enabled={!!resourceId}
        disabledText="No se ha seleccionado ninguna instancia de Filestore."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            instances: resourceId,
        }}
    />
);
