'use client'

import useSWR from 'swr'
import { BarChart3, AlertCircle, Info, Cpu, MemoryStick, HardDrive, PowerOff, DollarSign } from 'lucide-react'
import { VmStatusChart } from '@/components/azure/vista-consumo-vm/graficos/VmStatusViewComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { MessageCard } from '@/components/azure/cards/MessageCards'
import { Card, CardContent } from '@/components/ui/card'
import { VmConsumeViewMemoryUsageComponent } from '@/components/azure/vista-consumo-vm/graficos/VmConsumeViewMemoryUsageComponent';
import { VmConsumeViewIopsUsageComponent } from '@/components/azure/vista-consumo-vm/graficos/VmConsumeViewIopsUsageComponent';
import { VmConsumeViewCpuUsageComponent } from '@/components/azure/vista-consumo-vm/graficos/VmConsumeViewCpuUsageComponent';


interface AzureVmMetricsProps {
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
    max_used?: number
    min_used?: number
}

// --- NUEVO ---
interface CostosEstimados {
    total_usd: number
    moneda: string
    nota: string
}

interface AveragesResponse {
    periodo: {
        desde: string
        hasta: string
    }
    estado_vms?: {
        porcentaje_promedio_apagadas: number
    }
    metricas: {
        cpu_cores?: MetricAverage
        memoria_gb?: MetricAverage
        discos_iops?: MetricAverage
    }
    costos_estimados?: CostosEstimados  // --- NUEVO ---
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AzureVmMetricsComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2

}: AzureVmMetricsProps) => {
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

        return `/api/azure/bridge/azure/consumo/consumo-vm?${params.toString()}`
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

        return `/api/azure/bridge/azure/consumo/consumo-vm/promedios?${params.toString()}`
    }

    // Función para construir URL de estado temporal (VMs encendidas/apagadas)
    const buildVmStatusUrl = () => {
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

        return `/api/azure/bridge/azure/consumo/consumo-vm/estado-temporal?${params.toString()}`
    }

    // Llamadas a la API para cada métrica
    const cpuMetrics = useSWR(buildApiUrl('Percentage CPU'), fetcher)
    const memoryMetrics = useSWR(buildApiUrl('Available Memory'), fetcher)
    const storageMetrics = useSWR(buildApiUrl('Disks IOPS'), fetcher)
    const averages = useSWR<AveragesResponse>(buildAveragesUrl(), fetcher)
    const vmStatus = useSWR(buildVmStatusUrl(), fetcher)

    const anyLoading = cpuMetrics.isLoading || memoryMetrics.isLoading || storageMetrics.isLoading || averages.isLoading || vmStatus.isLoading
    const anyError = !!cpuMetrics.error || !!memoryMetrics.error || !!storageMetrics.error || !!averages.error || !!vmStatus.error

    const cpuData = isNonEmptyArray(cpuMetrics.data) ? cpuMetrics.data : null
    const memoryData = isNonEmptyArray(memoryMetrics.data) ? memoryMetrics.data : null
    const storageData = isNonEmptyArray(storageMetrics.data) ? storageMetrics.data : null
    const vmStatusData = vmStatus.data?.datos && isNonEmptyArray(vmStatus.data.datos) ? vmStatus.data.datos : null

    const hasAnyData = !!cpuData || !!memoryData || !!storageData || !!vmStatusData

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
        averages.data?.metricas.memoria_gb,
        averages.data?.metricas.discos_iops,
        averages.data?.estado_vms,
        averages.data?.costos_estimados,  // --- NUEVO ---
    ].filter(Boolean).length

    const gridCols =
        metricCount === 5 ? 'md:grid-cols-5' :
        metricCount === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 my-5">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas de Maquinas Virtuales Azure</h1>
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
                                            {/* --- NUEVO: peaks --- */}
                                            {(averages.data.metricas.cpu_cores.max_used != null || averages.data.metricas.cpu_cores.min_used != null) && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Máx: {averages.data.metricas.cpu_cores.max_used?.toFixed(2)} · Mín: {averages.data.metricas.cpu_cores.min_used?.toFixed(2)} {averages.data.metricas.cpu_cores.unidad}
                                                </p>
                                            )}
                                        </div>
                                        <Cpu className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Memory Card */}
                        {averages.data.metricas.memoria_gb && (
                            <Card className="border-l-4 border-l-purple-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Promedio de Memoria (GB)</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {averages.data.metricas.memoria_gb.porcentaje_no_utilizado.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">No Utilizado</p>
                                            {/* --- NUEVO: peaks --- */}
                                            {(averages.data.metricas.memoria_gb.max_used != null || averages.data.metricas.memoria_gb.min_used != null) && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Máx: {averages.data.metricas.memoria_gb.max_used?.toFixed(2)} · Mín: {averages.data.metricas.memoria_gb.min_used?.toFixed(2)} {averages.data.metricas.memoria_gb.unidad}
                                                </p>
                                            )}
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
                                            {/* --- NUEVO: peaks --- */}
                                            {(averages.data.metricas.discos_iops.max_used != null || averages.data.metricas.discos_iops.min_used != null) && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Máx: {averages.data.metricas.discos_iops.max_used?.toFixed(2)} · Mín: {averages.data.metricas.discos_iops.min_used?.toFixed(2)} {averages.data.metricas.discos_iops.unidad}
                                                </p>
                                            )}
                                        </div>
                                        <HardDrive className="h-8 w-8 text-cyan-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* VMs Apagadas Card */}
                        {averages.data.estado_vms && (
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">VMs Apagadas</p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {averages.data.estado_vms.porcentaje_promedio_apagadas.toFixed(2)} %
                                            </p>
                                            <p className="text-xs text-muted-foreground">Promedio del Periodo</p>
                                        </div>
                                        <PowerOff className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* --- NUEVO: Costo Estimado Card COMENTADO PORQUE
                         NECESITAMOS UN CUAENTA ACTIVA PARA VALIDAR EL COSTO, TECNICAMENTE ESTA BUENO PERO NO HAY COMO VALIDAR--- */}
                        {/* {averages.data.costos_estimados && (
                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Costo Estimado</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                $ {averages.data.costos_estimados.total_usd.toFixed(4)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">USD · Período seleccionado</p>
                                            <p className="text-xs text-muted-foreground mt-1">{averages.data.costos_estimados.nota}</p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        )} */}
                    </div>
                )}

                {/* Gráfico de CPU */}
                {cpuData && <VmConsumeViewCpuUsageComponent data={cpuData} title='Consumo CPU' />}

                {/* Gráfico de Memoria */}
                {memoryData && <VmConsumeViewMemoryUsageComponent data={memoryData} title='Memoria Disponible' />}

                {/* Gráfico de Almacenamiento */}
                {storageData && <VmConsumeViewIopsUsageComponent data={storageData} title='IOPS Disco' />}

                {/* Gráfico de Estado VMs (Encendidas vs Apagadas) */}
                {vmStatusData && <VmStatusChart data={vmStatusData}/>}
            </div>
        </div>
    )
}