'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_VM_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedVmComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedUnusedVm: string;
}

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

export const UnusedVmComponent = ({ startDate, endDate, subscription, region, selectedUnusedVm }: UnusedVmComponentProps) => (
    <UnusedView
        config={AZURE_VM_UNUSED}
        enabled={!!selectedUnusedVm}
        disabledText="Seleccione una VM."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedUnusedVm,
        }}
    />
);
