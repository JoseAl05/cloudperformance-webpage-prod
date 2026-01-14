'use client'

import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import {
    IntraCloudComputeBilling,
    IntraCloudComputeBillingData,
} from '@/interfaces/vista-intracloud/compute/intraCloudComputeInterfaces';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { AggregatedComputeRow } from '@/components/comp-cloud/intracloud/compute/table/IntraCloudComputeBillingColumns';
import { formatMetric } from '@/lib/metricUtils';
import { IntraCloudBillingDimSelectionComponent } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudBillingDimSelectionComponent';
import { IntraCloudStorageBilling } from '@/interfaces/vista-intracloud/storage/intraCloudStorageInterfaces';
import { getIntraCloudServicesBillingColumns } from '@/components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingColumns';

interface IntraCloudServicesBillingTableProps {
    data: IntraCloudComputeBilling[] | IntraCloudStorageBilling[];
    dimension: string;
    setDimension: Dispatch<SetStateAction<string>>;
    payload: ReqPayload;
}

export const IntraCloudServicesBillingTable = ({ data, dimension, setDimension, payload }: IntraCloudServicesBillingTableProps) => {

    const cloudProvider = payload.cloud_provider;

    const awsStats = useMemo(() => {
        if (cloudProvider !== 'AWS' || !data.length) return null;

        const mostExpensiveList = data.map((tenant, idx) => ({
            id: tenant.tenant_id,
            name: `Tenant ${idx + 1}`,
            cost: tenant.most_expensive?.total_cost || 0,
            resourceId: tenant.most_expensive?.RESOURCE_ID || tenant.most_expensive?.resource || 'N/A'
        })).sort((a, b) => b.cost - a.cost);

        const leastExpensiveList = data.map((tenant, idx) => ({
            id: tenant.tenant_id,
            name: `Tenant ${idx + 1}`,
            cost: tenant.least_expensive?.total_cost || 0,
            resourceId: tenant.least_expensive?.RESOURCE_ID || tenant.least_expensive?.resource || 'N/A'
        })).sort((a, b) => a.cost - b.cost);

        return {
            most: mostExpensiveList,
            least: leastExpensiveList
        };
    }, [data, cloudProvider]);

    const aggregatedData = useMemo(() => {
        if (!dimension || !data.length) return [];

        if (cloudProvider === 'AWS') {
            const tenantSortedData = data.map(tenant => {
                return {
                    tenantId: tenant.tenant_id,
                    items: [...tenant.billing_data].sort((a, b) => {
                        const costA = (a as unknown).cost_in_usd_sum || a.cost_in_usd || 0;
                        const costB = (b as unknown).cost_in_usd_sum || b.cost_in_usd || 0;
                        return costB - costA;
                    })
                };
            });

            const maxRows = Math.max(...tenantSortedData.map(t => t.items.length));
            const rows: AggregatedComputeRow[] = [];

            for (let i = 0; i < maxRows; i++) {
                const row: AggregatedComputeRow = {
                    dimension_value: `Top #${i + 1}`,
                    max_resource_name: {},
                    max_resource_cost: {},
                    min_resource_name: {},
                    min_resource_cost: {},
                    resource_search_term: ""
                };

                const searchTerms: string[] = [];

                tenantSortedData.forEach(tData => {
                    const item = tData.items[i];
                    if (item) {
                        const cost = (item as unknown).cost_in_usd_sum || item.cost_in_usd || 0;
                        const resourceId = item.RESOURCE_ID || (item as unknown).resource || 'Unknown';
                        row[tData.tenantId] = cost;
                        row[`${tData.tenantId}_meta_resource`] = resourceId;

                        searchTerms.push(resourceId);
                    } else {
                        row[tData.tenantId] = 0;
                    }
                });

                row.resource_search_term = searchTerms.join(' ');

                rows.push(row);
            }
            return rows;
        }
        const dimensionMap = new Map<string, AggregatedComputeRow>();

        data.forEach(tenant => {
            const tenantId = tenant.tenant_id;
            tenant.billing_data.forEach((item: IntraCloudComputeBillingData) => {
                const dimensionValue = (item[dimension as keyof typeof item] as string) || 'N/A';

                if (!dimensionMap.has(dimensionValue)) {
                    dimensionMap.set(dimensionValue, {
                        dimension_value: dimensionValue,
                        max_resource_name: {},
                        max_resource_cost: {},
                        min_resource_name: {},
                        min_resource_cost: {}
                    });
                }

                const current = dimensionMap.get(dimensionValue)!;
                const itemCost = (item as unknown).cost_in_usd_sum || item.cost_in_usd || 0;

                current[tenantId] = (Number(current[tenantId]) || 0) + itemCost;

                const resourceName = (item as unknown).resource || (item as unknown).instance_name || 'Unknown';

                const currentMaxCost = current.max_resource_cost[tenantId] ?? -1;
                if (itemCost > currentMaxCost) {
                    current.max_resource_cost[tenantId] = itemCost;
                    current.max_resource_name[tenantId] = resourceName;
                }

                const currentMinCost = current.min_resource_cost[tenantId];
                if (currentMinCost === undefined || (itemCost < currentMinCost && itemCost > 0)) {
                    current.min_resource_cost[tenantId] = itemCost;
                    current.min_resource_name[tenantId] = resourceName;
                }
            });
        });

        return Array.from(dimensionMap.values());
    }, [data, dimension, cloudProvider]);

    const columns = createColumns(getIntraCloudServicesBillingColumns(data, cloudProvider));

    return (
        <div className="flex flex-col gap-4 w-full">
            {cloudProvider === 'AWS' && awsStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Recursos Más Costosos (Por Tenant)
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col max-h-[250px] overflow-y-auto">
                                {awsStats.most.map((item, index) => (
                                    <div key={item.id} className={`flex items-center justify-between p-3 ${index !== awsStats.most.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <div className="flex flex-col gap-1 overflow-hidden mr-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground truncate font-mono" title={item.resourceId}>
                                                {item.resourceId}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-orange-700">
                                                ${formatMetric(item.cost)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-l-4 border-l-emerald-500 shadow-sm flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Recursos Menos Costosos (Por Tenant)
                            </CardTitle>
                            <TrendingDown className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col max-h-[250px] overflow-y-auto">
                                {awsStats.least.map((item, index) => (
                                    <div key={item.id} className={`flex items-center justify-between p-3 ${index !== awsStats.least.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <div className="flex flex-col gap-1 overflow-hidden mr-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground truncate font-mono" title={item.resourceId}>
                                                {item.resourceId}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-emerald-700">
                                                ${formatMetric(item.cost)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            <Card className="w-full overflow-hidden">
                <CardHeader className="border-b bg-muted/10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart3 className="h-5 w-5 text-emerald-500" />
                                Costos de Cómputo ({cloudProvider})
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {cloudProvider === 'AWS'
                                    ? 'Comparativa de recursos por ranking de costo.'
                                    : `Análisis detallado por ${dimension}.`}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {
                        cloudProvider === 'Azure' && (
                            <div className="p-2 flex justify-end">
                                <IntraCloudBillingDimSelectionComponent
                                    dimension={dimension}
                                    setDimension={setDimension}
                                    payload={payload}
                                />
                            </div>
                        )
                    }
                    {dimension && aggregatedData.length > 0 ? (
                        <div className="p-4">
                            <DataTableGrouping
                                columns={columns}
                                data={aggregatedData}
                                filterColumn={cloudProvider === 'AWS' ? "resource_search_term" : "dimension_value"}
                                filterPlaceholder={cloudProvider === 'AWS' ? "Filtrar por ranking..." : `Filtrar por ${dimension}...`}
                                enableGrouping={false}
                                pageSizeGroups={10}
                                pageSizeItems={10}
                            />
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16">
                            {!dimension ? 'Selecciona una dimensión.' : 'No hay datos para esta selección.'}
                        </div>
                    )}
                    {aggregatedData.length > 0 && (
                        <div className="border-t bg-muted/50 px-6 py-3">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                    {aggregatedData.length} registros encontrados
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};