'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { EventGroup } from '@/interfaces/vista-eventos/eventsViewInterfaces';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface EventsViewEventCountComponentProps {
    data: EventGroup[][] | null;
    sortDesc?: boolean;
}

const palette = [
    '#36A2EB', '#FF6384', '#28e995', '#FF9F40', '#9966FF',
    '#4BC0C0', '#C9CBCF', '#E7E9ED', '#8DD3C7', '#FDB462',
    '#B3DE69', '#FCCDE5'
];

export const EventsViewEventCountComponent = ({
    data,
    sortDesc = true
}: EventsViewEventCountComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const safeData = Array.isArray(data) ? data : [];

    const { legendItems, pieData, totalCount } = useMemo(() => {
        const counts = new Map<string, number>();

        for (const allEvents of safeData) {
            if (!Array.isArray(allEvents)) continue;
            for (const groupEvent of allEvents) {
                if (!groupEvent?.event_name || !Array.isArray(groupEvent?.docs)) continue;
                const inc = groupEvent.docs.length;
                if (inc > 0) counts.set(groupEvent.event_name, (counts.get(groupEvent.event_name) ?? 0) + inc);
            }
        }

        let entries = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
        if (sortDesc) {
            entries = entries.sort((a, b) => b.value - a.value);
        }

        const legendItems = entries.map(e => e.name);
        const totalCount = entries.reduce((s, e) => s + e.value, 0);

        return { legendItems, pieData: entries, totalCount };
    }, [safeData, sortDesc]);

    const option = useMemo(() => {
        const textColor = isDark ? '#ffffff' : '#131a22';
        const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(50, 50, 50, 0.95)';
        const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';
        const iconBorder = isDark ? '#9ca3af' : '#999';
        const iconBorderEmph = isDark ? '#d1d5db' : '#666';
        const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

        const base = makeBaseOptions({
            legend: legendItems,
            legendPos: 'top',
            unitLabel: 'Créditos',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });

        const pie = createChartOption({
            kind: 'pie',
            xAxisType: 'category',
            legend: true,
            tooltip: true,
            series: [
                {
                    name: 'Eventos por tipo',
                    kind: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '55%'],
                    extra: {
                        itemStyle: {
                            borderRadius: 4,
                            borderColor: seriesBorderColor,
                            borderWidth: 1
                        },
                        label: {
                            show: true,
                            formatter: (p: unknown) => `${p.name}\n${p.value} (${p.percent}%)`,
                            fontSize: 11,
                            color: textColor
                        },
                        emphasis: {
                            scale: true,
                            scaleSize: 4,
                            itemStyle: { shadowBlur: 8, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
                            label: { fontWeight: 'bold' }
                        }
                    },
                    data: pieData
                }
            ]
        })

        return deepMerge(base, pie);
    }, [isDark, legendItems, pieData])

    const isEmpty = !pieData?.length || totalCount === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Eventos por tipo (distribución)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Muestra la <strong>proporción</strong> de eventos por tipo en el periodo seleccionado. Total: <strong>{totalCount}</strong>.
                    </p>
                </div>

                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay eventos para graficar.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};
