'use client'

import useSWR from 'swr';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { IntraCloudServicesBillingTable } from '@/components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingTable';
import { IntraCloudAwsStorageChartComponent } from '@/components/comp-cloud/intracloud/storage/aws/grafico/IntraCloudAwsStorageChartComponent';
import { IntraCloudAwsStorageCardsByTenantComponent } from '@/components/comp-cloud/intracloud/storage/aws/info/IntraCloudAwsStorageCardsByTenantComponent';
import { IntraCloudAzureStorageChartComponent } from '@/components/comp-cloud/intracloud/storage/azure/grafico/IntraCloudAzureStorageChartComponent';
import { IntraCloudAzureStorageCardsByTenantComponent } from '@/components/comp-cloud/intracloud/storage/azure/info/IntraCloudAzureStorageCardsByTenantComponent';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';

type IntraCloudStorageServiceComponentProps = DynamicFilterProps;

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


export const IntraCloudStorageServiceComponent = ({
    payload,
    startDate,
    endDate,
    resourceGroups,
    resources,
    service,
    region
}: IntraCloudStorageServiceComponentProps) => {
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

    const urlStorageMetrics =
        payload.cloud_provider === 'Azure'
            ? `/api/comparison-cloud/bridge/intracloud/azure/storage/get_storage_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`
            : `/api/comparison-cloud/bridge/intracloud/aws/storage/get_storage_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`

    const urlBillingStorage = payload.cloud_provider === 'Azure'
        ? `/api/comparison-cloud/bridge/intracloud/azure/storage/get_storage_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}&dimension=${dimension}`
        : `/api/comparison-cloud/bridge/intracloud/aws/storage/get_storage_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}&service=${service}`;


    const storageMetrics = useSWR(
        [urlStorageMetrics, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const storageBilling = useSWR(
        [urlBillingStorage, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    return (
        <div className="p-4 space-y-6">
            {storageMetrics.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {storageMetrics.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{storageMetrics.error.message}</span>
                    </div>
                </div>
            )}
            {
                storageMetrics.data && (
                    <>
                        {
                            payload.cloud_provider === 'AWS' ? (
                                <>
                                    <IntraCloudAwsStorageCardsByTenantComponent
                                        data={storageMetrics.data}
                                    />
                                    <IntraCloudAwsStorageChartComponent
                                        data={storageMetrics.data}
                                    />
                                </>
                            ) : (
                                <>
                                    <IntraCloudAzureStorageCardsByTenantComponent
                                        data={storageMetrics.data}
                                        service={service}
                                    />
                                    <IntraCloudAzureStorageChartComponent
                                        data={storageMetrics.data}
                                        service={service}
                                    />
                                </>
                            )
                        }

                    </>
                )
            }
            {storageBilling.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {storageBilling.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{storageBilling.error.message}</span>
                    </div>
                </div>
            )}
            {
                storageBilling.data && (
                    <IntraCloudServicesBillingTable
                        dimension={dimension}
                        setDimension={setDimension}
                        data={storageBilling.data}
                        payload={payload}
                    />
                )
            }
        </div>
    )
}