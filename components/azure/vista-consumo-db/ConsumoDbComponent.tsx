'use client'

import useSWR from 'swr'
import { Database, AlertCircle, Info, Cpu, MemoryStick, HardDrive, PowerOff } from 'lucide-react'
import { AzureDbCpuUsageComponent, AzureDbMemoryUsageComponent, AzureDbStorageUsageComponent, AzureDbStoragePercentComponent} from '@/components/azure/vista-consumo-db/graficos/DbConsumeViewUsageComponent'
import DbStatusChart from '@/components/azure/vista-consumo-db/graficos/DbStatusViewComponent'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '@/components/azure/cards/MessageCards'
import { Card, CardContent } from '@/components/ui/card'

interface AzureDbMetricsProps {
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
    estado_dbs?: {
        porcentaje_promedio_apagadas: number
    }
    metricas: {
        backup_storage_usado?: MetricAverage
        memoria_porcentaje?: MetricAverage
        cpu_porcentaje?: MetricAverage
        log_storage_porcentaje?: MetricAverage
        log_storage_usado?: MetricAverage
        storage_porcentaje?: MetricAverage
        storage_usado?: MetricAverage
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

export const AzureDbMetricsComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2
}: AzureDbMetricsProps) => {
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
            resource_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-db?${params.toString()}`
    }

    // Función para construir URL de promedios
    const buildAveragesUrl = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            subscription_id: subscription,
            location: region,
            resource_group: selectedResourceGroup,
            resource_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-db/promedios?${params.toString()}`
    }

    // Función para construir URL de estado temporal (DBs encendidas/apagadas)
    const buildDbStatusUrl = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            subscription_id: subscription,
            location: region,
            resource_group: selectedResourceGroup,
            resource_name: selectedInstanceV2,
        })

        if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey)
        }

        if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
            params.append('valor_tag', selectedTagValue)
        }

        return `/api/azure/bridge/azure/consumo/consumo-db/estado-temporal?${params.toString()}`
    }

    // Llamadas a la API para cada métrica
    const cpuMetrics = useSWR(buildApiUrl('Percentage CPU'), fetcher)
    const memoryMetrics = useSWR(buildApiUrl('Memory Percent'), fetcher)
    const storageUsedMetrics = useSWR(buildApiUrl('Storage Used'), fetcher)
    const storagePercentMetrics = useSWR(buildApiUrl('Storage Percent'), fetcher)
    const backupStorageMetrics = useSWR(buildApiUrl('Backup Storage Used'), fetcher)
    const logStorageUsedMetrics = useSWR(buildApiUrl('Server Log Storage Used'), fetcher)
    const logStoragePercentMetrics = useSWR(buildApiUrl('Server Log Storage Percent'), fetcher)
    const averages = useSWR<AveragesResponse>(buildAveragesUrl(), fetcher)
    const dbStatus = useSWR(buildDbStatusUrl(), fetcher)

    const anyLoading = cpuMetrics.isLoading || memoryMetrics.isLoading || 
                       storageUsedMetrics.isLoading || storagePercentMetrics.isLoading ||
                       backupStorageMetrics.isLoading || logStorageUsedMetrics.isLoading ||
                       logStoragePercentMetrics.isLoading || averages.isLoading || dbStatus.isLoading

    const anyError = !!cpuMetrics.error || !!memoryMetrics.error || 
                     !!storageUsedMetrics.error || !!storagePercentMetrics.error ||
                     !!backupStorageMetrics.error || !!logStorageUsedMetrics.error ||
                     !!logStoragePercentMetrics.error || !!averages.error || !!dbStatus.error

    const cpuData = isNonEmptyArray(cpuMetrics.data) ? cpuMetrics.data : null
    const memoryData = isNonEmptyArray(memoryMetrics.data) ? memoryMetrics.data : null
    const storageUsedData = isNonEmptyArray(storageUsedMetrics.data) ? storageUsedMetrics.data : null
    const storagePercentData = isNonEmptyArray(storagePercentMetrics.data) ? storagePercentMetrics.data : null
    const backupStorageData = isNonEmptyArray(backupStorageMetrics.data) ? backupStorageMetrics.data : null
    const logStorageUsedData = isNonEmptyArray(logStorageUsedMetrics.data) ? logStorageUsedMetrics.data : null
    const logStoragePercentData = isNonEmptyArray(logStoragePercentMetrics.data) ? logStoragePercentMetrics.data : null
    const dbStatusData = dbStatus.data?.datos && isNonEmptyArray(dbStatus.data.datos) ? dbStatus.data.datos : null

    const hasAnyData = !!cpuData || !!memoryData || !!storageUsedData || !!storagePercentData || 
                       !!backupStorageData || !!logStorageUsedData || !!logStoragePercentData || !!dbStatusData

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
        averages.data?.metricas.cpu_porcentaje,
        averages.data?.metricas.memoria_porcentaje,
        averages.data?.metricas.storage_usado,
        averages.data?.estado_dbs
    ].filter(Boolean).length

    const gridCols = metricCount === 4 ? 'md:grid-cols-4' : metricCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 my-5">
                    <Database className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas de Bases de Datos Azure</h1>
                </div>

                {/* KPI Cards */}
                {averages.data && (
                    <div className={`grid grid-cols-1 ${gridCols} gap-4 mb-6`}>
                        {/* CPU Card */}
                        {averages.data.metricas.cpu_porcentaje && (
                            <Card className="border-l-4 border-l-blue-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de CPU (%)</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {averages.data.metricas.cpu_porcentaje.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                        </div>
                                        <Cpu className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Memory Card */}
                        {averages.data.metricas.memoria_porcentaje && (
                            <Card className="border-l-4 border-l-purple-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de Memoria (%)</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {averages.data.metricas.memoria_porcentaje.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                        </div>
                                        <MemoryStick className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Storage Card */}
                        {averages.data.metricas.storage_usado && (
                            <Card className="border-l-4 border-l-cyan-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de Storage</p>
                                            <p className="text-2xl font-bold text-cyan-600">
                                                {averages.data.metricas.storage_usado.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                        </div>
                                        <HardDrive className="h-8 w-8 text-cyan-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* DBs Apagadas Card */}
                        {averages.data.estado_dbs && (
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">DBs Apagadas</p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {averages.data.estado_dbs.porcentaje_promedio_apagadas.toFixed(2)} %
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
                {cpuData && <AzureDbCpuUsageComponent data={cpuData} />}

                {/* Gráfico de Memoria */}
                {memoryData && <AzureDbMemoryUsageComponent data={memoryData} />}

                {/* Gráfico de Storage Usado */}
                {storageUsedData && <AzureDbStorageUsageComponent data={storageUsedData} />}

                {/* Gráfico de Storage Porcentaje */}
                {storagePercentData && <AzureDbStoragePercentComponent data={storagePercentData} />}

                {/* Gráfico de Estado DBs (Encendidas vs Apagadas) */}
                {dbStatusData && <DbStatusChart data={dbStatusData} />}
            </div>
        </div>
    )
}