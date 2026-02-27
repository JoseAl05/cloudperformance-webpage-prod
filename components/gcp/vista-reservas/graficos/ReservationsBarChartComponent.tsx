'use client'

import * as echarts from 'echarts';
import { Button } from '@/components/ui/button';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { Download, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';
import { ReservationData } from '../ReservationsComponent';

interface ReservationsBarChartProps {
    data: ReservationData[];
}

export const ReservationsBarChartComponent = ({ data }: ReservationsBarChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    // Calculamos si hay dinero perdido en general
    const totalWaste = useMemo(() => {
        if (!data) return 0;
        return data.reduce((acc, curr) => acc + curr.dinero_perdido_usd, 0);
    }, [data]);

    const exportChart = () => {
        const dom = chartRef.current;
        if (!dom) return;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: isDark ? '#1f2937' : '#fff' });
        const link = document.createElement('a');
        link.download = `reservas-desperdicio-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
    };

    const option = useMemo(() => {
        if (!data || data.length === 0 || totalWaste === 0) return {};

        const chartData = [...data]
            .sort((a, b) => b.dinero_perdido_usd - a.dinero_perdido_usd)
            .slice(0, 10);

        const names = chartData.map(d => d.nombre_reserva);
        const wasteValues = chartData.map(d => d.dinero_perdido_usd);

        const series = [
            {
                name: 'Dinero Perdido (USD)',
                kind: 'bar' as const,
                extra: {
                    barWidth: '50%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#f87171' }, 
                            { offset: 1, color: '#ef4444' }  
                        ]),
                        borderRadius: [0, 4, 4, 0] 
                    },
                    emphasis: { focus: 'series' }
                },
                data: wasteValues
            }
        ];

        const base = makeBaseOptions({
            legend: ['Dinero Perdido (USD)'],
            legendPos: 'top',
            showToolbox: true,
            showDataZoom: false 
        });

        const bars = createChartOption({
            kind: 'bar',
            xAxisType: 'value', 
            yAxisType: 'category', 
            legend: true,
            legendOption: {
                top: 6,
                left: 'center',
                textStyle: { fontSize: 11, color: isDark ? '#ccc' : '#666' }
            },
            tooltip: true,
            tooltipFormatter(params) {
                if (!params || !(Array.isArray(params)) || !params.length) return '';

                const p = params[0] as any;
                const rawValue = Number(p.value || 0);
                const money = '$' + rawValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                let html = `<div style="font-weight:600;margin-bottom:8px">${p.name}</div>`;
                html += `<div style="display:flex;align-items:center;gap:12px;justify-content:space-between">
                            <div style="display:flex;align-items:center;gap:6px">
                                ${p.marker} <span style="font-weight:600; color:#555">Penalización</span>
                            </div>
                            <div style="font-variant-numeric: tabular-nums; font-weight: bold; color: #ef4444">
                                ${money}
                            </div>
                        </div>`;
                return html;
            },
            series: series,
            extraOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' } 
                },
                toolbox: { top: 0, right: 20 },
                xAxis: {
                    type: 'value',
                    name: 'USD',
                    nameTextStyle: { color: isDark ? '#aaa' : '#666', fontSize: 12 },
                    axisLabel: {
                        formatter: (value: number) => '$' + value.toLocaleString(),
                        color: isDark ? '#aaa' : '#666',
                        fontSize: 10,
                    },
                    splitLine: { show: true, lineStyle: { color: isDark ? '#374151' : '#f5f5f5', type: 'dashed' } },
                },
                yAxis: {
                    type: 'category',
                    data: names,
                    inverse: true, 
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        color: isDark ? '#ccc' : '#4b5563',
                        fontSize: 11,
                        fontWeight: 'bold',
                        margin: 15,
                        formatter: (value: string) => value.length > 20 ? value.substring(0, 20) + '...' : value
                    },
                },
                grid: { left: 10, right: 40, top: 40, bottom: 20, containLabel: true },
            },
        });

        return deepMerge(base, bars);
    }, [data, isDark, totalWaste]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (!data || data.length === 0) return null;

    // EL FIX: Si el total desperdiciado es 0, mostramos un mensaje de éxito
    if (totalWaste === 0) {
        return (
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Reservas con Mayor Desperdicio</h3>
                </div>
                <div className="w-full h-[350px] md:h-[400px] flex flex-col items-center justify-center gap-3">
                    <div className="h-16 w-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-center px-4">
                        ¡Excelente! No hay penalizaciones económicas por inactividad en el periodo seleccionado.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Reservas con Mayor Desperdicio</h3>
                <Button variant="outline" size="sm" className="gap-2" onClick={exportChart}>
                    <Download className="h-4 w-4" />
                    Exportar
                </Button>
            </div>
            <div ref={chartRef} className="w-full h-[350px] md:h-[400px]" />
        </div>
    );
};