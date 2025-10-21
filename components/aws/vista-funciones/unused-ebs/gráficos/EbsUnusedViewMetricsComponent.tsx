'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { UnusedEbsMetric } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces';
import { AnySeriesDef, createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';

interface EbsUnusedViewMetricsComponentProps {
    data: UnusedEbsMetric[] | null;
    metricLabels?: string | string[];
    title?: string;
    unitMeasure?: string;
}




const chartLegendMap = (labels: string[] | string | undefined): string[] => {
    if (!labels) return [];
    const arr = Array.isArray(labels) ? labels : [labels];
    return arr.map((raw) => {
        return labelTranslations[raw] ?? raw;
    });
};

const fmt = new Intl.DateTimeFormat('es-CL', { dayPeriod: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const EbsUnusedViewMetricsComponentComponent = ({ data, metricLabels, title, unitMeasure }: EbsUnusedViewMetricsComponentComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const tooltipFormatter = (params: unknown) => {
        const date = new Date(params[0].value[0]);
        const fDate = fmt.format(date);
        return (
            `${fDate}<br/>` +
            params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} ${unitMeasure}<br/>`).join('')
        );
    };

    const labelTranslations: Record<string, string> = {
        "VolumeIdleTime Average": "Tiempo inactivo del volumen",
        "BurstBalance Average": "Reserva de rendimiento disponible",
        "VolumeReadOps Average": "Operaciones de lectura",
        "VolumeWriteOps Average": "Operaciones de escritura",
    };

    const translate = (label: string) => labelTranslations[label] ?? label;



    const safeData = Array.isArray(data) ? data : [];

    const { metricsByLabel } = useMemo(() => {
        const metricsByLabel: Record<string, [string, number][]> = {};

        const labels = Array.isArray(metricLabels)
            ? metricLabels
            : [metricLabels ?? ""];

        labels.forEach(label => {
            const metricData = safeData.filter(item => item.metric_label === label);

            const grouped = new Map<string, { sum: number; count: number }>();
            for (const { timestamp, value } of metricData) {
                const key = new Date(timestamp).toISOString();
                const prev = grouped.get(key);
                if (prev) {
                    prev.sum += value;
                    prev.count += 1;
                } else {
                    grouped.set(key, { sum: value, count: 1 });
                }
            }

            metricsByLabel[label] = Array.from(grouped.entries())
                .map(([ts, { sum, count }]) => [ts, Number((sum / count).toFixed(2))])
                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        });

        return { metricsByLabel };
    }, [data]);

    const legendLabels = useMemo(() => {
        return Object.keys(metricsByLabel).map(translate);
    }, [metricsByLabel]);

    const option = useMemo(() => {
        const series = Object.entries(metricsByLabel).map(([label, data], i) => (
            {
                kind: 'line',
                name: translate(label),
                data: data,
                smooth: true
            }
            // createSeries(
            //     translate(label),
            //     data,
            //     i === 0 ? "#36A2EB" : "#e60000",
            //     i === 0 ? "rgba(54, 162, 235, 0.3)" : "rgba(235, 0, 0, 0.3)"
            // )
        )) as AnySeriesDef[]

        const base = makeBaseOptions({
            legend: legendLabels,
            unitLabel: 'Créditos',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: series,
            extraOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: tooltipFormatter,
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisLabel: {
                        fontSize: 11,
                        formatter: (value: number) => {
                            const date = new Date(value);
                            return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
                        },
                        showMaxLabel: true,
                        showMinLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e0e0e0'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        fontSize: 11,
                        formatter: (val: number) => `${val} ${unitMeasure}`,
                        showMaxLabel: true,
                        showMinLabel: true
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0',
                            type: 'solid',
                            width: 1
                        }
                    }
                },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [isDark, data]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay métricas de créditos disponibles.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};

// const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
//     name,
//     type: 'line',
//     data,
//     smooth: false,
//     smoothMonotone: null,
//     symbol: 'none',
//     symbolSize: 0,
//     lineStyle: {
//         color,
//         width: 2,
//         cap: 'round',
//         join: 'round'
//     },
//     itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
//     emphasis: {
//         focus: 'series',
//         lineStyle: {
//             width: 3
//         },
//         disabled: data.length > 5000
//     },
//     blur: {
//         lineStyle: {
//             opacity: 0.2
//         }
//     },
//     large: data.length > 1000,
//     largeThreshold: 1000,
//     sampling: data.length > 2000 ? 'lttb' : null,
//     progressive: data.length > 1000 ? 0 : undefined,
//     progressiveThreshold: data.length > 1000 ? 500 : undefined,
//     progressiveChunkMode: data.length > 5000 ? 'mod' : undefined,
//     ...(areaColor && {
//         areaStyle: {
//             color: areaColor,
//             opacity: 0.4
//         }
//     })
// });
