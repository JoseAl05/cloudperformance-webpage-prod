'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface IP {
    name: string;
    region: string;
    dias_reservada: number;
}

interface IPsSinUsoChartsProps {
    data: IP[];
    porRegion: Record<string, number>;
}

export const IPsSinUsoCharts = ({ data, porRegion }: IPsSinUsoChartsProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    
    const regionChartRef = useRef<HTMLDivElement>(null);
    const diasChartRef = useRef<HTMLDivElement>(null);

    // Gráfico 1: Distribución por región
    const regionData = useMemo(() => {
        const regions = Object.keys(porRegion);
        const counts = Object.values(porRegion);
        
        return { regions, counts };
    }, [porRegion]);

    const regionOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'IPs',
            useUTC: false,
            showToolbox: false,
            metricType: 'count',
        });

        const barChart = createChartOption({
            kind: 'bar',
            xAxisType: 'value',
            legend: false,
            tooltip: true,
            series: [
                {
                    kind: 'bar',
                    name: 'IPs por Región',
                    data: regionData.counts,
                    extra: {
                        color: '#ea580c',
                        barMaxWidth: 40
                    }
                }
            ],
            extraOption: {
                grid: { 
                    left: 120, 
                    right: 40, 
                    top: 20, 
                    bottom: 40, 
                    containLabel: true 
                },
                yAxis: {
                    type: 'category',
                    data: regionData.regions,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 100
                    }
                },
                xAxis: {
                    type: 'value',
                    name: 'IPs',
                    nameLocation: 'middle',
                    nameGap: 30
                }
            },
        });

        return deepMerge(base, barChart);
    }, [regionData]);

    // Gráfico 2: IPs por días reservadas (rangos)
    const diasData = useMemo(() => {
        const ranges = [
            { label: '0-7 días', min: 0, max: 7, count: 0 },
            { label: '8-30 días', min: 8, max: 30, count: 0 },
            { label: '31-90 días', min: 31, max: 90, count: 0 },
            { label: '90+ días', min: 91, max: Infinity, count: 0 }
        ];

        data.forEach(ip => {
            const dias = ip.dias_reservada || 0;
            const range = ranges.find(r => dias >= r.min && dias <= r.max);
            if (range) range.count++;
        });

        return {
            labels: ranges.map(r => r.label),
            counts: ranges.map(r => r.count)
        };
    }, [data]);

    const diasOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'IPs',
            useUTC: false,
            showToolbox: false,
            metricType: 'count',
        });

        const barChart = createChartOption({
            kind: 'bar',
            xAxisType: 'category',
            legend: false,
            tooltip: true,
            series: [
                {
                    kind: 'bar',
                    name: 'IPs por Antigüedad',
                    data: diasData.counts,
                    extra: {
                        color: '#dc2626',
                        barMaxWidth: 60
                    }
                }
            ],
            extraOption: {
                grid: { 
                    left: 60, 
                    right: 40, 
                    top: 20, 
                    bottom: 60, 
                    containLabel: true 
                },
                xAxis: {
                    type: 'category',
                    data: diasData.labels,
                    name: 'Días Reservadas',
                    nameLocation: 'middle',
                    nameGap: 35,
                    axisLabel: {
                        fontSize: 11,
                        rotate: 0
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'IPs',
                    nameLocation: 'middle',
                    nameGap: 40
                }
            },
        });

        return deepMerge(base, barChart);
    }, [diasData]);

    useECharts(regionChartRef, regionOption, [regionOption], isDark ? 'cp-dark' : 'cp-light');
    useECharts(diasChartRef, diasOption, [diasOption], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = !data || data.length === 0;

    if (isEmpty) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Distribución por Región</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>IPs por Días Reservadas</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Distribución por Región</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={regionChartRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">IPs por Días Reservadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={diasChartRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
        </div>
    );
};