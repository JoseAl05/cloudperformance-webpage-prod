'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';
import { ConsumeViewRdsMetrics } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces';


interface RdsConsumeViewChartComponentProps {
    data: ConsumeViewRdsMetrics[] | null;
    unit?: string;
    title?: string;
    metricName?: string;
}

const METRIC_CONFIG: Record<string, { label: string; unit: string; formatType: 'percent' | 'bytes' | 'count' }> = {
    cpucreditbalance: { label: 'Créditos Disponibles', unit: 'Créditos', formatType: 'count' },
    cpucreditusage: { label: 'Créditos Usados', unit: 'Créditos', formatType: 'count' },
    cpuutilization: { label: 'Uso de CPU', unit: '%', formatType: 'percent' },
    databaseconnections: { label: 'Conexiones a Base de Datos', unit: 'Conexiones', formatType: 'count' },
    freestoragespace: { label: 'Storage Disponible', unit: 'B', formatType: 'bytes' },
    freeablememory: { label: 'Memoria Disponible', unit: 'B', formatType: 'bytes' },
};

export const RdsConsumeViewChartComponent = ({ data, unit, title, metricName }: RdsConsumeViewChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const safeData = Array.isArray(data) ? data : [];

    const metricNameLowercase = metricName ? metricName.toLowerCase() : '';
    const config = METRIC_CONFIG[metricNameLowercase] || {
        label: title.replace(/_/g, ' '),
        unit: '',
        formatType: 'count'
    };

    const { avgMetric, maxMetric, minMetric } = useMemo(() => {
        const sortedData = [...safeData].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        if (title === 'Memoria Disponible') {
            console.log(sortedData)
        }

        const avgMetric: [string, number][] = sortedData.map(item => [
            item.timestamp,
            item.avg_value
        ]);

        const maxMetric: [string, number][] = sortedData.map(item => [
            item.timestamp,
            item.max_value
        ]);

        const minMetric: [string, number][] = sortedData.map(item => [
            item.timestamp,
            item.min_value
        ]);

        return { avgMetric, maxMetric, minMetric };
    }, [safeData]);

    const option = useMemo(() => {

        let axisLabelFormatter = (value: number) => `${formatGeneric(value)}`;
        let tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toLocaleString()}` : '-';
        let yAxisName = config.label;

        if (config.formatType === 'percent') {
            yAxisName = `${config.label} (%)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(0)}%`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)}%` : '-';
        }
        else if (config.formatType === 'bytes') {
            // Nota: El label del eje Y suele omitir la unidad si es dinámica (MB/s vs GB/s),
            // pero podemos poner la unidad base.
            yAxisName = config.label;
            axisLabelFormatter = (value: number) => formatBytes(value);
            tooltipFormatter = (v: number | null) => v != null ? formatBytes(Number(v)) : '-';
        }
        else if (config.formatType === 'count') {
            yAxisName = `${config.label}`;
            axisLabelFormatter = (value: number) => `${formatGeneric(value)} ${config.unit}`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)} ${config.unit}` : '-';
        }

        const base = makeBaseOptions({
            legend: ['Promedio', 'Máximo', 'Mínimo'],
            unitLabel: unit !== 'Bytes' ? unit : null,
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Promedio',
                    data: avgMetric,
                    smooth: true,
                    extra: { color: '#36A2EB' }
                },
                {
                    kind: 'line',
                    name: 'Máximo',
                    data: maxMetric,
                    smooth: true,
                    extra: { color: '#FF6384' }
                },
                {
                    kind: 'line',
                    name: 'Mínimo',
                    data: minMetric,
                    smooth: true,
                    extra: { color: '#28e995' }
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                tooltip: {
                    trigger: 'axis',
                    valueFormatter: tooltipFormatter,
                },
                yAxis: {
                    name: yAxisName,
                    nameTextStyle: {
                        align: 'left',
                        padding: [0, 0, 0, 0]
                    },
                    min: config.formatType === 'percent' ? 0 : undefined,
                    max: config.formatType === 'percent' ? 100 : undefined,
                    axisLabel: {
                        formatter: axisLabelFormatter
                    }
                },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [avgMetric, maxMetric, minMetric]);

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
                        <p className="text-sm text-muted-foreground">
                            No hay métricas de {title} disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};