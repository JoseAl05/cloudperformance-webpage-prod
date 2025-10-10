'use client'

import { useMemo, useRef } from 'react'
import { UnusedVmExtensions } from '@/interfaces/vista-unused-resources/unusedVmExtensionsInterfaces';
import { createChartOption, makeBaseOptions, deepMerge, useECharts } from '@/lib/echartsGlobalConfig'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';


interface UnusedVmExtensionsByTypeProps {
    data: UnusedVmExtensions[];
}

export const UnusedVmExtensionsByType = ({ data }: UnusedVmExtensionsByTypeProps) => {

    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { dates, types, series } = useMemo(() => {
        const counts = new Map<string, Map<string, number>>()

        for (const row of data ?? []) {
            const sync_time = row._cq_sync_time;
            const normalizedSyncTime = sync_time.replace(/\.(\d{3})\d+/, '.$1');
            const d = new Date(normalizedSyncTime);
            const fullYear = String(d.getFullYear());
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');
            const dateKey = `${fullYear}-${month}-${day}T${hours}:${minutes}:${seconds}`;

            if (!counts.has(dateKey)) counts.set(dateKey, new Map<string, number>())

            for (const ext of row.extensions ?? []) {
                const t = ext?.type_properties_type ?? 'Unknown'
                const prev = counts.get(dateKey)!.get(t) ?? 0
                counts.get(dateKey)!.set(t, prev + 1)
            }
        }
        const dates = Array.from(counts.keys()).sort()

        const typeTotals = new Map<string, number>()
        for (const date of dates) {
            for (const [t, v] of counts.get(date)!) {
                typeTotals.set(t, (typeTotals.get(t) ?? 0) + v)
            }
        }
        const types = Array.from(typeTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([t]) => t)

        const series = types.map((t) => ({
            kind: 'stackedBar' as const,
            name: t,
            data: dates.map((date) => [date, counts.get(date)?.get(t) ?? 0]),
        }))

        return { dates, types, series }
    }, [data]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: types,
            unitLabel: 'extensiones',
            useUTC: true,
            showToolbox: true,
            metricType: 'count',
        })

        const stacked = createChartOption({
            kind: 'stackedBar',
            xAxisType: 'time',
            stackKey: 'extensions',
            legend: true,
            tooltip: true,
            series,
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        })

        return deepMerge(base, stacked)
    }, [series, types])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const anyData = series.some(s => s.data.some(([, v]) => (v as number) > 0))

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Historico Extensiones por tipo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo están en <strong>UTC</strong>.
                    </p>
                </div>

                {!anyData ? (
                    <div className="text-center text-gray-500 py-6">
                        No hay datos de capacidad disponibles.
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
}