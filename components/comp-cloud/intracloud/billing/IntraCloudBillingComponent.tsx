'use client'

import { IntraCloudBillingCostUsdChartComponent } from '@/components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingCostUsdChartComponent';
import { IntraCloudBillingCardsComponent } from '@/components/comp-cloud/intracloud/billing/info/IntraCloudBillingCardsComponent';
import { IntraCloudBillingTable } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudBillingTable';
import { IntraCloudMonthlyBillingTable } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudMontlhyBillingTable';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';
import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { url } from 'inspector';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

type IntraCloudBillingComponentProps = DynamicFilterProps;

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        resource_group?: string;
        project_id?: string;
        location_region?: string;
        region?: string;
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
    projects,
    resourceGroups,
    subscriptions,
    tagKeys,
    tagValues,
    region
}: IntraCloudBillingComponentProps) => {

    let dimensionDefaultValue = '';
    switch (payload.cloud_provider) {
        case 'Azure':
            dimensionDefaultValue = 'service_family';
            break;
        case 'AWS':
            dimensionDefaultValue = 'SERVICE';
            break;
        case 'GCP':
            dimensionDefaultValue = 'service_description';
            break;
        default:
            dimensionDefaultValue = '';
            break;
    }

    const [dimension, setDimension] = useState<string>(dimensionDefaultValue);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';


    const filtersPayload: Record<string, unknown> = {};

    if (payload.tenants) {
        payload.tenants.forEach(tenantId => {
            if (payload.cloud_provider === 'Azure') {
                filtersPayload[tenantId] = {
                    resource_group: resourceGroups[tenantId] || 'all',
                    subscription: subscriptions[tenantId] || 'all',
                    tagKey: tagKeys[tenantId] || 'allKeys',
                    tagValue: tagValues[tenantId] || 'allValues'
                };
            } else if (payload.cloud_provider === 'AWS') {
                filtersPayload[tenantId] = {
                    region: region[tenantId] || 'all_regions'
                };
            } else if (payload.cloud_provider === 'GCP') {
                filtersPayload[tenantId] = {
                    project_id: projects[tenantId] || 'all',
                    location_region: region[tenantId] || 'all_regions'
                }
            }
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    let urlAcumulatedBilling = '';
    let urlBillingByDimension = '';
    let urlMonthlyBilling = '';
    switch (payload.cloud_provider) {
        case 'Azure':
            urlAcumulatedBilling = `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            urlBillingByDimension = `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_billing_by_dimension?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}`;
            urlMonthlyBilling = `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_monthly_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            break;
        case 'AWS':
            urlAcumulatedBilling = `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            urlBillingByDimension = `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_billing_by_dimension?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}`;
            urlMonthlyBilling = `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_monthly_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            break;
        case 'GCP':
            urlAcumulatedBilling = `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            urlBillingByDimension = `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_billing_by_dimension?date_from=${startDateFormatted}&date_to=${endDateFormatted}&dimension=${dimension}`;
            urlMonthlyBilling = `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_monthly_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
            break;
        default:
            urlAcumulatedBilling = null;
            break;
    }

    const acumulatedBilling = useSWR(
        [urlAcumulatedBilling, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const shouldFetchUrlBillingByDimension = dimension ? true : false;

    const billingByDimension = useSWR(
        [shouldFetchUrlBillingByDimension ? urlBillingByDimension : null, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const monthlyBilling = useSWR(
        [urlMonthlyBilling, fullPayload],
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
                    {/* <IntraCloudBillingCostUsdChartComponent
                        data={acumulatedBilling.data}
                    /> */}
                    <IntraCloudBillingCostUsdChartComponent
                        data={monthlyBilling.data}
                    />
                    <IntraCloudBillingTable
                        dimension={dimension}
                        setDimension={setDimension}
                        data={billingByDimension.data ? billingByDimension.data : []}
                        payload={payload}
                        isLoading={billingByDimension.isLoading}
                    />
                    <IntraCloudMonthlyBillingTable
                        data={monthlyBilling.data}
                        isLoading={monthlyBilling.isLoading}
                    />
                </>
            )}
        </div>
    )
}