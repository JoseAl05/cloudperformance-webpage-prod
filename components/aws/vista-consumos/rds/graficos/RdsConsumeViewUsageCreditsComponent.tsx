'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ConsumeViewRdsPgCreditsMetrics } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';

interface RdsConsumeViewUsageCreditsComponentProps {
    data: ConsumeViewRdsPgCreditsMetrics[] | null;
}

export const RdsConsumeViewUsageCreditsComponent = ({ data }: RdsConsumeViewUsageCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const safeData = Array.isArray(data) ? data : [];

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = safeData.filter(item => typeof item.CpuCreditUsageValue === 'number');
        creditsUsageData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [item.timestamp, +item.CpuCreditUsageValue.toFixed(2)]);

        const creditsBalanceData = safeData.filter(item => typeof item.CpuCreditBalanceValue === 'number');
        creditsBalanceData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [item.timestamp, +item.CpuCreditBalanceValue.toFixed(2)]);

        const maxCreditsValue = creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.CpuCreditBalanceValue)) : 0;
        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.max(10, Math.floor(yMaxRaw / factor) * factor);

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);
    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Uso de Créditos', 'Créditos Disponibles'],
            unitLabel: 'Créditos',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Uso de Créditos',
                    data: creditsUsageMetric,
                    smooth: true,
                    extra: {
                        color: '#36A2EB'
                    }
                },
                {
                    kind: 'line',
                    name: 'Créditos Disponibles',
                    data: creditsBalanceMetric,
                    smooth: true,
                    extra: {
                        color: '#FF6384'
                    }
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
                <CardTitle>Uso de Créditos de CPU</CardTitle>
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
                        <p className="text-sm text-muted-foreground">No hay métricas de créditos disponibles.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};
