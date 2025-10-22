'use client'

import { useRef, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'
import { useTheme } from 'next-themes'

interface TopS3BucketsChartProps {
  data: unknown[];
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average'
  title: string
}

export const TopS3BucketsChart = ({ data, metric, title }: TopS3BucketsChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';
  const [topLimit, setTopLimit] = useState<number | 'all'>(10)

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData: unknown[] = Array.isArray(data) ? data : [];

  const aggregateData = useMemo<{ name: string; total: number }[]>(() => {
    if (!Array.isArray(safeData)) return []
    const filtered = safeData.filter((d: unknown) => d?.metric === metric)
    const map = new Map<string, number>()
    filtered.forEach((item: unknown) => {
      const key: string = item?.resource ?? ''
      const prev = map.get(key) ?? 0
      map.set(key, prev + Number(item?.metric_value ?? 0))
    })
    let aggregated = Array.from(map, ([name, total]) => ({ name, total }))
    aggregated.sort((a, b) => b.total - a.total)
    if (topLimit !== 'all') aggregated = aggregated.slice(0, topLimit)
    return aggregated
  }, [safeData, metric, topLimit]);

  const totalsByName = useMemo(() => new Map(aggregateData.map(item => [item.name, item.total])), [aggregateData]);

  const longestNameLength = useMemo(
    () => aggregateData.reduce((max, item) => Math.max(max, item.name.length), 0),
    [aggregateData]
  );

  const option = useMemo(() => {
    const base = makeBaseOptions({
      unitLabel: 'Objetos',
      title: { text: `${title} (${topLimit === 'all' ? 'Todos' : 'Top ' + topLimit})`, left: 'center' },
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });

    const gridLeft = Math.min(360, Math.max(180, longestNameLength * 3 + (metric.includes('Bytes') ? 90 : 70)));
    const gridRight = 72;
    const sliderTop = 60;
    const sliderBottom = 40;
    const labelWidth = Math.max(120, gridLeft - 40);

    const formatAxisLabel = (val: string) => {
      // const total = totalsByName.get(val) ?? 0
      // const metaText = metric.includes('Bytes')
      //   ? `{meta|${(total / 1073741824).toFixed(2)} GB}`
      //   : `{meta|${total.toLocaleString()} Objetos}`
      // return `{name|${val}}\n${metaText}`
      return `{name|${val}}`
    }

    const bars = createChartOption({
      kind: 'bar',
      xAxisType: 'value',
      legend: false,
      tooltip: true,
      series: [
        {
          kind: 'bar',
          name: '',
          data: aggregateData.map(r => r.total),
          smooth: true,
          extra: {
            itemStyle: { borderRadius: [6, 6, 0, 0] },
          }
        },
      ],
      extraOption: {
        grid: { left: gridLeft, right: gridRight, top: sliderTop, bottom: sliderBottom, containLabel: false },
        xAxis: {
          type: 'value',
          name: metric.includes('Bytes') ? 'Tamaño (GB)' : 'Objetos',
          axisLabel: {
            formatter: (value: number) => {
              if (metric.includes('Bytes')) return (value / 1073741824).toFixed(0)
              if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B'
              if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M'
              if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
              return value.toString()
            }
          }
        },
        yAxis: {
          type: 'category',
          data: aggregateData.map(r => r.name),
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: formatAxisLabel,
            interval: 0,
            align: 'right',
            width: labelWidth,
            overflow: 'break', // parte en varias líneas si no cabe
            lineHeight: 16,
            margin: 12,
            rich: {
              name: { fontSize: 11, lineHeight: 16 },
              meta: { fontSize: 10, lineHeight: 14, color: isDark ? '#a3a3a3' : '#666' },
            },
          },
        },
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0,
            orient: 'vertical',
            filterMode: 'weakFilter',
            right: 10,
            top: sliderTop,
            bottom: sliderBottom,
            width: 18,
            handleSize: '70%',
            showDataShadow: false,
            labelFormatter: '',
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
            end: 100,
          },
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            const val = params?.[0]?.value ?? 0
            const name = params?.[0]?.name ?? ''
            return metric.includes('Bytes')
              ? `${name}<br/>${(Number(val) / 1073741824).toFixed(2)} GB`
              : `${name}<br/>${Number(val).toLocaleString()} Objetos`
          },
        },
      },
    });

    return deepMerge(base, bars);
  }, [safeData, topLimit, aggregateData, metric, title, longestNameLength, totalsByName, isDark]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="flex items-center justify-between border-b">
        <CardTitle>{title}</CardTitle>
        <Select value={topLimit.toString()} onValueChange={val => setTopLimit(val === 'all' ? 'all' : Number(val))}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Top" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Top 3</SelectItem>
            <SelectItem value="5">Top 5</SelectItem>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div ref={chartRef} className="w-full h-full" />
      </CardContent>
    </Card>
  )
}
