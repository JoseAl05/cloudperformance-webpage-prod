"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general/data-table/data-table-grouping"
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar,
    Package,
    ExternalLink
} from "lucide-react"

type DeploymentDetail = {
    id_deployment: string
    operation_name: string
    resource_id: string
    resource_group: string
    subscription_id: string
    event_timestamp: { $date: string }
    deployment_status: string
    date?: string // Para agrupar
}

type DeploymentGroup = {
    deployments_ids: string[]
    details: DeploymentDetail[]
    total_deployments: number
    date: string
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

export const DeploymentsDetailsTableComponent = ({
    startDateFormatted,
    endDateFormatted,
    selectedOperation,
}: {
    startDateFormatted: string
    endDateFormatted: string
    selectedOperation: string
}) => {
    const { data, error, isLoading } = useSWR<DeploymentGroup[]>(
        startDateFormatted && endDateFormatted
            ? `/api/azure/bridge/azure/deployments/deployments-detalles?date_from=${startDateFormatted}&date_to=${endDateFormatted}&operation_name=${selectedOperation}`
            : null,
        fetcher
    )

    const columns: ColumnDef<DeploymentDetail>[] = [
        {
            accessorKey: "date",
            header: "Fecha",
            // cell: (info) => {
            //     const value = info.getValue() as string
            //     if (!value) return '—'
            //     const date = new Date(value)
            //     return (
            //         <div className="flex items-center gap-2">
            //             <Calendar className="h-4 w-4 text-gray-400" />
            //             <span className="font-medium">
            //                 {date.toLocaleDateString('es-ES', { 
            //                     day: 'numeric', 
            //                     month: 'short', 
            //                     year: 'numeric' 
            //                 })}
            //             </span>
            //         </div>
            //     )
            // },
        },
        {
            accessorKey: "event_timestamp",
            header: "Hora",
            cell: (info) => {
                const value = info.getValue() as { $date: string }
                const date = new Date(value.$date)
                return (
                    <div className="text-sm">
                        <div className="font-medium">{date.toLocaleTimeString('es-ES')}</div>
                        <div className="text-xs text-gray-500">
                            {date.toLocaleDateString('es-ES')}
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
            accessorKey: "resource_group",
            header: "Grupo de Recursos",
            cell: (info) => (
                <span className="text-sm text-gray-700">{info.getValue() as string}</span>
            ),
        },
        {
            accessorKey: "resource_id",
            header: "Resource ID",
            cell: (info) => {
                const value = info.getValue() as string
                const shortId = value.length > 60 ? value.substring(0, 60) + '...' : value
                return (
                    <div className="flex items-center gap-2 max-w-md">
                        <span className="text-xs text-gray-600 font-mono truncate" title={value}>
                            {shortId}
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    </div>
                )
            },
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

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay datos disponibles</h3>
                <p className="text-gray-600">No se encontraron deployments para el período seleccionado</p>
            </div>
        )
    }

    // Aplanar los datos y agregar la fecha a cada detalle
    const flattenedDetails = data.flatMap(group => 
        group.details.map(detail => ({
            ...detail,
            date: group.date // Agregamos la fecha del grupo a cada detalle
        }))
    )

    // Calcular estadísticas generales
    const totalDeployments = flattenedDetails.length
    const successCount = flattenedDetails.filter(d => d.deployment_status === 'Succeeded').length
    const failedCount = flattenedDetails.filter(d => d.deployment_status === 'Failed').length
    const uniqueResourceGroups = new Set(flattenedDetails.map(d => d.resource_group)).size

    return (
        <div className="space-y-6">
            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white p-4 rounded-lg border shadow-sm border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Deployments</p>
                            <p className="text-2xl font-bold text-blue-600">{totalDeployments}</p>
                            <p className="text-xs text-gray-500">Todos los deployments</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Exitosos</p>
                            <p className="text-2xl font-bold text-green-600">{successCount}</p>
                            <p className="text-xs text-gray-500">
                                {totalDeployments > 0 ? ((successCount / totalDeployments) * 100).toFixed(1) : 0}% del total
                            </p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Fallidos</p>
                            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                            <p className="text-xs text-gray-500">
                                {totalDeployments > 0 ? ((failedCount / totalDeployments) * 100).toFixed(1) : 0}% del total
                            </p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Tabla de detalles con agrupación por fecha */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        Detalles de Deployments
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Agrupados por fecha con información detallada de cada deployment
                    </p>
                </div>
                
                <DataTableGrouping
                    columns={columns}
                    data={flattenedDetails}
                    filterColumn="operation_name"
                    filterPlaceholder="Buscar por operación"
                    enableGrouping={true}
                    groupByColumn="date"
                    pageSizeGroups={10}
                    pageSizeItems={10}
                />
            </div>
        </div>
    )
}