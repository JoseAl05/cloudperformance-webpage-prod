'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { IntraCloudMonthlyBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';

interface IntraCloudBillingCostUsdChartComponentProps {
  data: IntraCloudMonthlyBilling[] | undefined;
}

const MONTH_ORDER: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4,
  Mayo: 5, Junio: 6, Julio: 7, Agosto: 8,
  Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

export const IntraCloudBillingCostUsdChartComponent = ({ data }: IntraCloudBillingCostUsdChartComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const { categories, chartSeriesData } = useMemo(() => {
    if (!data || !Array.isArray(data)) return { categories: [] as string[], chartSeriesData: [] };

    const monthKey = (item: { year: number; month: string }) => item.year * 100 + (MONTH_ORDER[item.month] ?? 0);
    const keys = new Map<number, { year: number; month: string }>();
    data.forEach((tenant) => (tenant.billing_data ?? []).forEach((item) => keys.set(monthKey(item), item)));
    const sortedKeys = Array.from(keys.keys()).sort((a, b) => a - b);
    const years = new Set(Array.from(keys.values()).map((item) => item.year));
    const labelOf = (item: { year: number; month: string }) => (years.size > 1 ? `${item.month} ${item.year}` : item.month);

    const series = data.map((tenant, index) => {
      const costs = new Map((tenant.billing_data ?? []).map((item) => [monthKey(item), Number(item.cost_in_usd) || 0]));
      return {
        name: tenant.tenant_alias || `Tenant ${index + 1}`,
        data: sortedKeys.map((key) => costs.get(key) ?? null),
      };
    });

    return { categories: sortedKeys.map((key) => labelOf(keys.get(key)!)), chartSeriesData: series };
  }, [data]);

  const option = useMemo(() => {
    const seriesNames = chartSeriesData.map(s => s.name);

    const base = makeBaseOptions({
      legend: seriesNames,
      unitLabel: '$',
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });

    const seriesConfig = chartSeriesData.map((s) => ({
      kind: 'line',
      name: s.name,
      data: s.data,
      smooth: true
    }));

    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'category',
      legend: true,
      tooltip: true,
      series: seriesConfig as unknown,
      extraOption: {
        xAxis: { type: 'category', data: categories, axisLabel: { rotate: 30 } },
        yAxis: {
          type: 'value',
          name: 'Costo (USD)',
          nameTextStyle: { color: '#666', fontSize: 10 },
          min: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: (value: number) => {
              if (value === 0) return '$0';
              if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
              if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
              return '$' + value.toLocaleString();
            },
            color: '#666',
            fontSize: 10,
          },
        },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (v) => {
            if (v == null) return '-';
            const n = Number(v);
            if (Number.isNaN(n)) return String(v);
            return `$${n.toFixed(2)}`;
          },
        }
      },
    });

    return deepMerge(base, lines);
  }, [isDark, categories, chartSeriesData]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  const isEmpty = chartSeriesData.length === 0 || chartSeriesData.every(s => s.data.every(v => v === null));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tendencia Facturación Comparativa Costo Real</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start gap-2 mb-4">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            Comparando <strong>{chartSeriesData.length}</strong> tenants. Marcas de tiempo en <strong>UTC</strong>.
          </p>
        </div>
        {isEmpty ? (
          <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">No hay métricas de facturación disponibles para los filtros seleccionados.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};