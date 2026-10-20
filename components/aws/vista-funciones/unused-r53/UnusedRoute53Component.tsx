'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_ROUTE53_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedRoute53ComponentProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    unusedR53: string;
}

export const UnusedRoute53Component = ({ startDate, endDate, region, unusedR53 }: UnusedRoute53ComponentProps) => (
    <UnusedView
        config={AWS_ROUTE53_UNUSED}
        enabled={!!unusedR53}
        disabledText="No se ha seleccionado ninguna hosted zone."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: unusedR53,
        }}
    />
);
