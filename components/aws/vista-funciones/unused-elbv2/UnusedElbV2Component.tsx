'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_LOAD_BALANCERS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedElbV2ComponentProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    unusedElbV2: string;
}

export const UnusedElbV2Component = ({ startDate, endDate, region, unusedElbV2 }: UnusedElbV2ComponentProps) => (
    <UnusedView
        config={AWS_LOAD_BALANCERS_UNUSED}
        enabled={!!unusedElbV2}
        disabledText="No se ha seleccionado ningún Load Balancer."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: unusedElbV2,
        }}
    />
);
