"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general/data-table/data-table-grouping"

type EC2Instance = {
    InstanceId: string
    InstanceType: string
    pricePerUnit_USD: number | string
    unit: string
    servicename: string
    sync_time_instance?: { $date: string }
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const Ec2TableComponent = ({
    startDateFormatted,
    endDateFormatted,
}: {
    startDateFormatted: string
    endDateFormatted: string
}) => {
    const { data, error, isLoading } = useSWR<{
        total_unique_instances: number
        total_price_usd: number
        instances: EC2Instance[]
    }>(
        startDateFormatted && endDateFormatted
            ? `/api/aws/bridge/saving-plans/ec2-instances-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
            : null,
        fetcher
    )

    const columns: ColumnDef<EC2Instance>[] = [
        {
            accessorKey: "InstanceId",
            header: "InstanceId",
        },
        {
            accessorKey: "pricePerUnit_USD",
            header: "Precio Unitario",
            cell: (info) => {
                const value = info.getValue()
                const num = typeof value === "string" ? parseFloat(value) : value
                return `$${num.toFixed(4)}`
            },
        },
        {
            accessorKey: "unit",
            header: "Unidad de Medida",
        },
        {
            accessorKey: "InstanceType",
            header: "Tipo de Instancia",
        },
        {
            accessorKey: "servicename",
            header: "Servicio",
        },
    ]

    if (isLoading) return <p>Cargando datos...</p>
    if (error) return <p>Error cargando datos</p>

    return (
        <DataTableGrouping
            columns={columns}
            data={data?.instances ?? []}
            filterColumn="InstanceId"
            filterPlaceholder="Buscar InstanceId…"
        />
    )
}
