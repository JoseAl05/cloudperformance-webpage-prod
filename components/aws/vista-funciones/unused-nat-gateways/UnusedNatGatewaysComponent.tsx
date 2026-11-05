'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_NAT_GATEWAYS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedNatGatewaysComponentProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    unusedNatGateway: string;
}

export const UnusedNatGatewaysComponent = ({ startDate, endDate, region, unusedNatGateway }: UnusedNatGatewaysComponentProps) => (
    <UnusedView
        config={AWS_NAT_GATEWAYS_UNUSED}
        enabled={!!unusedNatGateway}
        disabledText="No se ha seleccionado ningún NAT Gateway."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: unusedNatGateway,
        }}
    />
);
