'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, DollarSign } from 'lucide-react';
import useSWR from 'swr';

interface BillingDetailData {
  total_cost_in_usd: number;
  total_payg_cost_in_usd: number;
  date: string;
}

interface BillingData {
  gasto_total_acumulado: number;
  gasto_pago_por_uso: number;
  detalle: BillingDetailData[];
}

interface VmBillingChartProps {
  data: BillingData | null;
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

const createTooltipFormatter = () => (params: any) => {
  const date = new Date(params[0].value[0]).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return (
    `${date}<br/>` +
    params.map((p: any) => `${p.marker} ${p.seriesName}: ${p.value[1].toFixed(2)} USD<br/>`).join('')
  );
};

const VmBillingChart = ({ data, title }: VmBillingChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const safeData = data?.detalle && Array.isArray(data.detalle) ? data.detalle : [];

  const { costData, paygData, yMaxRounded } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const costData: [string, number][] = sortedData.map(item => [
      item.date,
      item.total_cost_in_usd
    ]);

    const paygData: [string, number][] = sortedData.map(item => [
      item.date,
      item.total_payg_cost_in_usd
    ]);

    const allValues = [...costData.map(item => item[1]), ...paygData.map(item => item[1])];
    const maxValue = allValues.length ? Math.max(...allValues) : 0;
    const yMaxRaw = Math.ceil(maxValue * 1.2);
    const yMaxRounded = yMaxRaw;

    return { costData, paygData, yMaxRounded };
  }, [safeData]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const optionsMetrics: echarts.EChartsOption = {
      animation: costData.length < 1000,
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
        data: ['Costo Acumulado Pago por Uso', 'Costo Acumulado Fijo'],
        top: 10,
        left: 'center',
        animation: false,
        textStyle: {
          fontSize: 12
        }
      },
      grid: { left: 60, right: 30, top: 60, bottom: 60, containLabel: true },
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
            return `${date.getDate()}/${date.getMonth() + 1}`;
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
      series: [
        createSeries('Costo Acumulado Pago por Uso', paygData, '#36A2EB'),
        createSeries('Costo Acumulado Fijo', costData, '#FF6384')
      ],
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
  }, [costData, paygData, yMaxRounded, handleResize]);

  const isEmpty = costData.length === 0;

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
              Facturación de recursos en <strong>USD</strong>.
            </p>
          </div>
          {isEmpty ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No hay datos de facturación disponibles en el rango de fecha seleccionado.</p>
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 w-80">
        <Card className="border-l-4 border-l-green-500 flex-1">
          <CardContent className="p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Total Acumulado $USD</p>
                <p className="text-2xl font-bold text-green-600">
                  ${data?.gasto_total_acumulado?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Costo total acumulado</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 flex-1">
          <CardContent className="p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Pago por Uso $USD</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${data?.gasto_pago_por_uso?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Costo pago por uso</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
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

interface VmBillingProps {
  startDate: Date;
  endDate: Date;
  instanceName: string;
}

const VmBillingComponent = ({ startDate, endDate, instanceName }: VmBillingProps) => {
  const startDateFormatted = startDate.toISOString().split('T')[0] + 'T00:00:00';
  const endDateFormatted = endDate ? endDate.toISOString().split('T')[0] + 'T00:00:00' : '';

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/recursos/vm/facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${instanceName}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (isLoading) return <LoaderComponent />;
  if (error) return <div className="text-red-500 p-4">Error al cargar facturación</div>;

  return <VmBillingChart data={data} title="Facturación Recursos Costo Acumulado Pago por Uso y Costo Acumulado Fijo" />;
};

export const VmBillingChartComponent = ({ startDate, endDate, instanceName }: { startDate: Date; endDate: Date; instanceName: string }) => (
  <VmBillingComponent 
    startDate={startDate} 
    endDate={endDate} 
    instanceName={instanceName}
  />
);

export default VmBillingChartComponent;