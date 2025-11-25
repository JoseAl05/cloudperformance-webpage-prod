"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general_aws/data-table/data-table-grouping"

type LambdaFunction = {
    service: string
    function_name: string
    memory_size: number
    memory_size_gb: number
    region: string
    runtime: string
    timeout: number
    arn: string
    last_modified?: string
    retrieved_at?: { $date: string }
    gb_second_price: number
    request_price: number
    estimated_cost_per_invocation: number
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const LambdaTableComponent = ({
    startDateFormatted,
    endDateFormatted,
}: {
    startDateFormatted: string
    endDateFormatted: string
}) => {
    const { data, error, isLoading } = useSWR<{
        total_unique_functions: number
        functions: LambdaFunction[]
    }>(
        startDateFormatted && endDateFormatted
            ? `/api/aws/bridge/saving-plans/lambda-functions-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
            : null,
        fetcher
    )

    const columns: ColumnDef<LambdaFunction>[] = [
        {
            accessorKey: "service",
            header: "Servicio",
        },
        {
            accessorKey: "function_name",
            header: "Función",
        },
        {
            accessorKey: "region",
            header: "Región",
        },
        {
            accessorKey: "memory_size",
            header: "Memoria (MB)",
        },
        {
            accessorKey: "memory_size_gb",
            header: "Memoria (GB)",
            cell: (info) => {
                const value = info.getValue<number>()
                return value ? value.toFixed(2) : "-"
            },
        },
        {
            accessorKey: "gb_second_price",
            header: "Precio GB/s",
            cell: (info) => {
                const value = info.getValue<number>()
                return value ? `$${value.toFixed(8)}` : "-"
            },
        },
    ]

    if (isLoading) return <p>Cargando datos...</p>
    if (error) return <p>Error cargando datos</p>

    return (
        <DataTableGrouping
            columns={columns}
            data={data?.functions ?? []}
            filterColumn="function_name"
            filterPlaceholder="Buscar función…"
            groupByColumn='function_name'
            enableGrouping
        />
    )
}
