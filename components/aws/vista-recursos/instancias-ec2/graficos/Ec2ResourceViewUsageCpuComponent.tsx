'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceViewUsageCpuComponentProps {
  data: {
    metrics_data: { MetricLabel: string; Timestamp: string; total: number; used: number; unused: number }[];
  } | null;
}

const sliderConfig = [
  {
    type: 'slider',
    xAxisIndex: 0,
    bottom: 20,
    height: 20,
    handleSize: '100%',
    start: 0,
    end: 100
  },
  {
    type: 'inside',
    start: 0,
    end: 100,
    filterMode: 'filter'
  },
];

const tooltipFormatter = (params: unknown) => {
  const date = new Date(params[0].value[0]).toUTCString();
  return (
    `${date}<br/>` +
    params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} vCores<br/>`).join('')
  );
};

export const Ec2ResourceViewUsageCpuComponent = ({ data }: ResourceViewUsageCpuComponentProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const { totalData, usedData, unusedData, umbralCpu, yMaxRounded } = useMemo(() => {
    const cpuData = data?.metrics_data.filter(item => item.MetricLabel === 'Uso de CPU (Promedio)') || [];
    cpuData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

    const totalData: [string, number][] = cpuData.map(item => [item.Timestamp, item.total]);
    const usedData: [string, number][] = cpuData.map(item => [item.Timestamp, item.used]);
    const unusedData: [string, number][] = cpuData.map(item => [item.Timestamp, item.unused]);
    const umbralCpu: [string, number][] = cpuData.map(item => [item.Timestamp, (90 * item.total) / 100]);

    const maxTotalValue = totalData.length ? Math.max(...totalData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxTotalValue * 1.5);
    const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

    return { totalData, usedData, unusedData, umbralCpu, yMaxRounded };
  }, [data]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const optionsCpuMetrics: echarts.EChartsOption = {
      dataZoom: sliderConfig,
      tooltip: { trigger: 'axis', formatter: tooltipFormatter },
      legend: { data: ['Total', 'Used', 'Unused', 'Umbral Crítico'], top: 10, left: 'center' },
      grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
      toolbox: { feature: { saveAsImage: {} } },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value: number) => {
            const date = new Date(value);
            return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
          }
        }
      },
      yAxis: { type: 'value', max: yMaxRounded, axisLabel: { formatter: (val: number) => `${val} vCores` } },
      series: [
        createSeries('Total', totalData, '#36A2EB', 'rgba(54, 162, 235, 0.3)'),
        createSeries('Used', usedData, '#28e995'),
        createSeries('Umbral Crítico', umbralCpu, '#ef0000'),
        {
          ...createSeries('Unused', unusedData, '#FF6384'),
          markPoint: {
            data: unusedData
              .map(([timestamp, value]) =>
                value > 90 ? { name: 'Peak', value, xAxis: timestamp, yAxis: value } : null
              )
              .filter(Boolean),
            symbol: 'circle',
            symbolSize: 10,
            label: { show: true, formatter: '{c}', color: '#ef0000' }
          }
        }
      ],
      animation: true
    };

    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(optionsCpuMetrics);

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserverRef.current?.disconnect();
      chartInstance.current?.dispose();
    };
  }, [totalData, usedData, unusedData, umbralCpu, yMaxRounded, handleResize]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Uso de Cores de CPU</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
      </CardContent>
    </Card>
  );
};

const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
  name,
  type: 'line',
  data,
  smooth: true,
  lineStyle: { color },
  itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
  emphasis: { focus: 'series' },
  ...(areaColor && { areaStyle: { color: areaColor } })
});
