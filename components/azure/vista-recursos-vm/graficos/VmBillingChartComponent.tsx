'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface BillingDetailData {
  total_cost_in_usd: number;
  total_payg_cost_in_usd: number;
  date: string;
}

interface BillingData {
  gasto_total_acumulado: number;
  gasto_pago_por_uso: number;
  detalle: BillingDetailData[];
}

interface VmBillingChartProps {
  data: BillingData | null;
  title: string;
}

export const VmBillingChart = ({ data, title }: VmBillingChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = data?.detalle && Array.isArray(data.detalle) ? data.detalle : [];

  const { costData, paygData } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const costData: [string, number][] = sortedData.map(item => [
      item.date,
      item.total_cost_in_usd.toFixed(2)
    ]);

    const paygData: [string, number][] = sortedData.map(item => [
      item.date,
      item.total_payg_cost_in_usd.toFixed(2)
    ]);

    return { costData, paygData };
  }, [safeData]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Costo Acumulado Pago por Uso', 'Costo Acumulado Fijo'],
      unitLabel: '$',
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
          name: 'Costo Acumulado Pago por Uso',
          data: paygData,
          smooth: true,
          extra: {
            color: '#36A2EB'
          }
        },
        {
          kind: 'line',
          name: 'Costo Acumulado Fijo',
          data: costData,
          smooth: true,
          extra: {
            color: '#28e995'
          }
        }
      ],
      extraOption: {
        tooltip: {
          valueFormatter(value) {
            return `$${value}`
          },
        },
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: { min: 0 },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, lines);
  }, [costData,paygData]);

  const isEmpty = costData.length === 0;

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <div className="flex gap-4 w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Facturación de recursos en <strong>USD</strong>.
            </p>
          </div>
          {isEmpty ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No hay datos de facturación disponibles en el rango de fecha seleccionado.</p>
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 w-80">
        <Card className="border-l-4 border-l-green-500 flex-1">
          <CardContent className="p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Total Acumulado $USD</p>
                <p className="text-2xl font-bold text-green-600">
                  ${data?.gasto_total_acumulado?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Costo total acumulado</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 flex-1">
          <CardContent className="p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Pago por Uso $USD</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${data?.gasto_pago_por_uso?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Costo pago por uso</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};