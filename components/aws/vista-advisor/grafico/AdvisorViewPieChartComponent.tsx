// 'use client';

// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import * as echarts from 'echarts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Info } from 'lucide-react';
// import { useTheme } from 'next-themes';
// import { EventGroup } from '@/interfaces/vista-eventos/eventsViewInterfaces';
// import { AdvisorApiResponse } from '@/interfaces/vista-advisor/advisorViewInterfaces';

// interface AdvisorViewPieChartComponentProps {
//     data: AdvisorApiResponse | null;
//     sortDesc?: boolean;
// }

// const STATE_COLORS: Record<'OK' | 'Warning' | 'No disponible' | 'Error', string> = {
//     OK: '#19a500',
//     Warning: '#f4d800',
//     'No disponible': '#c9cacb',
//     Error: '#ff2828',
// };

// const STATES = [
//     { key: 'OK' as const, label: 'OK', getCount: (row: unknown) => row?.total_ok_recommendations ?? 0 },
//     { key: 'Warning' as const, label: 'Warning', getCount: (row: unknown) => row?.total_warning_recommendations ?? 0 },
//     { key: 'No disponible' as const, label: 'No disponible', getCount: (row: unknown) => row?.total_not_available_recommendations ?? 0 },
//     { key: 'Error' as const, label: 'Error', getCount: (row: unknown) => row?.total_error_recommendations ?? 0 },
// ];

// const palette = [
//     '#36A2EB', '#FF6384', '#28e995', '#FF9F40', '#9966FF',
//     '#4BC0C0', '#C9CBCF', '#E7E9ED', '#8DD3C7', '#FDB462',
//     '#B3DE69', '#FCCDE5',
// ];

// export const AdvisorViewPieChartComponent = ({
//     data,
//     sortDesc = true,
// }: AdvisorViewPieChartComponentProps) => {
//     const chartRef = useRef<HTMLDivElement>(null);
//     const chartInstance = useRef<echarts.ECharts | null>(null);
//     const resizeObserverRef = useRef<ResizeObserver | null>(null);

//     // Tema (shadcn + next-themes)
//     const { resolvedTheme } = useTheme();
//     const isDark = resolvedTheme === 'dark';

//     // Evitar hydration mismatch
//     const [mounted, setMounted] = useState(false);
//     useEffect(() => setMounted(true), []);

//     const safeData = Array.isArray(data) ? data : [];

//     const { legendStates, legendCategories, innerStateData, outerCatStateData, totalCount } = useMemo(() => {
//         const categoryTotals: Map<string, number> = new Map();
//         const categoryByState: Map<string, Record<string, number>> = new Map();
//         const colorsByCategory: Map<string, string> = new Map();
//         const stateTotals: Record<string, number> = { OK: 0, Warning: 0, 'No disponible': 0, Error: 0 };
//         let total = 0;

//         for (const row of safeData) {
//             if (!row?.category || !Array.isArray(row?.recommendations)) continue;

//             const category = row.category;
//             if (!categoryByState.has(category)) {
//                 categoryByState.set(category, { OK: 0, Warning: 0, 'No disponible': 0, Error: 0 });
//             }
//             const catBag = categoryByState.get(category)!;

//             for (const st of STATES) {
//                 const c = st.getCount(row);
//                 catBag[st.key] += c;
//                 stateTotals[st.key] += c;
//             }

//             const rowTotal = (row.total_recommendations ?? 0) as number;
//             categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + rowTotal);
//             total += rowTotal;
//         }

//         // Orden de categorías según total (asc/desc)
//         const categories = Array.from(categoryTotals.entries())
//             .sort((a, b) => (sortDesc ? b[1] - a[1] : a[1] - b[1]))
//             .map(([cat]) => cat);

//         // Colores estables por nombre (independiente del orden)
//         const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
//         const categoriesByName = Array.from(categoryTotals.keys()).sort(collator.compare);
//         categoriesByName.forEach((cat, idx) => {
//             colorsByCategory.set(cat, palette[idx % palette.length]);
//         });

//         const innerStateData = STATES.map(st => ({
//             name: st.label,
//             value: stateTotals[st.key],
//             itemStyle: { color: STATE_COLORS[st.label] },
//         }));

//         const outerCatStateData: Array<{
//             name: string;
//             value: number;
//             category: string;
//             stateKey: string;
//             stateLabel: string;
//             itemStyle: { color: string };
//         }> = [];

//         for (const cat of categories) {
//             outerCatStateData.push({
//                 name: cat,
//                 value: categoryTotals.get(cat) ?? 0,
//                 category: cat,
//                 stateKey: '',
//                 stateLabel: '',
//                 itemStyle: { color: colorsByCategory.get(cat) ?? palette[0] },
//             });
//         }

//         const legendStates = STATES.map(st => st.label);
//         return {
//             legendStates,
//             legendCategories: categories,
//             innerStateData,
//             outerCatStateData,
//             totalCount: total,
//         };
//     }, [safeData, sortDesc]);

//     const handleResize = useCallback(() => {
//         chartInstance.current?.resize();
//     }, []);

//     useEffect(() => {
//         if (!mounted) return;
//         if (!chartRef.current) return;

//         const textColor = isDark ? '#ffffff' : '#131a22';
//         const subTextColor = isDark ? '#a1a1aa' : '#6b7280';
//         const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(50, 50, 50, 0.95)';
//         const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';
//         const iconBorder = isDark ? '#9ca3af' : '#999';
//         const iconBorderEmph = isDark ? '#d1d5db' : '#666';
//         const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

//         const isEmpty = !Array.isArray(safeData) || safeData.length === 0;

//         const option: echarts.EChartsOption = {
//             animation: true,
//             animationDuration: 300,
//             animationEasing: 'linear',
//             color: palette,
//             backgroundColor: 'transparent',
//             toolbox: {
//                 right: 10,
//                 top: 66,
//                 feature: {
//                     saveAsImage: { pixelRatio: 2, excludeComponents: ['toolbox'] },
//                 },
//                 iconStyle: { borderColor: iconBorder },
//                 emphasis: { iconStyle: { borderColor: iconBorderEmph } },
//             },
//             tooltip: {
//                 trigger: 'item',
//                 transitionDuration: 0.1,
//                 hideDelay: 100,
//                 backgroundColor: tooltipBg,
//                 borderColor: tooltipBorder,
//                 textStyle: { color: '#fff', fontSize: 12 },
//                 formatter: (p: unknown) => {
//                     if (p?.seriesName === 'Estados') {
//                         return `${p.marker} ${p.name}<br/><strong>${p.value}</strong> recomendaciones`;
//                     }
//                     const s = p?.data?.stateLabel;
//                     const c = p?.data?.category ?? p.name ?? '';
//                     const v = p?.value ?? 0;
//                     if (s) return `${p.marker} ${c} · ${s}<br/><strong>${v}</strong> recomendaciones`;
//                     return `${p.marker} ${c}<br/><strong>${v}</strong> recomendaciones`;
//                 },
//             },
//             legend: [
//                 {
//                     top: 8,
//                     left: 'center',
//                     orient: 'horizontal',
//                     type: 'plain',
//                     icon: 'circle',
//                     textStyle: { fontSize: 12, color: textColor },
//                     data: legendStates,
//                 },
//                 {
//                     top: 34,
//                     left: 'center',
//                     orient: 'horizontal',
//                     type: 'scroll',
//                     pageIconColor: subTextColor,
//                     pageTextStyle: { color: subTextColor },
//                     textStyle: { fontSize: 12, color: textColor },
//                     data: legendCategories,
//                 },
//             ],
//             graphic: [
//                 {
//                     type: 'text',
//                     left: 'center',
//                     top: '58%',
//                     style: {
//                         text: `Total\n${totalCount}`,
//                         textAlign: 'center',
//                         fill: textColor,
//                         fontSize: 14,
//                         fontWeight: 600,
//                     },
//                 },
//             ],
//             series: [
//                 {
//                     name: 'Estados',
//                     type: 'pie',
//                     radius: ['28%', '45%'],
//                     center: ['50%', '58%'],
//                     avoidLabelOverlap: true,
//                     selectedMode: false,
//                     minAngle: 3,
//                     padAngle: 1,
//                     itemStyle: { borderRadius: 4, borderColor: seriesBorderColor, borderWidth: 1 },
//                     label: {
//                         show: true,
//                         formatter: (p: unknown) => `${p.name}\n${p.value}`,
//                         fontSize: 11,
//                         color: textColor,
//                     },
//                     labelLine: { show: true, length: 8, length2: 6, lineStyle: { color: subTextColor } },
//                     emphasis: {
//                         scale: true,
//                         scaleSize: 4,
//                         itemStyle: { shadowBlur: 8, shadowOffsetX: 0, shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' },
//                         label: { fontWeight: 'bold' },
//                     },
//                     data: innerStateData,
//                 },
//                 {
//                     name: 'Categoría',
//                     type: 'pie',
//                     radius: ['50%', '72%'],
//                     center: ['50%', '58%'],
//                     avoidLabelOverlap: true,
//                     selectedMode: false,
//                     minAngle: 2,
//                     padAngle: 0.6,
//                     itemStyle: { borderRadius: 3, borderColor: seriesBorderColor, borderWidth: 1 },
//                     label: {
//                         show: true,
//                         formatter: (p: unknown) => `${p?.data?.category ?? p.name}\n${p.value}`,
//                         fontSize: 11,
//                         color: textColor,
//                     },
//                     labelLine: { show: true, length: 10, length2: 6, lineStyle: { color: subTextColor } },
//                     emphasis: {
//                         scale: true,
//                         scaleSize: 4,
//                         itemStyle: { shadowBlur: 8, shadowOffsetX: 0, shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' },
//                         label: { fontWeight: 'bold' },
//                     },
//                     data: outerCatStateData,
//                 },
//             ],
//         };

//         // (Re)inicializar y setear opciones
//         chartInstance.current?.dispose();
//         chartInstance.current = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
//         chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: true, silent: false });

//         // Resize handling
//         resizeObserverRef.current?.disconnect();
//         resizeObserverRef.current = new ResizeObserver(() => handleResize());
//         resizeObserverRef.current.observe(chartRef.current);

//         const onWindowResize = () => handleResize();
//         window.addEventListener('resize', onWindowResize);

//         return () => {
//             window.removeEventListener('resize', onWindowResize);
//             resizeObserverRef.current?.disconnect();
//             resizeObserverRef.current = null;
//             chartInstance.current?.dispose();
//             chartInstance.current = null;
//         };
//     }, [mounted, isDark, safeData, legendStates, legendCategories, innerStateData, outerCatStateData, totalCount, handleResize]);

//     const isEmpty = !Array.isArray(safeData) || safeData.length === 0;

//     return (
//         <Card className="w-full">
//             <CardHeader className="pb-2">
//                 <div className="flex items-center gap-2">
//                     <CardTitle className="text-base font-semibold tracking-tight">Distribución de recomendaciones</CardTitle>
//                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                         <Info size={14} />
//                         <span>Gráfico Interior: Estados · Gráfico Exterior: Categorías</span>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 {isEmpty ? (
//                     <div className="w-full h-[200px] flex items-center justify-center">
//                         <p className="text-sm text-muted-foreground">No hay recomendaciones para graficar.</p>
//                     </div>
//                 ) : (
//                     <div ref={chartRef} className="w-full h-[420px] md:h-[470px] lg:h-[520px]" />
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AdvisorApiResponse } from '@/interfaces/vista-advisor/advisorViewInterfaces';

// ⬇️ IMPORTA desde tu config global (ajusta la ruta si corresponde)
import { useECharts, registerGlobalThemes } from '@/lib/echartsGlobalConfig';

interface AdvisorViewPieChartComponentProps {
    data: AdvisorApiResponse | null;
    sortDesc?: boolean;
}

const STATE_COLORS: Record<'OK' | 'Warning' | 'No disponible' | 'Error', string> = {
    OK: '#19a500',
    Warning: '#f4d800',
    'No disponible': '#c9cacb',
    Error: '#ff2828',
};

const STATES = [
    { key: 'OK' as const, label: 'OK', getCount: (row: unknown) => row?.total_ok_recommendations ?? 0 },
    { key: 'Warning' as const, label: 'Warning', getCount: (row: unknown) => row?.total_warning_recommendations ?? 0 },
    { key: 'No disponible' as const, label: 'No disponible', getCount: (row: unknown) => row?.total_not_available_recommendations ?? 0 },
    { key: 'Error' as const, label: 'Error', getCount: (row: unknown) => row?.total_error_recommendations ?? 0 },
];

const palette = [
    '#36A2EB', '#FF6384', '#28e995', '#FF9F40', '#9966FF',
    '#4BC0C0', '#C9CBCF', '#E7E9ED', '#8DD3C7', '#FDB462',
    '#B3DE69', '#FCCDE5',
];

export const AdvisorViewPieChartComponent = ({
    data,
    sortDesc = true,
}: AdvisorViewPieChartComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    // Registra temas globales de ECharts una sola vez
    useEffect(() => {
        registerGlobalThemes();
    }, []);

    // Tema (shadcn + next-themes)
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const themeName = isDark ? 'cp-dark' : 'cp-light';

    // Evitar hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const safeData = Array.isArray(data) ? data : [];

    const {
        legendStates,
        legendCategories,
        innerStateData,
        outerCatStateData,
        totalCount,
    } = useMemo(() => {
        const categoryTotals: Map<string, number> = new Map();
        const categoryByState: Map<string, Record<string, number>> = new Map();
        const colorsByCategory: Map<string, string> = new Map();
        const stateTotals: Record<string, number> = { OK: 0, Warning: 0, 'No disponible': 0, Error: 0 };
        let total = 0;

        for (const row of safeData) {
            if (!row?.category || !Array.isArray(row?.recommendations)) continue;

            const category = row.category;
            if (!categoryByState.has(category)) {
                categoryByState.set(category, { OK: 0, Warning: 0, 'No disponible': 0, Error: 0 });
            }
            const catBag = categoryByState.get(category)!;

            for (const st of STATES) {
                const c = st.getCount(row);
                catBag[st.key] += c;
                stateTotals[st.key] += c;
            }

            const rowTotal = (row.total_recommendations ?? 0) as number;
            categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + rowTotal);
            total += rowTotal;
        }

        // Orden de categorías según total (asc/desc)
        const categories = Array.from(categoryTotals.entries())
            .sort((a, b) => (sortDesc ? b[1] - a[1] : a[1] - b[1]))
            .map(([cat]) => cat);

        // Colores estables por nombre (independiente del orden)
        const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
        const categoriesByName = Array.from(categoryTotals.keys()).sort(collator.compare);
        categoriesByName.forEach((cat, idx) => {
            colorsByCategory.set(cat, palette[idx % palette.length]);
        });

        const innerStateData = STATES.map(st => ({
            name: st.label,
            value: stateTotals[st.key],
            itemStyle: { color: STATE_COLORS[st.label] },
        }));

        const outerCatStateData: Array<{
            name: string;
            value: number;
            category: string;
            stateKey: string;
            stateLabel: string;
            itemStyle: { color: string };
        }> = [];

        for (const cat of categories) {
            outerCatStateData.push({
                name: cat,
                value: categoryTotals.get(cat) ?? 0,
                category: cat,
                stateKey: '',
                stateLabel: '',
                itemStyle: { color: colorsByCategory.get(cat) ?? palette[0] },
            });
        }

        const legendStates = STATES.map(st => st.label);
        return {
            legendStates,
            legendCategories: categories,
            innerStateData,
            outerCatStateData,
            totalCount: total,
        };
    }, [safeData, sortDesc]);

    // Construye las opciones exactamente como las tenías (misma lógica),
    // solo que ahora las pasamos al hook global.
    const option: echarts.EChartsOption = useMemo(() => {
        const textColor = isDark ? '#ffffff' : '#131a22';
        const subTextColor = isDark ? '#a1a1aa' : '#6b7280';
        const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(50, 50, 50, 0.95)';
        const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';
        const iconBorder = isDark ? '#9ca3af' : '#999';
        const iconBorderEmph = isDark ? '#d1d5db' : '#666';
        const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

        return {
            animation: true,
            animationDuration: 300,
            animationEasing: 'linear',
            color: palette,
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
                formatter: (p: unknown) => {
                    if (p?.seriesName === 'Estados') {
                        return `${p.marker} ${p.name}<br/><strong>${p.value}</strong> recomendaciones`;
                    }
                    const s = p?.data?.stateLabel;
                    const c = p?.data?.category ?? p.name ?? '';
                    const v = p?.value ?? 0;
                    if (s) return `${p.marker} ${c} · ${s}<br/><strong>${v}</strong> recomendaciones`;
                    return `${p.marker} ${c}<br/><strong>${v}</strong> recomendaciones`;
                },
            },
            legend: [
                {
                    top: 8,
                    left: 'center',
                    orient: 'horizontal',
                    type: 'plain',
                    icon: 'circle',
                    textStyle: { fontSize: 12, color: textColor },
                    data: legendStates,
                },
                {
                    top: 34,
                    left: 'center',
                    orient: 'horizontal',
                    type: 'scroll',
                    pageIconColor: subTextColor,
                    pageTextStyle: { color: subTextColor },
                    textStyle: { fontSize: 12, color: textColor },
                    data: legendCategories,
                },
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '58%',
                    style: {
                        text: `Total\n${totalCount}`,
                        textAlign: 'center',
                        fill: textColor,
                        fontSize: 14,
                        fontWeight: 600,
                    },
                },
            ],
            series: [
                {
                    name: 'Estados',
                    type: 'pie',
                    radius: ['28%', '45%'],
                    center: ['50%', '58%'],
                    avoidLabelOverlap: true,
                    selectedMode: false,
                    minAngle: 3,
                    padAngle: 1,
                    itemStyle: { borderRadius: 4, borderColor: seriesBorderColor, borderWidth: 1 },
                    label: {
                        show: true,
                        formatter: (p: unknown) => `${p.name}\n${p.value}`,
                        fontSize: 11,
                        color: textColor,
                    },
                    labelLine: { show: true, length: 8, length2: 6, lineStyle: { color: subTextColor } },
                    emphasis: {
                        scale: true,
                        scaleSize: 4,
                        itemStyle: {
                            shadowBlur: 8,
                            shadowOffsetX: 0,
                            shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
                        },
                        label: { fontWeight: 'bold' },
                    },
                    data: innerStateData,
                },
                {
                    name: 'Categoría',
                    type: 'pie',
                    radius: ['50%', '72%'],
                    center: ['50%', '58%'],
                    avoidLabelOverlap: true,
                    selectedMode: false,
                    minAngle: 2,
                    padAngle: 0.6,
                    itemStyle: { borderRadius: 3, borderColor: seriesBorderColor, borderWidth: 1 },
                    label: {
                        show: true,
                        formatter: (p: unknown) => `${p?.data?.category ?? p.name}\n${p.value}`,
                        fontSize: 11,
                        color: textColor,
                    },
                    labelLine: { show: true, length: 10, length2: 6, lineStyle: { color: subTextColor } },
                    emphasis: {
                        scale: true,
                        scaleSize: 4,
                        itemStyle: {
                            shadowBlur: 8,
                            shadowOffsetX: 0,
                            shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
                        },
                        label: { fontWeight: 'bold' },
                    },
                    data: outerCatStateData,
                },
            ],
        } as echarts.EChartsOption;
    }, [
        isDark,
        legendStates,
        legendCategories,
        innerStateData,
        outerCatStateData,
        totalCount,
    ]);

    const isEmpty = !Array.isArray(safeData) || safeData.length === 0;

    // ⬇️ Inicializa y maneja resize usando la config global
    useECharts(chartRef, option, [option, themeName], themeName);

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold tracking-tight">
                        Distribución de recomendaciones
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Info size={14} />
                        <span>Gráfico Interior: Estados · Gráfico Exterior: Categorías</span>
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

