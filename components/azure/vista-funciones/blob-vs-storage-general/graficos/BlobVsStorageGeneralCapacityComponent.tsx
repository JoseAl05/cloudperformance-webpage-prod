'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { bytesToGB } from '@/lib/bytesToMbs';
import {
    StorageVsGeneralCapacity,
    StorageVsGeneralCapacityPerService,
} from '@/interfaces/vista-blob-vs-storage/strgVsGeneralInterfaces';

import {
    makeBaseOptions,
    makeLineSeries,
    deepMerge,
    useECharts,
    createChartOption,
} from '@/lib/echartsGlobalConfig';

interface BlobVsStorageGeneralCapacityComponentProps {
    data: StorageVsGeneralCapacity[] | null;
    title?: string;
}

const normalizeMetric = (m: string) => {
    if (m === 'Used Capacity') {
        return m.replace(m, 'Storage General').trim() || m;
    }
    return m.replace(/capacity$/i, 'Service').trim() || m;
};

export const BlobVsStorageGeneralCapacityComponent = ({
    data,
    title = 'Capacidad: Storage Account vs Servicios',
}: BlobVsStorageGeneralCapacityComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { series, legendNames, anyData } = useMemo(() => {
        const items = data ?? [];
        const allServices: StorageVsGeneralCapacityPerService[] = [];
        const allAccount: StorageVsGeneralCapacityPerService[] = [];

        for (const it of items) {
            if (it?.last_capacity_per_service?.length) {
                allServices.push(...it.last_capacity_per_service);
            }
            if (it?.last_strg_account_capacity?.length) {
                allAccount.push(...it.last_strg_account_capacity);
            }
        }

        const toPairs = (series: Array<{ timestamp: string; value: number }>) =>
            [...series]
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map(
                    (s) =>
                        [s.timestamp, Number.parseFloat(String(bytesToGB(s.value)))] as [string, number],
                );

        const serviceSeries = allServices.map((s) => ({
            name: normalizeMetric(s.metric),
            data: toPairs(s.series as unknown[]),
            rawMetric: s.metric,
        }));

        const accountSeries = allAccount.map((s) => ({
            name: normalizeMetric(s.metric) || 'Used',
            data: toPairs(s.series as unknown[]),
            rawMetric: s.metric,
        }));

        const legendNames = [
            ...new Set([
                ...serviceSeries.map((s) => s.name),
                ...accountSeries.map((s) => s.name),
            ]),
        ];

        const series = [];

        serviceSeries.forEach(s => {
            series.push({
                name: s.name,
                kind: 'line',
                smooth: true,
                data: s.data
            })
        })

        accountSeries.forEach(s => {
            series.push({
                name: s.name,
                kind: 'line',
                smooth: true,
                data: s.data
            })
        })


        return {
            series,
            legendNames,
            anyData: series.length
        };
    }, [data]);
    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: legendNames,
            unitLabel: 'GB',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            series: series,
            extraOption: {
                tooltip: {
                    valueFormatter(value) {
                        return `${value} GB`
                    },
                },
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        })

        return deepMerge(base, lines);
    }, [legendNames, series]);


    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
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
};
