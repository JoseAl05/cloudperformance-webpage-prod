'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { GCP_FILESTORE } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface FilestoreConsumeComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    resourceId?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const FilestoreConsumeComponent = ({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: FilestoreConsumeComponentProps) => {
    const hasTag = !!tagKey && tagKey !== 'allKeys';
    return (
        <ConsumptionView
            config={GCP_FILESTORE}
            enabled={!!projects}
            disabledText="No se ha seleccionado ningún proyecto."
            params={{
                date_from: startDate ? toApiDate(startDate) : undefined,
                date_to: endDate ? toApiDate(endDate) : undefined,
                project_id: projects,
                region: regions && regions !== 'all_regions' ? regions : undefined,
                resource: resourceId,
                resources_id: resourceId,
                tagKey: hasTag ? tagKey : undefined,
                tagValue: hasTag && tagValue && tagValue !== 'allValues' ? tagValue : undefined,
            }}
        />
    );
};
