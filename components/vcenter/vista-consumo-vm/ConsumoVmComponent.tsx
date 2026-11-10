'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { VCENTER_VM } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

export const VcenterVmConsumptionComponent = ({ startDate, endDate, resourceIp }: { startDate?: Date; endDate?: Date; resourceIp?: string }) => (
    <ConsumptionView
        config={VCENTER_VM}
        enabled
        disabledText=""
        params={{
            date_from: startDate && endDate ? toApiDate(startDate) : undefined,
            date_to: startDate && endDate ? toApiDate(endDate) : undefined,
            resource_ip: resourceIp && resourceIp !== 'all' ? resourceIp : undefined,
        }}
        source="vcenter"
    />
);
