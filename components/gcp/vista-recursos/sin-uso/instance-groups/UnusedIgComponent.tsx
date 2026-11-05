'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { GCP_INSTANCE_GROUPS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedIgComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
}

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

export const UnusedIgComponent = ({ startDate, endDate, resourceId, regions, projects }: UnusedIgComponentProps) => (
    <UnusedView
        config={GCP_INSTANCE_GROUPS_UNUSED}
        enabled={!!resourceId}
        disabledText="No se ha seleccionado ningún Instance Group."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: isSet(regions, 'all_regions') ? regions : 'all_regions',
            project_id: isSet(projects, 'all_projects') ? projects : undefined,
            resource: resourceId,
        }}
    />
);
