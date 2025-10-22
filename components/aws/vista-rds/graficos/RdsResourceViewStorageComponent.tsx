'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { bytesToGB } from '@/lib/bytesToMbs';
import { MessageCircleWarning } from 'lucide-react';

interface MetricPoint {
    sync_time: { $date: string };
    Resource: string;
    Timestamp: string;
    Value: number;
    total?: number;
    unused?: number;
    used?: number;
    MetricId: string;
    MetricLabel: string;
}

interface RdsResourceViewStorageComponentProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsResourceViewStorageComponent = ({
    data,
    title = "Storage Disponible",
    height = "350px"
}: RdsResourceViewStorageComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { storageAvailableSeries } = useMemo(() => {
        const storageAvailableData = data?.filter(item => item.MetricLabel === 'Espacio de Almacenamiento Libre (Promedio)') || [];
        storageAvailableData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

        const storageAvailableSeries: [string, string][] = storageAvailableData.map(item => [item.Timestamp, bytesToGB(item.Value)]);

        return { storageAvailableSeries };
    }, [data]);


    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Almacenamiento Disponible'],
            unitLabel: 'GB',
            useUTC: true,
            showToolbox: true,
            metricType: 'count',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Almacenamiento Disponible',
                    data: storageAvailableSeries,
                    smooth: true,
                    extra: {
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: storageAvailableSeries.length > 2000 ? 10 : 25,
                            label: {
                                show: false,
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} GB`;
                                    }
                                    return `${param.name}: ${param.value}`;
                                }
                            },
                            data: [
                                {
                                    type: 'max',
                                    name: 'Max',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Max \n${params.data.coord[1]} GB`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} GB`;
                                        }
                                    }
                                },
                                {
                                    coord: storageAvailableSeries.length ? [storageAvailableSeries[storageAvailableSeries.length - 1][0], storageAvailableSeries[storageAvailableSeries.length - 1][1]] : null,
                                    name: 'Último',
                                    value: storageAvailableSeries.length ? storageAvailableSeries[storageAvailableSeries.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} GB`;
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
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

        return deepMerge(base, lines);
    }, [data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg border-2 border-dashed border-purple-300">
                <div className="text-center">
                    <div className="text-purple-400 text-3xl mb-3">💾</div>
                    <p className="text-purple-600 font-medium">No hay datos de almacenamiento disponibles</p>
                    <p className="text-purple-500 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
                </div>
            </div>
        );
    }

    // Verificar si existen datos de storage
    const storageData = data.filter(item =>
        item.MetricLabel === "Espacio de Almacenamiento Libre (Promedio)"
    );

    if (storageData.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-5">
                    {/* <div className="text-yellow-400 text-lg mb-2">¡Ups!</div> */}
                    <MessageCircleWarning className='h-5 w-5 text-yellow-500' />
                    <p className="text-gray-500 font-medium">Métricas de Almacenamiento no disponibles</p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};