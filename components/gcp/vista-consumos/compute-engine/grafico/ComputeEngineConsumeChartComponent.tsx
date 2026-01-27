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

// --- Interfaces ---
interface MetricDataPoint {
    date: string;
    timestamp: string;
    metric: string;
    avg_value: number;
    max_value: number;
    min_value: number;
}

interface SingleMetricChartProps {
    data: MetricDataPoint[];
    title: string;
}

// --- Funciones de Formateo (Extraídas de CloudSqlChartComponent) ---
const formatGeneric = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(1);
};

const formatBytes = (value: number) => {
    if (value === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    // Evitar índices fuera de rango si el valor es muy grande
    const safeIndex = Math.min(i, sizes.length - 1);
    return parseFloat((value / Math.pow(k, safeIndex)).toFixed(1)) + ' ' + sizes[safeIndex];
};

// --- Configuración de Métricas ---
const METRIC_CONFIG: Record<string, { label: string; unit: string; formatType: 'percent' | 'bytes' | 'count' }> = {
    cpu_utilization: { label: 'Uso de CPU', unit: '%', formatType: 'percent' },
    disk_read_iops: { label: 'Lectura de Disco (IOPS)', unit: 'IOPS', formatType: 'count' },
    disk_read_throughput: { label: 'Lectura de Disco (Throughput)', unit: 'B/s', formatType: 'bytes' },
    disk_write_iops: { label: 'Escritura en Disco (IOPS)', unit: 'IOPS', formatType: 'count' },
    disk_write_throughput: { label: 'Escritura en Disco (Throughput)', unit: 'B/s', formatType: 'bytes' },
    network_egress_pps: { label: 'Red: Paquetes Salientes', unit: 'pps', formatType: 'count' },
    network_egress_throughput: { label: 'Red: Tráfico Saliente', unit: 'B/s', formatType: 'bytes' },
    network_ingress_pps: { label: 'Red: Paquetes Entrantes', unit: 'pps', formatType: 'count' },
    network_ingress_throughput: { label: 'Red: Tráfico Entrante', unit: 'B/s', formatType: 'bytes' },
};

const SingleMetricChart = ({ data, title }: SingleMetricChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const safeData = Array.isArray(data) ? data : [];

    const config = METRIC_CONFIG[title] || {
        label: title.replace(/_/g, ' '),
        unit: '',
        formatType: 'count'
    };

    // --- Preparación de Datos ---
    const { avgMetric, maxMetric, minMetric } = useMemo(() => {
        const sortedData = [...safeData].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

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

    // --- Configuración de Opciones de ECharts ---
    const option = useMemo(() => {
        // 1. Definir formateadores dinámicos según el tipo de métrica
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
            // unitLabel se usa para el tooltip base, pero lo sobrescribiremos con valueFormatter
            unitLabel: config.unit,
            useUTC: true,
            showToolbox: true,
            metricType: config.formatType === 'percent' ? 'percent' : 'standard',
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
                // Aplicamos los formateadores específicos al tooltip y eje Y
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
                xAxis: { axisLabel: { rotate: 30 } },
                grid: { left: 50, right: 20, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [avgMetric, maxMetric, minMetric, config]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="capitalize">{config.label}</CardTitle>
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
                            No hay métricas de {config.label} disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};

// --- Componente Principal ---
interface ComputeEngineConsumeChartComponentProps {
    data: MetricDataPoint[] | null;
}

export const ComputeEngineConsumeChartComponent = ({ data }: ComputeEngineConsumeChartComponentProps) => {
    const groupedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return {};

        return data.reduce((acc, curr) => {
            const key = curr.metric || 'unknown';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        }, {} as Record<string, MetricDataPoint[]>);
    }, [data]);

    const metricKeys = Object.keys(groupedData).sort();

    if (metricKeys.length === 0) {
        return (
            <div className="w-full p-4 text-center text-muted-foreground">
                No hay datos disponibles para mostrar.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {metricKeys.map((metricName) => (
                <SingleMetricChart
                    key={metricName}
                    title={metricName}
                    data={groupedData[metricName]}
                />
            ))}
        </div>
    );
};