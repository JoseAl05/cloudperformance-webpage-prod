'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { StorageVariationsRangesMetrics } from '@/interfaces/vista-variacion-storage/variationStorageInterfaces';
import { bytesToGB } from '@/lib/bytesToMbs';
import {
  createChartOption,
  deepMerge,
  makeBaseOptions,
  type AnySeriesDef,
  useECharts,
} from '@/lib/echartsGlobalConfig';
import type { DataZoomComponentOption } from 'echarts';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

type SeriesTuple = [string, number];

type SeriesKey = 'blob' | 'table' | 'queue' | 'file' | 'storage';

const SERIES_CONFIG: ReadonlyArray<{
  key: SeriesKey;
  label: string;
  color: string;
  areaColor?: string;
}> = [
    { key: 'blob', label: 'Blob', color: '#36A2EB' },
    { key: 'table', label: 'Table', color: '#9966FF' },
    { key: 'queue', label: 'Queue', color: '#FF9F40' },
    { key: 'file', label: 'File', color: '#FF6384' },
    {
      key: 'storage',
      label: 'Storage Account',
      color: '#28e995',
      areaColor: 'rgba(40, 233, 149, 0.3)',
    },
  ];

const sliderConfig: DataZoomComponentOption[] = [
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
    moveOnMouseMove: false,
  },
  {
    type: 'inside',
    start: 0,
    end: 100,
    filterMode: 'filter',
    throttle: 100,
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
  },
];

const toSeriesPairs = (arr: StorageVariationsRangesMetrics[]): SeriesTuple[] => {
  return [...(arr ?? [])]
    .filter((item) => typeof item.metric_value === 'number' && !!item.metric_timestamp)
    .sort(
      (a, b) =>
        new Date(a.metric_timestamp).getTime() - new Date(b.metric_timestamp).getTime()
    )
    .map((item) => [item.metric_timestamp, bytesToGB(item.metric_value)] as SeriesTuple);
};

const createSeries = (
  name: string,
  data: SeriesTuple[],
  color: string,
  areaColor?: string
): AnySeriesDef => {
  const length = data.length;
  return {
    kind: 'line',
    name,
    data,
    smooth: false,
    extra: {
      color,
      showSymbol: false,
      symbol: 'none',
      symbolSize: 0,
      lineStyle: {
        color,
        width: 2,
        cap: 'round',
        join: 'round',
      },
      itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
      emphasis: {
        focus: 'series',
        lineStyle: { width: 3 },
        disabled: length > 5000,
      },
      progressive: length > 1000 ? 0 : undefined,
      progressiveThreshold: length > 1000 ? 500 : undefined,
      progressiveChunkMode: length > 5000 ? 'mod' : undefined,
      large: length > 1000,
      largeThreshold: 1000,
      areaStyle: areaColor ? { color: areaColor, opacity: 0.35 } : undefined,
    },
  };
};

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

export const StorageVariationCapacitiesComponent = ({
  blob,
  table,
  queue,
  file,
  storage,
  unitLabel = 'GB',
  height = 420,
  title = 'Capacidades por Servicio vs Storage Account',
}: StorageVariationCapacitiesProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const { blobData, tableData, queueData, fileData, storageData, yMaxRounded, anyData } =
    useMemo(() => {
      const blobData = toSeriesPairs(blob);
      const tableData = toSeriesPairs(table);
      const queueData = toSeriesPairs(queue);
      const fileData = toSeriesPairs(file);
      const storageData = toSeriesPairs(storage);

      const all = [
        ...blobData,
        ...tableData,
        ...queueData,
        ...fileData,
        ...storageData,
      ];
      const maxVal = all.length ? Math.max(...all.map(([, value]) => value)) : 0;
      const yMaxRaw = Math.ceil(maxVal * 1.15);
      const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

      return {
        blobData,
        tableData,
        queueData,
        fileData,
        storageData,
        yMaxRounded,
        anyData: all.length > 0,
      };
    }, [blob, table, queue, file, storage]);

  const dataMap: Record<SeriesKey, SeriesTuple[]> = useMemo(
    () => ({
      blob: blobData,
      table: tableData,
      queue: queueData,
      file: fileData,
      storage: storageData,
    }),
    [blobData, fileData, queueData, storageData, tableData]
  );

  const legendNames = useMemo(
    () => SERIES_CONFIG.map((series) => series.label),
    []
  );

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: legendNames,
      legendConfig: {
        top: 10,
        left: 'center',
        animation: false,
        textStyle: { fontSize: 12 },
      },
      unitLabel,
      showToolbox: false,
      showDataZoom: false,
    });

    const chart = createChartOption({
      kind: 'line',
      xAxisType: 'time',
      series: SERIES_CONFIG.map(({ key, label, color, areaColor }) =>
        createSeries(label, dataMap[key], color, areaColor)
      ),
      extraOption: {
        tooltip: {
          valueFormatter(value) {
            return `${value} GB`
          },
        },
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: { min: 0 },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, chart);
  }, [dataMap, legendNames, unitLabel]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

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
            <p className="text-sm text-muted-foreground">
              No hay métricas de capacidad disponibles.
            </p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full" style={{ height }} />
        )}
      </CardContent>
    </Card>
  );
};
