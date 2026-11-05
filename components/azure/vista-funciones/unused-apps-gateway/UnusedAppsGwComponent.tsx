'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AZURE_APP_GATEWAYS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

const isSet = (value: string | null | undefined, allValue: string): value is string =>
    !!value && value !== allValue && value !== 'null';

interface UnusedAppsGwComponentProps {
    startDate: Date;
    endDate?: Date;
    subscription: string;
    region: string;
    selectedUnusedAppG?: string;
}

export const UnusedAppsGwComponent = ({ startDate, endDate, subscription, region, selectedUnusedAppG }: UnusedAppsGwComponentProps) => (
    <UnusedView
        config={AZURE_APP_GATEWAYS_UNUSED}
        enabled={!!selectedUnusedAppG}
        disabledText="Seleccione un Application Gateway."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            subscription_id: isSet(subscription, 'all_subscriptions') ? subscription : undefined,
            location: isSet(region, 'all_regions') ? region : undefined,
            resource: selectedUnusedAppG,
        }}
    />
);
