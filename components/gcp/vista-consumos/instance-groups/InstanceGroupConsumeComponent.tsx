'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { GCP_INSTANCE_GROUPS } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface InstanceGroupConsumeComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    resourceId?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const InstanceGroupConsumeComponent = ({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: InstanceGroupConsumeComponentProps) => {
    const hasTag = !!tagKey && tagKey !== 'allKeys';
    return (
        <ConsumptionView
            config={GCP_INSTANCE_GROUPS}
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
