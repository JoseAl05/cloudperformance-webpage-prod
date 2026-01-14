'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DynamicColumn } from '@/components/general/data-table/columns';
import { IntraCloudComputeBilling } from '@/interfaces/vista-intracloud/compute/intraCloudComputeInterfaces';
import { formatMetric } from '@/lib/metricUtils';
import { TrendingUp, TrendingDown, Maximize2, BarChart3, Info } from 'lucide-react';
import { IntraCloudStorageBilling } from '@/interfaces/vista-intracloud/storage/intraCloudStorageInterfaces';

export interface AggregatedComputeRow {
    dimension_value: string;
    resource_search_term?: string;
    [key: string]: string | number | Record<string, string> | Record<string, number>;
    max_resource_name: Record<string, string>;
    max_resource_cost: Record<string, number>;
    min_resource_name: Record<string, string>;
    min_resource_cost: Record<string, number>;
}

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const getResourceName = (resourceId: string) => {
    if (!resourceId) return 'N/A';
    const parts = resourceId.split('/');
    return parts[parts.length - 1];
}

const CostCell = ({ cost, subLabel }: { cost: number | undefined, subLabel?: string }) => {
    const amount = cost || 0;
    return (
        <div className="flex flex-col gap-0.5">
            <span className={`font-semibold ${amount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                ${formatMetric(amount)}
            </span>
            {subLabel && amount > 0 && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={subLabel}>
                    {subLabel}
                </span>
            )}
        </div>
    );
};

const ComparisonCell = ({ row, tenantIds, cloudProvider }: { row: AggregatedComputeRow, tenantIds: string[], cloudProvider: string }) => {
    const costs = tenantIds.map(tid => Number(row[tid]) || 0);
    const validCosts = costs.filter(c => c >= 0);

    if (validCosts.length === 0) {
        return <span className="text-muted-foreground text-xs">-</span>;
    }

    const totalCost = validCosts.reduce((a, b) => a + b, 0);
    const maxCost = Math.max(...validCosts);
    const minCost = Math.min(...validCosts);

    const ratioValue = minCost > 0 ? (maxCost / minCost) : 0;

    let ratioDisplay = '';
    let tooltipMessage = '';
    let badgeColorClass = '';

    if (ratioValue < 1.01) {
        ratioDisplay = '~ Equal';
        tooltipMessage = 'La diferencia de costo es muy baja (<1%).';
        badgeColorClass = 'text-slate-600';
    } else if (ratioValue < 1.15) {
        const pctDiff = ((ratioValue - 1) * 100).toFixed(1);
        ratioDisplay = `+${pctDiff}%`;
        tooltipMessage = `El tenant más costoso es un ${pctDiff}% más caro que el tenant menos costoso.`;
        badgeColorClass = 'text-blue-600';
    } else {
        ratioDisplay = `${ratioValue.toFixed(1)}x`;
        tooltipMessage = `El tenant más costoso es ${ratioDisplay} veces más caro que el tenant menos costoso.`;
        badgeColorClass = ratioValue > 1.5 ? 'text-orange-600' : 'text-emerald-600';
    }

    const maxIndex = costs.indexOf(maxCost);
    const minIndex = costs.indexOf(minCost);

    const content = (
        <div className="flex flex-col gap-2 min-w-[280px] py-1">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                        {cloudProvider === 'AWS' ? 'Total (Fila)' : 'Total:'}
                    </span>
                    <span className="font-bold text-sm text-emerald-800">{formatCurrency(totalCost)}</span>
                </div>
                {validCosts.length > 1 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-1 bg-white hover:bg-slate-50 shadow-sm cursor-help">
                                Diff: <span className={`font-bold ${badgeColorClass}`}>
                                    {ratioDisplay}
                                </span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                            <p>{tooltipMessage}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {tenantIds.map((tid, idx) => {
                    const cost = Number(row[tid]) || 0;
                    if (cost === 0 && totalCost > 0) return null;

                    const isMax = idx === maxIndex;
                    const isMin = idx === minIndex && validCosts.length > 1;

                    const colorClass = isMax
                        ? "[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500"
                        : "[&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500";

                    return (
                        <div key={tid} className="grid grid-cols-[25px_1fr_60px] items-center gap-2 text-[10px]">
                            <span className={`font-bold ${isMax ? 'text-orange-600' : isMin ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                T{idx + 1}
                            </span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <progress
                                        max={totalCost}
                                        value={cost}
                                        className={`h-2 w-full appearance-none overflow-hidden rounded-full bg-slate-100 [&::-webkit-progress-bar]:bg-slate-100 ${colorClass}`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Tenant {idx + 1}: {formatCurrency(cost)}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-right font-semibold text-slate-700">
                                {formatCurrency(cost)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {cloudProvider === 'Azure' && (
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-full text-[10px] text-muted-foreground cursor-pointer hover:text-emerald-600 mt-1 border border-dashed border-slate-200 hover:border-emerald-200 hover:bg-emerald-50">
                        <Maximize2 size={10} className="mr-1.5" />
                        Ver desglose de recursos
                    </Button>
                </DialogTrigger>
            )}
        </div>
    );

    if (cloudProvider !== 'Azure') {
        return content;
    }

    return (
        <Dialog>
            {content}
            <DialogContent className="min-w-5xl w-full max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        Análisis de Costos: {row.dimension_value}
                    </DialogTitle>
                    <DialogDescription>
                        Desglose detallado de los recursos más costosos y económicos por tenant.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {tenantIds.map((tid, idx) => {
                        const tenantCost = Number(row[tid]) || 0;
                        if (tenantCost === 0 && (!row.max_resource_name || !row.max_resource_name[tid])) return null;

                        const maxResName = row.max_resource_name?.[tid] || 'N/A';
                        const maxResCost = row.max_resource_cost?.[tid] || 0;
                        const minResName = row.min_resource_name?.[tid] || 'N/A';
                        const minResCost = row.min_resource_cost?.[tid] || 0;
                        const maxPct = tenantCost > 0 ? ((maxResCost / tenantCost) * 100).toFixed(0) : 0;

                        const isHighestOverall = idx === maxIndex;

                        return (
                            <div key={tid} className={`border rounded-lg p-4 flex flex-col gap-3 shadow-sm ${isHighestOverall ? 'bg-red-50/30 border-red-100 ring-1 ring-red-50' : 'bg-white border-slate-200'}`}>
                                <div className="flex flex-row items-start justify-between border-b pb-3 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant={isHighestOverall ? "destructive" : "secondary"} className="text-[10px]">
                                                Tenant {idx + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg leading-none">{formatCurrency(tenantCost)}</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wide">
                                            <span className="flex items-center gap-1 text-red-600"><TrendingUp size={12} /> Top Consumo</span>
                                            <span>{maxPct}% del tenant</span>
                                        </div>
                                        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 group hover:border-red-200 transition-colors">
                                            <div className="text-xs font-medium text-slate-800 break-all leading-snug" title={maxResName}>
                                                {getResourceName(maxResName) ? getResourceName(maxResName) : maxResName}
                                            </div>
                                            <div className="text-right text-xs font-mono font-semibold text-slate-600 mt-1.5">
                                                {formatCurrency(maxResCost)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wide">
                                            <span className="flex items-center gap-1 text-emerald-600"><TrendingDown size={12} /> Menor Consumo</span>
                                        </div>
                                        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 group hover:border-emerald-200 transition-colors">
                                            <div className="text-xs font-medium text-slate-800 break-all leading-snug" title={minResName}>
                                                {getResourceName(minResName)}
                                            </div>
                                            <div className="text-right text-xs font-mono font-semibold text-slate-600 mt-1.5">
                                                {formatCurrency(minResCost)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const getIntraCloudServicesBillingColumns = (
    allData: IntraCloudComputeBilling[] | IntraCloudStorageBilling[],
    cloudProvider: string
): DynamicColumn<AggregatedComputeRow>[] => {
    const tenantIds = Array.from(new Set(allData.map(t => t.tenant_id))).sort();

    const columns: DynamicColumn<AggregatedComputeRow>[] = [
        {
            header: cloudProvider === 'AWS' ? "Ranking" : "Dimensión",
            accessorKey: "dimension_value",
            cell: (info) => {
                const val = info.getValue() as string;
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground max-w-[180px] text-wrap" title={val}>
                            {val || 'Sin asignar'}
                        </span>
                        {cloudProvider === 'AWS' && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>Comparación basada en la posición de costo.</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                );
            },
            size: 150,
            enableSorting: true
        }
    ];

    if (cloudProvider === 'AWS') {
        columns.push({
            id: "resource_search_term",
            accessorKey: "resource_search_term",
            header: "",
            cell: () => null,
            size: 0,
            enableSorting: false,
        });
    }


    tenantIds.forEach((tenantId, index) => {
        columns.push({
            header: `Tenant ${index + 1}`,
            accessorKey: tenantId,
            cell: ({ row }) => {
                const cost = row.original[tenantId] as number | undefined;
                let resourceIdLabel = undefined;
                if (cloudProvider === 'AWS') {
                    resourceIdLabel = row.original[`${tenantId}_meta_resource`] as string;
                }

                return <CostCell cost={cost} subLabel={resourceIdLabel} />;
            },
            size: 130,
            desc: true,
        });
    });

    columns.push({
        header: "Análisis Comparativo",
        id: "comparison",
        cell: ({ row }) => (
            <ComparisonCell row={row.original} tenantIds={tenantIds} cloudProvider={cloudProvider} />
        ),
        size: 300
    });

    return columns;
};