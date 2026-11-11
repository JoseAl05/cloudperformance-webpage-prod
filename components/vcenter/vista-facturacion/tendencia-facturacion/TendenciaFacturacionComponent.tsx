'use client'

import { CalendarRange } from 'lucide-react';
import { BillingTrendView } from '@/components/shared/billing/BillingTrendView';
import { toApiDate } from '@/lib/consumption';
import type { BillingType } from '@/components/general_vcenter/filters/BillingTypeFilterComponent';
import type { BusinessUnit } from '@/components/general_vcenter/filters/BusinessUnitFilterComponent';

interface BillingFilterProps {
    startDate?: Date;
    endDate?: Date;
    billingType?: BillingType;
    businessUnit?: BusinessUnit;
}

export const TendenciaFacturacionComponent = ({ startDate, endDate, billingType, businessUnit }: BillingFilterProps) => {
    if (!startDate || !endDate) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <CalendarRange className="mx-auto mb-3 h-10 w-10" />
                <h2 className="text-base font-semibold text-foreground">Selecciona un período</h2>
                <p className="mt-1 text-sm">
                    Define las fechas de inicio y término para consultar la prefacturación de vCenter.
                </p>
            </div>
        );
    }

    return (
        <BillingTrendView
            cloud="vcenter"
            startDate={startDate}
            endDate={endDate}
            servicesLabel="Servicios Variables"
            regionsLabel="Ambientes"
            params={{
                date_from: toApiDate(startDate),
                date_to: toApiDate(endDate),
                billing_type: billingType ?? 'all',
                business_unit: businessUnit ?? 'all',
            }}
        />
    );
};
