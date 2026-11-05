'use client'
import { BillingTrendView } from '@/components/shared/billing/BillingTrendView';
import { toApiDate } from '@/lib/consumption';

interface TendenciaFacturacionProps {
    startDate: Date;
    endDate?: Date;
    services?: string;
    region?: string;
    selectedKey?: string | null,
    selectedValue?: string | null,
}

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region, selectedKey, selectedValue }: TendenciaFacturacionProps) => (
    <BillingTrendView
        cloud="aws"
        startDate={startDate}
        endDate={endDate ?? startDate}
        params={{
            date_from: toApiDate(startDate),
            date_to: toApiDate(endDate ?? startDate),
            region: region || 'all_regions',
            service: services,
            tag_key: selectedKey,
            tag_value: selectedKey ? selectedValue : undefined,
        }}
    />
);
