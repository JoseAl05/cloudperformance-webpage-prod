'use client'
import { BillingTrendView } from '@/components/shared/billing/BillingTrendView';
import { toApiDate } from '@/lib/consumption';

interface TendenciaFacturacionComponentProps {
    startDate: Date;
    endDate?: Date;
    regions: string;
    projects?: string | string[];
    service: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const TendenciaFacturacionComponent = ({ startDate, endDate, projects, regions, service, tagKey, tagValue }: TendenciaFacturacionComponentProps) => {
    const tagKeySelected = tagKey && tagKey !== 'allKeys' ? tagKey : undefined;
    return (
        <BillingTrendView
            cloud="gcp"
            startDate={startDate}
            endDate={endDate ?? startDate}
            params={{
                date_from: toApiDate(startDate),
                date_to: toApiDate(endDate ?? startDate),
                project_id: Array.isArray(projects) ? projects.join(',') : projects,
                region: regions,
                service_name: service,
                nombre_tag: tagKeySelected,
                valor_tag: tagKeySelected && tagValue && tagValue !== 'allValues' ? tagValue : undefined,
            }}
        />
    );
};
