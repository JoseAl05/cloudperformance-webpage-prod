'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { WorkingNonWorkingHoursUsage } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';

interface WorkingNonWorkingHoursChartComponentProps {
    data: WorkingNonWorkingHoursUsage[];
}


const SingleMetricChart = ({ metricName, data }: { metricName: string, data: WorkingNonWorkingHoursUsage[] }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        const businessData: [string, number][] = [];
        const nonBusinessData: [string, number][] = [];

        const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sortedData.forEach(item => {
            const isNonWorking = item.schedule_type.toLowerCase().includes('non') || item.schedule_type.toLowerCase().includes('no');
            const point: [string, number] = [item.timestamp, item.metric_value];

            if (isNonWorking) {
                nonBusinessData.push(point);
            } else {
                businessData.push(point);
            }
        });

        return [
            {
                name: 'Horario Hábil',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 3,
                    color: '#3b82f6'
                },
                itemStyle: {
                    color: '#3b82f6'
                },
                areaStyle: {
                    opacity: 0.3,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(59, 130, 246, 0.6)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: businessData,
            },
            {
                name: 'Horario No Hábil',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    type: 'dashed',
                    color: '#f59e0b'
                },
                itemStyle: {
                    color: '#f59e0b'
                },
                areaStyle: {
                    opacity: 0.2,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(245, 158, 11, 0.5)' },
                            { offset: 1, color: 'rgba(245, 158, 11, 0.05)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: nonBusinessData,
            }
        ];
    }, [data]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Horario Hábil', 'Horario No Hábil'],
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        let yAxisName = metricName;
        let axisLabelFormatter = formatGeneric;
        let tooltipFormatter = (v: number | null) => v != null ? formatGeneric(Number(v)) : '-';

        const lowerName = metricName.toLowerCase();

        if (lowerName.includes('cpu') || lowerName.includes('percent') || lowerName.includes('utilization')) {
            yAxisName = `${metricName} (%)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)}%`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)}%` : '-';
        }
        else if (lowerName.includes('throughput')) {
            yAxisName = `${metricName}`;
            axisLabelFormatter = formatBytes;
            tooltipFormatter = (v: number | null) => v != null ? formatBytes(Number(v)) : '-';
        }
        else if (lowerName.includes('iops')) {
            yAxisName = `${metricName} (IOPS)`;
            axisLabelFormatter = (value: number) => `${formatGeneric(value)} IOPS`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)} IOPS` : '-';
        }
        else if (lowerName.includes('pps')) {
            yAxisName = `${metricName} (PPS)`;
            axisLabelFormatter = (value: number) => `${formatGeneric(value)} PPS`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)} PPS` : '-';
        }

        const chartOptions = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [],
            extraOption: {
                grid: { left: 50, right: 30, top: 50, bottom: 60, containLabel: true },
                legend: { top: 0 }
            },
        });

        const specificOptions = {
            tooltip: {
                trigger: 'axis',
                valueFormatter: tooltipFormatter,
            },
            yAxis: {
                name: yAxisName,
                nameTextStyle: { align: 'left', padding: [0, 0, 0, 0] },
                axisLabel: { formatter: axisLabelFormatter },
                splitArea: { show: false }
            },
            series: seriesData
        };

        return deepMerge(base, deepMerge(chartOptions, specificOptions));
    }, [isDark, seriesData, metricName]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = seriesData.every(s => s.data.length === 0);

    return (
        <Card className="w-full h-full shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-700">
                    {metricName.replace(/_/g, ' ')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-start gap-2 mb-4">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                        Comparativa temporal entre horario hábil y no hábil para <strong>{metricName}</strong>.
                    </p>
                </div>
                {isEmpty ? (
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

export const WorkingNonWorkingHoursChartComponent = ({ data }: WorkingNonWorkingHoursChartComponentProps) => {

    const groupedMetrics = useMemo(() => {
        if (!data || data.length === 0) return [];

        const groups: Record<string, WorkingNonWorkingHoursUsage[]> = {};

        data.forEach(item => {
            if (!groups[item.metric]) {
                groups[item.metric] = [];
            }
            groups[item.metric].push(item);
        });

        return Object.entries(groups).sort(([nameA], [nameB]) => {
            const lowerA = nameA.toLowerCase();
            const lowerB = nameB.toLowerCase();
            const isCpuA = lowerA.includes('cpu');
            const isCpuB = lowerB.includes('cpu');

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
                <SingleMetricChart
                    key={metricName}
                    metricName={metricName}
                    data={metricData}
                />
            ))}
        </div>
    );
};