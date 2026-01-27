"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import {
    Server,
    Database,
    Package,
    DollarSign,
    Clock,
    Shield
} from "lucide-react"

type InstanciaSavingsPlan = {
    nombre_recurso: string
    instance_name_completo: string
    producto: string
    meter_name: string
    meter_sub_category: string
    resource_group: string
    resource_location: string
    subscription_name: string
    benefit_name: string
    service_family: string
    categoria: string
    unidad: string
    modelo: string
    precio_unitario: number
    precio_payg: number
    servicio: string
}

type ApiResponse = {
    instancias: InstanciaSavingsPlan[]
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json())

const ModeloBadge = ({ modelo }: { modelo: string }) => {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3" />
            {modelo}
        </span>
    )
}

export const SavingsPlanInstancesTable = ({
    startDateFormatted,
    endDateFormatted,
}: {
    startDateFormatted: string
    endDateFormatted: string
}) => {
    const { data, error, isLoading } = useSWR<ApiResponse>(
        startDateFormatted && endDateFormatted
            ? `/api/azure/bridge/azure/saving-plan/detalle_instancias?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
            : null,
        fetcher
    )

    const columns: ColumnDef<InstanciaSavingsPlan>[] = [
        {
            accessorKey: "categoria",
            header: "Categoría",
        },
        {
            accessorKey: "nombre_recurso",
            header: "Nombre Recurso",
            cell: (info) => {
                const value = info.getValue() as string
                return (
                    <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">{value}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "producto",
            header: "Producto",
            cell: (info) => {
                const value = info.getValue() as string
                const shortValue = value.length > 80 ? value.substring(0, 80) + '...' : value
                return (
                    <span className="text-sm text-gray-700" title={value}>
                        {shortValue}
                    </span>
                )
            },
        },
        {
            accessorKey: "meter_name",
            header: "Meter Name",
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">{info.getValue() as string}</span>
                </div>
            ),
        },
        {
            accessorKey: "unidad",
            header: "Unidad",
            cell: (info) => (
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">{info.getValue() as string}</span>
                </div>
            ),
        },
        {
            accessorKey: "precio_unitario",
            header: "Precio Unitario",
            cell: (info) => (
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                        {(info.getValue() as number)}
                    </span>
                </div>
            ),
        },
        // {
        //     accessorKey: "resource_location",
        //     header: "Ubicación",
        //     cell: (info) => (
        //         <div className="flex items-center gap-2">
        //             <MapPin className="h-4 w-4 text-orange-500" />
        //             <span className="text-sm text-gray-700">{info.getValue() as string}</span>
        //         </div>
        //     ),
        // },
        // {
        //     accessorKey: "resource_group",
        //     header: "Resource Group",
        //     cell: (info) => (
        //         <span className="text-xs text-gray-600 font-mono">{info.getValue() as string}</span>
        //     ),
        // },
        // {
        //     accessorKey: "subscription_name",
        //     header: "Suscripción",
        //     cell: (info) => (
        //         <span className="text-sm text-gray-700">{info.getValue() as string}</span>
        //     ),
        // },
        // {
        //     accessorKey: "service_family",
        //     header: "Service Family",
        //     cell: (info) => (
        //         <span className="text-sm text-gray-600">{info.getValue() as string}</span>
        //     ),
        // },
        // {
        //     accessorKey: "servicio",
        //     header: "Servicio",
        //     cell: (info) => (
        //         <span className="text-xs text-gray-500 font-mono">{info.getValue() as string}</span>
        //     ),
        // },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando instancias de Savings Plan...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Error cargando datos</span>
                </div>
                <p className="text-sm text-red-600 mt-1">No se pudieron obtener los datos de instancias</p>
            </div>
        )
    }

    if (!data || !data.instancias || data.instancias.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
                <Server className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay instancias disponibles</h3>
                <p className="text-gray-600">No se encontraron instancias cubiertas por Savings Plan en el período seleccionado</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
            </div>
            
            <DataTableGrouping
                columns={columns}
                data={data.instancias}
                filterColumn="nombre_recurso"
                filterPlaceholder="Buscar por nombre de recurso"
                enableGrouping={false}
                groupByColumn="categoria"
                pageSizeGroups={10}
                pageSizeItems={10}
            />
        </div>
    )
}