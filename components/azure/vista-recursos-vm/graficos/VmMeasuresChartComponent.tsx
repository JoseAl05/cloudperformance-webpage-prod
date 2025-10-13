'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import useSWR from 'swr';

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
  data: MeasuresResponseData | null;
  title: string;
}

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const sliderConfig = [
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

const createTooltipFormatter = () => (params: unknown) => {
  const date = new Date(params[0].value[0]).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return (
    `${date}<br/>` +
    params.map((p: unknown) => `${p.marker} ${p.seriesName}: $${p.value[1].toFixed(2)} USD<br/>`).join('')
  );
};

const COLORS = [
  '#36A2EB',
  '#FF6384',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
  '#4BC0C0',
  '#FF9F40'
];

const VmMeasuresChart = ({ data, title }: VmMeasuresChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const safeData = data?.medidas_costos_no_cuantificables && Array.isArray(data.medidas_costos_no_cuantificables) 
    ? data.medidas_costos_no_cuantificables 
    : [];
  const safeMedidas = data?.medidas && Array.isArray(data.medidas) ? data.medidas : [];

  const { seriesDataByMeter, yMaxRounded, meterNames } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Agrupar datos por meter_name
    const dataByMeter: { [key: string]: [string, number][] } = {};
    
    sortedData.forEach(item => {
      if (!dataByMeter[item.meter_name]) {
        dataByMeter[item.meter_name] = [];
      }
      dataByMeter[item.meter_name].push([item.date, item.total_cost_in_usd]);
    });

    const meterNames = Object.keys(dataByMeter);

    // Calcular el máximo valor para el eje Y
    const allValues = sortedData.map(item => item.total_cost_in_usd);
    const maxValue = allValues.length ? Math.max(...allValues) : 0;
    const yMaxRaw = Math.ceil(maxValue * 1.2);
    const yMaxRounded = yMaxRaw;

    return { seriesDataByMeter: dataByMeter, yMaxRounded, meterNames };
  }, [safeData]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const series = meterNames.map((meterName, index) => 
      createSeries(meterName, seriesDataByMeter[meterName], COLORS[index % COLORS.length])
    );

    const optionsMetrics: echarts.EChartsOption = {
      animation: safeData.length < 1000,
      animationDuration: 300,
      animationEasing: 'linear',
      progressiveThreshold: 500,
      progressive: 200,
      hoverLayerThreshold: 3000,
      useUTC: false,
      dataZoom: sliderConfig,
      tooltip: {
        trigger: 'axis',
        formatter: createTooltipFormatter(),
        transitionDuration: 0.1,
        hideDelay: 100,
        backgroundColor: 'rgba(50, 50, 50, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: meterNames,
        top: 10,
        left: 'center',
        animation: false,
        textStyle: {
          fontSize: 11
        },
        type: 'scroll',
        pageButtonPosition: 'end'
      },
      grid: { left: 60, right: 30, top: 80, bottom: 60, containLabel: true },
      toolbox: {
        feature: {
          saveAsImage: {
            pixelRatio: 2,
            excludeComponents: ['toolbox']
          }
        },
        iconStyle: {
          borderColor: '#999'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#666'
          }
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          fontSize: 11,
          formatter: (value: number) => {
            const date = new Date(value);
            const month = date.toLocaleDateString('es-CL', { month: 'short' });
            return `${month} ${date.getFullYear()}`;
          },
          showMaxLabel: true,
          showMinLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        max: yMaxRounded,
        min: 0,
        scale: true,
        axisLabel: {
          fontSize: 11,
          formatter: (val: number) => `$${val.toFixed(2)}`,
          showMaxLabel: true,
          showMinLabel: true
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'solid',
            width: 1
          }
        }
      },
      series: series,
      animation: true
    };

    chartInstance.current = echarts.init(chartRef.current, null, {
      renderer: 'canvas'
    });
    chartInstance.current.setOption(optionsMetrics, {
      notMerge: true,
      lazyUpdate: true,
      silent: false
    });

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserverRef.current?.disconnect();
      chartInstance.current?.dispose();
    };
  }, [seriesDataByMeter, yMaxRounded, meterNames, handleResize, safeData.length]);

  const isEmpty = safeData.length === 0;

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

const createSeries = (name: string, data: [string, number][], color: string) => ({
  name,
  type: 'line',
  data,
  smooth: false,
  smoothMonotone: null,
  symbol: 'circle',
  symbolSize: 4,
  lineStyle: {
    color,
    width: 2,
    cap: 'round',
    join: 'round'
  },
  itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
  emphasis: {
    focus: 'series',
    lineStyle: {
      width: 3
    },
    disabled: data.length > 5000
  },
  blur: {
    lineStyle: {
      opacity: 0.2
    }
  },
  large: data.length > 1000,
  largeThreshold: 1000,
  sampling: data.length > 2000 ? 'lttb' : null
});

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());

interface VmMeasuresProps {
  startDate: Date;
  endDate: Date;
  instanceName: string;
}

const VmMeasuresComponent = ({ startDate, endDate, instanceName }: VmMeasuresProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/recursos/vm/facturacion/medidas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${instanceName}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (isLoading) return <LoaderComponent />;
  if (error) return <div className="text-red-500 p-4">Error al cargar medidas de facturación</div>;

  return <VmMeasuresChart data={data} title="Medidas costos no cuantificables" />;
};

export const VmMeasuresChartComponent = ({ startDate, endDate, instanceName }: { startDate: Date; endDate: Date; instanceName: string }) => (
  <VmMeasuresComponent 
    startDate={startDate} 
    endDate={endDate} 
    instanceName={instanceName}
  />
);

export default VmMeasuresChartComponent;