'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

/** Controles de zoom por defecto (slider + inside) */
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
    xAxisIndex: 0,
    start: 0,
    end: 100,
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
    throttle: 50,
  },
];

/** Merge profundo y simple */
export function deepMerge<T extends Record<string, unknown>>(a: T, b: T): T {
  const out: Record<string, unknown> = { ...a };
  Object.keys(b ?? {}).forEach((k) => {
    const av = a?.[k];
    const bv = b?.[k];
    if (
      av &&
      bv &&
      typeof av === 'object' &&
      typeof bv === 'object' &&
      !Array.isArray(av) &&
      !Array.isArray(bv)
    ) {
      out[k] = deepMerge(
        av as Record<string, unknown>,
        bv as Record<string, unknown>
      );
    } else {
      out[k] = bv;
    }
  });
  return out as T;
}

/** Posición de leyenda: abreviada o detallada */
type LegendPos =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | {
      left?: string | number;
      right?: string | number;
      top?: string | number;
      bottom?: string | number;
      orient?: 'horizontal' | 'vertical';
      align?: 'auto' | 'left' | 'right';
    };

function buildLegendOption(
  legend: string[] | boolean,
  legendPos: LegendPos
): echarts.EChartsOption['legend'] {
  // Normalizar posicionamiento
  let pos: Record<string, unknown> = {};
  if (typeof legendPos === 'string') {
    const side = legendPos;
    if (side === 'top') pos = { top: 0, left: 'center', orient: 'horizontal' };
    if (side === 'bottom')
      pos = { bottom: 0, left: 'center', orient: 'horizontal' };
    if (side === 'left') pos = { left: 0, top: 'middle', orient: 'vertical' };
    if (side === 'right') pos = { right: 0, top: 'middle', orient: 'vertical' };
  } else {
    pos = { ...legendPos };
  }

  if (Array.isArray(legend)) {
    return { data: legend, ...pos };
  }
  return legend ? { ...pos } : { show: false };
}

export function makeBaseOptions(args?: {
  legend?: string[] | boolean;
  legendPos?: LegendPos;
  unitLabel?: string;
  useUTC?: boolean;
  showToolbox?: boolean;
  showDataZoom?: boolean;
  metricType?: 'default' | 'percent';
}): echarts.EChartsOption {
  const {
    legend = true,
    legendPos = 'top',
    unitLabel,
    useUTC = true,
    showToolbox = false,
    showDataZoom = true,
    metricType = 'default',
  } = args ?? {};

  const textColor = '#a1a1aa';
  const gridColor = '#27272a';

  return {
    useUTC,
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 300,
    textStyle: { color: textColor },
    grid: { left: 40, right: 10, top: 40, bottom: 40, containLabel: true },
    legend: buildLegendOption(legend, legendPos),
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      valueFormatter: (v) => {
        if (v == null) return '-';
        const n = Number(v);
        if (Number.isNaN(n)) return String(v);
        return metricType === 'percent' ? `${n.toFixed(2)}%` : `${n}`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor, hideOverlap: true },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: {
        color: textColor,
        formatter: (v: number) => (metricType === 'percent' ? `${v}%` : `${v}`),
      },
      splitLine: { show: true, lineStyle: { color: gridColor, opacity: 0.4 } },
    },
    toolbox: showToolbox
      ? {
          feature: {
            saveAsImage: { show: true },
            dataZoom: { show: true, yAxisIndex: 'none' },
            magicType: { type: ['line', 'bar'] },
            restore: { show: true },
          },
        }
      : undefined,
    dataZoom: showDataZoom ? defaultDataZoom : undefined,
  };
}

/** ============================================================
 * Tipos de Series
 * ============================================================ */

export type ChartKind =
  | 'line'
  | 'area'
  | 'bar'
  | 'stackedBar'
  | 'scatter'
  | 'pie'
  | 'doughnut'
  | 'radar';

export interface SeriesOverrides {
  color?: string;
  lineStyle?: Record<string, unknown>;
  areaStyle?: Record<string, unknown>;
  itemStyle?: Record<string, unknown>;
  showSymbol?: boolean;
  smooth?: boolean;
  symbol?: unknown;
  symbolSize?: number;
  barWidth?: number | string;
  stack?: string;
  yAxisIndex?: number;
  encode?: Record<string, unknown>;
  label?: Record<string, unknown>;
  emphasis?: Record<string, unknown>;
  markPoint?: Record<string, unknown>;
  z?: number;
  zlevel?: number;
}

export interface BaseSeriesDef {
  name: string;
  /**
   * Para (line, bar, area, stackedBar, scatter):
   *   Array<[number | string | Date, number]>
   * Para pie/donut:
   *   Array<{ name: string; value: number }>
   */
  data: unknown[];
  extra?: SeriesOverrides;
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

export type AnySeriesDef = CartesianSeriesDef | PieSeriesDef;

export type TooltipFormatter =
  | string
  | ((params: unknown) => string)
  | ((params: unknown[]) => string);

export type LegendOption = echarts.EChartsOption['legend'];

export interface ChartFactoryInput {
  kind: ChartKind;
  title?: string;
  subtitle?: string;
  series: AnySeriesDef[];
  legend?: boolean;
  legendOption?: LegendOption;
  tooltip?: boolean;
  tooltipFormatter?: TooltipFormatter;
  xAxisType?: 'category' | 'time' | 'value';
  stackKey?: string;
  extraOption?: echarts.EChartsOption;
}

/** Helpers de líneas con markPoint opcional */
interface LineSeriesArgs {
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
    smooth: true,
    symbol: 'none',
    symbolSize: 2,
    lineStyle: { color, width: 2, cap: 'round', join: 'round' },
    itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
    emphasis: { focus: 'series', lineStyle: { width: 3 }, disabled: veryLarge },
    blur: { lineStyle: { opacity: 0.2 } },
    large,
    largeThreshold: 1000,
    sampling: data.length > samplingThreshold ? 'lttb' : undefined,
    progressive: large ? 400 : undefined,
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
            ? markPointLabelFormatter(p?.value as number)
            : `${p?.value}`,
      },
    };
  }

  return series as echarts.EChartsOption['series'][number];
}

/** Hook ECharts con cleanup y resize */
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

    chartRef.current = echarts.init(el, theme ?? undefined, {
      renderer: 'canvas',
    });
    chartRef.current.setOption(memoOption, {
      notMerge: true,
      lazyUpdate: true,
    });

    resizeObs.current = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObs.current.observe(el);

    return () => {
      resizeObs.current?.disconnect();
      resizeObs.current = null;
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [ref, theme]);

  useEffect(() => {
    chartRef.current?.setOption(memoOption, {
      notMerge: true,
      lazyUpdate: true,
    });
  }, [memoOption]);
}

/** Fábrica principal */
function buildSeries(def: AnySeriesDef): echarts.SeriesOption {
  const applyOverrides = (base: echarts.SeriesOption, kind: ChartKind) => {
    const s: Record<string, unknown> = { ...base };
    const ex = def.extra ?? {};

    if (typeof ex.showSymbol === 'boolean') s.showSymbol = ex.showSymbol;
    if (typeof ex.smooth === 'boolean') s.smooth = ex.smooth;

    if (typeof ex.yAxisIndex === 'number') s.yAxisIndex = ex.yAxisIndex;
    if (typeof ex.barWidth !== 'undefined')
      s['barWidth'] = ex.barWidth as unknown;
    if (typeof ex.stack === 'string') s['stack'] = ex.stack;

    if (typeof ex.symbol !== 'undefined') s['symbol'] = ex.symbol as unknown;
    if (typeof ex.symbolSize === 'number') s['symbolSize'] = ex.symbolSize;

    if (ex.label) {
      const prev = (s['label'] as Record<string, unknown> | undefined) ?? {};
      s['label'] = { ...prev, ...ex.label };
    }
    if (ex.emphasis) {
      const prev = (s['emphasis'] as Record<string, unknown> | undefined) ?? {};
      s['emphasis'] = { ...prev, ...ex.emphasis };
    }
    if (ex.encode) {
      const prev = (s['encode'] as Record<string, unknown> | undefined) ?? {};
      s['encode'] = { ...prev, ...ex.encode };
    }
    if (ex.markPoint) {
      const prev =
        (s['markPoint'] as Record<string, unknown> | undefined) ?? {};
      s['markPoint'] = deepMerge(prev, ex.markPoint as Record<string, unknown>);
    }

    if (ex.itemStyle) {
      const prev =
        (s['itemStyle'] as Record<string, unknown> | undefined) ?? {};
      s['itemStyle'] = { ...prev, ...ex.itemStyle };
    }
    if (ex.lineStyle) {
      const prev =
        (s['lineStyle'] as Record<string, unknown> | undefined) ?? {};
      s['lineStyle'] = { ...prev, ...ex.lineStyle };
    }
    if (ex.areaStyle) {
      const prev =
        (s['areaStyle'] as Record<string, unknown> | undefined) ?? {};
      s['areaStyle'] = { ...prev, ...ex.areaStyle };
    }

    if (typeof ex.color === 'string' && ex.color) {
      const itemPrev =
        (s['itemStyle'] as Record<string, unknown> | undefined) ?? {};
      s['itemStyle'] = { ...itemPrev, color: ex.color };

      const k = kind as string;
      if (k === 'line' || k === 'area' || k === 'scatter') {
        const linePrev =
          (s['lineStyle'] as Record<string, unknown> | undefined) ?? {};
        s['lineStyle'] = { ...linePrev, color: ex.color };
      }
      if ((kind as string) === 'area') {
        const areaPrev =
          (s['areaStyle'] as Record<string, unknown> | undefined) ?? {};
        s['areaStyle'] = { ...areaPrev, color: ex.color };
      }
    }

    if (typeof ex.z === 'number') s['z'] = ex.z;
    if (typeof ex.zlevel === 'number') s['zlevel'] = ex.zlevel;

    return s as unknown as echarts.SeriesOption;
  };

  switch (def.kind) {
    case 'line':
    case 'area': {
      const base = {
        name: def.name,
        type: 'line',
        smooth: (def as CartesianSeriesDef).smooth ?? true,
        showSymbol: true,
        lineStyle: { width: 2 },
        areaStyle: def.kind === 'area' ? {} : undefined,
        data: def.data as Array<[unknown, number]> | Array<[number]>,
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;
      return applyOverrides(base, def.kind);
    }

    case 'bar': {
      const base = {
        name: def.name,
        type: 'bar',
        data: def.data as Array<[unknown, number]>,
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;
      return applyOverrides(base, def.kind);
    }

    case 'stackedBar': {
      const base = {
        name: def.name,
        type: 'bar',
        stack: 'stack',
        data: def.data as Array<[unknown, number]>,
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;
      return applyOverrides(base, def.kind);
    }

    case 'scatter': {
      const base = {
        name: def.name,
        type: 'scatter',
        data: def.data as Array<[unknown, number]>,
        encode: { x: 0, y: 1 },
        emphasis: { focus: 'series' },
      } as echarts.SeriesOption;
      return applyOverrides(base, def.kind);
    }

    case 'pie':
    case 'doughnut': {
      const radius =
        (def as PieSeriesDef).radius ??
        (def.kind === 'doughnut' ? ['40%', '70%'] : '60%');
      const center = (def as PieSeriesDef).center ?? ['50%', '55%'];
      const base = {
        name: def.name,
        type: 'pie',
        radius,
        center,
        roseType: undefined,
        data: def.data as Array<{ name: string; value: number }>,
        emphasis: { focus: 'self' },
      } as echarts.SeriesOption;
      return applyOverrides(base, def.kind);
    }

    default:
      return {
        name: def.name,
        type: 'line',
        data: def.data as Array<[unknown, number]> | Array<[number]>,
      } as echarts.SeriesOption;
  }
}

export function createChartOption(
  input: ChartFactoryInput
): echarts.EChartsOption {
  const {
    kind,
    title,
    subtitle,
    series,
    legend = true,
    legendOption,
    tooltip = true,
    tooltipFormatter,
    xAxisType = 'category',
    extraOption,
  } = input;
  const resolvedLegend: LegendOption =
    legend === false
      ? ({ show: false } as LegendOption)
      : legendOption ?? ({} as LegendOption);

  const option: echarts.EChartsOption = {
    ...makeBaseOptions({ useUTC: true }),
    title: title ? { text: title, subtext: subtitle } : undefined,
    legend: resolvedLegend,
    tooltip: tooltip
      ? ({
          trigger: 'axis',
          ...(tooltipFormatter ? { formatter: tooltipFormatter } : {}),
        } as echarts.EChartsOption['tooltip'])
      : { show: false },
    xAxis:
      kind === 'pie' || kind === 'doughnut'
        ? undefined
        : {
            type: xAxisType,
            boundaryGap: kind === 'bar' || kind === 'stackedBar',
          },
    yAxis:
      kind === 'pie' || kind === 'doughnut' ? undefined : { type: 'value' },
    series: series.map(buildSeries),
  };

  return extraOption
    ? deepMerge(option, extraOption as Record<string, unknown>)
    : option;
}

/** Atajo para una sola serie */
export const createSeries = (
  kind: ChartKind,
  name: string,
  data: unknown[],
  extra?: Partial<ChartFactoryInput>
): echarts.EChartsOption => {
  const def: AnySeriesDef = {
    kind: kind as unknown,
    name,
    data,
  } as AnySeriesDef;
  return createChartOption({
    kind,
    series: [def],
    ...extra,
  });
};
