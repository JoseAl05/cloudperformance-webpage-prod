'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { AWS_ASG_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedAutoscalingComponentProps {
    startDate: Date;
    endDate?: Date;
    instance: string;
    region: string;
}

export const UnusedAutoscalingComponent = ({ startDate, endDate, instance, region }: UnusedAutoscalingComponentProps) => (
    <UnusedView
        config={AWS_ASG_UNUSED}
        enabled={!!instance}
        disabledText="No se ha seleccionado ningún Auto Scaling Group."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            region: region || 'all_regions',
            resource: instance,
        }}
    />
);
