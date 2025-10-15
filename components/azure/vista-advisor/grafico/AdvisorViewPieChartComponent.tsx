'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AzureAdvisorRecommendation {
    _cq_sync_time: { $date: string }
    impact: string
    high_impact: number
    medium_impact: number
    low_impact: number
    category: string
    impacted_value: string
    impacted_value_count: number
    last_updated: string
    problem: string
    total_recommendations: number
    visual_impact: string
    resource_type: string
}

interface AdvisorViewPieChartComponentProps {
    data: AzureAdvisorRecommendation[] | null;
}

const IMPACT_COLORS: Record<string, string> = {
    'Alto': '#dc2626',      // Rojo
    'Medio': '#eab308',     // Amarillo
    'Bajo': '#3b82f6',      // Azul
};

export const AdvisorViewPieChartComponent = ({
    data,
}: AdvisorViewPieChartComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Tema (shadcn + next-themes)
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // Evitar hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const safeData = Array.isArray(data) ? data : [];

    const { chartData, totalCount } = useMemo(() => {
        if (safeData.length === 0) {
            return { chartData: [], totalCount: 0 };
        }

        // Tomar los valores del primer registro (todos tienen los mismos totales)
        const firstRecord = safeData[0];
        const highImpact = firstRecord?.high_impact ?? 0;
        const mediumImpact = firstRecord?.medium_impact ?? 0;
        const lowImpact = firstRecord?.low_impact ?? 0;
        const total = highImpact + mediumImpact + lowImpact;

        const chartData = [
            {
                name: 'Alto',
                value: highImpact,
                itemStyle: { color: IMPACT_COLORS['Alto'] },
            },
            {
                name: 'Medio',
                value: mediumImpact,
                itemStyle: { color: IMPACT_COLORS['Medio'] },
            },
            {
                name: 'Bajo',
                value: lowImpact,
                itemStyle: { color: IMPACT_COLORS['Bajo'] },
            },
        ].filter(item => item.value > 0); // Solo mostrar los que tienen valor

        return { chartData, totalCount: total };
    }, [safeData]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!chartRef.current) return;

        const textColor = isDark ? '#ffffff' : '#131a22';
        const subTextColor = isDark ? '#a1a1aa' : '#6b7280';
        const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(50, 50, 50, 0.95)';
        const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';
        const iconBorder = isDark ? '#9ca3af' : '#999';
        const iconBorderEmph = isDark ? '#d1d5db' : '#666';
        const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

        const isEmpty = chartData.length === 0;

        const option: echarts.EChartsOption = {
            animation: true,
            animationDuration: 300,
            animationEasing: 'linear',
            backgroundColor: 'transparent',
            toolbox: {
                right: 10,
                top: 66,
                feature: {
                    saveAsImage: { pixelRatio: 2, excludeComponents: ['toolbox'] },
                },
                iconStyle: { borderColor: iconBorder },
                emphasis: { iconStyle: { borderColor: iconBorderEmph } },
            },
            tooltip: {
                trigger: 'item',
                transitionDuration: 0.1,
                hideDelay: 100,
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: (p: any) => {
                    const percentage = ((p.value / totalCount) * 100).toFixed(1);
                    return `${p.marker} Impacto ${p.name}<br/><strong>${p.value}</strong> recomendaciones (${percentage}%)`;
                },
            },
            legend: {
                top: 8,
                left: 'center',
                orient: 'horizontal',
                type: 'plain',
                icon: 'circle',
                textStyle: { fontSize: 12, color: textColor },
                data: ['Alto', 'Medio', 'Bajo'],
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '50%',
                    style: {
                        text: `Total\n${totalCount}`,
                        textAlign: 'center',
                        fill: textColor,
                        fontSize: 16,
                        fontWeight: 600,
                    },
                },
            ],
            series: [
                {
                    name: 'Impactos',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: true,
                    selectedMode: false,
                    minAngle: 3,
                    padAngle: 2,
                    itemStyle: { 
                        borderRadius: 6, 
                        borderColor: seriesBorderColor, 
                        borderWidth: 2 
                    },
                    label: {
                        show: true,
                        formatter: (p: any) => `${p.name}\n${p.value}`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: textColor,
                    },
                    labelLine: { 
                        show: true, 
                        length: 15, 
                        length2: 8, 
                        lineStyle: { color: subTextColor } 
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 8,
                        itemStyle: { 
                            shadowBlur: 10, 
                            shadowOffsetX: 0, 
                            shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' 
                        },
                        label: { fontWeight: 'bold', fontSize: 14 },
                    },
                    data: chartData,
                },
            ],
        };

        // (Re)inicializar y setear opciones
        chartInstance.current?.dispose();
        chartInstance.current = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
        chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: true, silent: false });

        // Resize handling
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = new ResizeObserver(() => handleResize());
        resizeObserverRef.current.observe(chartRef.current);

        const onWindowResize = () => handleResize();
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            resizeObserverRef.current?.disconnect();
            resizeObserverRef.current = null;
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [mounted, isDark, chartData, totalCount, handleResize]);

    const isEmpty = chartData.length === 0;

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold tracking-tight">Distribución por Impacto</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Info size={14} />
                        <span>Recomendaciones agrupadas por nivel de impacto</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay recomendaciones para graficar.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[420px] md:h-[470px] lg:h-[520px]" />
                )}
            </CardContent>
        </Card>
    );
};