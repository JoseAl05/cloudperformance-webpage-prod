// 'use client';

// import { useCallback, useEffect, useMemo, useRef } from 'react';
// import * as echarts from 'echarts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Info } from 'lucide-react';
// import { AllEvents, EventGroup } from '@/interfaces/vista-eventos/eventsViewInterfaces';

// interface EventsViewEventCountComponentProps {
//     data: EventGroup[][] | null;
// }

// const sliderConfig = [
//     {
//         type: 'slider',
//         xAxisIndex: 0,
//         bottom: 20,
//         height: 20,
//         handleSize: '100%',
//         start: 0,
//         end: 100,
//         realtime: false,
//         throttle: 100,
//         zoomOnMouseWheel: false,
//         moveOnMouseMove: false
//     },
//     {
//         type: 'inside',
//         start: 0,
//         end: 100,
//         filterMode: 'filter',
//         throttle: 100,
//         zoomOnMouseWheel: true,
//         moveOnMouseMove: true
//     },
// ];

// const tooltipFormatter = (params: unknown) => {
//     const date = new Date(params[0].value[0]).toUTCString();
//     return (
//         `${date}<br/>` +
//         params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} eventos<br/>`).join('')
//     );
// };

// const palette = [
//     '#36A2EB', '#FF6384', '#28e995', '#FF9F40', '#9966FF',
//     '#4BC0C0', '#C9CBCF', '#E7E9ED', '#8DD3C7', '#FDB462',
//     '#B3DE69', '#FCCDE5'
// ];

// export const EventsViewEventCountComponent = ({ data }: EventsViewEventCountComponentProps) => {
//     const chartRef = useRef<HTMLDivElement>(null);
//     const chartInstance = useRef<echarts.ECharts | null>(null);
//     const resizeObserverRef = useRef<ResizeObserver | null>(null);

//     const safeData = Array.isArray(data) ? data : [];

//     const { legendItems, seriesList } = useMemo(() => {
//         const flatEvents = [];
//         for (const allEvents of safeData) {
//             if (!Array.isArray(allEvents)) continue;
//             for (const groupEvent of allEvents) {
//                 if(!Array.isArray(groupEvent?.docs)) continue;
//                 for(const event of groupEvent.docs){
//                     if (!groupEvent?.event_name) continue;
//                     if (event?.EventTime){
//                         flatEvents.push({
//                             event_name: groupEvent.event_name,
//                             event_time: event.EventTime
//                         })
//                     }
//                 }
//             }
//         }
//         const bucketMs = Math.max(1, 60) * 60 * 1000;
//         const floorToBucket = (ts: number) => Math.floor(ts / bucketMs) * bucketMs;
//         const allEvents = new Set<number>();
//         const eventTypeSet = new Set<string>();

//         const countsByType: Record<string, Map<number, number>> = {};

//         for (const ev of flatEvents) {
//             const t = Date.parse(ev.event_time);
//             if (isNaN(t)) continue;
//             const eventGroup = floorToBucket(t);
//             allEvents.add(eventGroup);
//             eventTypeSet.add(ev.event_name);

//             const m = (countsByType[ev.event_name] ??= new Map<number, number>());
//             m.set(eventGroup, (m.get(eventGroup) ?? 0) + 1);
//         }

//         const sortedEvents = Array.from(allEvents).sort((a, b) => a - b);

//         const legendItems = Array.from(eventTypeSet).sort((a, b) => a.localeCompare(b));

//         const seriesList = legendItems.map((type, idx) => {
//             const perEvent = countsByType[type] ?? new Map<number, number>();
//             const dataPairs: [string, number][] = sortedEvents.map((b) => [new Date(b).toISOString(), perEvent.get(b) ?? 0]);
//             // color de paleta
//             const color = palette[idx % palette.length];
//             return createSeries(type, dataPairs, color);
//         });

//         return { legendItems, seriesList };
//     }, [safeData])


//     const handleResize = useCallback(() => {
//         chartInstance.current?.resize();
//     }, []);

//     useEffect(() => {
//         if (!chartRef.current) return;

//         const optionEvents: echarts.EChartsOption = {
//             animation: seriesList.reduce((n, s) => n + (s.data as unknown[]).length, 0) < 1000,
//             animationDuration: 300,
//             animationEasing: 'linear',
//             progressiveThreshold: 500,
//             progressive: 200,
//             hoverLayerThreshold: 3000,
//             useUTC: true,
//             dataZoom: sliderConfig,
//             tooltip: {
//                 trigger: 'axis',
//                 formatter: tooltipFormatter as unknown,
//                 transitionDuration: 0.1,
//                 hideDelay: 100,
//                 backgroundColor: 'rgba(50, 50, 50, 0.95)',
//                 borderColor: 'rgba(255, 255, 255, 0.2)',
//                 textStyle: { color: '#fff', fontSize: 12 },
//                 axisPointer: { animation: false }
//             },
//             legend: {
//                 data: legendItems,
//                 top: 10,
//                 left: 'center',
//                 animation: false,
//                 textStyle: { fontSize: 12 }
//             },
//             grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
//             toolbox: {
//                 feature: {
//                     saveAsImage: { pixelRatio: 2, excludeComponents: ['toolbox'] }
//                 },
//                 iconStyle: { borderColor: '#999' },
//                 emphasis: { iconStyle: { borderColor: '#666' } }
//             },
//             xAxis: {
//                 type: 'time',
//                 boundaryGap: false,
//                 axisLabel: {
//                     fontSize: 11,
//                     formatter: (value: number) => {
//                         const date = new Date(value);
//                         const dd = String(date.getUTCDate()).padStart(2, '0');
//                         const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
//                         const HH = String(date.getUTCHours()).padStart(2, '0');
//                         const MM = String(date.getUTCMinutes()).padStart(2, '0');
//                         return `${dd}/${mm} ${HH}:${MM}`;
//                     },
//                     showMaxLabel: true,
//                     showMinLabel: true
//                 },
//                 axisLine: { lineStyle: { color: '#e0e0e0' } },
//                 axisTick: { show: false },
//                 splitLine: { show: false }
//             },
//             yAxis: {
//                 type: 'value',
//                 // max: yMaxRounded,
//                 scale: true,
//                 axisLabel: {
//                     fontSize: 11,
//                     formatter: (val: number) => `${val} eventos`,
//                     showMaxLabel: true,
//                     showMinLabel: true
//                 },
//                 axisLine: { show: false },
//                 axisTick: { show: false },
//                 splitLine: { lineStyle: { color: '#f0f0f0', type: 'solid', width: 1 } }
//             },
//             series: seriesList,
//             animation: true
//         };

//         chartInstance.current = echarts.init(chartRef.current, null, {
//             renderer: 'canvas'
//         });
//         chartInstance.current.setOption(optionEvents, {
//             notMerge: true,
//             lazyUpdate: true,
//             silent: false
//         });

//         resizeObserverRef.current = new ResizeObserver(handleResize);
//         resizeObserverRef.current.observe(chartRef.current);
//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//             resizeObserverRef.current?.disconnect();
//             chartInstance.current?.dispose();
//         };
//     }, [legendItems, seriesList, handleResize]);

//     const isEmpty = seriesList.every(s => !(s.data as [string, number][])?.length);

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle>Eventos por tipo (conteo)</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="flex items-center justify-center gap-2 mb-2">
//                     <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
//                     <p className="text-xs text-muted-foreground">
//                         Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>. Agrupación por 60 min.
//                     </p>
//                 </div>

//                 {isEmpty ? (
//                     <div className="w-full h-[200px] flex items-center justify-center">
//                         <p className="text-sm text-muted-foreground">No hay eventos para graficar.</p>
//                     </div>
//                 ) : (
//                     <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

// const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
//     name,
//     type: 'line',
//     data,
//     smooth: false,
//     smoothMonotone: null,
//     symbol: 'none',
//     symbolSize: 0,
//     lineStyle: {
//         color,
//         width: 2,
//         cap: 'round',
//         join: 'round'
//     },
//     itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
//     emphasis: {
//         focus: 'series',
//         lineStyle: {
//             width: 3
//         },
//         disabled: data.length > 5000
//     },
//     blur: {
//         lineStyle: {
//             opacity: 0.2
//         }
//     },
//     large: data.length > 1000,
//     largeThreshold: 1000,
//     sampling: data.length > 2000 ? 'lttb' : null,
//     progressive: data.length > 1000 ? 0 : undefined,
//     progressiveThreshold: data.length > 1000 ? 500 : undefined,
//     progressiveChunkMode: data.length > 5000 ? 'mod' : undefined,
//     ...(areaColor && {
//         areaStyle: {
//             color: areaColor,
//             opacity: 0.4
//         }
//     })
// });

'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { EventGroup } from '@/interfaces/vista-eventos/eventsViewInterfaces';

interface EventsViewEventCountComponentProps {
    data: EventGroup[][] | null;
    /** Ordenar desc por conteo (true por defecto) */
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
