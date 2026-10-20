'use client'

import * as echarts from 'echarts';
import { Button } from '@/components/ui/button';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, type RefObject } from 'react';

export interface BillingChartPoint {
    date: string;
    service: string;
    cost: number;
}

interface BillingTrendChartProps {
    data: BillingChartPoint[];
    currency: string;
}

const generateUniqueColors = (count: number) => {
    const colors: string[] = [];
    const goldenAngle = 137.5;
    for (let i = 0; i < count; i++) {
        const hue = (i * goldenAngle) % 360;
        colors.push(`hsla(${Math.round(hue)}, 70%, 65%, 0.8)`);
    }
    return colors;
};

const serviceColorCache = new Map<string, string>();

const getServiceColor = (serviceName: string, serviceIndex: number, totalServices: number) => {
    if (serviceColorCache.has(serviceName)) return serviceColorCache.get(serviceName)!;

    if (serviceColorCache.size === 0) {
        const colors = generateUniqueColors(Math.max(totalServices, 50));
        const color = colors[serviceIndex % colors.length];
        serviceColorCache.set(serviceName, color);
        return color;
    }

    const usedColors = Array.from(serviceColorCache.values());
    for (const color of generateUniqueColors(usedColors.length + 20)) {
        if (!usedColors.includes(color)) {
            serviceColorCache.set(serviceName, color);
            return color;
        }
    }

    const hue = (serviceName.charCodeAt(0) + serviceName.length * 137.5) % 360;
    const fallback = `hsla(${Math.round(hue)}, 70%, 65%, 0.8)`;
    serviceColorCache.set(serviceName, fallback);
    return fallback;
};

const toUTCDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const money = (n: number) =>
    n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(2) + 'M'
        : n >= 1_000 ? '$' + (n / 1_000).toFixed(0) + 'K'
            : '$' + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const processChartData = (rawData: BillingChartPoint[]) => {
    const serviceMap = new Map<string, Map<string, number>>();
    const allDates = new Set<string>();

    rawData.forEach(({ service, date, cost }) => {
        allDates.add(date);
        if (!serviceMap.has(service)) serviceMap.set(service, new Map());
        const dateMap = serviceMap.get(service)!;
        dateMap.set(date, (dateMap.get(date) || 0) + cost);
    });

    const dates = Array.from(allDates).sort();
    const totalOf = (m: Map<string, number>) => Array.from(m.values()).reduce((sum, v) => sum + v, 0);
    const services = Array.from(serviceMap.entries())
        .filter(([, dateMap]) => totalOf(dateMap))
        .sort((a, b) => totalOf(b[1]) - totalOf(a[1]));

    const series = services.map(([serviceName, dateMap], index) => {
        const baseColor = getServiceColor(serviceName, index, services.length);
        return {
            name: serviceName,
            kind: 'line' as const,
            smooth: true,
            extra: {
                areaStyle: { color: baseColor, opacity: 0.7 },
                lineStyle: { width: 1, color: baseColor.replace('0.8', '1') },
                smooth: true,
                symbol: 'circle',
                showSymbol: true,
                emphasis: { focus: 'series' }
            },
            data: dates.map((d) => dateMap.get(d) || 0),
        };
    });

    return { dates, series };
};

export const BillingTrendChart = ({ data, currency }: BillingTrendChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const exportChart = () => {
        const dom = chartRef.current;
        if (!dom) return;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        const link = document.createElement('a');
        link.download = `tendencia-facturacion-${new Date().toISOString().split('T')[0]}.png`;
        link.href = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
        link.click();
    };

    const option = useMemo(() => {
        const { dates, series } = processChartData(data);
        const names = series.map((s) => s.name);

        const dateCount = dates.length;
        const start = dateCount ? toUTCDate(dates[0]) : null;
        const end = dateCount ? toUTCDate(dates[dateCount - 1]) : null;
        const daysDiff = start && end ? Math.floor((+end - +start) / 86_400_000) + 1 : 0;
        const bigStep = Math.max(1, Math.ceil(dateCount / 12));
        const midStep = Math.max(1, Math.ceil(dateCount / 20));

        const base = makeBaseOptions({
            legend: names,
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
                selectedMode: 'multiple',
                data: names,
            },
            tooltip: true,
            tooltipFormatter(params: unknown) {
                if (!params || !Array.isArray(params) || !params.length) return '';

                const dateStr = fmt.format(toUTCDate(dates[(params[0] as { dataIndex: number }).dataIndex]));
                const items = (params as unknown[]).map((p) => ({
                    name: (p as { seriesName: string }).seriesName,
                    value: Number((p as { value: unknown }).value || 0),
                    marker: (p as { marker: string }).marker,
                })).filter((i) => i.value > 0);

                if (!items.length) {
                    return `<div style="font-weight:600;margin-bottom:6px">${dateStr}</div>
                      <div style="font-weight:600">Total: $0</div>`;
                }

                items.sort((a, b) => b.value - a.value);
                const total = items.reduce((s, i) => s + i.value, 0);

                let html = `<div style="font-weight:600;margin-bottom:8px">${dateStr}</div>`;
                html += `<div style="max-height:280px; overflow:auto; padding-right:4px;">`;
                html += items.map((i) => {
                    const pct = total > 0 ? (i.value / total) * 100 : 0;
                    return `
                <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;line-height:1.25;margin:3px 0">
                  <div style="display:flex;align-items:center;gap:6px;min-width:0">
                    ${i.marker}
                    <span style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${i.name}</span>
                  </div>
                  <div style="font-variant-numeric: tabular-nums;">
                    <span>${money(i.value)}</span>
                    <span style="color:#666"> · ${pct.toFixed(1)}%</span>
                  </div>
                </div>`;
                }).join('');
                html += `</div>`;
                html += `
              <div style="border-top:1px solid #eee;margin-top:8px;padding-top:6px;font-weight:700">
                Total: ${money(total)} ${currency}
              </div>`;
                return html;
            },
            series: series.slice().reverse(),
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
                        rotate: 45,
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
                    name: `Facturación (${currency})`,
                    nameTextStyle: { color: '#666', fontSize: 12, padding: [0, 0, 10, 0] },
                    nameGap: 25,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        formatter: (value: number) => {
                            if (value === 0) return '$0';
                            if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
                            if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
                            return '$' + value.toLocaleString();
                        },
                        color: '#666',
                        fontSize: 10,
                    },
                    splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
                    min: (v: unknown) => {
                        const obj = v as { min: number; max: number };
                        return Math.max(0, obj.min - (obj.max - obj.min) * 0.1);
                    },
                },
                grid: { left: 60, right: 60, top: 80, bottom: 80, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data, currency]);

    useECharts(chartRef as RefObject<HTMLDivElement>, option, [option], isDark ? 'cp-dark' : 'cp-light');

    useEffect(() => {
        const dom = chartRef.current;
        if (!dom) return;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        let pinned = false;
        const setPinned = (value: boolean) => {
            pinned = value;
            chart.setOption({ tooltip: { alwaysShowContent: value, triggerOn: value ? 'none' : 'mousemove|click' } }, false);
            if (!value) chart.dispatchAction({ type: 'hideTip' });
        };

        const onClick = (params: unknown) => {
            setPinned(!pinned);
            if (!pinned) return;
            const p = params as { seriesIndex?: number; dataIndex?: number };
            if (typeof p.dataIndex === 'number') {
                chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: typeof p.seriesIndex === 'number' ? p.seriesIndex : 0,
                    dataIndex: p.dataIndex,
                });
            }
        };
        const onZrClick = (e: unknown) => {
            if (!(e as { target?: unknown }).target && pinned) setPinned(false);
        };
        const onGlobalOut = () => {
            if (!pinned) chart.dispatchAction({ type: 'hideTip' });
        };

        chart.on?.('click', onClick);
        chart.on?.('globalout', onGlobalOut);
        chart.getZr?.()?.on?.('click', onZrClick);

        return () => {
            const inst = echarts.getInstanceByDom(dom);
            if (!inst || (inst as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;
            inst.off?.('click', onClick);
            inst.off?.('globalout', onGlobalOut);
            inst.getZr?.()?.off?.('click', onZrClick);
        };
    }, [option]);

    return (
        <>
            <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={exportChart}>
                    <Download className="h-4 w-4" />
                    Exportar
                </Button>
            </div>
            <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        </>
    );
};
