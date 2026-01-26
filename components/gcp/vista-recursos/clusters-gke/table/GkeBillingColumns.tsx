'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { createColumns } from '@/components/data-table/columns';
import { useMemo } from 'react';
import { ClusterGkeBilling } from '@/interfaces/vista-gke/gkeInterfaces';

export interface ResourceBillingGroup extends ClusterGkeBilling {
    items: ClusterGkeBilling[];
}

const formatCurrencyUSD = (value: number | undefined) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(value);
};

const formatCurrencyCLP = (value: number | undefined) => {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

const SkuBreakdownTable = ({ data }: { data: ClusterGkeBilling[] }) => {
    const aggregatedSkus = useMemo(() => {
        const skuMap = new Map<string, ClusterGkeBilling>();
        data.forEach((item) => {
            const current = skuMap.get(item.sku);
            if (current) {
                current.cost_gross_clp += item.cost_gross_clp || 0;
                current.cost_gross_usd += item.cost_gross_usd || 0;
                current.cost_net_clp += item.cost_net_clp || 0;
                current.cost_net_usd += item.cost_net_usd || 0;
                current.discount_clp += item.discount_clp || 0;
                current.discount_usd += item.discount_usd || 0;
            } else {
                skuMap.set(item.sku, { ...item });
            }
        });
        return Array.from(skuMap.values()).sort((a, b) => b.cost_net_usd - a.cost_net_usd);
    }, [data]);

    const columns = createColumns(getSkuBillingColumns());

    return (
        <DataTableGrouping
            columns={columns}
            data={aggregatedSkus}
            filterColumn="sku"
            filterPlaceholder="Filtrar SKU..."
            enableGrouping={false}
            pageSizeItems={5}
        />
    );
};

export const getSkuBillingColumns = (): DynamicColumn<ClusterGkeBilling>[] => {
    return [
        {
            header: "SKU",
            accessorKey: "sku",
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground max-w-[300px] truncate" title={info.getValue() as string}>
                        {info.getValue() as string || '-'}
                    </span>
                </div>
            ),
            size: 250,
            enableSorting: true
        },
        {
            header: "Neto (USD)",
            accessorKey: "cost_net_usd",
            cell: (info) => <div className="text-center font-bold">{formatCurrencyUSD(info.getValue() as number)}</div>,
            size: 100,
            enableSorting: true
        },
        {
            header: "Neto (CLP)",
            accessorKey: "cost_net_clp",
            cell: (info) => <div className="text-center font-bold">{formatCurrencyCLP(info.getValue() as number)}</div>,
            size: 100,
            enableSorting: true
        }
    ];
};

export const getResourceBillingColumns = (): DynamicColumn<ResourceBillingGroup>[] => {
    return [
        {
            header: "Recurso",
            accessorKey: "resource",
            cell: (info) => {
                const val = info.getValue() as string;
                return (
                    <div className="font-medium text-foreground">
                        {val || 'Sin Nombre'}
                    </div>
                );
            },
            size: 250,
            enableSorting: true
        },
        {
            header: "Costo Total (USD)",
            accessorKey: "cost_net_usd",
            cell: (info) => (
                <div className="font-bold text-foreground">
                    {formatCurrencyUSD(info.getValue() as number)}
                </div>
            ),
            size: 120,
            enableSorting: true
        },
        {
            header: "Costo Total (CLP)",
            accessorKey: "cost_net_clp",
            cell: (info) => (
                <div className="font-bold text-foreground">
                    {formatCurrencyCLP(info.getValue() as number)}
                </div>
            ),
            size: 120,
            enableSorting: true
        },
        {
            header: "Detalles",
            id: "actions",
            cell: ({ row }) => {
                const resourceGroup = row.original;
                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4 text-emerald-600" />
                                <span className="sr-only">Ver detalles</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-5xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Desglose de Costos: {resourceGroup.resource}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <SkuBreakdownTable data={resourceGroup.items} />
                            </div>
                        </DialogContent>
                    </Dialog>
                );
            },
            size: 80,
            enableSorting: false
        }
    ];
};