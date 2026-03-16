'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Eye,
    Server,
    Moon,
    Sun,
    Scale,
    Calendar,
    ExternalLink,
    EqualApproximately
} from 'lucide-react';
import { useState } from 'react';
import { WorkingNonWorkingHoursUsageSummaryByResource, WorkingNonWorkingHoursUsageSummaryByResourceMetrics } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { formatGeneric, formatBytes } from '@/lib/bytesToMbs';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ConsumoHorarioInfoView, ConsumoHorarioMetricsView } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/info/ConsumoHorarioInsightModalComponent';
import { HistoryModal, HistoryModalTab } from '@/components/general_aws/modal/HistoryModal';

export const getMetricFormat = (metricName: string): 'percent' | 'bytes' | 'number' => {
    const lower = metricName.toLowerCase();
    if (lower.includes('cpuutilization') || lower.includes('percentage') || lower.includes('percent')) return 'percent';
    if (lower.includes('networkin') || lower.includes('networkout')) return 'bytes';
    return 'number';
};

export const formatMetricName = (name: string): string => {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const findMetric = (metrics: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[], metricName: string, schedule: string) => {
    return metrics.find(m =>
        m.metric_name === metricName &&
        m.schedule_type === schedule
    );
};

// Esta función se mantiene para el uso en GeneralTrendCell, 
// pero ya no se usa para determinar la visualización individual en DualMetricCell.
const getMetricTrend = (row: WorkingNonWorkingHoursUsageSummaryByResource, metricName: string) => {
    const summary = row.metric_activity_summary.find(s => s.metric_name === metricName);
    if (!summary) return 'balanced';
    return summary.highest_avg_schedule;
};

interface DualMetricCellProps {
    row: WorkingNonWorkingHoursUsageSummaryByResource;
    metricName: string;
    maxVal: number;
    format: 'percent' | 'bytes' | 'number';
}

const DualMetricCell = ({ row, metricName, maxVal, format }: DualMetricCellProps) => {
    const working = findMetric(row.metric_data, metricName, 'business_hours');
    const nonWorking = findMetric(row.metric_data, metricName, 'non_business_hours');

    const workingVal = working ? working.avg_value : 0;
    const nonWorkingVal = nonWorking ? nonWorking.avg_value : 0;

    const base = format === 'cpuutilization' ? 100 : maxVal;
    const pctWorking = base > 0 ? (workingVal / base) * 100 : 0;
    const pctNonWorking = base > 0 ? (nonWorkingVal / base) * 100 : 0;

    // Función de formateo
    const formatValue = (val: number) => {
        if (format === 'cpuutilization') return `${val.toFixed(1)}%`;
        if (format === 'networkin' || format === 'networkout') return formatBytes(val);
        return formatGeneric(val);
    };

    // 1. Obtenemos los valores visuales exactos
    const displayedWorkingValue = formatValue(workingVal);
    const displayedNonWorkingValue = formatValue(nonWorkingVal);

    // 2. Calculamos la tendencia basándonos en lo que ve el usuario (post-redondeo)
    let visualTrend: 'business_hours' | 'non_business_hours' | 'balanced' = 'balanced';

    if (displayedWorkingValue !== displayedNonWorkingValue) {
        // Solo si visualmente son distintos, miramos los datos crudos para ver quién gana
        if (workingVal > nonWorkingVal) {
            visualTrend = 'business_hours';
        } else if (nonWorkingVal > workingVal) {
            visualTrend = 'non_business_hours';
        }
    }

    const TrendIcon = () => {
        if (visualTrend === 'business_hours') return <Sun className="w-3 h-3 text-amber-500" />;
        if (visualTrend === 'non_business_hours') return <Moon className="w-3 h-3 text-purple-500" />;
        return null;
    };

    return (
        <div className="flex flex-col w-full min-w-[130px] gap-1.5 py-1 relative">
            <div className='flex justify-center items-center gap-2 min-h-[20px]'>
                {
                    visualTrend === 'business_hours' && (
                        <>
                            <TrendIcon className="w-3 h-3" />
                            <span className='text-xs'>Mayor uso en horario hábil</span>
                        </>
                    )
                }
                {
                    visualTrend === 'non_business_hours' && (
                        <>
                            <TrendIcon className="w-3 h-3" />
                            <span className='text-xs'>Mayor uso en horario no hábil</span>
                        </>
                    )
                }
                {
                    visualTrend === 'balanced' && (
                        <>
                            <Scale className="w-3 h-3" />
                            <span className='text-xs'>Balanceado</span>
                        </>
                    )
                }
                {/* Opcional: Espacio vacío o indicador de balanceado si son iguales */}
            </div>

            <div className={`flex flex-col gap-0.5 ${visualTrend === 'business_hours' ? 'opacity-100' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">Hábil</span>
                    <span className={`font-mono ${visualTrend === 'business_hours' ? 'font-bold text-amber-600' : ''}`}>
                        {displayedWorkingValue}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(pctWorking, 100)}%` }} />
                </div>
            </div>

            <div className={`flex flex-col gap-0.5 ${visualTrend === 'non_business_hours' ? 'opacity-100' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">No Hábil</span>
                    <span className={`font-mono ${visualTrend === 'non_business_hours' ? 'font-bold text-purple-600' : ''}`}>
                        {displayedNonWorkingValue}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(pctNonWorking, 100)}%` }} />
                </div>
            </div>
        </div>
    );
};

const GeneralTrendCell = ({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource }) => {
    let workingCount = 0;
    let nonWorkingCount = 0;

    row.metric_activity_summary.forEach(summary => {
        if (summary.highest_avg_schedule === 'business_hours') workingCount++;
        else if (summary.highest_avg_schedule === 'non_business_hours') nonWorkingCount++;
    });

    if (workingCount > nonWorkingCount) {
        return <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-200 flex w-fit items-center gap-1"><Sun className="w-3 h-3" /> Mayor uso general en horario hábil</Badge>;
    } else if (nonWorkingCount > workingCount) {
        return <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-200 flex w-fit items-center gap-1"><Moon className="w-3 h-3" /> Mayor uso general en horario no hábil</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px] flex w-fit items-center gap-1"><Scale className="w-3 h-3" /> Balanceado</Badge>;
};

const DetailsCell = ({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource }) => {
    const [isOpen, setIsOpen] = useState(false);

    const tabs: HistoryModalTab[] = [
        { value: "info", label: "Resumen", content: <ConsumoHorarioInfoView data={row} /> },
        { value: "metricas", label: "Detalle Métricas", content: <ConsumoHorarioMetricsView data={row} /> },
    ];

    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={row.resource_name} region={row.resource_id} resourceType="Compute Engine" tabs={tabs} />
        </>
    );
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const regionParam = searchParams.get('region');

    return {
        startDateParam,
        endDateParam,
        regionParam,
        pathname
    }
}

export const getConsumoHorarioColumns = (
    uniqueMetrics: string[],
    maxValues: Record<string, number>
): DynamicColumn<WorkingNonWorkingHoursUsageSummaryByResource>[] => {

    const metricColumns: DynamicColumn<WorkingNonWorkingHoursUsageSummaryByResource>[] = uniqueMetrics.map(metric => {
        const format = getMetricFormat(metric);
        return {
            header: formatMetricName(metric),
            id: metric,
            cell: ({ row }) => (
                <DualMetricCell
                    row={row.original}
                    metricName={metric}
                    maxVal={maxValues[metric] || 100}
                    format={format}
                />
            ),
            size: 220,
            enableSorting: true,
        };
    });

    return [
        {
            header: "Recurso",
            accessorKey: "resource_name",
            cell: (info) => {
                const { startDateParam, endDateParam, regionParam, pathname } = GetParameters();

                const isCloudSql = pathname.includes('cloud-sql');
                const redirectBaseUrl = isCloudSql ? '/aws/recursos' : '/aws/recursos';
                const resourcePath = info.getValue();

                let redirectUrl = '';
                if (pathname.includes('rds-mysql')) {
                    redirectUrl = `${redirectBaseUrl}/instancias-rds-mysql`;
                } else if (pathname.includes('rds-postgresql')) {
                    redirectUrl = `${redirectBaseUrl}/instancias-rds-pg`;
                } else if (pathname.includes('rds-sql')) {
                    redirectUrl = `${redirectBaseUrl}/instancias-rds-sqlserver`;
                } else if (pathname.includes('rds-oracle')) {
                    redirectUrl = `${redirectBaseUrl}/instancias-rds-oracle`;
                } else if (pathname.includes('rds-mariadb')) {
                    redirectUrl = `${redirectBaseUrl}/instancias-rds-mariadb`;
                } else {
                    redirectUrl = `${redirectBaseUrl}/instancias-ec2`;
                }

                const hrefObject = {
                    pathname: redirectUrl,
                    query: {
                        startDate: startDateParam,
                        endDate: endDateParam,
                        instance: resourcePath,
                        region: regionParam
                    }
                };

                return (
                    <div className="flex flex-col justify-center">
                        <Link
                            href={hrefObject}
                            className="group flex items-start gap-3 p-2 -ml-2 rounded-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <div className="mt-0.5 p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                                <Server className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline decoration-blue-300 underline-offset-2 transition-colors"
                                        title={info.getValue() as string}
                                    >
                                        {info.getValue() as string}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-500 transition-all duration-300 ease-out" />
                                </div>

                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                                    {info.row.original.resource_id}
                                </span>
                            </div>
                        </Link>
                    </div>
                )
            },
            size: 300,
            enableSorting: true
        },
        {
            header: "Fecha Observación",
            accessorKey: "sync_time",
            cell: (info) => (
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 max-w-[180px]" title={info.getValue() as string}>
                            {new Date(info.getValue()).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) as string}
                        </span>
                    </div>
                </div>
            ),
            size: 300,
            enableSorting: true
        },
        ...metricColumns,
        {
            header: "Tendencia Global",
            accessorKey: "metric_activity_summary",
            cell: ({ row }) => <GeneralTrendCell row={row.original} />,
            size: 250
        },
        {
            id: "actions",
            header: " ",
            cell: ({ row }) => <DetailsCell row={row.original} />,
            size: 150
        }
    ];
};