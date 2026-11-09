'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { VCENTER_VM } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';
import type { VcenterFilterProps } from '@/components/general_vcenter/filters/FiltersComponent';

export const VcenterVmConsumptionComponent = ({ startDate, endDate }: VcenterFilterProps) => (
    <ConsumptionView
        config={VCENTER_VM}
        enabled
        disabledText=""
        params={{
            date_from: startDate && endDate ? toApiDate(startDate) : undefined,
            date_to: startDate && endDate ? toApiDate(endDate) : undefined,
        }}
    />
);
