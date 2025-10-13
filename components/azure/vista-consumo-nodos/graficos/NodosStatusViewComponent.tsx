'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface NodeStatusData {
  timestamp: { $date: string };
  total: number;
  encendidos: number;
  apagados: number;
}

interface NodeStatusChartProps {
  data: NodeStatusData[] | null;
}

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
    params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} Nodos<br/>`).join('')
  );
};

const NodeStatusChart = ({ data }: NodeStatusChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const safeData = Array.isArray(data) ? data : [];

  const { totalData, encendidosData, apagadosData, yMaxRounded } = useMemo(() => {
    // Ordenar por timestamp
    const sortedData = [...safeData].sort((a, b) => 
      new Date(a.timestamp.$date).getTime() - new Date(b.timestamp.$date).getTime()
    );

    const totalData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date, 
      item.total
    ]);
    
    const encendidosData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date, 
      item.encendidos
    ]);
    
    const apagadosData: [string, number][] = sortedData.map(item => [
      item.timestamp.$date, 
      item.apagados
    ]);

    const maxTotalValue = totalData.length ? Math.max(...totalData.map(item => item[1])) : 0;
    const yMaxRaw = Math.ceil(maxTotalValue * 1.2);
    const yMaxRounded = Math.ceil(yMaxRaw / 10) * 10;

    return { totalData, encendidosData, apagadosData, yMaxRounded };
  }, [safeData]);

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const optionsMetrics: echarts.EChartsOption = {
      animation: totalData.length < 1000,
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
        data: ['Apagados', 'Encendidos', 'Total'],
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
        scale: true,
        axisLabel: {
          fontSize: 11,
          formatter: (val: number) => `${val} Nodos`,
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
        createSeries('Apagados', apagadosData, '#FF6384', 'rgba(255, 99, 132, 0.2)'),
        createSeries('Encendidos', encendidosData, '#28e995', 'rgba(40, 233, 149, 0.2)'),
        createSeries('Total', totalData, '#36A2EB', 'rgba(54, 162, 235, 0.3)'),
      ]
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
  }, [totalData, encendidosData, apagadosData, yMaxRounded, handleResize]);

  const isEmpty = totalData.length === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nodos Encendidos vs Apagados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>. 
            Un nodo se considera apagado cuando CPU y Memoria están en 0.
          </p>
        </div>
        {isEmpty ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        )}
      </CardContent>
    </Card>
  );
};


const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => {
  const len = data.length;
  return {
    name,
    type: 'line',
    data,
    smooth: false,
    symbol: 'none',
    showSymbol: false,
    lineStyle: {
      color,
      width: 2
    },
    itemStyle: {
      color
    },
    emphasis: {
      disabled: len > 1000
    },
    large: true,
    largeThreshold: 500,
    sampling: len > 1000 ? 'lttb' : undefined,
    progressive: len > 2000 ? 200 : undefined,
    progressiveThreshold: len > 2000 ? 300 : undefined,
    ...(areaColor && {
      areaStyle: {
        color: areaColor,
        opacity: 0.3
      }
    })
  };
};

export default NodeStatusChart;