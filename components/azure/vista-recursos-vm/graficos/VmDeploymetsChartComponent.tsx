'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import useSWR from 'swr';

interface DeploymentData {
  deployment_count: number;
  event_timestamp: string;
}

interface VmDeploymentsChartProps {
  data: DeploymentData[] | null;
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
  const date = new Date(params[0].value[0]).toUTCString();
  return (
    `${date}<br/>` +
    params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} deployments<br/>`).join('')
  );
};

const VmDeploymentsChart = ({ data, title }: VmDeploymentsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { deploymentsData, yMaxRounded } = useMemo(() => {
    const sortedData = [...safeData].sort((a, b) => 
      new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
    );

    const deploymentsData: [string, number][] = sortedData.map(item => [
      item.event_timestamp,
      item.deployment_count
    ]);

    const maxValue = deploymentsData.length ? Math.max(...deploymentsData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxValue * 1.5);
    const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

    return { deploymentsData, yMaxRounded };
  }, [safeData]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const optionsMetrics: echarts.EChartsOption = {
      animation: deploymentsData.length < 1000,
      animationDuration: 300,
      animationEasing: 'linear',
      progressiveThreshold: 500,
      progressive: 200,
      hoverLayerThreshold: 3000,
      useUTC: true,
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
        data: ['Deployments'],
        top: 10,
        left: 'center',
        animation: false,
        textStyle: {
          fontSize: 12
        }
      },
      grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
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
            return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
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
        minInterval: 1,
        axisLabel: {
          fontSize: 11,
          formatter: (val: number) => `${Math.floor(val)}`,
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
        createSeries('Deployments', deploymentsData, '#36A2EB', 'rgba(54, 162, 235, 0.3)')
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
  }, [deploymentsData, yMaxRounded, handleResize]);

  const isEmpty = deploymentsData.length === 0;

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
        {isEmpty ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No hay deployments disponibles en el rango de fecha seleccionado.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};

const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
  name,
  type: 'line',
  data,
  smooth: false,
  smoothMonotone: null,
  symbol: 'circle',
  symbolSize: 0.5,
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
  sampling: data.length > 2000 ? 'lttb' : null,
  progressive: data.length > 1000 ? 0 : undefined,
  progressiveThreshold: data.length > 1000 ? 500 : undefined,
  progressiveChunkMode: data.length > 5000 ? 'mod' : undefined,
  ...(areaColor && {
    areaStyle: {
      color: areaColor,
      opacity: 0.4
    }
  })
});

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());

interface VmMetricProps {
  startDate: Date;
  endDate: Date;
  vmName: string;
}

const VmDeploymentsComponent = ({ startDate, endDate, vmName }: VmMetricProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/recursos/vm/deployments-por-fecha?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_name=${vmName}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (isLoading) return <LoaderComponent />;
  if (error) return <div className="text-red-500 p-4">Error al cargar métricas</div>;

  return <VmDeploymentsChart data={data} title="Historial de Deployments" />;
};

export const VmDeploymentsChartComponent = ({ startDate, endDate, vmName }: { startDate: Date; endDate: Date; vmName: string }) => (
  <VmDeploymentsComponent 
    startDate={startDate} 
    endDate={endDate} 
    vmName={vmName}
  />
);

export default VmDeploymentsChartComponent;