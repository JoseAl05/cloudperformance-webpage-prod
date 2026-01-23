'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { InstanceGroupsBillingTableComponent } from '@/components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { InstanceGroupsBilling } from '@/interfaces/vista-instance-group/iGInterfaces';
import { AlertCircle, Info } from 'lucide-react';
import { useMemo } from 'react';
import useSWR from 'swr';

interface InstanceGroupsBillingComponentProps {
    instances: string[];
    startDate: string;
    endDate: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const InstanceGroupsBillingComponent = ({ instances, startDate, endDate }: InstanceGroupsBillingComponentProps) => {

    const formattedInstances = instances.join(',');

    const iGBilling = useSWR(
        instances ? `/api/gcp/bridge/gcp/instance_groups/gcp_instance_groups_billing?date_from=${startDate}&date_to=${endDate}&instances=${formattedInstances}` : null,
        fetcher
    )

    const billingData: InstanceGroupsBilling[] | null =
        isNonEmptyArray<InstanceGroupsBilling>(iGBilling.data) ? iGBilling.data : null;

    const hasBillingData = !!billingData && billingData.length > 0;

    const anyLoading =
        iGBilling.isLoading



    const anyError =
        !!iGBilling.error

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!instances) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna instancia.</div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }

    const noneHasData = !hasBillingData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos facturacion ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <>
            <InstanceGroupsBillingTableComponent
                data={billingData}
            />
        </>
    )
}