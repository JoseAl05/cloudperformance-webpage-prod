'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';


export const defaultDataZoom: echarts.EChartsOption['dataZoom'] = [
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


export const makeAxisTooltipFormatter = (unitLabel?: string) =>
  (params: unknown[]) => {
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
    const out: unknown = Array.isArray(base) ? [...(base as unknown)] : { ...(base as unknown) };
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
  textStyle: { fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI' },
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

export function makeBaseOptions(args: BaseOptionArgs = {}): echarts.EChartsOption {
  const { title, legend, unitLabel, yMax, useUTC = true, showToolbox = true } = args;

  return {
    useUTC,
    animation: true,
    animationDuration: 300,
    animationEasing: 'linear',
    progressiveThreshold: 500,
    progressive: 200,
    hoverLayerThreshold: 3000,

    title: title ? { text: title, left: 'center', top: 8 } : undefined,

    dataZoom: defaultDataZoom,

    tooltip: {
      trigger: 'axis',
      formatter: makeAxisTooltipFormatter(unitLabel) as unknown,
      transitionDuration: 0.1,
      hideDelay: 100,
      backgroundColor: 'rgba(50,50,50,0.95)',
      borderColor: 'rgba(255,255,255,0.2)',
      textStyle: { color: '#fff', fontSize: 12 },
      axisPointer: { animation: false },
    },

    legend: legend?.length
      ? {
          data: legend,
          top: 10,
          left: 'center',
          animation: false,
          textStyle: { fontSize: 12 },
        }
      : undefined,

    grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },

    toolbox: showToolbox
      ? {
          feature: {
            saveAsImage: { pixelRatio: 2, excludeComponents: ['toolbox'] },
          },
          iconStyle: { borderColor: '#999' },
          emphasis: { iconStyle: { borderColor: '#666' } },
        }
      : undefined,

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
          return `${dd}/${mm} ${hh}:00`;
        },
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisTick: { show: false },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      max: yMax,
      scale: true,
      axisLabel: {
        fontSize: 11,
        formatter: (val: number) => (unitLabel ? `${val} ${unitLabel}` : String(val)),
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'solid', width: 1 } },
    },
  };
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
      opacity: typeof area === 'object' && typeof area.opacity === 'number' ? area.opacity : 0.35,
    };
  }

  if (markPointPredicate) {
    const pts = data
      .map(([x, y]) => (markPointPredicate([x, y]) ? { name: 'mark', value: y, xAxis: x, yAxis: y } : null))
      .filter(Boolean);
    series.markPoint = {
      data: pts,
      symbol: 'circle',
      symbolSize: 10,
      label: { show: true, formatter: (p: unknown) => (markPointLabelFormatter ? markPointLabelFormatter(p?.value) : `${p?.value}`) },
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

    chartRef.current = echarts.getInstanceByDom(el) || echarts.init(el, theme ?? undefined, { renderer: 'canvas' });
    chartRef.current.setOption(memoOption, { notMerge: true, lazyUpdate: true, silent: false });

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
