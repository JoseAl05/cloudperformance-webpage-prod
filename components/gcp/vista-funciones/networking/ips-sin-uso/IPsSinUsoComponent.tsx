'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { GCP_IPS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface IPsSinUsoComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const IPsSinUsoComponent = ({ startDate, endDate, projects, regions }: IPsSinUsoComponentProps) => (
    <UnusedView
        config={GCP_IPS_UNUSED}
        enabled={!!projects}
        disabledText="No se ha seleccionado ningún proyecto."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            project_id: isSet(projects, 'all_projects') ? projects : undefined,
            region: isSet(regions, 'all_regions') ? regions : undefined,
        }}
    />
);
