"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent } from '@/components/ui/card'
import {
    CheckCircle2,
    XCircle,
    Clock,
    Package,
    Server,
    Activity
} from "lucide-react"

type VmDeploymentDetail = {
    resource_name: string
    resource_type: string
    resource_provider: string
    operation_name: string
    deployment_status: string
    event_timestamp: { $date: string }
}

type VmDeploymentsResponse = {
    total_deployments: number
    detalle: VmDeploymentDetail[]
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json())

const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        'Succeeded': { icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', label: 'Exitoso' },
        'Failed': { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Fallido' },
        'Started': { icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Iniciado' },
        'Accepted': { icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Aceptado' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Started']
    const Icon = config.icon

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    )
}

export const VmDeploymentsTableComponent = ({
    startDate,
    endDate,
    vmName,
}: {
    startDate: Date
    endDate: Date
    vmName: string
}) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const { data, error, isLoading } = useSWR<VmDeploymentsResponse>(
        startDateFormatted && endDateFormatted && vmName
            ? `/api/azure/bridge/azure/recursos/vm/deployments-detalle?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_id=${vmName}`
            : null,
        fetcher
    )

    const columns: ColumnDef<VmDeploymentDetail>[] = [
        {
            accessorKey: "event_timestamp",
            header: "Fecha y Hora",
            cell: (info) => {
                const value = info.getValue() as { $date: string }
                const date = new Date(value.$date)
                return (
                    <div className="text-sm">
                        <div className="font-medium">{date.toLocaleTimeString('es-ES')}</div>
                        <div className="text-xs text-gray-500">
                            {date.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "operation_name",
            header: "Operación",
            cell: (info) => {
                const value = info.getValue() as string
                return (
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">{value}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "deployment_status",
            header: "Estado",
            cell: (info) => <StatusBadge status={info.getValue() as string} />,
        },
        {
            accessorKey: "resource_type",
            header: "Tipo de Recurso",
            cell: (info) => {
                const value = info.getValue() as string
                return (
                    <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-700">{value}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "resource_provider",
            header: "Proveedor",
            cell: (info) => (
                <span className="text-sm text-gray-600 font-mono">{info.getValue() as string}</span>
            ),
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando detalles de deployments...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">Error cargando datos</span>
                </div>
                <p className="text-sm text-red-600 mt-1">No se pudieron obtener los datos de deployments</p>
            </div>
        )
    }

    if (!data || !data.detalle || data.detalle.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay datos disponibles</h3>
                <p className="text-gray-600">No se encontraron deployments para el período seleccionado</p>
            </div>
        )
    }

    // Calcular estadísticas
    const totalDeployments = data.total_deployments

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Tabla de detalles - 3 columnas */}
            <div className="lg:col-span-3 bg-white rounded-lg border shadow-sm p-6 h-full">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        Últimos Deployments
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Historial de operaciones en {vmName}
                    </p>
                </div>

                <DataTableGrouping
                    columns={columns}
                    data={data.detalle}
                    enableGrouping
                    groupByColumn='operation_name'
                    filterColumn="operation_name"
                    filterPlaceholder="Buscar por operación"
                />
            </div>

            {/* Tarjeta de Total - 1 columna */}
            <div className="lg:col-span-1 h-full">
                <Card className="border-l-4 border-l-blue-500 h-full flex flex-col">
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Deployments</p>
                                <p className="text-6xl font-bold text-blue-600">
                                    {totalDeployments.toLocaleString('es-ES', { minimumIntegerDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">Operaciones registradas</p>
                            </div>
                            <Activity className="h-12 w-12 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}