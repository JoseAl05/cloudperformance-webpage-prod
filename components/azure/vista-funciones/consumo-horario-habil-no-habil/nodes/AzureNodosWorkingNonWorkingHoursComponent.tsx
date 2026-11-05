'use client'

import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { AZURE_NODES_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { toApiDate } from '@/lib/consumption';

interface AzureNodosWorkingNonWorkingHoursComponentProps {
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

export const AzureNodosWorkingNonWorkingHoursComponent = ({
    startDate,
    endDate,
    subscription,
    region,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2,
}: AzureNodosWorkingNonWorkingHoursComponentProps) => {
    const hasTag = isSet(selectedTagKey, 'allKeys');
    return (
        <WorkingHoursView
            config={AZURE_NODES_WH}
            enabled={!!subscription}
            disabledText="No se ha seleccionado ninguna suscripción."
            params={{
                date_from: toApiDate(startDate),
                date_to: endDate ? toApiDate(endDate) : undefined,
                subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
                location: isSet(region, 'all_regions') ? region : undefined,
                resource_group: isSet(selectedResourceGroup, 'all_resource_groups') ? selectedResourceGroup : undefined,
                vm_name: isSet(selectedInstanceV2, 'all_instances') ? selectedInstanceV2 : undefined,
                tagKey: hasTag ? selectedTagKey : undefined,
                tagValue: hasTag && isSet(selectedTagValue, 'allValues') ? selectedTagValue : undefined,
            }}
        />
    );
};
