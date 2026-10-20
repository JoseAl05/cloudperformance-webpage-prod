'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { GCP_COMPUTE_ENGINE_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedCeComponentProps {
    startDate: Date;
    endDate?: Date;
    resourceId?: string;
    regions: string;
    projects: string;
}

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

export const UnusedCeComponent = ({ startDate, endDate, resourceId, regions, projects }: UnusedCeComponentProps) => (
    <UnusedView
        config={GCP_COMPUTE_ENGINE_UNUSED}
        enabled={!!resourceId}
        disabledText="No se ha seleccionado ninguna instancia."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: isSet(regions, 'all_regions') ? regions : 'all_regions',
            project_id: isSet(projects, 'all_projects') ? projects : undefined,
            resource: resourceId,
        }}
    />
);
