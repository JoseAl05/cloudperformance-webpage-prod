'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';

interface Ec2ResourceConsumeViewUsageCpuComponentProps {
  data: { MetricLabel: string; Timestamp: string; total: number; used: number; unused: number }[] | null;
}

export const Ec2ResourceConsumeViewUsageCpuComponent = ({ data }: Ec2ResourceConsumeViewUsageCpuComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { totalData, usedData, unusedData, yMaxRounded } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) => new Date((a as unknown).timestamp ?? a.Timestamp).getTime() - new Date((b as unknown).timestamp ?? b.Timestamp).getTime());

    const totalData: [string, number][] = sortedData.map(item => [item.timestamp, item.total_cpu]);
    const usedData: [string, number][] = sortedData.map(item => [item.timestamp, item.used_cpu]);
    const unusedData: [string, number][] = sortedData.map(item => [item.timestamp, item.unused_cpu]);

    const maxTotalValue = totalData.length ? Math.max(...totalData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxTotalValue * 1.5);
    const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

    return { totalData, usedData, unusedData, yMaxRounded };
  }, [data]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Total', 'Usado', 'No Usado'],
      unitLabel: 'vCores',
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });
    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'time',
      legend: true,
      tooltip: true,
      series: [
        {
          kind: 'line',
          name: 'Total',
          data: totalData,
          smooth: true,
          extra: {
            color: '#36A2EB'
          }
        },
        {
          kind: 'line',
          name: 'Usado',
          data: usedData,
          smooth: true,
          extra: {
            color: '#28e995'
          }
        },
        {
          kind: 'line',
          name: 'No Usado',
          data: unusedData,
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
  }, [isDark, data]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  const isEmpty = totalData.length === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Uso de Cores de CPU</CardTitle>
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
            <p className="text-sm text-muted-foreground">No hay métricas de CPU disponibles.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};
