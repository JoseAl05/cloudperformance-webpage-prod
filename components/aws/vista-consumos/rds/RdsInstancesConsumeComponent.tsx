'use client'

import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import useSWR from 'swr'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react'
import { ConsumeViewRdsMetrics, ConsumeViewRdsPgCpuMetrics, ConsumeViewRdsPgCreditsMetrics, ConsumeViewRdsPgDbConnectionsMetrics, ConsumeViewRdsPgFreeStorageMetrics, RdsConsumeViewEfficiencyData, RdsConsumeViewInfo, RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces'
import { RdsInfoConsumeViewComponent } from '@/components/aws/vista-consumos/rds/info/RdsInfoConsumeViewComponent'
import { RdsConsumeViewUsageCpuComponent } from '@/components/aws/vista-consumos/rds/graficos/RdsConsumeViewUsageCpuComponent'
import { RdsConsumeViewUsageCreditsComponent } from '@/components/aws/vista-consumos/rds/graficos/RdsConsumeViewUsageCreditsComponent'
import { RdsConsumeViewDbConnectionsComponent } from '@/components/aws/vista-consumos/rds/graficos/RdsConsumeViewDbConnectionsComponent'
import { RdsConsumeViewFreeStorageComponent } from '@/components/aws/vista-consumos/rds/graficos/RdsConsumeViewFreeStorageComponent'
import { RdsConsumeViewInstanceTable } from '@/components/aws/vista-consumos/rds/table/RdsConsumeViewInstanceTable'
import { RdsConsumeViewChartComponent } from '@/components/aws/vista-consumos/rds/graficos/RdsConsumeViewChartComponent'
import { RdsInfoConsumeViewCardsComponent } from '@/components/aws/vista-consumos/rds/info/RdsInfoConsumeViewCardsComponent'

interface RdsInstancesConsumeComponentProps {
    startDate: Date
    endDate: Date
    instance: string
    region: string
    instancesService: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const RdsInstancesConsumeComponent = ({ startDate, endDate, instance, region, instancesService }: RdsPgInstancesConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = '/api/aws/bridge/rds/consumo_rds';
    let rdsType = '';
    switch (instancesService) {
        case 'rds-pg':
            rdsType = 'postgresql'
            break;
        case 'rds-mysql':
            rdsType = 'mysql'
            break;
        case 'rds-oracle':
            rdsType = 'oracle'
            break;
        case 'rds-sqlserver':
            rdsType = 'sqlserver'
            break;
        case 'rds-mariadb':
            rdsType = 'mariadb'
            break;
        default:
            break;
    }

    const rdsCpuMetrics = useSWR(
        instance
            ? `${url}/cpu_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsMemoryMetrics = useSWR(
        instance
            ? `${url}/memory?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsCreditsUsageMetrics = useSWR(
        instance
            ? `${url}/credits_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsCreditsBalanceMetrics = useSWR(
        instance
            ? `${url}/credits_balance?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsDbConnectionsMetrics = useSWR(
        instance
            ? `${url}/connections?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsFreeStorageMetrics = useSWR(
        instance
            ? `${url}/storage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsInfo = useSWR(
        instance
            ? `${url}/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );
    const rdsGlobalCreditsEfficiency = useSWR(
        instance
            ? `${url}/global_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}&db_type=${rdsType}`
            : null,
        fetcher
    );

    const anyLoading =
        rdsCpuMetrics.isLoading ||
        rdsCreditsUsageMetrics.isLoading ||
        rdsCreditsBalanceMetrics.isLoading ||
        rdsDbConnectionsMetrics.isLoading ||
        rdsFreeStorageMetrics.isLoading ||
        rdsGlobalCreditsEfficiency.isLoading ||
        rdsInfo.isLoading

    const anyError =
        !!rdsCpuMetrics.error ||
        !!rdsCreditsUsageMetrics.error ||
        !!rdsCreditsBalanceMetrics.error ||
        !!rdsDbConnectionsMetrics.error ||
        !!rdsFreeStorageMetrics.error ||
        !!rdsGlobalCreditsEfficiency.error ||
        !!rdsInfo.error

    const cpuMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsCpuMetrics.data) ? rdsCpuMetrics.data : null;

    const memoryMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsMemoryMetrics.data) ? rdsMemoryMetrics.data : null;

    const creditsUsageMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsCreditsUsageMetrics.data) ? rdsCreditsUsageMetrics.data : null;

    const creditsBalanceMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsCreditsBalanceMetrics.data) ? rdsCreditsBalanceMetrics.data : null;

    const dbConnectionsMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsDbConnectionsMetrics.data) ? rdsDbConnectionsMetrics.data : null;

    const freeStorageMetricsData: ConsumeViewRdsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsMetrics>(rdsFreeStorageMetrics.data) ? rdsFreeStorageMetrics.data : null;

    const infoData: RdsConsumeViewInfo | null = isNullish(rdsInfo.data) ? null : rdsInfo.data;

    const globalEfficiencyData: RdsConsumeViewEfficiencyData | null = isNullish(rdsGlobalCreditsEfficiency.data)
        ? null
        : rdsGlobalCreditsEfficiency.data

    const hasCpuData = !!cpuMetricsData && cpuMetricsData.length > 0;
    const hasCreditsUsageData = !!creditsUsageMetricsData && creditsUsageMetricsData.length > 0;
    const hasCreditsBalanceData = !!creditsBalanceMetricsData && creditsBalanceMetricsData.length > 0;
    const hasDbConnectionsData = !!dbConnectionsMetricsData && dbConnectionsMetricsData.length > 0;
    const hasFreeStorageData = !!freeStorageMetricsData && freeStorageMetricsData.length > 0;
    const hasMemoryData = !!memoryMetricsData && memoryMetricsData.length > 0;

    if (anyLoading) {
        return (
            <LoaderComponent />
        )
    }

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna instancia.</div>
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

    const noneHasData = !hasCpuData && !hasCreditsUsageData && !hasCreditsBalanceData && !hasDbConnectionsData && !hasFreeStorageData && !hasMemoryData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Tarjetas */}
            <RdsInfoConsumeViewCardsComponent
                summary={infoData?.resumen}
                instancias={infoData?.instancias || []}
                efficiency={globalEfficiencyData}
                isLoading={rdsInfo?.isLoading}
            />

            {/* Gráficos de métricas */}
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <RdsConsumeViewChartComponent
                    data={cpuMetricsData}
                    unit='%'
                    title='Uso de CPU'
                    metricName='CPUUtilization'
                />
                <RdsConsumeViewChartComponent
                    data={creditsUsageMetricsData}
                    unit='Créditos'
                    title='Uso Créditos de CPU'
                    metricName='CPUCreditUsage'
                />
                <RdsConsumeViewChartComponent
                    data={creditsBalanceMetricsData}
                    unit='Créditos'
                    title='Saldo Créditos de CPU'
                    metricName='CPUCreditBalance'
                />
                <RdsConsumeViewChartComponent
                    data={memoryMetricsData}
                    unit='Bytes'
                    title='Memoria Disponible'
                    metricName='FreeableMemory'
                />
                <RdsConsumeViewChartComponent
                    data={dbConnectionsMetricsData}
                    unit='Conexiones'
                    title='Conexiones a la Base de Datos'
                    metricName='DatabaseConnections'
                />
                <RdsConsumeViewChartComponent
                    data={freeStorageMetricsData}
                    unit='Bytes'
                    title='Almacenamiento Libre'
                    metricName='FreeStorageSpace'
                />
            </div>

            {/* Tabla */}
            <RdsConsumeViewInstanceTable data={infoData?.instancias || []} />
        </div>
        // <div className="w-full min-w-0 px-4 py-6">
        //     <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
        //         <RdsInfoConsumeViewComponent
        //             cpuData={cpuMetricsData}
        //             creditsData={creditsMetricsData}
        //             infoData={infoData}
        //             creditsGlobalEfficiency={globalEfficiencyData}
        //         />
        //     </div>

        //     <div className="flex flex-col gap-5 mt-10">
        //         <div className="flex items-center gap-3 my-5">
        //             <ChartBar className="h-8 w-8 text-blue-500" />
        //             <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
        //         </div>

        //         <RdsConsumeViewUsageCreditsComponent data={creditsMetricsData} />
        //         <RdsConsumeViewUsageCpuComponent data={cpuMetricsData} />
        //         <RdsConsumeViewDbConnectionsComponent data={dbConnectionsMetricsData} />
        //         <RdsConsumeViewFreeStorageComponent data={freeStorageMetricsData} />
        //     </div>
        //     <div className="flex flex-col gap-5 mt-10">
        //         <div className="flex items-center gap-3 my-5">
        //             <Clock className="h-8 w-8 text-blue-500" />
        //             <h1 className="text-3xl font-bold text-foreground">Detalle Instancias</h1>
        //         </div>
        //         <RdsConsumeViewInstanceTable
        //             data={infoData}
        //             startDate={startDate}
        //             endDate={endDate}
        //             instance={instance}
        //             enableGrouping
        //         />
        //     </div>
        // </div>
    )
}