'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
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

interface RdsResourceViewIopsComponentProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsResourceViewIopsComponent = ({
    data,
    title = "Operaciones Lectura/Escritura (IOPS/seg)",
    height = "350px"
}: RdsResourceViewIopsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { writeOpsSeries, readOpsSeries } = useMemo(() => {
        const writeOpsData = data?.filter(item => item.MetricLabel === 'Escrituras por Segundo (Promedio)') || [];
        writeOpsData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

        const readOpsData = data?.filter(item => item.MetricLabel === 'Lecturas por Segundo (Promedio)') || [];
        readOpsData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

        const writeOpsSeries: [string, number][] = writeOpsData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
        const readOpsSeries: [string, number][] = readOpsData.map(item => [item.Timestamp, item.Value.toFixed(2)]);


        return { writeOpsSeries, readOpsSeries };
    }, [data]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Lecturas OPS', 'Escrituras OPS'],
            unitLabel: 'IOPS',
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
                    name: 'Lecturas OPS',
                    data: readOpsSeries,
                    smooth: true,
                    extra: {
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: readOpsSeries.length > 2000 ? 10 : 25,
                            label: {
                                show: false,
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} IOPS`;
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
                                            return `Max \n${params.data.coord[1]} IOPS`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} IOPS`;
                                        }
                                    }
                                },
                                {
                                    coord: readOpsSeries.length ? [readOpsSeries[readOpsSeries.length - 1][0], readOpsSeries[readOpsSeries.length - 1][1]] : null,
                                    name: 'Último',
                                    value: readOpsSeries.length ? readOpsSeries[readOpsSeries.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} IOPS`;
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    kind: 'line',
                    name: 'Escrituras OPS',
                    data: writeOpsSeries,
                    smooth: true,
                    extra: {
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: writeOpsSeries.length > 2000 ? 10 : 25,
                            label: {
                                show: false,
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} IOPS`;
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
                                            return `Max \n${params.data.coord[1]} IOPS`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} IOPS`;
                                        }
                                    }
                                },
                                {
                                    coord: writeOpsSeries.length ? [writeOpsSeries[writeOpsSeries.length - 1][0], writeOpsSeries[writeOpsSeries.length - 1][1]] : null,
                                    name: 'Último',
                                    value: writeOpsSeries.length ? writeOpsSeries[writeOpsSeries.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} IOPS`;
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
                    valueFormatter(value, dataIndex) {
                        return `${value} IOPS`
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
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg border-2 border-dashed border-indigo-300">
                <div className="text-center">
                    <div className="text-indigo-400 text-3xl mb-3">⚡</div>
                    <p className="text-indigo-600 font-medium">No hay datos de IOPS disponibles</p>
                    <p className="text-indigo-500 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
                </div>
            </div>
        );
    }

    // Verificar si existen las métricas de IOPS específicas
    const allowedMetrics = [
        "Lecturas por Segundo (Promedio)",
        "Escrituras por Segundo (Promedio)"
    ];

    const hasValidMetrics = data.some(item =>
        allowedMetrics.includes(item.MetricLabel)
    );

    if (!hasValidMetrics) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-5">
                    {/* <div className="text-yellow-400 text-lg mb-2">¡Ups!</div> */}
                    <MessageCircleWarning className='h-5 w-5 text-yellow-500' />
                    <p className="text-gray-500 font-medium">Métricas de Operaciones de lectura y escritura no disponibles</p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};