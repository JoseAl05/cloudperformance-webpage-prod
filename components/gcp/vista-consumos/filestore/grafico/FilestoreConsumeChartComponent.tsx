'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface HistoryPoint {
    timestamp: string;
    value: number;
}

// Mapeo para normalizar los nombres de las métricas del JSON a labels legibles
const FILERE_METRIC_CONFIG: Record<string, { label: string; unit: string; formatType: 'bytes' | 'count' }> = {
    UsedCapacity: { label: 'Capacidad Usada', unit: 'B', formatType: 'bytes' },
    FreeCapacity: { label: 'Capacidad Libre', unit: 'B', formatType: 'bytes' },
    ReadIOPS: { label: 'Operaciones de Lectura', unit: 'IOPS', formatType: 'count' },
    WriteIOPS: { label: 'Operaciones de Escritura', unit: 'IOPS', formatType: 'count' },
    ReadThroughput: { label: 'Throughput Lectura', unit: 'B/s', formatType: 'bytes' },
    WriteThroughput: { label: 'Throughput Escritura', unit: 'B/s', formatType: 'bytes' },
};

const formatBytes = (value: number) => {
    if (value === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const SingleFilestoreChart = ({ data, metricKey }: { data: HistoryPoint[], metricKey: string }) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const config = FILERE_METRIC_CONFIG[metricKey] || { label: metricKey, unit: '', formatType: 'count' };

    const option = useMemo(() => {
        const seriesData = data.map(p => [p.timestamp, p.value]);
        
        const base = makeBaseOptions({
            legend: [config.label],
            unitLabel: config.unit,
            useUTC: true,
            showToolbox: true,
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            series: [{
                kind: 'line',
                name: config.label,
                data: seriesData,
                smooth: true,
                extra: { color: '#36A2EB', areaStyle: { opacity: 0.1 } }
            }],
            extraOption: {
                tooltip: { 
                    trigger: 'axis', 
                    valueFormatter: (v: unknown) => config.formatType === 'bytes' ? formatBytes(v) : `${v} ${config.unit}` 
                },
                yAxis: {
                    axisLabel: { formatter: (v: unknown) => config.formatType === 'bytes' ? formatBytes(v) : v }
                },
                grid: { left: 60, right: 20, bottom: 40, containLabel: true }
            }
        });

        return deepMerge(base, lines);
    }, [data, config, isDark]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="w-full h-[300px]" />
            </CardContent>
        </Card>
    );
};

export const FilestoreConsumeChartComponent = ({ data }: { data: unknown[] }) => {
    // Tomamos la primera instancia para el gráfico general o podrías iterar
    const firstInstance = data?.[0];
    const history = firstInstance?.history || {};
    const metricKeys = Object.keys(history).filter(k => history[k].length > 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <HardDrive className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-lg">Métricas de Rendimiento: {firstInstance?.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metricKeys.map(key => (
                    <SingleFilestoreChart key={key} metricKey={key} data={history[key]} />
                ))}
            </div>
        </div>
    );
};