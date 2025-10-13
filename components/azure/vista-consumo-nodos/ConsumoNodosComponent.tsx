'use client'

import useSWR from 'swr'
import { BarChart3, AlertCircle, Info, Cpu, MemoryStick, HardDrive, PowerOff } from 'lucide-react'
import { AzureCpuUsageComponent, AzureMemoryUsageComponent, AzureStorageUsageComponent } from './graficos/NodosConsumeViewUsageComponent'
import  NodeStatusChart  from './graficos/NodosStatusViewComponent';
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '../cards/MessageCards'
import { Card, CardContent } from '@/components/ui/card'


interface AzureNodeMetricsProps {
    startDate: Date
    endDate: Date
    subscription: string
    region: string
    selectedTagKey: string 
    selectedTagValue: string 
    selectedResourceGroup: string
    selectedInstanceV2: string
}

interface MetricAverage {
    nombre_original: string
    porcentaje_no_utilizado: number
    unidad: string
    total_registros: number
}

interface AveragesResponse {
    periodo: {
        desde: string
        hasta: string
    }
    estado_nodos?: {
        porcentaje_promedio_apagados: number
    }
    metricas: {
        cpu_cores?: MetricAverage
        memoria_bytes?: MetricAverage
        discos_iops?: MetricAverage
    }
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AzureNodeMetricsComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2

}: AzureNodeMetricsProps) => {
    const startDateFormatted = startDate.toISOString().split('.')[0]
    const endDateFormatted = endDate.toISOString().split('.')[0]

    // Función para construir URL
    const buildApiUrl = (metricName: string) => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            metric_name: metricName,
            subscription_id: subscription,
            location: region,
            resource_group: selectedResourceGroup,
            vm_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-nodos?${params.toString()}`
    }

    // Función para construir URL de promedios
    const buildAveragesUrl = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            subscription_id: subscription,
            location: region,
            resource_group: selectedResourceGroup,
            vm_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-nodos/promedios?${params.toString()}`
    }

    // Función para construir URL de estado temporal (Nodos encendidos/apagados)
    const buildNodeStatusUrl = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            subscription_id: subscription,
            location: region,
            resource_group: selectedResourceGroup,
            vm_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-nodos/estado-temporal?${params.toString()}`
    }

    // Llamadas a la API para cada métrica
    const cpuMetrics = useSWR(buildApiUrl('Percentage CPU'), fetcher)
    const memoryMetrics = useSWR(buildApiUrl('Available Memory Bytes'), fetcher)
    const storageMetrics = useSWR(buildApiUrl('Disks IOPS'), fetcher)
    const averages = useSWR<AveragesResponse>(buildAveragesUrl(), fetcher)
    const nodeStatus = useSWR(buildNodeStatusUrl(), fetcher)

    const anyLoading = cpuMetrics.isLoading || memoryMetrics.isLoading || storageMetrics.isLoading || averages.isLoading || nodeStatus.isLoading
    const anyError = !!cpuMetrics.error || !!memoryMetrics.error || !!storageMetrics.error || !!averages.error || !!nodeStatus.error

    const cpuData = isNonEmptyArray(cpuMetrics.data) ? cpuMetrics.data : null
    const memoryData = isNonEmptyArray(memoryMetrics.data) ? memoryMetrics.data : null
    const storageData = isNonEmptyArray(storageMetrics.data) ? storageMetrics.data : null
    const nodeStatusData = nodeStatus.data?.datos && isNonEmptyArray(nodeStatus.data.datos) ? nodeStatus.data.datos : null

    const hasAnyData = !!cpuData || !!memoryData || !!storageData || !!nodeStatusData

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!subscription || !region) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    No se ha seleccionado subscription o region.
                </div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API."
                    tone="error"
                />
            </div>
        )
    }

    if (!hasAnyData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No se encontraron métricas en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    // Determinar el número de columnas según las métricas disponibles
    const metricCount = [
        averages.data?.metricas.cpu_cores,
        averages.data?.metricas.memoria_bytes,
        averages.data?.metricas.discos_iops,
        averages.data?.estado_nodos
    ].filter(Boolean).length

    const gridCols = metricCount === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 my-5">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas de Nodos Azure</h1>
                </div>

                {/* KPI Cards */}
                {averages.data && (
                    <div className={`grid grid-cols-1 ${gridCols} gap-4 mb-6`}>
                        {/* CPU Card */}
                        {averages.data.metricas.cpu_cores && (
                            <Card className="border-l-4 border-l-blue-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de CPU (Cores)</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {averages.data.metricas.cpu_cores.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizados</p>
                                        </div>
                                        <Cpu className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Memory Card */}
                        {averages.data.metricas.memoria_bytes && (
                            <Card className="border-l-4 border-l-purple-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de Memoria (GB)</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {averages.data.metricas.memoria_bytes.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                        </div>
                                        <MemoryStick className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Disks Card */}
                        {averages.data.metricas.discos_iops && (
                            <Card className="border-l-4 border-l-cyan-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de Discos (IOPS)</p>
                                            <p className="text-2xl font-bold text-cyan-600">
                                                {averages.data.metricas.discos_iops.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                        </div>
                                        <HardDrive className="h-8 w-8 text-cyan-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Nodos Apagados Card */}
                        {averages.data.estado_nodos && (
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Nodos Apagados</p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {averages.data.estado_nodos.porcentaje_promedio_apagados.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">Promedio del Periodo</p>
                                        </div>
                                        <PowerOff className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Gráfico de CPU */}
                {cpuData && <AzureCpuUsageComponent data={cpuData} />}

                {/* Gráfico de Memoria */}
                {memoryData && <AzureMemoryUsageComponent data={memoryData} />}

                {/* Gráfico de Almacenamiento */}
                {storageData && <AzureStorageUsageComponent data={storageData} />}

                {/* Gráfico de Estado Nodos (Encendidos vs Apagados) */}
                {nodeStatusData && <NodeStatusChart data={nodeStatusData} />}
            </div>
        </div>
    )
}