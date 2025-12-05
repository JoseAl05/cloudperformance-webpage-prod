'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

const METRIC_TRANSLATIONS: Record<string, string> = {
    'BytesOutToDestination Average': 'Volumen Saliente (Internet)',
    'BytesInFromSource Average': 'Volumen Entrante (VPC)',
    'ActiveConnectionCount Average': 'Conexiones Activas',
    'ErrorPortAllocation Average': 'Errores de Puerto (SNAT)',
};

interface NatGatewaysConsumeSingleChartComponentProps {
    metricName: string;
    dataPoints: [string, string | number][];
    className?: string;
}

export const NatGatewaysConsumeSingleChartComponent = ({ metricName, dataPoints, className }: NatGatewaysConsumeSingleChartComponentProps) => {
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

    const cardTitle = METRIC_TRANSLATIONS[metricName] || metricName;

    const getUnitLabel = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('bytes')) return 'MB';
        return 'Count';
    };

    const unitLabel = getUnitLabel(metricName);
    const metricType = 'default';

    const option = useMemo(() => {
        const colors = getThemeColors();
        const sortedData = [...dataPoints].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

        const series = [{
            name: cardTitle,
            data: sortedData,
            smooth: true,
            kind: 'line',
            extra: {
                color: colors.metricValueColor,
                areaStyle: { color: colors.metricValueAreaColor }
            }
        }];

        const base = makeBaseOptions({
            legend: [cardTitle],
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
            series: series,
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
    }, [dataPoints, isDark, cardTitle, unitLabel]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className={`w-full shadow-sm ${className || ''}`}>
            <CardHeader className='pb-2 border-b mb-2 bg-muted/5'>
                <CardTitle className="text-base font-medium text-foreground/80">{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="w-full h-[350px] md:h-[400px]" />
            </CardContent>
        </Card>
    );
};