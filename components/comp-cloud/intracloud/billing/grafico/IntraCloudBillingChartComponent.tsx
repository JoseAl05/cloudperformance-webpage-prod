'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { IntraCloudBilling, IntraCloudBillingTenant } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { formatMetric } from '@/lib/metricUtils';

interface IntraCloudBillingChartComponentProps {
  data: IntraCloudBilling;
}

export const IntraCloudBillingChartComponent = ({ data }: IntraCloudBillingChartComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const { totalCostUsdTenantA, totalCostUsdTenantB } = useMemo(() => {
    const sortedDataTenantA = [...data.billing_tenant_a].sort((a, b) => new Date((a as IntraCloudBillingTenant)._id).getTime() - new Date((b as IntraCloudBillingTenant)._id).getTime());
    const sortedDataTenantB = [...data.billing_tenant_b].sort((a, b) => new Date((a as IntraCloudBillingTenant)._id).getTime() - new Date((b as IntraCloudBillingTenant)._id).getTime());

    const totalCostUsdTenantA: [string, string][] = sortedDataTenantA.map(item => [item._id, formatMetric(item.cost_in_usd_sum)]);
    const totalCostUsdTenantB: [string, string][] = sortedDataTenantB.map(item => [item._id, formatMetric(item.cost_in_usd_sum)]);

    return { totalCostUsdTenantA, totalCostUsdTenantB };
  }, [data]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: ['Tenant A', 'Tenant B'],
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
          name: 'Tenant A',
          data: totalCostUsdTenantA,
          smooth: true,
          extra: {
            color: '#36A2EB'
          }
        },
        {
          kind: 'line',
          name: 'Tenant B',
          data: totalCostUsdTenantB,
          smooth: true,
          extra: {
            color: '#28e995'
          }
        }
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

  const isEmpty = totalCostUsdTenantA.length === 0 && totalCostUsdTenantB.length === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tendencia Facturación Tenant A vs Tenant B</CardTitle>
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
            <p className="text-sm text-muted-foreground">No hay métricas de facturación disponibles.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};
