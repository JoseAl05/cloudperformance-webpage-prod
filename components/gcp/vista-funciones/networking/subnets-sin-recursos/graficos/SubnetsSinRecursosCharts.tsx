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

interface Subnet {
    name: string;
    region: string;
    ip_cidr_range: string;
    purpose: string;
}

interface SubnetsSinRecursosChartsProps {
    data: Subnet[];
    porRegion: Record<string, number>;
    porPurpose: Record<string, number>;
}

export const SubnetsSinRecursosCharts = ({ data, porRegion, porPurpose }: SubnetsSinRecursosChartsProps) => {
    const { theme, resolvedTheme } = useTheme();
    
    
    const regionChartRef = useRef<HTMLDivElement>(null);
    const purposeChartRef = useRef<HTMLDivElement>(null);

    // Gráfico 1: Top regiones con IPs desperdiciadas (barras horizontales)
    const regionData = useMemo(() => {
        // Ordenar regiones por cantidad y tomar top 10
        const sortedRegions = Object.entries(porRegion)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        const regions = sortedRegions.map(([region]) => region);
        const ipsWasted = sortedRegions.map(([,count]) => count * 4096); // Cada subnet /20 = 4096 IPs
        
        return { regions: regions.reverse(), ipsWasted: ipsWasted.reverse() }; // Reverso para que el mayor esté arriba
    }, [porRegion]);

    const regionOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'IPs',
            useUTC: false,
            showToolbox: false,
            //showDataZoom: false,
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
                    name: 'IPs Desperdiciadas',
                    data: regionData.ipsWasted,
                    extra: {
                        color: '#f97316',
                        barMaxWidth: 40
                    }
                }
            ],
            extraOption: {
                // toolbox: {
                //     show: false  // ← AGREGAR esta línea al inicio
                // },                
                grid: { 
                    left: 140, 
                    right: 40, 
                    top: 40, 
                    bottom: 40, 
                    containLabel: true 
                },
                yAxis: {
                    type: 'category',
                    data: regionData.regions,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 120
                    }
                },
                xAxis: {
                    type: 'value',
                    name: 'IPs Bloqueadas',
                    nameLocation: 'middle',
                    nameGap: 30,
                    axisLabel: {
                        formatter: function(value: number) {
                            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                            return value.toString();
                        }
                    }
                }
            },
        });

        return deepMerge(base, barChart);
    }, [regionData]);

    // Gráfico 2: Distribución por Purpose (gráfico de dona)
    const purposeData = useMemo(() => {
        return Object.entries(porPurpose).map(([purpose, count]) => ({
            name: purpose === 'PRIVATE' ? 'VMs y Recursos' : 'Balanceadores',
            value: count
        }));
    }, [porPurpose]);    
    const purposeOption = useMemo(() => {
        const isDark = (resolvedTheme || theme) === 'dark';
        const textColor = isDark ? '#ffffff' : '#131a22';
        const subTextColor = isDark ? '#a1a1aa' : '#6b7280';
        const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

        const base = makeBaseOptions({
            legend: false,
            unitLabel: 'subnets',
            useUTC: false,
            showToolbox: false,
            showDataZoom: false,
            metricType: 'count',
        });

        const pieChart = {
            legend: [
                {
                    top: 10,
                    left: 'center',
                    orient: 'horizontal',
                    textStyle: { fontSize: 12, color: textColor },
                    data: purposeData.map(item => item.name),
                }
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '50%',
                    style: {
                        text: `Total\n${purposeData.reduce((sum, item) => sum + item.value, 0)}`,
                        textAlign: 'center',
                        fill: textColor,
                        fontSize: 14,
                        fontWeight: 600,
                    },
                }
            ],           
            series: [
                {
                    name: 'Purpose',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['50%', '55%'], //bajar grafico 55%
                    data: purposeData,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: seriesBorderColor,
                        borderWidth: 1,
                        color: function(params: any) {
                            return params.data.name.includes('VMs y Recursos') ? '#36A2EB' : '#FF6384';
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
            ],
            dataZoom: undefined,  // ← quita el zoom
            xAxis: undefined,     // ← quita el zoom
            yAxis: undefined,     // ← quita el zoom
        };

        return deepMerge(base, pieChart);
    }, [purposeData, theme, resolvedTheme]);

    useECharts(regionChartRef, regionOption, [regionOption], (resolvedTheme || theme) === 'dark' ? 'cp-dark' : 'cp-light');
    useECharts(purposeChartRef, purposeOption, [purposeOption], (resolvedTheme || theme) === 'dark' ? 'cp-dark' : 'cp-light');

    const isEmpty = !data || data.length === 0;

    if (isEmpty) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Top Regiones con IPs Desperdiciadas</CardTitle></CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Distribución por Purpose</CardTitle></CardHeader>
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
                    <CardTitle className="text-lg">Top Regiones con IPs Desperdiciadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={regionChartRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Distribución por Purpose</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={purposeChartRef} className="w-full h-[350px]" />
                </CardContent>
            </Card>
        </div>
    );
};