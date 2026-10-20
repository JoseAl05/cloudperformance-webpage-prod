'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { GCP_FILESTORE_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface FilestoreSinUsoComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    filestoreTier?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const FilestoreSinUsoComponent = ({ startDate, endDate, projects, regions, filestoreTier, tagKey, tagValue }: FilestoreSinUsoComponentProps) => {
    const hasTag = isSet(tagKey, 'allKeys');
    return (
        <UnusedView
            config={GCP_FILESTORE_UNUSED}
            enabled={!!projects}
            disabledText="No se ha seleccionado ningún proyecto."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                project_id: isSet(projects, 'all_projects') ? projects : undefined,
                location: isSet(regions, 'all_regions') ? regions : undefined,
                tier: isSet(filestoreTier, 'all') ? filestoreTier : undefined,
                nombre_tag: hasTag ? tagKey : undefined,
                valor_tag: hasTag && isSet(tagValue, 'allValues') ? tagValue : undefined,
            }}
        />
    );
};
