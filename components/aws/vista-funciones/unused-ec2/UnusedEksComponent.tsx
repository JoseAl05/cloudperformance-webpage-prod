'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_EKS_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedEksComponentProps {
    startDate: Date;
    endDate?: Date;
    instance: string;
    region: string;
}

export const UnusedEksComponent = ({ startDate, endDate, instance, region }: UnusedEksComponentProps) => (
    <UnusedView
        config={AWS_EKS_UNUSED}
        enabled={!!instance}
        disabledText="No se ha seleccionado ningún cluster EKS."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: instance,
        }}
    />
);
