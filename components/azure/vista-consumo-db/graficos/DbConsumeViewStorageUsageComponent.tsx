'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface AzureDbMetricsData {
  metric_name: string;
  resource_name: string;
  total_assigned: number;
  used: number;
  unused: number;
  timestamp: { $date: string };
}

interface DbConsumeViewStorageUsageComponentProps {
  data: AzureDbMetricsData[] | null;
  title: string;
  metricUnit: string;
}

export const DbConsumeViewStorageUsageComponent = ({ data, title, metricUnit }: DbConsumeViewStorageUsageComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { totalData, usedData, unusedData, yMaxRounded } = useMemo(() => {
    // Agrupar por timestamp y sumar los valores
    const filteredData = safeData.filter(m => m.metric_name === 'Storage Used');
    const grouped = filteredData.reduce((acc, item) => {
      const timestamp = item.timestamp.$date;
      if (!acc[timestamp]) {
        acc[timestamp] = { total_assigned: 0, used: 0, unused: 0 };
      }
      acc[timestamp].total_assigned += item.total_assigned;
      acc[timestamp].used += item.used;
      acc[timestamp].unused += item.unused;
      return acc;
    }, {} as Record<string, { total_assigned: number; used: number; unused: number }>);

    // Convertir a arrays y ordenar
    const sortedTimestamps = Object.keys(grouped).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    );

    const totalData: [string, string][] = sortedTimestamps.map(ts => [ts, grouped[ts].total_assigned.toFixed(2)]);
    const usedData: [string, string][] = sortedTimestamps.map(ts => [ts, grouped[ts].used.toFixed(2)]);
    const unusedData: [string, string][] = sortedTimestamps.map(ts => [ts, grouped[ts].unused.toFixed(2)]);

    const maxTotalValue = totalData.length ? Math.max(...totalData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxTotalValue * 1.5);
    const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

    return { totalData, usedData, unusedData, yMaxRounded };
  }, [safeData]);
  console.log(title);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Total', 'Usado', 'No Usado'],
      unitLabel: 'GB',
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
        tooltip:{
          valueFormatter(value) {
            return `${value} GB`
          },
        },
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: { min: 0 },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, lines);
  }, [totalData, unusedData, usedData]);

  const isEmpty = totalData.length === 0;

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
            Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
          </p>
        </div>
        {isEmpty ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No hay métricas disponibles.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};