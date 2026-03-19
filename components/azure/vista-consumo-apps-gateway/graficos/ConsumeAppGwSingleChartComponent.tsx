'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface ConsumeAppGwSingleChartComponentProps {
    metricName: string;
    dataPoints: [string, string][];
    dataPointsMax?: [string, string][];  // --- NUEVO ---
    dataPointsMin?: [string, string][];  // --- NUEVO ---
}

export const ConsumeAppGwSingleChartComponent = ({ metricName, dataPoints, dataPointsMax, dataPointsMin }: ConsumeAppGwSingleChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const getThemeColors = () => {
        if (isDark) {
            return { textColor: '#e4e4e7', gridColor: '#3f3f46', metricValueColor: '#44ad44', metricValueAreaColor: '#44ad4440' };
        } else {
            return { textColor: '#3f3f46', gridColor: '#e4e4e7', metricValueColor: '#009c00', metricValueAreaColor: '#009c003b' };
        }
    };

    const getCardTitle = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName === 'bytes received') return 'Bytes Recibidos (MB)';
        if (lowerName === 'bytes sent') return 'Bytes Enviados (MB)';
        if (lowerName === 'capacity units') return 'Capacidad Utilizada';
        if (lowerName === 'compute units') return 'Unidades de Computo';
        if (lowerName === 'cpu utilization') return 'Promedio Uso de CPU (%)';
        if (lowerName === 'current connections') return 'Conexiones Actuales';
        if (lowerName === 'fixed billable capacity units') return 'Capacidad Minima Facturada';
        return name;
    };

    const getUnitLabel = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('bytes')) return 'MB';
        if (lowerName.includes('cpu')) return '%';
        return 'Count';
    };

    const cardTitle = getCardTitle(metricName);
    const unitLabel = getUnitLabel(metricName);
    const metricType = metricName.toLowerCase().includes('cpu') ? 'percent' : 'default';

    const option = useMemo(() => {
        const colors = getThemeColors();
        const sortedData = [...dataPoints].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

        // Construir todas las series juntas para evitar que deepMerge las pise
        const legendNames = [metricName];

        // Serie principal — verde con área, igual que antes
        const allSeries = [{
            name: metricName,
            data: sortedData,
            smooth: true,
            kind: 'line' as const,
            extra: {
                color: colors.metricValueColor,
                areaStyle: { color: colors.metricValueAreaColor }
            }
        }];

        // --- NUEVO: serie Máximo — rojo punteado ---
        if (dataPointsMax && dataPointsMax.length > 0) {
            const sortedMax = [...dataPointsMax].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
            legendNames.push('Máx');
            allSeries.push({
                name: 'Máx',
                data: sortedMax,
                smooth: true,
                kind: 'line' as const,
                extra: {
                    color: '#ef4444',
                    lineStyle: { type: 'dashed', width: 1.5 },
                    areaStyle: undefined,
                }
            });
        }

        // --- NUEVO: serie Mínimo — amarillo punteado ---
        if (dataPointsMin && dataPointsMin.length > 0) {
            const sortedMin = [...dataPointsMin].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
            legendNames.push('Mín');
            allSeries.push({
                name: 'Mín',
                data: sortedMin,
                smooth: true,
                kind: 'line' as const,
                extra: {
                    color: '#eab308',
                    lineStyle: { type: 'dashed', width: 1.5 },
                    areaStyle: undefined,
                }
            });
        }

        const base = makeBaseOptions({
            legend: legendNames,
            unitLabel: unitLabel,
            useUTC: true,
            showToolbox: true,
            metricType: metricType
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: allSeries,
            extraOption: {
                xAxis: { axisLabel: { rotate: 30, color: colors.textColor } },
                yAxis: { min: 0, axisLabel: { color: colors.textColor }, splitLine: { lineStyle: { color: colors.gridColor } } },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: colors.gridColor,
                    textStyle: { color: colors.textColor }
                }
            },
        });

        return deepMerge(base, lines);
    }, [dataPoints, dataPointsMax, dataPointsMin, isDark, metricName]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className='pb-2'>
                <CardTitle className="text-lg">{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};