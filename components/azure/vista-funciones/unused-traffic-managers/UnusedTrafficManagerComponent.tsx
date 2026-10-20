'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_TRAFFIC_MANAGERS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface UnusedTrafficManagerComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedUnusedTm?: string;
}

export const UnusedTrafficManagerComponent = ({ startDate, endDate, subscription, region, selectedUnusedTm }: UnusedTrafficManagerComponentProps) => (
    <UnusedView
        config={AZURE_TRAFFIC_MANAGERS_UNUSED}
        enabled={!!selectedUnusedTm}
        disabledText="Seleccione un Traffic Manager."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedUnusedTm,
        }}
    />
);
