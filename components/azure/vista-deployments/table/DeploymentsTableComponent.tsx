"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import {
    CheckCircle2,
    XCircle,
    Clock,
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
    user_caller: string
    date?: string
}

type DeploymentGroup = {
    deployments_ids: string[]
    details: DeploymentDetail[]
    total_deployments: number
    date: string
}

interface DeploymentsDetailsTableComponentProps {
    data: DeploymentGroup[];
}

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

export const DeploymentsDetailsTableComponent = ({ data }: DeploymentsDetailsTableComponentProps) => {
    const columns: ColumnDef<DeploymentDetail>[] = [
        {
            accessorKey: "date",
            header: "Fecha",
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
        {
            accessorKey: "user_caller",
            header: "Usuario",
            cell: (info) => (
                <span className="text-sm text-gray-700">{info.getValue() as string}</span>
            ),
        },
    ]
    const flattenedDetails = data.flatMap(group =>
        group.details.map(detail => ({
            ...detail,
            date: group.date
        }))
    )

    const totalDeployments = flattenedDetails.length
    const successCount = flattenedDetails.filter(d => d.deployment_status === 'Succeeded').length
    const failedCount = flattenedDetails.filter(d => d.deployment_status === 'Failed').length
    const uniqueResourceGroups = new Set(flattenedDetails.map(d => d.resource_group)).size

    return (
        <div className="space-y-6">
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