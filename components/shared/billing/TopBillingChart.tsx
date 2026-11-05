'use client'

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as echarts from 'echarts';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import type { BillingTopItem } from '@/interfaces/billing';

interface LegendCfg {
    type?: 'plain' | 'scroll';
    orient?: 'horizontal' | 'vertical';
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
}

export interface TopBillingUiTuning {
    yLabelStrategy?: 'truncate' | 'fit';
    yLabelMaxChars?: number;
    yLabelFontSize?: number;
    gridMinLeft?: number;
    gridMaxLeft?: number;
    axisLabelInterval?: number | 'auto';
    legend?: LegendCfg;
}

interface TopBillingChartProps {
    items: BillingTopItem[];
    selected: string | null;
    onSelect: (value: string | null) => void;
    topLimit: number | 'all';
    currency: string;
    uiTuning?: TopBillingUiTuning;
}

const NO_SERVICE = 'Sin servicio';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const LARGE_MODE = {
    large: true,
    largeThreshold: 200,
    progressiveChunkMode: 'mod' as const,
    animation: false,
    animationDuration: 0,
    animationDurationUpdate: 0,
};

export const TopBillingChart = ({ items, selected, onSelect, topLimit, currency, uiTuning }: TopBillingChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const positive = useMemo(() => items.filter((item) => item.cost > 0), [items]);

    const mainView = useMemo(() => {
        const services = Array.from(new Set(positive.map((item) => item.service ?? NO_SERVICE)));
        const dataMap = new Map<string, Map<string, number>>();
        const totals: Record<string, number> = {};

        positive.forEach((item) => {
            const value = item.value || 'N/D';
            const service = item.service ?? NO_SERVICE;
            totals[value] = (totals[value] || 0) + item.cost;
            if (!dataMap.has(value)) dataMap.set(value, new Map());
            const serviceMap = dataMap.get(value)!;
            serviceMap.set(service, (serviceMap.get(service) || 0) + item.cost);
        });

        let sorted = Object.entries(totals).map(([value, total]) => ({ value, total })).sort((a, b) => b.total - a.total);
        if (topLimit !== 'all') sorted = sorted.slice(0, topLimit);

        const largeMode = services.length > 14 || sorted.length > 20;
        const seriesData = services.map((service) => ({
            name: service,
            kind: 'bar' as const,
            extra: { stack: 'total', ...(largeMode ? { ...LARGE_MODE, progressive: 600, progressiveThreshold: 3000 } : {}) },
            data: sorted.map(({ value }) => [dataMap.get(value)?.get(service) || 0, value]),
        }));

        return { services, seriesData, yCategories: sorted.map((s) => s.value), totals };
    }, [positive, topLimit]);

    const detailView = useMemo(() => {
        if (!selected) return null;
        const serviceTotals: Record<string, number> = {};
        positive.filter((item) => item.value === selected).forEach((item) => {
            const service = item.service ?? NO_SERVICE;
            serviceTotals[service] = (serviceTotals[service] || 0) + item.cost;
        });
        const sorted = Object.entries(serviceTotals).map(([service, total]) => ({ service, total }))
            .filter((s) => s.total > 0).sort((a, b) => b.total - a.total);
        const yCategories = sorted.map((s) => s.service);
        return {
            yCategories,
            seriesData: [{
                name: 'Costo',
                kind: 'bar' as const,
                data: sorted.map((s) => [s.total, s.service]),
                extra: yCategories.length > 32 ? { ...LARGE_MODE, progressive: 500, progressiveThreshold: 2000 } : undefined,
            }],
        };
    }, [positive, selected]);

    const yLabels = detailView ? detailView.yCategories : mainView.yCategories;

    const dynamicLeft = useMemo(() => {
        const fontSize = uiTuning?.yLabelFontSize ?? 12;
        const longest = yLabels.reduce((m, label) => Math.max(m, label.length), 0);
        return clamp(Math.round(longest * fontSize * 0.62) + 80, uiTuning?.gridMinLeft ?? 150, uiTuning?.gridMaxLeft ?? 300);
    }, [yLabels, uiTuning?.yLabelFontSize, uiTuning?.gridMinLeft, uiTuning?.gridMaxLeft]);

    const option = useMemo(() => {
        const isDetail = Boolean(detailView);
        const money = (n: number) => `$${n.toFixed(2)}`;

        const base = makeBaseOptions({
            legend: isDetail ? [] : mainView.services,
            unitLabel: currency,
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
            legendConfig: {
                type: uiTuning?.legend?.type ?? 'scroll',
                orient: uiTuning?.legend?.orient ?? 'horizontal',
                bottom: uiTuning?.legend?.bottom ?? 8,
                left: uiTuning?.legend?.left ?? 'center',
                right: uiTuning?.legend?.right,
                top: uiTuning?.legend?.top,
                selectedMode: 'multiple',
            },
        });

        const series = isDetail ? detailView?.seriesData ?? [] : mainView.seriesData;
        const visibleCategories = isDetail ? detailView?.yCategories ?? [] : mainView.yCategories;
        if (visibleCategories.length > 25 || (!isDetail && series.length > 20)) {
            Object.assign(base, {
                animation: false,
                animationDuration: 0,
                animationDurationUpdate: 0,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear',
                animationDelay: 0,
                animationDelayUpdate: 0,
                stateAnimation: { duration: 0 },
                universalTransition: false,
            });
            base.toolbox = undefined;
        }

        const readValue = (raw: unknown) => (Array.isArray(raw) ? toNumber(raw[0]) : toNumber(raw));

        const tooltipFormatter = (params: unknown) => {
            const list = (Array.isArray(params) ? params : []) as Record<string, unknown>[];
            const visible = list.filter((p) => readValue(p.value) > 0).sort((a, b) => readValue(b.value) - readValue(a.value));
            const total = visible.reduce((sum, p) => sum + readValue(p.value), 0);
            const lines = visible.map((p) => `${String(p.marker ?? '')} ${String(p.seriesName ?? '')}: ${money(readValue(p.value))}`);
            const header = isDetail
                ? `<strong>Total: ${money(total)} ${currency}</strong>`
                : `<strong>${String(list[0]?.axisValue ?? '')} - Total: ${money(total)} ${currency}</strong>`;
            const body = lines.length ? lines.join('<br/>') : '<em>Sin datos</em>';
            return `<div>${header}<div style="max-height: 220px; overflow-y: auto; margin-top: 6px; padding-right: 6px;">${body}</div></div>`;
        };

        const truncate = (label: string) => {
            const max = uiTuning?.yLabelMaxChars ?? 36;
            return uiTuning?.yLabelStrategy === 'truncate' && label.length > max ? `${label.slice(0, max - 1)}…` : label;
        };
        const yFormatter = (value: unknown) => {
            const label = String(value ?? '');
            return isDetail ? truncate(label) : `${truncate(label)} (${money(mainView.totals[label] || 0)})`;
        };

        const gridLeft = uiTuning?.yLabelStrategy === 'fit' ? dynamicLeft : (uiTuning?.gridMinLeft ?? 150);

        const built = createChartOption({
            kind: 'bar',
            legend: !isDetail,
            tooltip: true,
            tooltipFormatter,
            xAxisType: 'value',
            series,
            extraOption: {
                grid: { left: gridLeft, right: 16, top: 56, bottom: 64, containLabel: true },
                xAxis: { type: 'value', name: currency },
                yAxis: {
                    type: 'category',
                    data: visibleCategories,
                    ...(isDetail ? {} : { name: 'Categorías' }),
                    inverse: true,
                    axisLabel: {
                        interval: uiTuning?.axisLabelInterval ?? 'auto',
                        fontSize: uiTuning?.yLabelFontSize ?? 12,
                        formatter: yFormatter,
                    },
                },
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        filterMode: 'weakFilter',
                        width: 15,
                        right: 10,
                        start: 0,
                        end: 100,
                        handleSize: '80%',
                        showDataShadow: false,
                        labelFormatter: '',
                    },
                    { type: 'inside', yAxisIndex: 0, filterMode: 'weakFilter', start: 0, end: 100 },
                ],
                tooltip: { triggerOn: 'mousemove|click', enterable: true, confine: true },
            },
        });

        return deepMerge(base, built);
    }, [detailView, mainView, uiTuning, dynamicLeft, currency]);

    useECharts(chartRef as RefObject<HTMLDivElement>, option, [option], isDark ? 'cp-dark' : 'cp-light');

    useEffect(() => {
        if (!chartRef.current) return;
        const inst = echarts.getInstanceByDom(chartRef.current);
        if (!inst) return;

        const handler = (params: unknown) => {
            if (selected) return;
            const name = String((params as { name?: unknown }).name ?? '');
            if (name) onSelect(name);
        };
        const ec = inst as unknown as {
            on: (e: string, h: (p: unknown) => void) => void;
            off: (e?: string, h?: (p: unknown) => void) => void;
        };
        ec.off('click');
        ec.on('click', handler);
        return () => ec.off('click', handler);
    }, [selected, onSelect, option]);

    return (
        <>
            {selected && (
                <Button
                    onClick={() => onSelect(null)}
                    className="absolute top-4 left-4 px-3 py-1 rounded text-sm z-10 bg-blue-600 text-white hover:bg-blue-700"
                >
                    ← Volver
                </Button>
            )}
            <div ref={chartRef} className="w-full h-[600px]" />
        </>
    );
};
