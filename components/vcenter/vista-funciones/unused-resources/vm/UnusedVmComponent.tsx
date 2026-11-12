'use client'

import { UnusedView } from '@/components/shared/unused/UnusedView';
import { VCENTER_VM_UNUSED } from '@/components/shared/unused/unusedConfigs';
import { toApiDate } from '@/lib/consumption';

interface UnusedVmComponentProps {
    startDate?: Date;
    endDate?: Date;
    resourceIp?: string;
}

export const UnusedVmComponent = ({ startDate, endDate, resourceIp }: UnusedVmComponentProps) => (
    <UnusedView
        config={VCENTER_VM_UNUSED}
        enabled={!!startDate && !!endDate}
        disabledText="No se ha seleccionado un período."
        params={{
            date_from: startDate ? toApiDate(startDate) : undefined,
            date_to: endDate ? toApiDate(endDate) : undefined,
            resource_ip: resourceIp && resourceIp !== 'all' ? resourceIp : undefined,
        }}
    />
);
