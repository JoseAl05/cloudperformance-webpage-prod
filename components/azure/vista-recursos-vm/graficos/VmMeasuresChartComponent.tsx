'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import useSWR from 'swr';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface MeasureData {
  meter_name: string;
  unit_of_measure: string;
}

interface MeasureCostData {
  total_cost_in_usd: number;
  date: string;
  meter_name: string;
}

interface MeasuresResponseData {
  medidas: MeasureData[];
  medidas_costos_no_cuantificables: MeasureCostData[];
}

interface VmMeasuresChartProps {
  data: MeasuresResponseData;
  title: string;
}

export const VmMeasuresChart = ({ data, title }: VmMeasuresChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData = data?.medidas_costos_no_cuantificables && Array.isArray(data.medidas_costos_no_cuantificables)
    ? data.medidas_costos_no_cuantificables
    : [];
  const safeMedidas = data?.medidas && Array.isArray(data.medidas) ? data.medidas : [];

  const { series, meterNames } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Agrupar datos por meter_name
    const dataByMeter: { [key: string]: [string, number][] } = {};

    sortedData.forEach(item => {
      if (!dataByMeter[item.meter_name]) {
        dataByMeter[item.meter_name] = [];
      }
      dataByMeter[item.meter_name].push([item.date, item.total_cost_in_usd.toFixed(2)]);
    });

    const meterNames = Object.keys(dataByMeter);

    const series = meterNames.map((meterName) => (
      {
        name: meterName,
        kind: 'line',
        smooth: true,
        data: dataByMeter[meterName]
      }
    ));

    return { series, meterNames };
  }, [safeData]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      legend: meterNames,
      legendPos: {
        orient: 'horizontal',
        top: 0
      },
      unitLabel: '$',
      useUTC: true,
      showToolbox: true
    });
    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'time',
      legend: true,
      legendOption: {
        type: 'scroll',
        orient: 'horizontal',
        top: 0,
        left: 'center',
        textStyle: { fontSize: 11, color: '#666' },
        selectedMode: 'multiple',
      },
      tooltip: true,
      series: series,
      extraOption: {
        tooltip: {
          valueFormatter(value) {
            return `$${value}`
          },
        },
        xAxis: { axisLabel: { rotate: 30 } },
        yAxis: { min: 0 },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, lines);
  }, [series, meterNames]);

  const isEmpty = safeData.length === 0;

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <div className="flex gap-4 w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Costos no cuantificables por medida en <strong>USD</strong>.
            </p>
          </div>
          {isEmpty ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No hay datos de medidas disponibles en el rango de fecha seleccionado.</p>
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
          )}
        </CardContent>
      </Card>

      <div className="w-80">
        <Card className="border-l-4 border-l-purple-500 h-full">
          <CardHeader>
            <CardTitle className="text-lg">Medidas Facturadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeMedidas.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay medidas disponibles</p>
              ) : (
                safeMedidas.map((medida, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">Unidad medida</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">{medida.unit_of_measure}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground">Nombre medida</p>
                      <p className="text-sm text-gray-600 mt-1 break-words">{medida.meter_name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};