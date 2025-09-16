'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { EventGroup } from '@/interfaces/vista-eventos/eventsViewInterfaces';

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
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const safeData = Array.isArray(data) ? data : [];

    // 1) Aplanar y contar por tipo de evento (event_name)
    const { legendItems, pieData, totalCount } = useMemo(() => {
        const counts = new Map<string, number>();

        for (const allEvents of safeData) {
            if (!Array.isArray(allEvents)) continue;
            for (const groupEvent of allEvents) {
                if (!groupEvent?.event_name || !Array.isArray(groupEvent?.docs)) continue;
                const inc = groupEvent.docs.length; // cada doc es un evento
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

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const option: echarts.EChartsOption = {
            animation: true,
            animationDuration: 300,
            animationEasing: 'linear',
            color: palette,
            toolbox: {
                right: 10,
                top: 56,
                feature: {
                    saveAsImage: { pixelRatio: 2, excludeComponents: ['toolbox'] }
                },
                iconStyle: { borderColor: '#999' },
                emphasis: { iconStyle: { borderColor: '#666' } }
            },
            tooltip: {
                trigger: 'item',
                transitionDuration: 0.1,
                hideDelay: 100,
                backgroundColor: 'rgba(50, 50, 50, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: (p: unknown) => {
                    // p: { name, value, percent, marker }
                    return `${p.marker} ${p.name}<br/><strong>${p.value}</strong> eventos (${p.percent}%)`;
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                top: 10,
                left: 'center',
                animation: false,
                textStyle: { fontSize: 12 },
                data: legendItems
            },
            series: [
                {
                    name: 'Eventos por tipo',
                    type: 'pie',
                    radius: ['50%', '70%'],          // donut
                    center: ['50%', '55%'],
                    avoidLabelOverlap: true,
                    selectedMode: false,
                    minAngle: 3,
                    padAngle: 1,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        formatter: (p: unknown) => `${p.name}\n${p.value} (${p.percent}%)`,
                        fontSize: 11
                    },
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 6
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 4,
                        itemStyle: { shadowBlur: 8, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
                        label: { fontWeight: 'bold' }
                    },
                    data: pieData
                }
            ]
        };

        chartInstance.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
        chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: true, silent: false });

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };
    }, [legendItems, pieData, handleResize]);

    const isEmpty = !pieData?.length || totalCount === 0;

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
