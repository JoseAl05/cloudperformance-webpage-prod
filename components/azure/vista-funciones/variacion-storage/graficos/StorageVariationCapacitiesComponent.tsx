'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { StorageVariationsRangesMetrics } from '@/interfaces/vista-variacion-storage/variationStorageInterfaces';
import { bytesToGB } from '@/lib/bytesToMbs';

type SeriesTuple = [string, number];

export interface StorageVariationCapacitiesProps {
  blob: StorageVariationsRangesMetrics[];
  table: StorageVariationsRangesMetrics[];
  queue: StorageVariationsRangesMetrics[];
  file: StorageVariationsRangesMetrics[];
  storage: StorageVariationsRangesMetrics[];
  unitLabel?: string;
  height?: number;
  title?: string;
}

const sliderConfig: echarts.DataZoomComponentOption[] = [
  {
    type: 'slider',
    xAxisIndex: 0,
    bottom: 20,
    height: 20,
    handleSize: '100%',
    start: 0,
    end: 100,
    realtime: false,
    throttle: 100,
    zoomOnMouseWheel: false,
    moveOnMouseMove: false
  },
  {
    type: 'inside',
    start: 0,
    end: 100,
    filterMode: 'filter',
    throttle: 100,
    zoomOnMouseWheel: true,
    moveOnMouseMove: true
  },
];

const toSeriesPairs = (arr: StorageVariationsRangesMetrics[]): SeriesTuple[] => {
  return [...(arr ?? [])]
    .filter(it => typeof it.metric_value === 'number' && !!it.metric_timestamp)
    .sort((a, b) => new Date(a.metric_timestamp).getTime() - new Date(b.metric_timestamp).getTime())
    .map(it => [it.metric_timestamp,  bytesToGB(it.metric_value)] as SeriesTuple);
}

const createSeries = (
  name: string,
  data: SeriesTuple[],
  color: string,
  areaColor?: string
): echarts.SeriesOption => {
  return {
    name,
    type: 'line',
    data,
    smooth: false,
    symbol: 'none',
    symbolSize: 0,
    lineStyle: {
      color,
      width: 2,
      cap: 'round',
      join: 'round'
    },
    itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
    emphasis: {
      focus: 'series',
      lineStyle: { width: 3 },
      disabled: data.length > 5000
    },
    blur: { lineStyle: { opacity: 0.2 } },
    large: data.length > 1000,
    largeThreshold: 1000,
    sampling: data.length > 2000 ? 'lttb' : undefined,
    progressive: data.length > 1000 ? 0 : undefined,
    progressiveThreshold: data.length > 1000 ? 500 : undefined,
    progressiveChunkMode: data.length > 5000 ? 'mod' : undefined,
    ...(areaColor && { areaStyle: { color: areaColor, opacity: 0.35 } })
  };
}

export const StorageVariationCapacitiesComponent = ({
  blob,
  table,
  queue,
  file,
  storage,
  unitLabel = 'GB',
  height = 420,
  title = 'Capacidades por Servicio vs Storage Account'
}: StorageVariationCapacitiesProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const {
    blobData, tableData, queueData, fileData, storageData, yMaxRounded, anyData
  } = useMemo(() => {
    const blobData = toSeriesPairs(blob);
    const tableData = toSeriesPairs(table);
    const queueData = toSeriesPairs(queue);
    const fileData = toSeriesPairs(file);
    const storageData = toSeriesPairs(storage);

    const all = [...blobData, ...tableData, ...queueData, ...fileData, ...storageData];
    const maxVal = all.length ? Math.max(...all.map(([, v]) => v)) : 0;
    const yMaxRaw = Math.ceil(maxVal * 1.15);
    const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

    return {
      blobData,
      tableData,
      queueData,
      fileData,
      storageData,
      yMaxRounded,
      anyData: all.length > 0
    };
  }, [blob, table, queue, file, storage]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !anyData) return;

    const options: echarts.EChartsOption = {
      animation: true,
      animationDuration: 300,
      animationEasing: 'linear',
      progressiveThreshold: 500,
      progressive: 200,
      hoverLayerThreshold: 3000,
      useUTC: true,
      dataZoom: sliderConfig,
      tooltip: {
        trigger: 'axis',
        transitionDuration: 0.1,
        hideDelay: 100,
        backgroundColor: 'rgba(50, 50, 50, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        textStyle: { color: '#fff', fontSize: 12 },
        axisPointer: { animation: false },
        formatter: (params: unknown) => {
          if (!params?.length) return '';
          const date = new Date(params[0].value[0]).toUTCString();
          return (
            `${date}<br/>` +
            params
              .map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} ${unitLabel}<br/>`)
              .join('')
          );
        }
      },
      legend: {
        data: ['Blob', 'Table', 'Queue', 'File', 'Storage Account'],
        top: 10,
        left: 'center',
        animation: false,
        textStyle: { fontSize: 12 }
      },
      grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
      toolbox: {
        feature: {
          saveAsImage: {
            pixelRatio: 2,
            excludeComponents: ['toolbox']
          }
        },
        iconStyle: { borderColor: '#999' },
        emphasis: { iconStyle: { borderColor: '#666' } }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          fontSize: 11,
          formatter: (value: number) => {
            const d = new Date(value);
            const dd = String(d.getUTCDate()).padStart(2, '0');
            const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
            const hh = String(d.getUTCHours()).padStart(2, '0');
            const mi = String(d.getUTCMinutes()).padStart(2, '0');
            return `${dd}/${mm} ${hh}:${mi}`;
          },
          showMaxLabel: true,
          showMinLabel: true
        },
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        max: yMaxRounded,
        scale: true,
        axisLabel: {
          fontSize: 11,
          formatter: (val: number) => `${val} ${unitLabel}`,
          showMaxLabel: true,
          showMinLabel: true
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'solid', width: 1 } }
      },
      series: [
        createSeries('Blob', blobData, '#36A2EB'),
        createSeries('Table', tableData, '#9966FF'),
        createSeries('Queue', queueData, '#FF9F40'),
        createSeries('File', fileData, '#FF6384'),
        createSeries('Storage Account', storageData, '#28e995', 'rgba(40, 233, 149, 0.3)'),
      ]
    };

    chartInstance.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    chartInstance.current.setOption(options, { notMerge: true, lazyUpdate: true, silent: false });

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserverRef.current?.disconnect();
      chartInstance.current?.dispose();
    };
  }, [anyData, blobData, tableData, queueData, fileData, storageData, yMaxRounded, unitLabel, handleResize]);

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

        {!anyData ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No hay métricas de capacidad disponibles.</p>
          </div>
        ) : (
          <div
            ref={chartRef}
            className="w-full"
            style={{ height }}
          />
        )}
      </CardContent>
    </Card>
  );
}
