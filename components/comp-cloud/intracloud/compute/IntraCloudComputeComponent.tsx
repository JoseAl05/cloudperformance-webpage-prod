// 'use client'

// import { MessageCard } from '@/components/azure/cards/MessageCards';
// import { IntraCloudBillingCostUsdChartComponent } from '@/components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingCostUsdChartComponent';
// import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
// import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
// import { AlertCircle, Loader2, X } from 'lucide-react';
// import useSWR from 'swr';

// interface IntraCloudComputeComponentProps {
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

// export const IntraCloudComputeComponent = ({
//     payload,
//     startDate,
//     endDate,
//     resourceGroupA,
//     resourceGroupB
// }: IntraCloudComputeComponentProps) => {

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
//                     <IntraCloudBillingCostUsdChartComponent
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

import { IntraCloudComputeChartComponent } from '@/components/comp-cloud/intracloud/compute/grafico/IntraCloudComputeChartComponent';
import { IntraCloudComputeCardsByTenantComponent } from '@/components/comp-cloud/intracloud/compute/info/IntraCloudComputeCardsByTenantComponent';
import { IntraCloudComputeBillingTable } from '@/components/comp-cloud/intracloud/compute/table/IntraCloudComputeBillingTable';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

type IntraCloudComputeComponentProps = DynamicFilterProps;

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        resource_group?: string;
        resources?: string;
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

export const IntraCloudComputeComponent = ({
    payload,
    startDate,
    endDate,
    resourceGroups,
    resources,
    service,
    region
}: IntraCloudComputeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const [dimension, setDimension] = useState<string>(payload.cloud_provider === 'Azure' ? 'pricing_model' : 'RESOURCE_ID');

    const filtersPayload: Record<string, unknown> = {};

    if (payload.tenants) {
        payload.tenants.forEach(tenantId => {
            if (payload.cloud_provider === 'Azure') {
                filtersPayload[tenantId] = {
                    resource_group: resourceGroups[tenantId] || 'all',
                    resources: resources[tenantId] || 'all'
                };
            } else if (payload.cloud_provider === 'AWS') {
                filtersPayload[tenantId] = {
                    region: region[tenantId] || 'all_regions',
                    resources: resources[tenantId] || 'all'
                };
            }
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    const urlComputeMetrics =
        payload.cloud_provider === 'Azure'
            ? `/api/comparison-cloud/bridge/intracloud/azure/compute/get_compute_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`
            : `/api/comparison-cloud/bridge/intracloud/aws/compute/get_compute_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`

    const urlBillingCompute = payload.cloud_provider === 'Azure'
        ? `/api/comparison-cloud/bridge/intracloud/azure/compute/get_compute_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}&dimension=${dimension}`
        : `/api/comparison-cloud/bridge/intracloud/aws/compute/get_compute_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}&service=${service}`;


    const computeMetrics = useSWR(
        [urlComputeMetrics, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const computeBilling = useSWR(
        [urlBillingCompute, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    console.log('computeBilling.data', computeBilling.data);

    return (
        <div className="p-4 space-y-6">
            {computeMetrics.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {computeMetrics.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{computeMetrics.error.message}</span>
                    </div>
                </div>
            )}
            {
                computeMetrics.data && (
                    <>
                        <IntraCloudComputeCardsByTenantComponent
                            data={computeMetrics.data}
                        />
                        <IntraCloudComputeChartComponent
                            data={computeMetrics.data}
                        />
                    </>
                )
            }
            {computeBilling.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {computeBilling.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{computeBilling.error.message}</span>
                    </div>
                </div>
            )}
            {
                computeBilling.data && (
                    <IntraCloudComputeBillingTable
                        dimension={dimension}
                        setDimension={setDimension}
                        data={computeBilling.data}
                        payload={payload}
                    />
                )
            }
        </div>
    )
}