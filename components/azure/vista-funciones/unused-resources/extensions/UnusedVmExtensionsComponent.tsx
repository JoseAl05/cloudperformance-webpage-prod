'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_VM_EXTENSIONS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface UnusedVmExtensionsComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedVm?: string;
}

export const UnusedVmExtensionsComponent = ({ startDate, endDate, subscription, region, selectedVm }: UnusedVmExtensionsComponentProps) => (
    <UnusedView
        config={AZURE_VM_EXTENSIONS_UNUSED}
        enabled={!!selectedVm}
        disabledText="Seleccione una VM."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedVm,
        }}
    />
);
