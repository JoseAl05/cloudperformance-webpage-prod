'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { RecommenderGcp } from '@/interfaces/gcpRecommenderInterfaces';

interface RecommenderPieChartComponentProps {
    data: RecommenderGcp[];
    sortDesc?: boolean;
}

const palette = [
    '#36A2EB', '#FF6384', '#28e995', '#FF9F40', '#9966FF',
    '#4BC0C0', '#C9CBCF', '#E7E9ED', '#8DD3C7', '#FDB462',
    '#B3DE69', '#FCCDE5',
];

export const RecommenderPieChartComponent = ({
    data,
    sortDesc = true,
}: RecommenderPieChartComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const themeName = isDark ? 'cp-dark' : 'cp-light';

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const safeData = Array.isArray(data) ? data : [];

    const {
        legendCategories,
        innerCategoryData,
        outerPriorityData,
        totalCount,
    } = useMemo(() => {
        const categoryMap = new Map<string, { total: number, priorities: Map<string, number> }>();
        let total = 0;

        safeData.forEach((item) => {
            const cat = item.category || 'Uncategorized';
            const prio = item.priority || 'Unknown';

            if (!categoryMap.has(cat)) {
                categoryMap.set(cat, { total: 0, priorities: new Map() });
            }

            const catEntry = categoryMap.get(cat)!;
            catEntry.total += 1;

            const currentPrioCount = catEntry.priorities.get(prio) || 0;
            catEntry.priorities.set(prio, currentPrioCount + 1);

            total += 1;
        });

        const sortedCategories = Array.from(categoryMap.entries())
            .sort((a, b) => sortDesc ? b[1].total - a[1].total : a[1].total - b[1].total);

        const categoriesList = sortedCategories.map(([name]) => name);

        const colorsByCategory = new Map<string, string>();
        sortedCategories.forEach(([name], index) => {
            colorsByCategory.set(name, palette[index % palette.length]);
        });

        const innerCategoryData = sortedCategories.map(([name, data]) => ({
            name,
            value: data.total,
            itemStyle: { color: colorsByCategory.get(name) }
        }));

        const outerPriorityData: Array<{
            name: string;
            value: number;
            category: string;
            priority: string;
            itemStyle: { color: string };
        }> = [];

        sortedCategories.forEach(([catName, data]) => {
            const prioEntries = Array.from(data.priorities.entries());
            const baseColor = colorsByCategory.get(catName) || palette[0];

            prioEntries.forEach(([prioName, count]) => {
                outerPriorityData.push({
                    name: prioName,
                    value: count,
                    category: catName,
                    priority: prioName,
                    itemStyle: { color: baseColor }
                });
            });
        });

        return {
            legendCategories: categoriesList,
            innerCategoryData,
            outerPriorityData,
            totalCount: total,
        };
    }, [safeData, sortDesc]);

    const option: echarts.EChartsOption = useMemo(() => {
        const textColor = isDark ? '#ffffff' : '#131a22';
        const subTextColor = isDark ? '#a1a1aa' : '#6b7280';
        const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(50, 50, 50, 0.95)';
        const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';
        const iconBorder = isDark ? '#9ca3af' : '#999';
        const iconBorderEmph = isDark ? '#d1d5db' : '#666';
        const seriesBorderColor = isDark ? '#0b1220' : '#ffffff';

        const baseOption = makeBaseOptions({
            legend: false,
            showToolbox: false,
            showDataZoom: false,
            useUTC: true,
        });

        return deepMerge(
            baseOption,
            {
                animationEasing: 'linear',
                color: palette,
                textStyle: { color: textColor },
                xAxis: undefined,
                yAxis: undefined,
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
                        const val = p.value;
                        const name = p.name;

                        if (p.seriesName === 'Categorías') {
                            return `${p.marker} ${name}<br/><strong>${val}</strong> recomendaciones`;
                        }

                        const cat = p.data?.category;
                        const prio = p.data?.priority;

                        if (cat && prio) {
                            return `${p.marker} ${cat} -> ${prio}<br/><strong>${val}</strong> recomendaciones`;
                        }

                        return `${p.marker} ${name}<br/><strong>${val}</strong> recomendaciones`;
                    },
                },
                legend: [
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
                        name: 'Categorías',
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
                            fontWeight: 'bold'
                        },
                        labelLine: { show: true, length: 8, length2: 6, lineStyle: { color: subTextColor } },
                        data: innerCategoryData,
                    },
                    {
                        name: 'Prioridad',
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
                            formatter: (p: unknown) => `${p.data?.priority}\n${p.value}`,
                            fontSize: 11,
                            color: textColor,
                            fontWeight: 'bold'
                        },
                        labelLine: { show: true, length: 15, length2: 6, lineStyle: { color: subTextColor } },
                        data: outerPriorityData,
                    },
                ],
            } as echarts.EChartsOption
        );
    }, [
        isDark,
        legendCategories,
        innerCategoryData,
        outerPriorityData,
        totalCount,
    ]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option, themeName], themeName);

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold tracking-tight">
                        Distribución de recomendaciones GCP
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Info size={14} />
                        <span>Interior: Categoría · Exterior: Prioridad</span>
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