// 'use client'

// import { MessageCard } from '@/components/azure/cards/MessageCards';
// import { IntraCloudBillingChartComponent } from '@/components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingChartComponent';
// import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
// import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
// import { AlertCircle, Loader2, X } from 'lucide-react';
// import useSWR from 'swr';

// interface IntraCloudBillingComponentProps {
//     payload: ReqPayload;
//     startDate?: Date;
//     endDate?: Date;
//     resourceGroupA?: string;
//     resourceGroupB?: string;
// }

// const fetcherPost = async ([url, payload]: [string, unknown]) => {
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//         const errorInfo = await res.json().catch(() => ({}));
//         throw new Error(errorInfo.message || 'Error al obtener datos');
//     }
//     return res.json();
// };

// export const IntraCloudBillingComponent = ({
//     payload,
//     startDate,
//     endDate,
//     resourceGroupA,
//     resourceGroupB
// }: IntraCloudBillingComponentProps) => {

//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const url = `/api/comparison-cloud/bridge/intracloud/billing/get_tenants_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_group_tenant_a=${resourceGroupA}&resource_group_tenant_b=${resourceGroupB}`;

//     const { data, error, isLoading } = useSWR(
//         [url, payload],
//         fetcherPost,
//         {
//             revalidateOnFocus: false,
//             shouldRetryOnError: false
//         }
//     );

//     return (
//         <div className="p-4 border rounded shadow-sm bg-white">
//             {isLoading && (
//                 <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
//                     <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
//                     <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
//                 </div>
//             )}
//             {error && (
//                 <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
//                     <AlertCircle size={20} />
//                     <p>Ocurrió un error al cargar el reporte: <span className="font-semibold">{error.message}</span></p>
//                 </div>
//             )}
//             {
//                 data && (
//                     <IntraCloudBillingChartComponent
//                         data={data}
//                     />
//                 )
//             }
//             {
//                 data && (
//                     <pre className="text-xs font-mono bg-slate-50 p-4 rounded overflow-x-auto text-slate-700">
//                         {JSON.stringify(data.billing_dimension_tenant_a, null, 2)}
//                         {JSON.stringify(data.billing_dimension_tenant_a, null, 2)}
//                     </pre>
//                 )
//             }
//         </div>
//     )
// }
'use client'

import { IntraCloudBillingChartComponent } from '@/components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingChartComponent';
import { IntraCloudBillingCardsComponent } from '@/components/comp-cloud/intracloud/billing/info/IntraCloudBillingCardsComponent';
import { IntraCloudBillingTable } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudBillingTable';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';
import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

type IntraCloudBillingComponentProps = DynamicFilterProps;

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        resource_group?: string;
        subscription?: string;
        tagKey?: string | null;
        tagValue?: string | null;
    }>;
}

const fetcherPost = async ([url, payload]: [string, BackendPayload]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw new Error(errorInfo.message || 'Error al obtener datos');
    }
    return res.json();
};

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const IntraCloudBillingComponent = ({
    payload,
    startDate,
    endDate,
    resourceGroups,
    subscriptions,
    tagKeys,
    tagValues
}: IntraCloudBillingComponentProps) => {

    const [dimension, setDimension] = useState<string>('');

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const filtersPayload: Record<string, unknown> = {};

    if (payload.tenants) {
        payload.tenants.forEach(tenantId => {
            filtersPayload[tenantId] = {
                resource_group: resourceGroups[tenantId] || 'all',
                subscription: subscriptions[tenantId] || 'all',
                tagKey: tagKeys[tenantId] || 'allKeys',
                tagValue: tagValues[tenantId] || 'allValues'
            };
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    const urlAcumulatedBilling = `/api/comparison-cloud/bridge/intracloud/billing/get_tenants_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

    const acumulatedBilling = useSWR(
        [urlAcumulatedBilling, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const urlBillingByDimension = dimension ? `/api/comparison-cloud/bridge/intracloud/billing/get_tenants_billing_by_dimension?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}` : null;

    const billingByDimension = useSWR(
        [urlBillingByDimension, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );


    return (
        <div className="p-4 bg-white space-y-6">
            {acumulatedBilling.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {acumulatedBilling.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{acumulatedBilling.error.message}</span>
                    </div>
                </div>
            )}

            {acumulatedBilling.data && (
                <>
                    <IntraCloudBillingCardsComponent
                        data={acumulatedBilling.data}
                    />
                    <IntraCloudBillingChartComponent
                        data={acumulatedBilling.data}
                    />
                    <IntraCloudBillingTable
                        dimension={dimension}
                        setDimension={setDimension}
                        data={billingByDimension.data ? billingByDimension.data : []}
                    />
                    <div className="mt-4 p-2 bg-slate-100 rounded text-[10px] font-mono">
                        Payload enviado: {JSON.stringify(filtersPayload, null, 2)}
                    </div>

                </>
            )}
        </div>
    )
}