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

interface ZonaDNS {
    name: string;
    dns_name: string;
    clasificacion_uso: string;
    queries_por_segundo: number;
}

interface ZonasDNSChartsProps {
    data: ZonaDNS[];
}

export const ZonasDNSCharts = ({ data }: ZonasDNSChartsProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    
    const topQueriesRef = useRef<HTMLDivElement>(null);
    const clasificacionRef = useRef<HTMLDivElement>(null);

    // Gráfico 1: Top Zonas por Queries/Segundo (solo zonas activas)
    const topQueriesData = useMemo(() => {
        const zonasActivas = data.filter(zona => zona.queries_por_segundo > 0);
        const sorted = zonasActivas
            .sort((a, b) => b.queries_por_segundo - a.queries_por_segundo)
            .slice(0, 10);
        
        return {
            names: sorted.map(z => z.name).reverse(), // Reverso para que el mayor esté arriba
            queries: sorted.map(z => z.queries_por_segundo).reverse()
        };
    }, [data]);

    const topQueriesOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'queries/seg',
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
                    name: 'Queries por Segundo',
                    data: topQueriesData.queries,
                    extra: {
                        color: '#3b82f6',
                        barMaxWidth: 40
                    }
                }
            ],
            extraOption: {
                grid: { 
                    left: 160, 
                    right: 40, 
                    top: 20, 
                    bottom: 40, 
                    containLabel: true 
                },
                yAxis: {
                    type: 'category',
                    data: topQueriesData.names,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 140
                    }
                },
                xAxis: {
                    type: 'value',
                    name: 'Queries/Segundo',
                    nameLocation: 'middle',
                    nameGap: 30
                }
            },
        });

        return deepMerge(base, barChart);
    }, [topQueriesData]);

    // Gráfico 2: Distribución por Clasificación (Dona)
    const clasificacionData = useMemo(() => {
        const clasificationMap = new Map();
        
        data.forEach(zona => {
            const clasificacion = zona.clasificacion_uso || 'DESCONOCIDO';
            clasificationMap.set(clasificacion, (clasificationMap.get(clasificacion) || 0) + 1);
        });

        return Array.from(clasificationMap.entries()).map(([clasificacion, count]) => ({
            name: clasificacion,
            value: count
        }));
    }, [data]);

    const clasificacionOption = useMemo(() => {
        const isDarkMode = (resolvedTheme || theme) === 'dark';
        const textColor = isDarkMode ? '#ffffff' : '#131a22';
        const subTextColor = isDarkMode ? '#a1a1aa' : '#6b7280';
        const seriesBorderColor = isDarkMode ? '#0b1220' : '#ffffff';

        const base = makeBaseOptions({
            legend: false,
            unitLabel: 'zonas',
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
                    data: clasificacionData.map(item => item.name),
                }
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '55%',
                    style: {
                        text: `Total\n${clasificacionData.reduce((sum, item) => sum + item.value, 0)}`,
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
                    name: 'Clasificación',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['50%', '55%'],
                    data: clasificacionData,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: seriesBorderColor,
                        borderWidth: 1,
                        color: function(params: unknown) {
                            const colors = {
                                'SIN_USO': '#dc2626',
                                'USO_BAJO': '#f59e0b',
                                'USO_MEDIO': '#3b82f6',
                                'USO_ALTO': '#10b981'
                            };
                            return colors[params.data.name as keyof typeof colors] || '#6b7280';
                        }
                    },
                    label: {
                        show: true,
                        formatter: (p: unknown) => `${p.data.name}\n${p.value}`,
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
    }, [clasificacionData, theme, resolvedTheme]);

    useECharts(topQueriesRef, topQueriesOption, [topQueriesOption], isDark ? 'cp-dark' : 'cp-light');
    useECharts(clasificacionRef, clasificacionOption, [clasificacionOption], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = !data || data.length === 0;

    if (isEmpty) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Top Zonas por Queries/Segundo</CardTitle></CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Distribución por Clasificación</CardTitle></CardHeader>
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
                    <CardTitle className="text-lg">Top Zonas por Queries/Segundo</CardTitle>
                </CardHeader>
                <CardContent>
                    {topQueriesData.names.length > 0 ? (
                        <div ref={topQueriesRef} className="w-full h-[350px]" />
                    ) : (
                        <div className="h-[350px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No hay zonas con tráfico activo</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Distribución por Clasificación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={clasificacionRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
        </div>
    );
};