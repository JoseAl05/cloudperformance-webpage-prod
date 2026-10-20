'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_EBS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedEbsComponentProps {
    startDate: Date;
    endDate?: Date;
    instance: string;
    region: string;
}

export const UnusedEbsComponent = ({ startDate, endDate, instance, region }: UnusedEbsComponentProps) => (
    <UnusedView
        config={AWS_EBS_UNUSED}
        enabled={!!instance}
        disabledText="No se ha seleccionado ningún volumen."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: instance,
        }}
    />
);
