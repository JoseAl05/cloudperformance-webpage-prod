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
import { ConsumeViewEc2Metrics } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
import { NatGatewayConsumeMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';


interface SingleMetricChartProps {
    data: ConsumeViewEc2Metrics[];
    title: string;
}


// --- Configuración de Métricas ---
const METRIC_CONFIG: Record<string, { label: string; unit: string; formatType: 'percent' | 'bytes' | 'count' }> = {
    activeconnectioncount: { label: 'Conexiones Activas', unit: 'Conexiones', formatType: 'count' },
    bytesinfromsource: { label: 'Datos Enviados a Internet', unit: 'B/s', formatType: 'bytes' },
    bytesouttodestination: { label: 'Datos Entregados al Destino', unit: 'B/s', formatType: 'bytes' },
    errorportallocation: { label: 'Error de asignación de puertos', unit: 'Errores', formatType: 'count' }
};

const SingleMetricChart = ({ data, title }: SingleMetricChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    console.log(title)

    const chartRef = useRef<HTMLDivElement>(null);
    const safeData = Array.isArray(data) ? data : [];
    const metricNameLowercase = title.toLowerCase();
    const config = METRIC_CONFIG[metricNameLowercase] || {
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
interface NatGatewaysConsumeChartsComponentProps {
    data: NatGatewayConsumeMetrics[] | null;
}

export const NatGatewaysConsumeChartsComponent = ({ data }: NatGatewaysConsumeChartsComponentProps) => {
    console.log(data);
    const groupedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return {};
        return data.reduce((acc, curr) => {
            const key = curr.metric || 'unknown';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        }, {} as Record<string, NatGatewayConsumeMetrics[]>);
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