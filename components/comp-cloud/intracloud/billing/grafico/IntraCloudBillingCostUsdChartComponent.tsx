// 'use client';

// import { useMemo, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Info } from 'lucide-react';
// import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
// import { useTheme } from 'next-themes';
// import { IntraCloudBilling, IntraCloudBillingTenant } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
// import { formatMetric } from '@/lib/metricUtils';

// interface IntraCloudBillingCostUsdChartComponentProps {
//   data: IntraCloudBilling;
// }

// export const IntraCloudBillingCostUsdChartComponent = ({ data }: IntraCloudBillingCostUsdChartComponentProps) => {
//   const { theme, resolvedTheme } = useTheme();
//   const currentTheme = resolvedTheme || theme;
//   const isDark = currentTheme === 'dark';

//   const chartRef = useRef<HTMLDivElement>(null);

//   const { totalCostUsdTenantA, totalCostUsdTenantB } = useMemo(() => {
//     const sortedDataTenantA = [...data.billing_tenant_a].sort((a, b) => new Date((a as IntraCloudBillingTenant)._id).getTime() - new Date((b as IntraCloudBillingTenant)._id).getTime());
//     const sortedDataTenantB = [...data.billing_tenant_b].sort((a, b) => new Date((a as IntraCloudBillingTenant)._id).getTime() - new Date((b as IntraCloudBillingTenant)._id).getTime());

//     const totalCostUsdTenantA: [string, string][] = sortedDataTenantA.map(item => [item._id, formatMetric(item.cost_in_usd_sum)]);
//     const totalCostUsdTenantB: [string, string][] = sortedDataTenantB.map(item => [item._id, formatMetric(item.cost_in_usd_sum)]);

//     return { totalCostUsdTenantA, totalCostUsdTenantB };
//   }, [data]);

//   const option = useMemo(() => {
//     const base = makeBaseOptions({
//       legend: ['Tenant A', 'Tenant B'],
//       unitLabel: '$',
//       useUTC: true,
//       showToolbox: true,
//       metricType: 'default'
//     });
//     const lines = createChartOption({
//       kind: 'line',
//       xAxisType: 'time',
//       legend: true,
//       tooltip: true,
//       series: [
//         {
//           kind: 'line',
//           name: 'Tenant A',
//           data: totalCostUsdTenantA,
//           smooth: true,
//           extra: {
//             color: '#36A2EB'
//           }
//         },
//         {
//           kind: 'line',
//           name: 'Tenant B',
//           data: totalCostUsdTenantB,
//           smooth: true,
//           extra: {
//             color: '#28e995'
//           }
//         }
//       ],
//       extraOption: {
//         xAxis: { axisLabel: { rotate: 30 } },
//         yAxis: { min: 0 },
//         grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
//       },
//     });

//     return deepMerge(base, lines);
//   }, [isDark, data]);

//   useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

//   const isEmpty = totalCostUsdTenantA.length === 0 && totalCostUsdTenantB.length === 0;

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Tendencia Facturación Tenant A vs Tenant B</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
//           <p className="text-xs text-muted-foreground">
//             Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
//           </p>
//         </div>
//         {isEmpty ? (
//           <div className="w-full h-[200px] flex items-center justify-center">
//             <p className="text-sm text-muted-foreground">No hay métricas de facturación disponibles.</p>
//           </div>
//         ) : (
//           <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
//         )}
//       </CardContent>
//     </Card>
//   );
// };
'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { formatMetric } from '@/lib/metricUtils';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';

interface IntraCloudBillingCostUsdChartComponentProps {
  data: IntraCloudBilling[];
  payload: ReqPayload;
}


export const IntraCloudBillingCostUsdChartComponent = ({ data, payload }: IntraCloudBillingCostUsdChartComponentProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  console.log(data);

  const chartSeriesData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((tenant, index) => {
      const sortedData = [...tenant.billing_data].sort((a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );

      const chartData: [string, string][] = sortedData.map(item => [
        item.start_date,
        formatMetric(item.cost_in_usd_sum)
      ]);

      const name = `Tenant ${index + 1}`;

      return {
        name,
        data: chartData
      };
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
      xAxisType: 'time',
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