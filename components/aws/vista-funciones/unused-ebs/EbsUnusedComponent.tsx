'use client'

import { LoaderComponent } from '@/components/general/LoaderComponent'
import { UnusedEbsApiResponse, UnusedEbsMetric, UnusedEbsVolumeInfo } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces'
import useSWR from 'swr'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react'
import { EbsUnusedViewInfoComponent } from '@/components/aws/vista-funciones/unused-ebs/info/EbsUnusedViewInfoComponent'
import { useMemo } from 'react'
import { EbsUnusedViewTableComponent } from '@/components/aws/vista-funciones/unused-ebs/table/EbsUnusedViewTableComponent'
import { EbsUnusedViewMetricsComponentComponent } from '@/components/aws/vista-funciones/unused-ebs/gráficos/EbsUnusedViewMetricsComponent'

interface EbsUnusedComponentProps {
    startDate: Date,
    endDate: Date,
    ebs: string,
    region: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const EbsUnusedComponent = ({ startDate, endDate, ebs, region }: EbsUnusedComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const unusedEbs = useSWR(
        ebs ? `/api/aws/bridge/ebs/ebs_unused?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${ebs}` : null,
        fetcher
    )

    const anyLoading =
        unusedEbs.isLoading;

    const anyError =
        !!unusedEbs.error;

    const ebsData: UnusedEbsApiResponse[] | null =
        isNonEmptyArray<UnusedEbsApiResponse>(unusedEbs.data) ? unusedEbs.data : null;

    const hasData = !!ebsData && ebsData.length > 0;

    const unusedEbsVolumeInfoForTable: UnusedEbsVolumeInfo[] = useMemo(() => {
        if (!ebsData) return [];

        return ebsData.flatMap(row =>
            (row.ebs_info ?? []).map(vol => ({
                sync_time: row.sync_time, // ojo, sync_time viene de row, no de vol
                ...vol
            }))
        );
    }, [ebsData]);

    const ebsMetricsData: UnusedEbsMetric[] = useMemo(() => {
        if (!ebsData) return [];

        return ebsData.flatMap(row =>
            (row.ebs_info ?? []).flatMap(vol =>
                (vol.ebs_metrics ?? []).map(m => ({
                    metric_label: m.metric_label,
                    timestamp: m.timestamp,
                    value: m.value,
                    ebs_name: vol.ebs_name
                }))
            )
        );
    }, [ebsData]);

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!ebs) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún volúmen ebs.</div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }
    const noneHasData = !hasData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los volúmen/es en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <EbsUnusedViewInfoComponent ebsData={ebsData} />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        {/* <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} /> */}
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas Volúmenes EBS</h1>
                    </div>
                    <EbsUnusedViewMetricsComponentComponent
                        data={ebsMetricsData}
                        metricLabels='VolumeIdleTime Average'
                        title='Promedio de tiempo inactivo de volúmenes'
                        unitMeasure='Segundos'
                    />
                    <EbsUnusedViewMetricsComponentComponent
                        data={ebsMetricsData}
                        metricLabels={['VolumeReadOps Average', 'VolumeWriteOps Average']}
                        title='Promedio de operaciones de escritura y lectura'
                        unitMeasure='OPS'
                    />
                    <EbsUnusedViewMetricsComponentComponent
                        data={ebsMetricsData}
                        metricLabels='BurstBalance Average'
                        title='Promedio del % de reserva de rendimiento'
                        unitMeasure='%'
                    />
                    {/* <Ec2ResourceViewUsageCreditsComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageCpuComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageNetworkComponent
                        data={metricsData}
                    /> */}
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Volúmenes no utilizados</h1>
                </div>
                <EbsUnusedViewTableComponent
                    data={unusedEbsVolumeInfoForTable}
                    startDate={startDate}
                    endDate={endDate}
                    instance={ebs}
                />
            </div>
        </>
    )
}