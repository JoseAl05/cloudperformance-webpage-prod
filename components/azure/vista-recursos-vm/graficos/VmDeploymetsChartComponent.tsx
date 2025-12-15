'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import useSWR from 'swr';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface DeploymentData {
  deployment_count: number;
  event_timestamp: string;
}

interface VmDeploymentsChartProps {
  data: DeploymentData[];
  title: string;
}

export const VmDeploymentsChart = ({ data, title }: VmDeploymentsChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { deploymentsData } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) =>
      new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
    );

    const deploymentsData: [string, number][] = sortedData.map(item => [
      item.event_timestamp,
      item.deployment_count
    ]);

    return { deploymentsData };
  }, [safeData]);


  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Deployments'],
      unitLabel: 'deployments',
      useUTC: true,
      showToolbox: true,
      showDataZoom: deploymentsData.length > 1,
      metricType: 'default',
    });
    const lines = createChartOption({
      kind: 'line',
      xAxisType: deploymentsData.length > 1 ? 'time' : 'category',
      legend: true,
      tooltip: true,
      series: [
        {
          kind: 'line',
          name: 'Deployments',
          data: deploymentsData,
          smooth: true,
          extra: {
            color: '#36A2EB'
          }
        }
      ],
      extraOption: {
        tooltip: {
          valueFormatter(value) {
            return `${value} deployments`
          },
        },
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: { min: 0 },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, lines);
  }, [deploymentsData]);

  const isEmpty = deploymentsData.length === 0;

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
            <p className="text-sm text-muted-foreground">No hay deployments disponibles en el rango de fecha seleccionado.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
}