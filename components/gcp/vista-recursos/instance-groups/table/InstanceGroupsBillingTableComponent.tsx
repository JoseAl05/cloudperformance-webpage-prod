'use client'

import { createColumns } from '@/components/data-table/columns';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getResourceBillingColumns, ResourceBillingGroup } from '@/components/gcp/vista-recursos/instance-groups/table/InstanceGroupBillingColumns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstanceGroupsBilling } from '@/interfaces/vista-instance-group/iGInterfaces'
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface InstanceGroupsBillingTableComponentProps {
    data: InstanceGroupsBilling[];
}

const formatUSD = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatCLP = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

export const InstanceGroupsBillingTableComponent = ({ data }: InstanceGroupsBillingTableComponentProps) => {

    const aggregatedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const resourceMap = new Map<string, ResourceBillingGroup>();

        data.forEach((item) => {
            const key = item.resource;
            const current = resourceMap.get(key);

            if (current) {
                current.cost_gross_clp += item.cost_gross_clp || 0;
                current.cost_gross_usd += item.cost_gross_usd || 0;
                current.cost_net_clp += item.cost_net_clp || 0;
                current.cost_net_usd += item.cost_net_usd || 0;
                current.discount_clp += item.discount_clp || 0;
                current.discount_usd += item.discount_usd || 0;

                current.items.push(item);
            } else {
                resourceMap.set(key, {
                    ...item,
                    items: [item]
                });
            }
        });

        return Array.from(resourceMap.values()).sort((a, b) => b.cost_net_usd - a.cost_net_usd);
    }, [data]);

    const totals = useMemo(() => {
        return aggregatedData.reduce((acc, item) => ({
            usd: acc.usd + (item.cost_net_usd || 0),
            clp: acc.clp + (item.cost_net_clp || 0)
        }), { usd: 0, clp: 0 });
    }, [aggregatedData]);

    const columns = createColumns(getResourceBillingColumns());

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="h-5 w-5 text-emerald-500" />
                            Facturación por Recurso
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Costos agrupados por Recurso. Haz clic en el ojo para ver el desglose por SKU.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-background/50 p-2 rounded-lg border border-border/50 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Neto USD</span>
                            <span className="text-lg font-bold text-foreground font-mono">
                                {formatUSD(totals.usd)}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Neto CLP</span>
                            <span className="text-lg font-bold text-foreground font-mono">
                                {formatCLP(totals.clp)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {aggregatedData.length > 0 ? (
                    <div className="p-4">
                        <DataTableGrouping
                            columns={columns}
                            data={aggregatedData}
                            filterColumn="resource"
                            filterPlaceholder="Buscar por Recurso..."
                            enableGrouping={false}
                            pageSizeGroups={10}
                            pageSizeItems={10}
                        />
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-16">
                        No hay datos de facturación disponibles.
                    </div>
                )}
                {aggregatedData.length > 0 && (
                    <div className="border-t bg-muted/50 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                Mostrando {aggregatedData.length} recursos
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}