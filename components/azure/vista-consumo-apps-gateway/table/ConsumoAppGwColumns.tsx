'use client'

import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { ConsumeViewAppGwSummaryApiResponse } from '@/interfaces/vista-consumos/appGwConsumeViewInterface';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
};

export const ConsumoAppGwColumns: DynamicColumn<ConsumeViewAppGwSummaryApiResponse>[] = [
    {
        header: "Nombre Gateway",
        accessorKey: "appg_name",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;
            const resourceId = row.original.resource_id;

            return (
                <div className="flex flex-col py-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {name}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <span className="truncate max-w-[240px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500" title={resourceId}>
                            {resourceId}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        header: "Ubicación",
        accessorKey: "location",
        cell: (info) => (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Costo fijo no utilizado",
        accessorKey: "wasted_capacity",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="flex items-center gap-1.5">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${value > 0
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        {formatCurrency(value)}
                    </div>
                </div>
            );
        }
    },
    {
        header: "Eficiencia",
        accessorKey: "efficiency_percentage",
        cell: (info) => {
            const value = info.getValue() as number;
            const isLow = value < 50;
            const textClass = isLow ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400';

            const progressColorClass = isLow
                ? '[&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500'
                : '[&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500';

            return (
                <div className="w-full max-w-[120px]">
                    <div className={`flex justify-between text-xs font-bold mb-1 ${textClass}`}>
                        <span>{value}%</span>
                    </div>
                    <progress
                        value={value}
                        max={100}
                        className={`
                            h-2 w-full appearance-none overflow-hidden rounded-full
                            bg-gray-100 dark:bg-gray-800
                            [&::-webkit-progress-bar]:bg-gray-100 dark:[&::-webkit-progress-bar]:bg-gray-800
                            ${progressColorClass}
                        `}
                    >
                        {value}%
                    </progress>
                </div>
            );
        }
    },
    {
        header: "Tráfico Procesado",
        accessorKey: "total_requests",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium border border-blue-100 dark:border-blue-900/50 min-w-[60px] text-center">
                        {value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">requests</span>
                </div>
            );
        }
    },
    {
        header: "Conexiones",
        accessorKey: "avg_current_connections",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium border border-indigo-100 dark:border-indigo-900/50 min-w-[40px] text-center">
                        {value.toFixed(2)}
                    </span>
                </div>
            );
        }
    }
];