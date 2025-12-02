'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface NatGatewaysConsumeSingleChartComponentProps {
    metricName: string;
    dataPoints: [string, number][];
}

export const NatGatewaysConsumeSingleChartComponent = ({ metricName, dataPoints }: NatGatewaysConsumeSingleChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const getThemeColors = () => {
        if (isDark) {
            return { textColor: '#e4e4e7', gridColor: '#3f3f46', metricValueColor: '#44ad44', metricValueAreaColor: '#44ad4440' };
        } else {
            return { textColor: '#3f3f46', gridColor: '#e4e4e7', metricValueColor: '#009c00', metricValueAreaColor: '#009c003b' };
        }
    };

    const getCardTitle = (name: string) => {
        if (!name) return 'Sin Título';
        const lowerName = name.toLowerCase();
        if (lowerName.includes('bytesout')) return 'Volumen Saliente (Internet)';
        if (lowerName.includes('bytesin')) return 'Volumen Entrante (VPC)';
        if (lowerName.includes('activeconnection')) return 'Carga de Conexiones (Total)';
        if (lowerName.includes('errorport')) return 'Errores de Asignación de Puerto';
        return name;
    };

    const getUnitLabel = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('bytes')) return 'MB';
        return 'Count';
    };

    const cardTitle = getCardTitle(metricName);
    const unitLabel = getUnitLabel(metricName);
    const metricType = 'default';

    const option = useMemo(() => {
        const colors = getThemeColors();
        const sortedData = [...dataPoints].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

        const series = [{
            name: metricName,
            data: sortedData,
            smooth: true,
            kind: 'line',
            extra: {
                color: colors.metricValueColor,
                areaStyle: { color: colors.metricValueAreaColor }
            }
        }];

        const base = makeBaseOptions({
            legend: [metricName],
            unitLabel: unitLabel,
            useUTC: true,
            showToolbox: true,
            metricType: metricType
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: series,
            extraOption: {
                xAxis: { axisLabel: { rotate: 30, color: colors.textColor } },
                yAxis: { min: 0, axisLabel: { color: colors.textColor }, splitLine: { lineStyle: { color: colors.gridColor } } },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: colors.gridColor,
                    textStyle: { color: colors.textColor }
                }
            },
        });

        return deepMerge(base, lines);
    }, [dataPoints, isDark, metricName, unitLabel]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className='pb-2'>
                <CardTitle className="text-lg">{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};

// 'use client'

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
// import { useTheme } from 'next-themes';
// import { useMemo, useRef } from 'react';

// interface NatGatewaysConsumeSingleChartComponentProps {
//     metricName: string;
//     dataPoints: [string, number][];
//     chartType: 'line' | 'area'; // Nueva prop para control visual
// }

// export const NatGatewaysConsumeSingleChartComponent = ({ metricName, dataPoints, chartType }: NatGatewaysConsumeSingleChartComponentProps) => {
//     const { theme, resolvedTheme } = useTheme();
//     const currentTheme = resolvedTheme || theme;
//     const isDark = currentTheme === 'dark';

//     const chartRef = useRef<HTMLDivElement>(null);

//     const getThemeColors = () => {
//         if (isDark) {
//             return { textColor: '#e4e4e7', gridColor: '#3f3f46', lineColor: '#44ad44', areaColor: '#44ad4440' };
//         } else {
//             return { textColor: '#3f3f46', gridColor: '#e4e4e7', lineColor: '#009c00', areaColor: '#009c003b' };
//         }
//     };

//     const getCardTitle = (name: string) => {
//         if (!name) return 'Sin Título';
//         const lowerName = name.toLowerCase();
//         if (lowerName.includes('bytesout')) return 'Volumen Saliente (Internet)';
//         if (lowerName.includes('bytesin')) return 'Volumen Entrante (VPC)';
//         if (lowerName.includes('activeconnection')) return 'Carga de Conexiones (Total)';
//         if (lowerName.includes('errorport')) return 'Errores de Asignación de Puerto';
//         return name;
//     };

//     const getUnitLabel = (name: string) => {
//         if (name.toLowerCase().includes('bytes')) return 'MB';
//         return 'Count';
//     };

//     const cardTitle = getCardTitle(metricName);
//     const unitLabel = getUnitLabel(metricName);

//     const option = useMemo(() => {
//         const colors = getThemeColors();
//         // Ordenar por fecha es vital para gráficos de línea
//         const sortedData = [...dataPoints].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

//         const series = [{
//             name: cardTitle,
//             data: sortedData,
//             smooth: true,
//             type: 'line', // ECharts usa 'line' para ambos, el área se activa con areaStyle
//             // itemStyle: { color: colors.lineColor },
//             // // LÓGICA VISUAL: Solo agregamos areaStyle si chartType es 'area'
//             // areaStyle: chartType === 'area' ? {
//             //     color: colors.areaColor,
//             //     opacity: 0.5
//             // } : undefined,
//         }];

//         const base = makeBaseOptions({
//             legend: [cardTitle],
//             unitLabel: unitLabel,
//             useUTC: true,
//             showToolbox: true,
//             metricType: 'default'
//         });

//         const lines = createChartOption({
//             kind: 'line',
//             xAxisType: 'time',
//             legend: true,
//             tooltip: true,
//             series: series,
//             extraOption: {
//                 xAxis: {
//                     axisLabel: { rotate: 0, color: colors.textColor }, // Rotate 0 es más limpio si hay espacio
//                     boundaryGap: false // Importante para Area Charts: que empiece pegado al eje Y
//                 },
//                 yAxis: {
//                     min: 0,
//                     axisLabel: { color: colors.textColor },
//                     splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed' } }
//                 },
//                 grid: { left: 50, right: 20, top: 40, bottom: 40, containLabel: true },
//                 tooltip: {
//                     trigger: 'axis',
//                     backgroundColor: isDark ? '#1f2937' : '#ffffff',
//                     borderColor: colors.gridColor,
//                     textStyle: { color: colors.textColor },
//                     formatter: (params: unknown) => {
//                         // Formateador custom para mostrar fecha y valor con unidad
//                         const p = params[0];
//                         const date = new Date(p.value[0]).toLocaleString();
//                         return `<b>${date}</b><br/>${p.marker} ${p.seriesName}: <b>${p.value[1]} ${unitLabel}</b>`;
//                     }
//                 }
//             },
//         });

//         return deepMerge(base, lines);
//     }, [dataPoints, isDark, cardTitle, unitLabel, chartType]);

//     useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

//     return (
//         <Card className="w-full shadow-sm border-t-4 border-t-blue-500">
//             <CardHeader className='pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50'>
//                 <CardTitle className="text-base font-medium text-muted-foreground uppercase tracking-wide">
//                     {cardTitle}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-4">
//                 <div ref={chartRef} className="w-full h-[350px]" />
//             </CardContent>
//         </Card>
//     );
// };