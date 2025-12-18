'use client'

import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DynamicColumn } from '@/components/general/data-table/columns';
import { IntraCloudBillingByDimension } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { Button } from '@/components/ui/button';
import { formatMetric } from '@/lib/metricUtils';

interface AggregatedBillingRow {
    dimension_value: string;
    [tenantId: string]: string | number;
}

const formatCurrency = (value: number | undefined) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const CostCell = ({ cost }: { cost: number | undefined }) => {
    const amount = cost || 0;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
                ${formatMetric(amount)}
            </span>
        </div>
    );
};

const ComparisonCell = ({ row, tenantIds }: { row: AggregatedBillingRow, tenantIds: string[] }) => {
    const costs = tenantIds.map(tid => Number(row[tid]) || 0);
    const validCosts = costs.filter(c => c > 0);

    if (validCosts.length === 0) {
        return <span className="text-muted-foreground text-xs">-</span>;
    }

    const totalCost = validCosts.reduce((a, b) => a + b, 0);
    const avgCost = totalCost / validCosts.length;
    const maxCost = Math.max(...validCosts);
    const minCost = Math.min(...validCosts);

    const maxIndex = costs.indexOf(maxCost);
    const minIndex = costs.indexOf(minCost);
    const highestTenant = `Tenant ${maxIndex + 1}`;
    const lowestTenant = `Tenant ${minIndex + 1}`;

    const stdDev = validCosts.length > 1 ? Math.sqrt(
        validCosts.reduce((sum, cost) => sum + Math.pow(cost - avgCost, 2), 0) / validCosts.length
    ) : 0;

    const coefficientOfVariation = avgCost > 0 ? (stdDev / avgCost * 100).toFixed(1) : '0.0';

    const ratio = minCost > 0 ? (maxCost / minCost).toFixed(2) : '∞';

    const percentages = costs.map(cost => totalCost > 0 ? (cost / totalCost * 100).toFixed(1) : '0.0');

    return (
        <div className="flex flex-col gap-3 min-w-[220px]">
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="font-semibold text-sm">{formatCurrency(totalCost)}</span>
            </div>

            {validCosts.length > 1 && (
                <>
                    <div className="space-y-1.5">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                            Distribución Porcentual
                        </div>
                        <div className="flex gap-1">
                            {tenantIds.map((tid, idx) => {
                                const pct = parseFloat(percentages[idx]);
                                if (pct === 0) return null;
                                return (
                                    <Tooltip key={tid}>
                                        <TooltipTrigger
                                            asChild
                                            className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full relative group"
                                            style={{ width: `${pct}%` }}
                                        >
                                            <Button variant="outline"></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Tenant {idx + 1}: {pct}%
                                        </TooltipContent>
                                    </Tooltip>
                                    // <div
                                    //     key={tid}
                                    //     className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full relative group"
                                    //     style={{ width: `${pct}%` }}
                                    //     title={`Tenant ${idx + 1}: ${pct}%`}
                                    // >
                                    //     <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    //         Tenant {idx + 1}: {pct}%
                                    //     </span>
                                    // </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-around text-[12px] text-muted-foreground">
                            {tenantIds.map((tid, idx) => {
                                const pct = parseFloat(percentages[idx]);
                                if (pct === 0) return null;
                                return (
                                    <span key={tid}>Tenant {idx + 1}: {pct}%</span>
                                );
                            })}
                        </div>
                    </div>

                    {/* <div className="space-y-1">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                            Desviación Estándar
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">±{formatCurrency(stdDev)}</span>
                            <Badge variant="outline" className="text-[9px] h-4 px-1">
                                CV: {coefficientOfVariation}%
                            </Badge>
                        </div>
                    </div> */}

                    <div className="space-y-1">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                            Ratio Mayor/Menor
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                                {highestTenant}
                            </Badge>
                            <span className="text-xs font-bold text-orange-600">{ratio}x</span>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                {lowestTenant}
                            </Badge>
                        </div>
                    </div>
                </>
            )}

            {validCosts.length === 1 && (
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 w-fit">
                    Solo 1 tenant con costo
                </Badge>
            )}
        </div>
    );
};

export const getIntraCloudBillingColumns = (
    allData: IntraCloudBillingByDimension[]
): DynamicColumn<AggregatedBillingRow>[] => {
    const tenantIds = Array.from(new Set(allData.map(t => t.tenant_id))).sort();
    const columns: DynamicColumn<AggregatedBillingRow>[] = [
        {
            header: "Dimensión",
            accessorKey: "dimension_value",
            cell: (info) => {
                const val = info.getValue() as string;
                console.log(val);
                return (
                    <div className="flex flex-col">
                        <div className="font-medium text-foreground max-w-[250px] truncate" title={val}>
                            {val || '-'}
                        </div>
                    </div>
                );
            },
            size: 250
        }
    ];

    tenantIds.forEach((tenantId, index) => {
        columns.push({
            header: `Tenant ${index + 1}`,
            accessorKey: tenantId,
            cell: ({ row }) => {
                const cost = row.original[tenantId] as number | undefined;
                return <CostCell cost={cost} />;
            },
            size: 140,
            desc: true,
            isDefaultSort: index === 0
        });
    });

    columns.push({
        header: "Análisis Comparativo",
        id: "comparison",
        cell: ({ row }) => (
            <ComparisonCell row={row.original} tenantIds={tenantIds} />
        ),
        size: 240
    });

    return columns;
};