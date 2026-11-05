'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_EC2_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedEc2ComponentProps {
    startDate: Date;
    endDate?: Date;
    instance: string;
    region: string;
}

export const UnusedEc2Component = ({ startDate, endDate, instance, region }: UnusedEc2ComponentProps) => (
    <UnusedView
        config={AWS_EC2_UNUSED}
        enabled={!!instance}
        disabledText="No se ha seleccionado ninguna instancia."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: instance,
        }}
    />
);
