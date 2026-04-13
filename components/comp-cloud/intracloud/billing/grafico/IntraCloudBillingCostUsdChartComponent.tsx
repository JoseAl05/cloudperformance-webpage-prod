'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { formatMetric } from '@/lib/metricUtils';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { IntraCloudBilling, IntraCloudMonthlyBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';

interface IntraCloudBillingCostUsdChartComponentProps {
  data: IntraCloudMonthlyBilling[];
  payload: ReqPayload;
}

const MONTH_ORDER: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4,
  Mayo: 5, Junio: 6, Julio: 7, Agosto: 8,
  Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

export const IntraCloudBillingCostUsdChartComponent = ({ data, payload }: IntraCloudBillingCostUsdChartComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const chartSeriesData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const monthSet = new Set<{ month: string; cost_in_usd: number }>()


    return data.map((tenant, index) => {
      if(tenant.billing_data.length && tenant.billing_data.length === 0) {
        return {
          name: '',
          data: []
        }
      }
      const sortedData = [...tenant.billing_data].sort(
        (a, b) => (MONTH_ORDER[a.month] ?? 0) - (MONTH_ORDER[b.month] ?? 0)
      );

      const chartData: [string, string][] = sortedData.map(item => [
        item.month,
        formatMetric(item.cost_in_usd)
      ]);

      const name = tenant.tenant_alias || `Tenant ${index + 1}`;

      return { name, data: chartData };
    });
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
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: {
          type: 'value',
          name: 'Costo (USD)',
          nameTextStyle: { color: '#666', fontSize: 10 },
          // nameGap: 25,
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
  }, [isDark, chartSeriesData]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  const isEmpty = chartSeriesData.length === 0 || chartSeriesData.every(s => s.data.length === 0);

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