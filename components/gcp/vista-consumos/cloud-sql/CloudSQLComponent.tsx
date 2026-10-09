'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { GCP_CLOUD_SQL } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface CloudSQLComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    databaseType?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

/** Consumo Cloud SQL: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/cloud-sql/*). */
export const CloudSQLComponent = ({ startDate, endDate, projects, regions, databaseType, tagKey, tagValue }: CloudSQLComponentProps) => {
    const hasTag = !!tagKey && tagKey !== 'allKeys';
    return (
        <ConsumptionView
            config={GCP_CLOUD_SQL}
            enabled={!!projects}
            disabledText="No se ha seleccionado ningún proyecto."
            params={{
                date_from: startDate ? toApiDate(startDate) : undefined,
                date_to: endDate ? toApiDate(endDate) : undefined,
                project_id: projects,
                region: regions && regions !== 'all_regions' ? regions : undefined,
                database_type: databaseType && databaseType !== 'all' ? databaseType : undefined,
                tagKey: hasTag ? tagKey : undefined,
                tagValue: hasTag && tagValue && tagValue !== 'allValues' ? tagValue : undefined,
            }}
        />
    );
};
