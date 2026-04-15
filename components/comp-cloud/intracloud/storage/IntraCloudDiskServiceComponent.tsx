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
import { IntraCloudGcpStorageCardsByTenantComponent } from '@/components/comp-cloud/intracloud/storage/gcp/info/IntraCloudGcpStorageCardsByTenantComponent';
import { IntraCloudGcpStorageChartComponent } from '@/components/comp-cloud/intracloud/storage/gcp/grafico/IntraCloudGcpStorageChartComponent';

type IntraCloudDiskServiceComponentProps = DynamicFilterProps;

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        resource_group?: string;
        resources?: string;
        project_id?: string;
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


export const IntraCloudDiskServiceComponent = ({
    payload,
    startDate,
    endDate,
    resourceGroups,
    resources,
    projects,
    service,
    region
}: IntraCloudDiskServiceComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    let dimensionDefaultValue = '';
    switch (payload.cloud_provider) {
        case 'Azure':
            dimensionDefaultValue = 'pricing_model';
            break;
        case 'AWS':
            dimensionDefaultValue = 'RESOURCE_ID';
            break;
        case 'GCP':
            dimensionDefaultValue = 'service_description';
            break;
        default:
            dimensionDefaultValue = '';
            break;
    }

    const [dimension, setDimension] = useState<string>(dimensionDefaultValue);
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
            } else if (payload.cloud_provider === 'GCP') {
                filtersPayload[tenantId] = {
                    resources: resources[tenantId] || 'all',
                    project_id: payload.project_id || 'all'
                };
            }
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    let urlDisksMetrics = '';
    let urlBillingDisks = '';

    switch (payload.cloud_provider) {
        case 'Azure':
            urlDisksMetrics = `/api/comparison-cloud/bridge/intracloud/azure/storage/get_disks_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`;
            urlBillingDisks = `/api/comparison-cloud/bridge/intracloud/azure/storage/get_disks_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}&dimension=${dimension}`;
            break;
        case 'AWS':
            urlDisksMetrics = `/api/comparison-cloud/bridge/intracloud/aws/storage/get_disks_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`;
            urlBillingDisks = `/api/comparison-cloud/bridge/intracloud/aws/storage/get_disks_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}&service=${service}`;
            break;
        case 'GCP':
            urlDisksMetrics = `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_disks_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`;
            urlBillingDisks = `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_disks_billing_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}&service=${service}`;
            break;
    }


    const disksMetrics = useSWR(
        [urlDisksMetrics, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const disksBilling = useSWR(
        [urlBillingDisks, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    return (
        <div className="p-4 space-y-6">
            {disksMetrics.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {disksMetrics.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{disksMetrics.error.message}</span>
                    </div>
                </div>
            )}
            {
                disksMetrics.data && (
                    <>
                        {
                            payload.cloud_provider === 'AWS' && (
                                <>
                                    <IntraCloudAwsStorageCardsByTenantComponent
                                        data={disksMetrics.data}
                                        service={service}
                                    />
                                    <IntraCloudAwsStorageChartComponent
                                        data={disksMetrics.data}
                                        service={service}
                                    />
                                </>
                            )
                        }
                        {
                            payload.cloud_provider === 'Azure' && (
                                <>
                                    <IntraCloudAzureStorageCardsByTenantComponent
                                        data={disksMetrics.data}
                                        service={service}
                                    />
                                    <IntraCloudAzureStorageChartComponent
                                        data={disksMetrics.data}
                                        service={service}
                                    />
                                </>
                            )
                        }
                        {
                            payload.cloud_provider === 'GCP' && (
                                <>
                                    <IntraCloudGcpStorageCardsByTenantComponent
                                        data={disksMetrics.data}
                                        service={service}                                     />
                                    <IntraCloudGcpStorageChartComponent
                                        data={disksMetrics.data}
                                        service={service}
                                    />
                                </>
                            )
                        }

                    </>
                )
            }
            {disksBilling.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {disksBilling.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{disksBilling.error.message}</span>
                    </div>
                </div>
            )}
            {
                disksBilling.data && (
                    <IntraCloudServicesBillingTable
                        dimension={dimension}
                        setDimension={setDimension}
                        data={disksBilling.data}
                        payload={payload}
                    />
                )
            }
        </div>
    )
}