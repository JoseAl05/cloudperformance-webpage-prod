'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { GCP_PERSISTENT_DISKS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface DiscosComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    resourceId?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const DiscosPersistentesComponent = ({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: DiscosComponentProps) => {
    const hasTag = isSet(tagKey, 'allKeys');
    return (
        <UnusedView
            config={GCP_PERSISTENT_DISKS_UNUSED}
            enabled={!!projects}
            disabledText="No se ha seleccionado ningún proyecto."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                project_id: isSet(projects, 'all_projects') ? projects : undefined,
                location: isSet(regions, 'all_regions') ? regions : undefined,
                resource: resourceId || 'all',
                nombre_tag: hasTag ? tagKey : undefined,
                valor_tag: hasTag && isSet(tagValue, 'allValues') ? tagValue : undefined,
            }}
        />
    );
};
