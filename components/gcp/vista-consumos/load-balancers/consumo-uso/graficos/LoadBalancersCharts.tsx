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

interface LoadBalancer {
    name: string;
    region: string;
    loadBalancingScheme: string;
    requests_totales: number;
    clasificacion_trafico: string;
}

interface LoadBalancersChartsProps {
    data: LoadBalancer[];
    porEsquema: Record<string, number>;
}

export const LoadBalancersCharts = ({ data, porEsquema }: LoadBalancersChartsProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    
    const topRequestsRef = useRef<HTMLDivElement>(null);
    const esquemaRef = useRef<HTMLDivElement>(null);

    // Gráfico 1: Top Load Balancers por Requests (solo activos)
    const topRequestsData = useMemo(() => {
        const lbsActivos = data.filter(lb => lb.requests_totales > 0);
        const sorted = lbsActivos
            .sort((a, b) => b.requests_totales - a.requests_totales)
            .slice(0, 10);
        
        return {
            names: sorted.map(lb => lb.name).reverse(), // Reverso para que el mayor esté arriba
            requests: sorted.map(lb => lb.requests_totales).reverse()
        };
    }, [data]);

    const topRequestsOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'requests',
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
                    name: 'Requests Totales',
                    data: topRequestsData.requests,
                    extra: {
                        color: '#10b981',
                        barMaxWidth: 40
                    }
                }
            ],
            extraOption: {
                grid: { 
                    left: 180, 
                    right: 40, 
                    top: 20, 
                    bottom: 40, 
                    containLabel: true 
                },
                yAxis: {
                    type: 'category',
                    data: topRequestsData.names,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 160
                    }
                },
                xAxis: {
                    type: 'value',
                    name: 'Requests',
                    nameLocation: 'middle',
                    nameGap: 30,
                    axisLabel: {
                        formatter: function(value: number) {
                            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                            return value.toString();
                        }
                    }
                }
            },
        });

        return deepMerge(base, barChart);
    }, [topRequestsData]);

    // Gráfico 2: Distribución por Load Balancing Scheme (Dona)
    const esquemaData = useMemo(() => {
        return Object.entries(porEsquema).map(([esquema, count]) => ({
            name: esquema,
            value: count
        }));
    }, [porEsquema]);

    const esquemaOption = useMemo(() => {
        const isDarkMode = (resolvedTheme || theme) === 'dark';
        const textColor = isDarkMode ? '#ffffff' : '#131a22';
        const subTextColor = isDarkMode ? '#a1a1aa' : '#6b7280';
        const seriesBorderColor = isDarkMode ? '#0b1220' : '#ffffff';

        const base = makeBaseOptions({
            legend: false,
            unitLabel: 'load balancers',
            useUTC: false,
            showToolbox: false,
            metricType: 'count',
        });

        const pieChart = {
            legend: [
                {
                    top: 10,
                    left: 'center',
                    orient: 'horizontal',
                    textStyle: { fontSize: 12, color: textColor },
                    data: esquemaData.map(item => item.name),
                }
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '55%',
                    style: {
                        text: `Total\n${esquemaData.reduce((sum, item) => sum + item.value, 0)}`,
                        textAlign: 'center',
                        fill: textColor,
                        fontSize: 14,
                        fontWeight: 600,
                    },
                }
            ],
            toolbox: {
                show: false
            },
            dataZoom: undefined,
            xAxis: undefined,
            yAxis: undefined,
            series: [
                {
                    name: 'Load Balancing Scheme',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['50%', '55%'],
                    data: esquemaData,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: seriesBorderColor,
                        borderWidth: 1,
                        color: function(params: any) {
                            const colors = {
                                'EXTERNAL': '#3b82f6',
                                'INTERNAL': '#10b981',
                                'EXTERNAL_MANAGED': '#f59e0b',
                                'INTERNAL_MANAGED': '#8b5cf6',
                                'INTERNAL_SELF_MANAGED': '#ef4444'
                            };
                            return colors[params.data.name as keyof typeof colors] || '#6b7280';
                        }
                    },
                    label: {
                        show: true,
                        formatter: (p: any) => `${p.data.name}\n${p.value}`,
                        fontSize: 11,
                        color: textColor,
                        fontWeight: 'bold'
                    },
                    labelLine: { 
                        show: true, 
                        length: 15, 
                        length2: 6, 
                        lineStyle: { color: subTextColor } 
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        return deepMerge(base, pieChart);
    }, [esquemaData, theme, resolvedTheme]);

    useECharts(topRequestsRef, topRequestsOption, [topRequestsOption], isDark ? 'cp-dark' : 'cp-light');
    useECharts(esquemaRef, esquemaOption, [esquemaOption], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = !data || data.length === 0;

    if (isEmpty) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Top Load Balancers por Requests</CardTitle></CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Distribución por Esquema</CardTitle></CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
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
                    <CardTitle className="text-lg">Top Load Balancers por Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {topRequestsData.names.length > 0 ? (
                        <div ref={topRequestsRef} className="w-full h-[350px]" />
                    ) : (
                        <div className="h-[350px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No hay load balancers con tráfico</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Distribución por Esquema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={esquemaRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
        </div>
    );
};