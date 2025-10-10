'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

// export const defaultDataZoom: echarts.EChartsOption['dataZoom'] = [
//   {
//     type: 'slider',
//     xAxisIndex: 0,
//     bottom: 20,
//     height: 20,
//     handleSize: '100%',
//     start: 0,
//     end: 100,
//     realtime: false,
//     throttle: 100,
//     zoomOnMouseWheel: false,
//     moveOnMouseMove: false,
//     filterMode: 'none'
//   },
//   {
//     type: 'inside',
//     start: 0,
//     end: 100,
//     filterMode: 'none',
//     throttle: 100,
//     zoomOnMouseWheel: true,
//     moveOnMouseMove: true,
//   },
// ];
export type MetricType =
  | 'count'
  | 'percent'
  | 'bytes'
  | 'gb'
  | 'mb'
  | 'default';

export const defaultDataZoom: echarts.EChartsOption['dataZoom'] = [
  {
    type: 'slider',
    xAxisIndex: 0,
    bottom: 28,
    height: 18,
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
    filterMode: 'none',
    throttle: 100,
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
  },
];

const makeNiceY = (
  minPad = 0.1,
  maxPad = 0.15,
  opts?: {
    minSpan?: number;
    hardFloor?: number;
    hardCeil?: number;
    integerTicks?: boolean;
  }
) => {
  const minSpan = opts?.minSpan ?? 1;
  const hardFloor = opts?.hardFloor;
  const hardCeil = opts?.hardCeil;
  const integer = opts?.integerTicks ?? false;

  return {
    min: (v: { min: number; max: number }) => {
      const span = v.max - v.min;
      if (!isFinite(span) || span <= 0) {
        const c = isFinite(v.min) ? v.min : 0;
        const floor = c - minSpan / 2;
        return hardFloor != null ? Math.max(hardFloor, floor) : floor;
      }
      const val = v.min - span * minPad;
      return hardFloor != null ? Math.max(hardFloor, val) : val;
    },
    max: (v: { min: number; max: number }) => {
      const span = v.max - v.min;
      if (!isFinite(span) || span <= 0) {
        const c = isFinite(v.max) ? v.max : 0;
        const ceil = c + minSpan / 2;
        return hardCeil != null ? Math.min(hardCeil, ceil) : ceil;
      }
      const val = v.max + span * maxPad;
      return hardCeil != null ? Math.min(hardCeil, val) : val;
    },
    axisLabel: { show: true, hideOverlap: false, margin: 8 },
    splitLine: { show: true },
    axisLine: { show: true },
    axisTick: { show: true, length: 4 },
    ...(integer ? { minInterval: 1 } : {}),
  };
};

export const makeAxisTooltipFormatter =
  (unitLabel?: string) => (params: unknown[]) => {
    const first = params?.[0];
    const ts = first?.value?.[0] ?? first?.data?.[0];
    const date = ts ? new Date(ts).toUTCString() : '';
    const lines = (params || [])
      .map((p: unknown) => {
        const val = Array.isArray(p.value) ? p.value[1] : p.value;
        const unit = unitLabel ? ` ${unitLabel}` : '';
        return `${p.marker} ${p.seriesName}: ${val}${unit}`;
      })
      .join('<br/>');
    return `${date}<br/>${lines}`;
  };

export function deepMerge<T>(base: T, extra: Partial<T>): T {
  if (Array.isArray(base) && Array.isArray(extra)) {
    return extra as T;
  }
  if (typeof base === 'object' && base && typeof extra === 'object' && extra) {
    const out: unknown = Array.isArray(base)
      ? [...(base as unknown)]
      : { ...(base as unknown) };
    for (const [k, v] of Object.entries(extra)) {
      const cur = (out as unknown)[k];
      if (Array.isArray(v) || typeof v !== 'object' || v === null) {
        (out as unknown)[k] = v as unknown;
      } else {
        (out as unknown)[k] = deepMerge(cur ?? {}, v as unknown);
      }
    }
    return out;
  }
  return (extra as T) ?? base;
}

export const lightTheme = {
  color: undefined,
  textStyle: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI',
  },
  axisPointer: { lineStyle: { type: 'dashed' } },
};

export const darkTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#e5e7eb' },
  axisLine: { lineStyle: { color: '#374151' } },
  splitLine: { lineStyle: { color: '#111827' } },
  axisPointer: { lineStyle: { type: 'dashed' } },
};

export function registerGlobalThemes() {
  try {
    echarts.registerTheme('cp-light', lightTheme as unknown);
  } catch {}
  try {
    echarts.registerTheme('cp-dark', darkTheme as unknown);
  } catch {}
}

export interface BaseOptionArgs {
  title?: string;
  legend?: string[];
  unitLabel?: string;
  yMax?: number;
  useUTC?: boolean;
  showToolbox?: boolean;
}

const fmtFixed = (n: number, d = 2) =>
  Number.isInteger(n)
    ? String(n)
    : Math.abs(n) >= 1e-3
    ? n.toFixed(d)
    : n.toString();

const humanBytes = (b: number, unitLabel?: string) => {
  if (!isFinite(b)) return '';
  const abs = Math.abs(b);
  if (abs >= 1024 ** 3)
    return `${(b / 1024 ** 3).toFixed(2)} ${unitLabel ?? 'GB'}`;
  if (abs >= 1024 ** 2)
    return `${(b / 1024 ** 2).toFixed(2)} ${unitLabel ?? 'MB'}`;
  if (abs >= 1024) return `${(b / 1024).toFixed(2)} ${unitLabel ?? 'KB'}`;
  return `${Math.round(b)} ${unitLabel ?? 'Bytes'}`;
};

export const getYAxisByMetricType = (
  metricType: MetricType,
  unitLabel?: string
): echarts.EChartsOption['yAxis'] => {
  switch (metricType) {
    case 'percent':
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, { minSpan: 1, hardFloor: 0, hardCeil: 100 }),
        axisLabel: {
          show: true,
          hideOverlap: false,
          margin: 8,
          formatter: (v: number) => `${fmtFixed(v, 1)} ${unitLabel ?? '%'}`,
        },
      };

    case 'count':
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, {
          minSpan: 2,
          hardFloor: 0,
          hardCeil: 100,
          // integerTicks: true,
        }),
        axisLabel: {
          show: true,
          hideOverlap: false,
          margin: 8,
          formatter: (v: number) =>
            `${fmtFixed(v, 1)} ${unitLabel ?? ''}`.trim(),
        },
      };

    case 'gb':
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, { minSpan: 1, hardFloor: 0 }),
        axisLabel: {
          show: true,
          hideOverlap: false,
          margin: 8,
          formatter: (v: number) => `${fmtFixed(v, 2)} ${unitLabel ?? 'GB'}`,
        },
      };

    case 'mb':
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, { minSpan: 100, hardFloor: 0 }),
        axisLabel: {
          show: true,
          hideOverlap: false,
          margin: 8,
          formatter: (v: number) => `${fmtFixed(v, 0)} ${unitLabel ?? 'MB'}`,
        },
      };

    case 'bytes':
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, { minSpan: 1024, hardFloor: 0 }),
        axisLabel: {
          show: true,
          hideOverlap: false,
          margin: 8,
          formatter: (v: number) => humanBytes(v, unitLabel),
        },
      };

    case 'default':
    default:
      return {
        type: 'value',
        ...makeNiceY(0.1, 0.15, { minSpan: 1, hardFloor: 0 }),
        axisLabel: { show: true, hideOverlap: false, margin: 8 },
      };
  }
};

export function makeBaseOptions({
  legend = [],
  unitLabel,
  useUTC = true,
  showToolbox = true,
  metricType = 'default',
}: {
  legend?: string[];
  unitLabel?: string;
  useUTC?: boolean;
  showToolbox?: boolean;
  metricType?: MetricType;
}): echarts.EChartsOption {
  const xAxis: echarts.EChartsOption['xAxis'] = {
    type: 'time',
    boundaryGap: false,
    axisLabel: {
      hideOverlap: true,
    },
    axisLine: { show: false },
    axisTick: { show: false },
  };

  // const yAxis: echarts.EChartsOption['yAxis'] = {
  //   type: 'value',
  //   ...makeNiceY(),
  //   axisLabel: unitLabel
  //     ? {
  //         hideOverlap: false,
  //         margin: 8,
  //         formatter: (val: number) => `${val} ${unitLabel}`,
  //       }
  //     : {
  //         hideOverlap: false,
  //         margin: 8,
  //       },
  //   axisLine: { show: true },
  //   axisTick: { show: true, length: 4 },
  //   splitLine: { show: true },
  // };

  const yAxis: echarts.EChartsOption['yAxis'] = getYAxisByMetricType(
    metricType,
    unitLabel
  );

  const grid: echarts.EChartsOption['grid'] = {
    left: 44,
    right: 10,
    top: 40,
    bottom: 56,
    containLabel: true,
  };

  const toolbox: echarts.EChartsOption['toolbox'] = showToolbox
    ? {
        right: 6,
        feature: {
          // dataZoom: { yAxisIndex: 'none' },
          restore: {},
          saveAsImage: {},
        },
      }
    : undefined;

  const base: echarts.EChartsOption = {
    useUTC,
    grid,
    legend: { data: legend, top: 8, icon: 'circle' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      valueFormatter: unitLabel
        ? (v) => (v == null ? '' : `${v} ${unitLabel}`)
        : undefined,
      confine: true,
    },
    xAxis,
    yAxis,
    dataZoom: defaultDataZoom,
    toolbox,
    media: [
      {
        query: { maxWidth: 640 },
        option: {
          grid: {
            left: 56,
            bottom: 70,
            top: 44,
            containLabel: true,
          },
          xAxis: { axisLabel: { rotate: 30 } },
          dataZoom: [{ bottom: 30, height: 16 }, {}],
        },
      },
      {
        query: { maxHeight: 420 },
        option: {
          grid: { left: 48, bottom: 64, containLabel: true },
          dataZoom: [{ bottom: 26, height: 14 }, {}],
        },
      },
    ],
  };

  return base;
}

export interface LineSeriesArgs {
  color?: string;
  area?: boolean | { opacity?: number };
  samplingThreshold?: number;
  markPointPredicate?: (x: [string | number, number]) => boolean;
  markPointLabelFormatter?: (v: number) => string;
}

export function makeLineSeries(
  name: string,
  data: Array<[string | number, number]>,
  args: LineSeriesArgs = {}
): echarts.EChartsOption['series'][number] {
  const {
    color,
    area,
    samplingThreshold = 2000,
    markPointPredicate,
    markPointLabelFormatter,
  } = args;

  const large = data.length > 1000;
  const veryLarge = data.length > 5000;

  const series: unknown = {
    name,
    type: 'line',
    data,
    smooth: false,
    symbol: 'none',
    symbolSize: 0,
    lineStyle: { color, width: 2, cap: 'round', join: 'round' },
    itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
    emphasis: { focus: 'series', lineStyle: { width: 3 }, disabled: veryLarge },
    blur: { lineStyle: { opacity: 0.2 } },
    large,
    largeThreshold: 1000,
    sampling: data.length > samplingThreshold ? 'lttb' : undefined,
    progressive: large ? 0 : undefined,
    progressiveThreshold: large ? 500 : undefined,
    progressiveChunkMode: veryLarge ? 'mod' : undefined,
  };

  if (area) {
    series.areaStyle = {
      opacity:
        typeof area === 'object' && typeof area.opacity === 'number'
          ? area.opacity
          : 0.35,
    };
  }

  if (markPointPredicate) {
    const pts = data
      .map(([x, y]) =>
        markPointPredicate([x, y])
          ? { name: 'mark', value: y, xAxis: x, yAxis: y }
          : null
      )
      .filter(Boolean);
    series.markPoint = {
      data: pts,
      symbol: 'circle',
      symbolSize: 10,
      label: {
        show: true,
        formatter: (p: unknown) =>
          markPointLabelFormatter
            ? markPointLabelFormatter(p?.value)
            : `${p?.value}`,
      },
    };
  }

  return series as echarts.EChartsOption['series'][number];
}

export function useECharts(
  ref: React.RefObject<HTMLDivElement>,
  option: echarts.EChartsOption,
  deps: unknown[] = [],
  theme?: 'cp-light' | 'cp-dark' | string | null
) {
  const chartRef = useRef<echarts.ECharts | null>(null);
  const resizeObs = useRef<ResizeObserver | null>(null);

  const memoOption = useMemo(() => option, deps);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    chartRef.current =
      echarts.getInstanceByDom(el) ||
      echarts.init(el, theme ?? undefined, { renderer: 'canvas' });
    chartRef.current.setOption(memoOption, {
      notMerge: true,
      lazyUpdate: true,
      silent: false,
    });

    resizeObs.current = new ResizeObserver(() => chartRef.current?.resize());
    resizeObs.current.observe(el);
    const onWinResize = () => chartRef.current?.resize();
    window.addEventListener('resize', onWinResize);

    return () => {
      window.removeEventListener('resize', onWinResize);
      resizeObs.current?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [ref, memoOption, theme]);
}

export type ChartKind =
  | 'line'
  | 'area'
  | 'bar'
  | 'stackedBar'
  | 'pie'
  | 'doughnut'

export interface BaseSeriesDef {
  name: string;
  /**
   * Para (line, bar, area, stackedBar, scatter):
   *   Array<[number | string | Date, number]>
   * Para pie/donut:
   *   Array<{ name: string; value: number }>
   */
  data: unknown[];
}

export interface CartesianSeriesDef extends BaseSeriesDef {
  kind: Extract<ChartKind, 'line' | 'area' | 'bar' | 'stackedBar'>;
  smooth?: boolean;
}

export interface PieSeriesDef extends BaseSeriesDef {
  kind: Extract<ChartKind, 'pie' | 'doughnut'>;
  radius?: [string | number, string | number] | string | number;
  center?: [string | number, string | number];
}


export type AnySeriesDef =
  | CartesianSeriesDef
  | PieSeriesDef

export interface ChartFactoryInput {
  kind: ChartKind;
  title?: string;
  subtitle?: string;
  series: AnySeriesDef[];
  legend?: boolean;
  tooltip?: boolean;
  xAxisType?: 'category' | 'time' | 'value';
  stackKey?: string;
  extraOption?: echarts.EChartsOption;
}

export const buildSeries = (def: AnySeriesDef, opts?: { stackKey?: string }): echarts.SeriesOption  => {
  switch (def.kind) {
    case 'line':
    case 'area':
      return {
        name: def.name,
        type: 'line',
        smooth: (def as CartesianSeriesDef).smooth ?? true,
        showSymbol: false,
        lineStyle: { width: 2 },
        areaStyle: def.kind === 'area' ? {} : undefined,
        data: (def.data as Array<[unknown, number]>),
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;

    case 'bar':
    case 'stackedBar': {
      const stack = def.kind === 'stackedBar' ? (opts?.stackKey ?? 'total') : undefined;
      return {
        name: def.name,
        type: 'bar',
        stack,
        data: (def.data as Array<[unknown, number]>),
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;
    }

    case 'pie':
    case 'doughnut': {
      const radius = (def as PieSeriesDef).radius ?? (def.kind === 'doughnut' ? ['40%', '70%'] : '60%');
      const center = (def as PieSeriesDef).center ?? ['50%', '55%'];
      return {
        name: def.name,
        type: 'pie',
        radius,
        center,
        roseType: undefined,
        label: { show: true },
        data: def.data as Array<{ name: string; value: number }>,
        emphasis: { focus: 'data' },
      } as echarts.SeriesOption;
    }

    default:
      return { name: def.name, type: 'line', data: def.data as unknown } as echarts.SeriesOption;
  }
}

export const createChartOption = (input: ChartFactoryInput): echarts.EChartsOption  => {
  const {
    kind,
    title,
    subtitle,
    series,
    radarIndicators,
    legend = true,
    tooltip = true,
    xAxisType = (kind === 'line' || kind === 'area' || kind === 'scatter' ? 'time' : 'category'),
    stackKey,
    extraOption = {},
  } = input;
  const needsCartesian = ['line', 'area', 'bar', 'stackedBar', 'scatter'].includes(kind);

  const builtSeries = series.map(s => buildSeries(s, { stackKey }));

  const option: echarts.EChartsOption = {
    title: title
      ? { text: title, subtext: subtitle }
      : undefined,
    legend: legend ? { top: 0 } : undefined,
    tooltip: tooltip ? { trigger: kind === 'pie' || kind === 'doughnut' || kind === 'funnel' ? 'item' : 'axis' } : undefined,
    xAxis: needsCartesian
      ? { type: xAxisType }
      : undefined,
    yAxis: needsCartesian
      ? { type: 'value' }
      : undefined,
    radar: kind === 'radar'
      ? {
          indicator: radarIndicators ?? [],
          center: ['50%', '55%'],
          radius: '65%',
        }
      : undefined,
    series: builtSeries,
    ...extraOption,
  };

  return option;
}
export const makeSimpleChart = (
  kind: ChartKind,
  name: string,
  data: unknown[],
  extra?: Partial<ChartFactoryInput>
): echarts.EChartsOption => {
  const def: AnySeriesDef = { kind: kind as unknown, name, data } as AnySeriesDef;
  return createChartOption({
    kind,
    series: [def],
    ...extra,
  });
};
