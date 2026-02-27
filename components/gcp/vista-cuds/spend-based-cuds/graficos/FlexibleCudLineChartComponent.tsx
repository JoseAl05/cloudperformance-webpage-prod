'use client'

import * as echarts from 'echarts';
import { Button } from '@/components/ui/button';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

// Tipos de datos que provienen de la API
export interface ChartTrend {
    date: string;
    commitment_fee_usd: number;
    savings_generated_usd: number;
    net_impact_usd: number;
}

interface FlexibleCudLineChartComponentProps {
    data: ChartTrend[];
}

const toUTCDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const FlexibleCudLineChartComponent = ({ data }: FlexibleCudLineChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const exportChart = () => {
        const dom = chartRef.current;
        if (!dom) return;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
        const link = document.createElement('a');
        link.download = `cud-flexible-trend-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
    };

    const option = useMemo(() => {
        if (!data || data.length === 0) return {};

        const dates = data.map(d => d.date);
        
        // Series para ECharts
        const series = [
            {
                name: 'Costo Fijo del CUD',
                kind: 'line' as const,
                smooth: true,
                extra: {
                    areaStyle: { color: '#ef4444', opacity: 0.2 },
                    lineStyle: { width: 2, color: '#ef4444' },
                    itemStyle: { color: '#ef4444' },
                    symbol: 'circle',
                    showSymbol: true,
                    emphasis: { focus: 'series' }
                },
                data: data.map(d => d.commitment_fee_usd)
            },
            {
                name: 'Ahorro Logrado',
                kind: 'line' as const,
                smooth: true,
                extra: {
                    areaStyle: { color: '#22c55e', opacity: 0.2 },
                    lineStyle: { width: 2, color: '#22c55e' },
                    itemStyle: { color: '#22c55e' },
                    symbol: 'circle',
                    showSymbol: true,
                    emphasis: { focus: 'series' }
                },
                // CORRECCIÓN: Se envían tal cual vienen de la API (positivos)
                data: data.map(d => Math.abs(d.savings_generated_usd)) 
            }
        ];

        const dateCount = dates.length;
        const start = dateCount ? toUTCDate(dates[0]) : null;
        const end = dateCount ? toUTCDate(dates[dateCount - 1]) : null;
        const daysDiff = start && end ? Math.floor((+end - +start) / 86_400_000) + 1 : 0;

        const bigStep = Math.max(1, Math.ceil(dateCount / 12));
        const midStep = Math.max(1, Math.ceil(dateCount / 20));

        const base = makeBaseOptions({
            legend: ['Costo Fijo del CUD', 'Ahorro Logrado'],
            legendPos: 'top',
            useUTC: true,
            showToolbox: true,
            showDataZoom: true
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'category',
            legend: true,
            legendOption: {
                type: 'scroll',
                orient: 'horizontal',
                top: 6,
                left: 'center',
                textStyle: { fontSize: 11, color: '#666' },
                data: ['Costo Fijo del CUD', 'Ahorro Logrado']
            },
            tooltip: true,
            tooltipFormatter(params) {
                if (!params || !(Array.isArray(params)) || !params.length) return '';

                const dataIndex = (params[0] as { dataIndex: number }).dataIndex;
                const originalDate = toUTCDate(dates[dataIndex]);
                const dateStr = fmt.format(originalDate);

                const items = (params as unknown[]).map((p) => {
                    const rawValue = Number((p as { value: unknown }).value || 0);
                    const sName = (p as { seriesName: string }).seriesName;
                    return {
                        name: sName,
                        value: rawValue,
                        isSavings: sName === 'Ahorro Logrado',
                        marker: (p as { marker: string }).marker,
                    };
                });

                const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

                let html = `<div style="font-weight:600;margin-bottom:8px">${dateStr}</div>`;
                html += `<div style="max-height:280px; overflow:auto; padding-right:4px;">`;

                items.forEach((i) => {
                    html += `
                    <div style="display:flex;align-items:center;gap:12px;justify-content:space-between;line-height:1.25;margin:6px 0">
                        <div style="display:flex;align-items:center;gap:6px;min-width:0">
                            ${i.marker}
                            <span style="font-weight:600; color:#555">${i.name}</span>
                        </div>
                        <div style="font-variant-numeric: tabular-nums; font-weight: bold; color: ${i.isSavings ? '#22c55e' : '#ef4444'}">
                            ${money(i.value)}
                        </div>
                    </div>`;
                });

                const cost = items.find(i => !i.isSavings)?.value || 0;
                const sav = items.find(i => i.isSavings)?.value || 0;
                const net = cost - sav; 
                const netColor = net > 0 ? '#ef4444' : '#22c55e';

                html += `</div>`;
                html += `
                <div style="border-top:1px solid #eee;margin-top:8px;padding-top:6px;font-weight:700;display:flex;justify-content:space-between">
                    <span>Impacto Neto:</span>
                    <span style="color:${netColor}">${net > 0 ? '+' : ''}${money(net)}</span>
                </div>`;

                return html;
            },
            series: series,
            extraOption: {
                tooltip: {
                    triggerOn: 'mousemove|click',
                    enterable: true,
                    confine: true,
                },
                toolbox: { top: 30 },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dates,
                    axisLine: { lineStyle: { color: '#d0d0d0' } },
                    axisTick: { show: false },
                    axisLabel: {
                        fontSize: 10,
                        color: '#666',
                        margin: 8,
                        formatter: (value: string, index: number) => {
                            if (!dateCount) return '';
                            const d = toUTCDate(value);
                            if (daysDiff > 365) return (index === 0 || index === dateCount - 1 || index % bigStep === 0) ? fmt.format(d) : '';
                            if (daysDiff > 30) return (index % midStep === 0) ? fmt.format(d) : '';
                            return fmt.format(d);
                        }
                    },
                    splitLine: { show: true, lineStyle: { color: '#f5f5f5', type: 'dashed' } },
                },
                yAxis: {
                    type: 'value',
                    name: 'Costo USD',
                    nameTextStyle: { color: '#666', fontSize: 12, padding: [0, 0, 10, 0] },
                    nameGap: 25,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        // CORRECCIÓN: Ya no usamos Math.abs para no "engañar" al eje
                        formatter: (value: number) => '$' + value.toLocaleString(),
                        color: '#666',
                        fontSize: 10,
                    },
                    splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
                    min: 0 // Forzamos a que el gráfico empiece en 0 y suba
                },
                grid: { left: 60, right: 60, top: 80, bottom: 80, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    useEffect(() => {
        const dom = chartRef.current;
        if (!dom) return;

        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        let pinned = false;

        const setPinned = (value: boolean) => {
            pinned = value;
            chart.setOption(
                { tooltip: { alwaysShowContent: value, triggerOn: value ? 'none' : 'mousemove|click' } },
                false
            );
            if (!value) chart.dispatchAction({ type: 'hideTip' });
        };

        const onClick = (params: unknown) => {
            setPinned(!pinned);
            if (!pinned) {
                const p = params as { seriesIndex?: number; dataIndex?: number };
                if (typeof p.dataIndex === 'number') {
                    chart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: typeof p.seriesIndex === 'number' ? p.seriesIndex : 0,
                        dataIndex: p.dataIndex,
                    });
                }
            }
        };

        const onZrClick = (e: unknown) => {
            const ev = e as { target?: unknown };
            if (!ev.target && pinned) setPinned(false);
        };

        const onGlobalOut = () => {
            if (!pinned) chart.dispatchAction({ type: 'hideTip' });
        };

        chart.on?.('click', onClick);
        chart.on?.('globalout', onGlobalOut);
        chart.getZr?.()?.on?.('click', onZrClick);

        return () => {
            const currentDom = chartRef.current;
            const inst = currentDom ? echarts.getInstanceByDom(currentDom) : null;
            if (!inst || (inst as unknown as { isDisposed?: () => boolean })?.isDisposed?.()) return;

            inst.off?.('click', onClick);
            inst.off?.('globalout', onGlobalOut);
            inst.getZr?.()?.off?.('click', onZrClick);
        };
    }, [option]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end px-4">
                <Button variant="outline" size="sm" className="gap-2" onClick={exportChart}>
                    <Download className="h-4 w-4" />
                    Exportar PNG
                </Button>
            </div>
            <div ref={chartRef} className="w-full h-[350px] md:h-[400px]" />
        </div>
    );
};