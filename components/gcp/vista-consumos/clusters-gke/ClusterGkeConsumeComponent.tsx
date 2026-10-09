'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { GCP_GKE } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface ClusterGkeConsumeComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    resourceId?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

/** Consumo Clusters GKE: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/gke/*). */
export const ClusterGkeConsumeComponent = ({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: ClusterGkeConsumeComponentProps) => {
    const hasTag = !!tagKey && tagKey !== 'allKeys';
    return (
        <ConsumptionView
            config={GCP_GKE}
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
