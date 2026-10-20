'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AZURE_DB } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface AzureDbMetricsComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedTagKey?: string | null;
    selectedTagValue?: string | null;
    selectedResourceGroup?: string | null;
    selectedInstanceV2?: string | null;
}

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

export const AzureDbMetricsComponent = ({
    startDate,
    endDate,
    subscription,
    region,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2,
}: AzureDbMetricsComponentProps) => {
    const hasTag = isSet(selectedTagKey, 'allKeys');
    return (
        <ConsumptionView
            config={AZURE_DB}
            enabled={!!subscription}
            disabledText="No se ha seleccionado ninguna suscripción."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
                location: isSet(region, 'all_regions') ? region : undefined,
                resource_group: isSet(selectedResourceGroup, 'all_resource_groups') ? selectedResourceGroup : undefined,
                resource_name: isSet(selectedInstanceV2, 'all_instances') ? selectedInstanceV2 : undefined,
                nombre_tag: hasTag ? selectedTagKey : undefined,
                valor_tag: hasTag && isSet(selectedTagValue, 'allValues') ? selectedTagValue : undefined,
            }}
        />
    );
};
