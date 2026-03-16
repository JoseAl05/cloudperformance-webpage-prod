'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { WorkingNonWorkingHoursUsage } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';

interface ConsumoHorarioChartComponentProps {
    data: WorkingNonWorkingHoursUsage[];
}

const SingleMetricChart = ({ metricName, data }: { metricName: string, data: WorkingNonWorkingHoursUsage[] }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        // 1. Ordenar por fecha estricta
        const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const businessDataPoints: [string, number | null][] = [];
        const nonBusinessDataPoints: [string, number | null][] = [];

        const businessValues: number[] = [];
        const nonBusinessValues: number[] = [];

        // 2. Mapeo "Espejo"
        // En lugar de inventar fechas, iteramos la data real.
        // Para cada punto, asignamos valor a su serie correspondiente y NULL a la contraria.
        // Esto garantiza que los puntos del mismo tipo se unan, pero se corten al cambiar de tipo.
        sortedData.forEach(item => {
            const isNonWorking = item.schedule_type.toLowerCase().includes('non') || item.schedule_type.toLowerCase().includes('no');

            if (isNonWorking) {
                // Es No Hábil: Dato al rojo, Null al azul
                nonBusinessDataPoints.push([item.timestamp, item.metric_value]);
                businessDataPoints.push([item.timestamp, null]);
                nonBusinessValues.push(item.metric_value);
            } else {
                // Es Hábil: Dato al azul, Null al rojo
                businessDataPoints.push([item.timestamp, item.metric_value]);
                nonBusinessDataPoints.push([item.timestamp, null]);
                businessValues.push(item.metric_value);
            }
        });

        // 3. Cálculos estadísticos (solo con valores reales)
        const businessAvg = businessValues.length > 0
            ? businessValues.reduce((sum, val) => sum + val, 0) / businessValues.length
            : 0;
        const nonBusinessAvg = nonBusinessValues.length > 0
            ? nonBusinessValues.reduce((sum, val) => sum + val, 0) / nonBusinessValues.length
            : 0;

        const businessMax = businessValues.length > 0 ? Math.max(...businessValues) : 0;
        const nonBusinessMax = nonBusinessValues.length > 0 ? Math.max(...nonBusinessValues) : 0;

        return {
            series: [
                {
                    name: 'Horario Hábil',
                    type: 'line',
                    smooth: false,
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    // connectNulls: false es vital para dejar el espacio en blanco en el cambio de turno
                    connectNulls: false,
                    lineStyle: { width: 2.5, color: '#2563eb' },
                    itemStyle: { color: '#2563eb', borderColor: '#fff', borderWidth: 1 },
                    areaStyle: {
                        opacity: 0.15,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
                                { offset: 1, color: 'rgba(37, 99, 235, 0.05)' }
                            ]
                        }
                    },
                    data: businessDataPoints,
                },
                {
                    name: 'Horario No Hábil',
                    type: 'line',
                    smooth: false,
                    showSymbol: true,
                    symbol: 'diamond',
                    symbolSize: 7,
                    connectNulls: false,
                    lineStyle: { width: 2.5, color: '#dc2626' },
                    itemStyle: { color: '#dc2626', borderColor: '#fff', borderWidth: 1 },
                    areaStyle: {
                        opacity: 0.12,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(220, 38, 38, 0.25)' },
                                { offset: 1, color: 'rgba(220, 38, 38, 0.05)' }
                            ]
                        }
                    },
                    data: nonBusinessDataPoints,
                }
            ],
            stats: {
                businessAvg, nonBusinessAvg, businessMax, nonBusinessMax
            }
        };
    }, [data]);

    const option = useMemo(() => {
        // Configuramos formato de ejes y tooltip
        let yAxisName = metricName;
        let axisLabelFormatter = formatGeneric;

        // Formatter para el tooltip: Solo muestra el valor si existe (ignora los nulls)
        const tooltipValueFormatter = (value: number | string) => {
            // Si viene null o undefined, retornamos string vacío para que ECharts lo oculte o maneje
            if (value === null || value === undefined) return '';
            const num = Number(value);
            if (metricName.toLowerCase().includes('throughput')) return formatBytes(num);
            if (metricName.toLowerCase().includes('cpuutilization') || metricName.toLowerCase().includes('percent')) return `${num.toFixed(2)}%`;
            if (metricName.toLowerCase().includes('cpucredit')) return `${num.toFixed(2)} Créditos`;
            if (metricName.toLowerCase().includes('networkin') || metricName.toLowerCase().includes('networkout')) return formatBytes(num);
            if (metricName.toLowerCase().includes('databaseconnections')) return `${num.toFixed(0)} Conexiones`;
            if (metricName.toLowerCase().includes('freeablememory')) return formatBytes(num);
            if (metricName.toLowerCase().includes('freestorage')) return formatBytes(num);
            if (metricName.toLowerCase().includes('writeiops') || metricName.toLowerCase().includes('readiops')) return `${num.toFixed(2)} IOPS`;

            return formatGeneric(num);
        };

        const lowerName = metricName.toLowerCase();
        if (lowerName.includes('cpuutilization')) {
            yAxisName = `${metricName} (%)`;
            axisLabelFormatter = (val) => `${val.toFixed(1)}%`;
        } else if (lowerName.includes('networkin') || lowerName.includes('networkout')) {
            yAxisName = metricName;
            axisLabelFormatter = (val) => formatBytes(val);
        } else if (lowerName.includes('cpucredit')) {
            yAxisName = `${metricName} (Créditos)`;
            axisLabelFormatter = (val) => `${val.toFixed(1)}%`;
        } else if (lowerName.includes('databaseconnections')) {
            yAxisName = `${metricName} (Conexiones)`;
            axisLabelFormatter = (val) => `${val.toFixed(0)} Conexiones`;
        } else if (lowerName.includes('freeablememory')) {
            yAxisName = metricName;
            axisLabelFormatter = (val) => formatBytes(val);
        } else if (lowerName.includes('freestorage')) {
            yAxisName = metricName;
            axisLabelFormatter = (val) => formatBytes(val);
        } else if (lowerName.includes('writeiops') || lowerName.includes('readiops')) {
            yAxisName = `${metricName} (IOPS)`;
            axisLabelFormatter = (val) => `${val.toFixed(1)} IOPS`;
        }

        const baseOption = {
            grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
            legend: { show: true, top: 0 },
            tooltip: {
                trigger: 'axis',
                // Custom tooltip formatter para limpiar los repetidos o nulos
                formatter: function (params: unknown) {
                    let result = `<div class="text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">${params[0].axisValueLabel}</div>`;
                    let hasValues = false;

                    params.forEach((item: unknown) => {
                        // Solo agregamos la línea al tooltip si el valor NO es null
                        if (item.value[1] !== null && item.value[1] !== undefined) {
                            hasValues = true;
                            const formattedVal = tooltipValueFormatter(item.value[1]);
                            result += `
                                <div class="flex items-center gap-2 text-xs">
                                    <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                                    <span class="text-slate-500 dark:text-slate-400">${item.seriesName}:</span>
                                    <span class="font-medium text-slate-900 dark:text-slate-100">${formattedVal}</span>
                                </div>
                            `;
                        }
                    });
                    return hasValues ? result : '';
                }
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    formatter: '{dd}-{MM} {HH}:{mm}',
                    hideOverlap: true
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                axisLabel: { formatter: axisLabelFormatter },
                splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.5 } }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    bottom: 0,
                    height: 20
                }
            ],
            series: seriesData.series
        };

        return baseOption;
    }, [isDark, seriesData, metricName]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const hasData = data && data.length > 0;

    let cardValueBusiness = '';
    let cardValueNonBusiness = '';

    if (metricName.toLowerCase().includes('cpuutilization')) {
        cardValueBusiness = `${formatGeneric(seriesData.stats.businessAvg)} %`;
        cardValueNonBusiness = `${formatGeneric(seriesData.stats.nonBusinessAvg)} %`;
    } else if (metricName.toLowerCase().includes('cpucredit')) {
        cardValueBusiness = `${formatGeneric(seriesData.stats.businessAvg)} Créditos`;
        cardValueNonBusiness = `${formatGeneric(seriesData.stats.nonBusinessAvg)} Créditos`;
    } else if (metricName.toLowerCase().includes('networkin') || metricName.toLowerCase().includes('networkout')) {
        cardValueBusiness = `${formatBytes(seriesData.stats.businessAvg)}`;
        cardValueNonBusiness = `${formatBytes(seriesData.stats.nonBusinessAvg)}`;
    } else if (metricName.toLowerCase().includes('freeablememory')) {
        cardValueBusiness = `${formatBytes(seriesData.stats.businessAvg)}`;
        cardValueNonBusiness = `${formatBytes(seriesData.stats.nonBusinessAvg)}`;
    } else if (metricName.toLowerCase().includes('freestorage')) {
        cardValueBusiness = `${formatBytes(seriesData.stats.businessAvg)}`;
        cardValueNonBusiness = `${formatBytes(seriesData.stats.nonBusinessAvg)}`;
    } else if (metricName.toLowerCase().includes('databaseconnections')) {
        cardValueBusiness = `${formatGeneric(seriesData.stats.businessAvg)} Conexiones`;
        cardValueNonBusiness = `${formatGeneric(seriesData.stats.nonBusinessAvg)} Conexiones`;
    } else if (metricName.toLowerCase().includes('writeiops') || metricName.toLowerCase().includes('readiops')) {
        cardValueBusiness = `${formatGeneric(seriesData.stats.businessAvg)} IOPS`;
        cardValueNonBusiness = `${formatGeneric(seriesData.stats.nonBusinessAvg)} IOPS`;
    }

    return (
        <Card className="w-full h-full shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-700">
                    {metricName.replace(/_/g, ' ')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Resumen Estadístico (Se mantiene igual, solo lógica visual) */}
                {hasData && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            {/* Bloque Hábil */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Horario Hábil</span>
                                </div>
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {cardValueBusiness}
                                </div>
                                <span className="text-[10px] text-muted-foreground">Promedio</span>
                            </div>
                            {/* Bloque No Hábil */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rotate-45 bg-red-600"></div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Horario No Hábil</span>
                                </div>
                                <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                    {cardValueNonBusiness}
                                </div>
                                <span className="text-[10px] text-muted-foreground">Promedio</span>
                            </div>
                        </div>
                    </div>
                )}

                {!hasData ? (
                    <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border border-dashed">
                        <span className="text-muted-foreground text-sm">No hay datos disponibles</span>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[300px]" />
                )}
            </CardContent>
        </Card>
    );
};

export const ConsumoHorarioChartComponent = ({ data }: ConsumoHorarioChartComponentProps) => {
    // Agrupación de métricas
    const groupedMetrics = useMemo(() => {
        if (!data || data.length === 0) return [];
        const groups: Record<string, WorkingNonWorkingHoursUsage[]> = {};
        data.forEach(item => {
            if (!groups[item.metric]) groups[item.metric] = [];
            groups[item.metric].push(item);
        });

        // Ordenar: CPU primero
        return Object.entries(groups).sort(([nameA], [nameB]) => {
            const isCpuA = nameA.toLowerCase().includes('cpuutilization');
            const isCpuB = nameB.toLowerCase().includes('cpuutilization');
            if (isCpuA && !isCpuB) return -1;
            if (!isCpuA && isCpuB) return 1;
            return nameA.localeCompare(nameB);
        });
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
                <span>No hay datos históricos disponibles.</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {groupedMetrics.map(([metricName, metricData]) => (
                <SingleMetricChart key={metricName} metricName={metricName} data={metricData} />
            ))}
        </div>
    );
};