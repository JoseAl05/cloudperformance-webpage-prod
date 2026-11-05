'use client'
import { BillingTrendView } from '@/components/shared/billing/BillingTrendView';
import { toApiDate } from '@/lib/consumption';

interface TendenciaFacturacionAzureProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    subscription: string;
    selectedTagKey: string | null;
    selectedTagValue: string | null;
    selectedMeterCategory: string | null;
    selectedInstance: string | null;
}

const filterValue = (value: string | null) => (value && value !== 'null' ? value : undefined);

export const TendenciaFacturacionPagoPorUsoComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedMeterCategory,
    selectedInstance,
}: TendenciaFacturacionAzureProps) => (
    <BillingTrendView
        cloud="azure"
        startDate={startDate}
        endDate={endDate ?? startDate}
        showHeader={false}
        servicesLabel="Categorías de Servicio"
        regionsLabel="Ubicaciones"
        params={{
            date_from: toApiDate(startDate),
            date_to: toApiDate(endDate ?? startDate),
            resource_location: region,
            subscription_name: subscription,
            nombre_tag: filterValue(selectedTagKey),
            valor_tag: filterValue(selectedTagValue),
            meter_category: filterValue(selectedMeterCategory),
            instance_name: selectedInstance !== 'all_instances' ? filterValue(selectedInstance) : undefined,
        }}
    />
);
