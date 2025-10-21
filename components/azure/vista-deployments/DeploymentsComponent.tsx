'use client'

import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { TrendingUp, Activity, Download, Calendar } from 'lucide-react';
import {DeploymentsDetailsTableComponent} from './table/DeploymentsTableComponent';

interface DeploymentsChartProps {
    startDate: Date;
    endDate: Date;
    selectedOperation: string;
}

interface DeploymentData {
    date: string;
    unique_deployments: number;
}

const LoaderComponent = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

const toUTCDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export default function DeploymentsChartComponent({ startDate, endDate, selectedOperation }: DeploymentsChartProps) {
    const [data, setData] = useState<DeploymentData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    const apiUrl = `/api/azure/bridge/azure/deployments/deployments?date_from=${startDateFormatted}&date_to=${endDateFormatted}&operation_name=${selectedOperation}`;

    useEffect(() => {
        setIsLoading(true);
        fetcher(apiUrl)
            .then((result) => {
                setData(result);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiUrl]);

    const calculateMetrics = (rawData: DeploymentData[]) => {
        if (!rawData?.length) return { total: 0, average: 0, max: 0, days: 0 };
        
        const total = rawData.reduce((sum, item) => sum + item.unique_deployments, 0);
        const max = Math.max(...rawData.map(item => item.unique_deployments));
        const average = total / rawData.length;
        const days = rawData.length;

        return { total, average, max, days };
    };

    const exportChart = () => {
        if (!chartInstance.current) return;
        const url = chartInstance.current.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
        const link = document.createElement('a');
        link.download = `deployments-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
    };

    const formatDatesAdaptive = (dates: string[]) => {
        if (!Array.isArray(dates) || !dates.length) return [];

        const dateCount = dates.length;
        const start = toUTCDate(dates[0]);
        const end = toUTCDate(dates[dateCount - 1]);
        const daysDiff = Math.floor((+end - +start) / 86_400_000) + 1;

        const bigStep = Math.max(1, Math.ceil(dateCount / 12));
        const midStep = Math.max(1, Math.ceil(dateCount / 20));

        return dates.map((s, i) => {
            const d = toUTCDate(s);
            if (daysDiff > 365) return i === 0 || i === dateCount - 1 || i % bigStep === 0 ? fmt.format(d) : '';
            if (daysDiff > 30) return i % midStep === 0 ? fmt.format(d) : '';
            return fmt.format(d);
        });
    };

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
        const dates = sortedData.map(item => item.date);
        const values = sortedData.map(item => item.unique_deployments);

        if (chartInstance.current) chartInstance.current.dispose();
        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

        const formattedDates = formatDatesAdaptive(dates);

        const option: echarts.EChartsOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: { 
                    type: 'cross',
                    crossStyle: { color: '#999' }
                },
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: { fontSize: 12, color: '#111' },
                extraCssText: 'box-shadow:0 4px 12px rgba(0,0,0,.08); border-radius:10px; padding:10px 12px;',
                formatter: (params: unknown) => {
                    const param = Array.isArray(params) ? params[0] : params;
                    const originalDate = toUTCDate(dates[param.dataIndex]);
                    const dateStr = fmt.format(originalDate);
                    const value = param.value;
                    
                    return `
                        <div style="font-weight:600;margin-bottom:6px">${dateStr}</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            ${param.marker}
                            <span>Deployments: <strong>${value}</strong></span>
                        </div>
                    `;
                },
            },
            grid: { 
                left: 70, 
                right: 50, 
                top: 60, 
                bottom: 80, 
                containLabel: true 
            },
            dataZoom: [
                { type: 'inside', start: 0, end: 100 },
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 20,
                    handleStyle: { color: '#10b981' },
                    dataBackground: { 
                        areaStyle: { color: 'rgba(16, 185, 129, 0.3)' }, 
                        lineStyle: { opacity: 0.8, color: '#10b981' } 
                    },
                },
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: formattedDates,
                axisLine: { lineStyle: { color: '#d0d0d0' } },
                axisTick: { show: false },
                axisLabel: { 
                    fontSize: 10, 
                    color: '#666', 
                    rotate: 45, 
                    margin: 8 
                },
                splitLine: { 
                    show: true, 
                    lineStyle: { color: '#f5f5f5', type: 'dashed' } 
                },
            },
            yAxis: {
                type: 'value',
                name: 'Deployments',
                nameTextStyle: { 
                    color: '#666', 
                    fontSize: 12, 
                    padding: [0, 0, 10, 0] 
                },
                nameGap: 25,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: (value: number) => value.toString(),
                    color: '#666',
                    fontSize: 10,
                },
                splitLine: { 
                    lineStyle: { color: '#f5f5f5', type: 'dashed' } 
                },
                minInterval: 1,
            },
            series: [
                {
                    name: 'Deployments',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: {
                        color: '#10b981',
                        width: 3,
                    },
                    itemStyle: {
                        color: '#10b981',
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                        ])
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            color: '#059669',
                            borderColor: '#fff',
                            borderWidth: 3,
                            shadowBlur: 10,
                            shadowColor: 'rgba(16, 185, 129, 0.5)'
                        }
                    },
                    data: values,
                }
            ],
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
        };

        chart.setOption(option);

        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        resizeObserverRef.current = new ResizeObserver(() => {
            if (chart && !chart.isDisposed()) setTimeout(() => chart.resize(), 100);
        });
        resizeObserverRef.current.observe(chartRef.current!);

        return () => {
            if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, [data]);

    if (isLoading) return <LoaderComponent />;

    if (error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de deployments</p>
            </div>
        );

    if (!data || !Array.isArray(data) || !data.length)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron deployments para el período seleccionado</p>
            </div>
        );

    const metrics = calculateMetrics(data);

    return (
        <div className="w-full min-w-0 px-4 py-6">
            {/* <div className="flex justify-end mb-4 mt-6">
                <button
                    onClick={exportChart}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Exportar
                </button>
            </div> */}

            <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <h2 className="text-xl font-semibold">Evolución de Deployments</h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Gráfico de línea que muestra la cantidad de deployments únicos por fecha
                    </p>
                </div>

                <div className="p-6">
                    <div ref={chartRef} className="w-full" style={{ height: '500px', minHeight: '500px' }} />
                </div>
            </div>


             {/* Tabla de detalles de deployments */}
            <div className="mt-8">
                <DeploymentsDetailsTableComponent 
                    startDateFormatted={startDateFormatted}
                    endDateFormatted={endDateFormatted}
                    selectedOperation={selectedOperation}
                />
            </div>
        </div>
    );
}