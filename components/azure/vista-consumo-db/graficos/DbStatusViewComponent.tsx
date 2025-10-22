'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface DbStatusData {
  timestamp: { $date: string };
  total: number;
  encendidas: number;
  apagadas: number;
}

interface DbStatusChartProps {
  data: DbStatusData[] | null;
}


export const DbStatusChart = ({ data }: DbStatusChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { totalData, encendidasData, apagadasData, yMaxRounded } = useMemo(() => {
    // Ordenar por timestamp
    const sortedData = [...safeData].sort((a, b) =>
      new Date(a.timestamp.$date).getTime() - new Date(b.timestamp.$date).getTime()
    );

    const totalData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date,
      item.total
    ]);

    const encendidasData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date,
      item.encendidas
    ]);

    const apagadasData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date,
      item.apagadas
    ]);

    const maxTotalValue = totalData.length ? Math.max(...totalData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxTotalValue * 1.2);
    const yMaxRounded = Math.ceil(yMaxRaw / 10) * 10;

    return { totalData, encendidasData, apagadasData, yMaxRounded };
  }, [safeData]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Apagadas', 'Encendidas', 'Total'],
      unitLabel: 'VMs',
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
          name: 'Apagadas',
          data: apagadasData,
          smooth: true,
          extra: {
            color: '#FF6384'
          }
        },
        {
          kind: 'line',
          name: 'Encendidas',
          data: encendidasData,
          smooth: true,
          extra: {
            color: '#28e995'
          }
        },
        {
          kind: 'line',
          name: 'Total',
          data: totalData,
          smooth: true,
          extra: {
            color: '#36A2EB'
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
  }, [apagadasData, encendidasData, totalData]);


  const isEmpty = totalData.length === 0;

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>VMs Encendidas vs Apagadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
            Una VM se considera apagada cuando CPU y Memoria están en 0.
          </p>
        </div>
        {isEmpty ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};