'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ConsumeViewRdsPgDbConnectionsMetrics } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface RdsConsumeViewDbConnectionsComponentProps {
    data: ConsumeViewRdsPgDbConnectionsMetrics[] | null;
}

export const RdsConsumeViewDbConnectionsComponent = ({
    data,
}: RdsConsumeViewDbConnectionsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const safeData = Array.isArray(data) ? data : [];

    const { dbConnectionsMetric } = useMemo(() => {
        const dbConnectionsData = safeData.map((item) => item);
        dbConnectionsData.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const dbConnectionsMetric: [string, number][] = dbConnectionsData.map((item) => [
            item.timestamp,
            +item.value.toFixed(2),
        ]);

        return { dbConnectionsMetric };
    }, [safeData]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Conexiones a BD'],
            unitLabel: 'Conexiones',
            useUTC: true,
            showToolbox: true,
            metricType: 'count',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Conexiones a BD',
                    data: dbConnectionsMetric,
                    smooth: true,
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Conexiones a la Base de Datos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            No hay métricas de conexiones a la base de datos.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};
