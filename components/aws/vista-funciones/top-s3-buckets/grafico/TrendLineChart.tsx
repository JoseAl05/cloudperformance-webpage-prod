'use client'
import { useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

interface TrendLineChartProps {
  data: unknown[];
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average';
  title: string;
  yAxisLabel: string;
}

const parseISO = (s: string): Date => {
  const normalized = s.replace(/(\.\d{3})\d+/, '$1').replace(/\+00:00$/, 'Z');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: ${s}`);
  return d;
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short',timeZone: 'UTC' });
const fmtFull = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC'
});

export const TrendLineChart = ({
  data,
  metric,
  title,
  yAxisLabel,
}: TrendLineChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';
  const chartRef = useRef<HTMLDivElement>(null);

  const safeData: [] = Array.isArray(data) ? data : [];

  const toNumber = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const option = useMemo(() => {
    const filtered = safeData.filter((d: unknown) => d.metric === metric)
    const map = new Map<string, number>()
    filtered.forEach((item: unknown) => {
      const key = item.sync_time
      const prev = map.get(key) ?? 0
      map.set(key, prev + toNumber(item.metric_value))
    })
    const trendData = Array.from(map.entries())
      .map(([sync_time, total]) => ({ sync_time, total }))
      .sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())

    // const times = trendData.map(item => {
    //   const d = new Date(item.sync_time)
    //   return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`
    // })
    const times = trendData.map(item => item.sync_time);

    const dateCount = times.length;

    const start = dateCount ? parseISO(times[0]) : null;

    const end = dateCount ? parseISO(times[dateCount - 1]) : null;

    const daysDiff = start && end ? Math.floor((+end - +start) / 86_400_000) + 1 : 0;


    const bigStep = Math.max(1, Math.ceil(dateCount / 12));
    const midStep = Math.max(1, Math.ceil(dateCount / 20));

    const values = metric.includes('Bytes')
      ? trendData.map(item => (item.total / 1073741824).toFixed(2))
      : trendData.map(item => item.total)

    let metricsUnitLabel = '';
    if (metric === 'BucketSizeBytes Average') {
      metricsUnitLabel = 'Bytes'
    }
    if (metric === 'NumberOfObjects Average') {
      metricsUnitLabel = 'Objetos'
    }

    const base = makeBaseOptions({
      unitLabel: metricsUnitLabel,
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });

    const nf = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });

    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'category',
      legend: false,
      tooltip: true,
      series: [
        {
          name: yAxisLabel,
          kind: 'line',
          smooth: true,
          data: values,
          extra: {
            symbol: 'circle',
            symbolSize: 6,
          }
        },
      ],
      extraOption: {
        legend: { data: [yAxisLabel], top: 10, left: 'center' },
        tooltip: {
          trigger: 'axis',
          formatter: (params: unknown): string => {
            const list = (Array.isArray(params) ? params : [params]).filter(Boolean) as unknown[];
            const first = (list[0] ?? {}) as Record<string, unknown>;

            // Tomamos el valor crudo del eje (tu timestamp ISO)
            const rawAxis =
              typeof first.axisValue === 'string'
                ? first.axisValue
                : typeof first.name === 'string'
                  ? first.name
                  : '';

            // Encabezado con la fecha formateada
            let header = rawAxis;
            try {
              const d = parseISO(rawAxis);
              header = fmtFull.format(d); // p.ej. "1 oct"
            } catch {
              // si falla el parseo, mostramos tal cual
            }

            // Filas por serie (soporta 1+ series)
            const rows = list
              .map((p) => {
                const r = p as Record<string, unknown>;
                const marker = typeof r.marker === 'string' ? r.marker : '';
                const seriesName = typeof r.seriesName === 'string' ? r.seriesName : '';

                // value puede ser number|string|[x,y]
                let v: unknown = r.value;
                if (Array.isArray(v)) {
                  const arr = v as unknown[];
                  v = arr[arr.length - 1];
                }
                const valText =
                  typeof v === 'number'
                    ? nf.format(v)
                    : typeof v === 'string'
                      ? v
                      : typeof r.data === 'number'
                        ? nf.format(r.data as number)
                        : typeof r.data === 'string'
                          ? (r.data as string)
                          : '';

                return `${marker}${seriesName}: <b>${valText}</b>`;
              })
              .join('<br/>');

            return `<div style="margin-bottom:4px;"><b>${header}</b></div>${rows}`;
          },
        },
        xAxis: {
          type: 'category',
          data: times,
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
            color: '#666',
            rotate: 45,
            margin: 8,
            formatter: (value: string, index: number) => {
              if (!dateCount) return '';
              const d = parseISO(value);
              if (daysDiff > 365) return (index === 0 || index === dateCount - 1 || index % bigStep === 0) ? fmt.format(d) : '';
              if (daysDiff > 30) return (index % midStep === 0) ? fmt.format(d) : '';
              return fmt.format(d);
            }
          },
          axisLine: { lineStyle: { color: '#d0d0d0' } },
          axisTick: { show: false }
        },
        yAxis: { type: 'value', name: yAxisLabel },
        // grid: { left: 150, right: 50, top: 60, bottom: 60 },
      },
    });

    return deepMerge(base, lines);
  }, [safeData, metric, yAxisLabel]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </CardContent>
    </Card>
  )
}
