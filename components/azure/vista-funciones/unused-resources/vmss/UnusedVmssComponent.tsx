'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_VMSS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedVmssComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedUnusedVmss: string;
}

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

export const UnusedVmssComponent = ({ startDate, endDate, subscription, region, selectedUnusedVmss }: UnusedVmssComponentProps) => (
    <UnusedView
        config={AZURE_VMSS_UNUSED}
        enabled={!!selectedUnusedVmss}
        disabledText="Seleccione una VMSS."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedUnusedVmss,
        }}
    />
);
