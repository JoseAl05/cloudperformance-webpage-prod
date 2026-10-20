'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_LOAD_BALANCERS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface UnusedLoadbalancersComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedUnusedLb?: string;
}

export const UnusedLoadbalancersComponent = ({ startDate, endDate, subscription, region, selectedUnusedLb }: UnusedLoadbalancersComponentProps) => (
    <UnusedView
        config={AZURE_LOAD_BALANCERS_UNUSED}
        enabled={!!selectedUnusedLb}
        disabledText="Seleccione un load balancer."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedUnusedLb,
        }}
    />
);
