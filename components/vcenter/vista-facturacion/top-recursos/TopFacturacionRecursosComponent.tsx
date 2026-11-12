'use client'

import { CalendarRange } from 'lucide-react';
import { TopBillingView } from '@/components/shared/billing/TopBillingView';
import { VCENTER_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs';
import type { BillingType } from '@/components/general_vcenter/filters/BillingTypeFilterComponent';
import type { BusinessUnit } from '@/components/general_vcenter/filters/BusinessUnitFilterComponent';

interface TopFacturacionRecursosProps {
    startDate?: Date;
    endDate?: Date;
    billingType?: BillingType;
    businessUnit?: BusinessUnit;
}

export const TopFacturacionRecursosComponent = ({
    startDate,
    endDate,
    billingType,
    businessUnit
}: TopFacturacionRecursosProps) => {
    if (!startDate || !endDate) {
        return (
            <div className='rounded-lg border border-dashed p-8 text-center text-muted-foreground'>
                <CalendarRange className='mx-auto mb-3 h-10 w-10' />
                <h2 className='text-base font-semibold text-foreground'>Selecciona un período</h2>
                <p className='mt-1 text-sm'>
                    Define las fechas de inicio y término para consultar el top de prefacturación de vCenter.
                </p>
            </div>
        );
    }

    return (
        <TopBillingView
            cloud='vcenter'
            startDate={startDate}
            endDate={endDate}
            dimensions={[VCENTER_TOP_DIMENSIONS.resource]}
            params={{
                billing_type: billingType ?? 'all',
                business_unit: businessUnit ?? 'all',
            }}
        />
    );
};
