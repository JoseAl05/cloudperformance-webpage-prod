'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { ComputeEngineBilling } from '@/interfaces/vista-compute-engine/cEInterfaces';

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

export const getComputeEngineBillingColumns = (): DynamicColumn<ComputeEngineBilling>[] => {
    return [
        {
            header: "SKU",
            accessorKey: "sku",
            cell: (info) => {
                const val = info.getValue() as string;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground max-w-[300px] truncate" title={val}>
                            {val || '-'}
                        </span>
                    </div>
                );
            },
            size: 300,
            enableSorting: true
        },
        {
            header: "Bruto (USD)",
            accessorKey: "cost_gross_usd",
            cell: (info) => {
                const val = info.getValue() as number;
                return <div className="text-center text-muted-foreground text-xs">{formatCurrencyUSD(val)}</div>;
            },
            size: 120,
            enableSorting: true
        },
        {
            header: "Desc. (USD)",
            accessorKey: "discount_usd",
            cell: (info) => {
                const val = info.getValue() as number;
                return <div className="text-center text-emerald-600 text-xs">{formatCurrencyUSD(val)}</div>;
            },
            size: 120,
            enableSorting: true
        },
        {
            header: "Neto (USD)",
            accessorKey: "cost_net_usd",
            cell: (info) => {
                const val = info.getValue() as number;
                return (
                    <div className="text-center font-bold text-foreground text-sm">
                        {formatCurrencyUSD(val)}
                    </div>
                );
            },
            size: 130,
            enableSorting: true
        },
        {
            header: "Bruto (CLP)",
            accessorKey: "cost_gross_clp",
            cell: (info) => {
                const val = info.getValue() as number;
                return <div className="text-center text-muted-foreground text-xs">{formatCurrencyCLP(val)}</div>;
            },
            size: 120,
            enableSorting: true
        },
        {
            header: "Desc. (CLP)",
            accessorKey: "discount_clp",
            cell: (info) => {
                const val = info.getValue() as number;
                return <div className="text-center text-emerald-600 text-xs">{formatCurrencyCLP(val)}</div>;
            },
            size: 120,
            enableSorting: true
        },
        {
            header: "Neto (CLP)",
            accessorKey: "cost_net_clp",
            cell: (info) => {
                const val = info.getValue() as number;
                return (
                    <div className="text-center font-bold text-foreground text-sm">
                        {formatCurrencyCLP(val)}
                    </div>
                );
            },
            size: 130,
            enableSorting: true
        }
    ];
};