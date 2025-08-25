'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo, useCallback } from "react"
import * as echarts from "echarts"

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

interface HeatmapQuotasComponentProps {
    startDate: Date,
    endDate: Date | null
}

export const HeatmapQuotasComponent = ({ startDate, endDate }: HeatmapQuotasComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';


    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by_quota=true`,
        fetcher
    )
    const formattedData = data ? data.map(d => {
        return {
            "name": new Date(d.sync_time.$date).toLocaleDateString(),
            "value": d.services.length,
            "children": d.services.map(service => {
                return {
                    "name": service.ServiceName,
                    "value": service.Quotas.length,
                    "children": service.Quotas.map(quota => {
                        return {
                            "name": quota.QuotaName,
                            "value": quota.Quota_Usage_Percentage ? quota.Quota_Usage_Percentage : 0
                        }
                    })
                }
            })
        }
    }) : []
    const handleResize = useCallback(() => {
        if (chartInstance.current) {
            chartInstance.current.resize();
        }
    }, []);

    useEffect(() => {
        const getLevelOption = () => {
            return [
                {
                    itemStyle: {
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2
                    },
                    upperLabel: {
                        show: true,
                        position: 'inside',
                        height: 20,
                        color: '#ffffff',
                        fontSize: 20,
                        backgroundColor: '#2b00ff',
                        borderRadius: 3
                    }
                },
                {
                    itemStyle: {
                        borderColor: '#666',
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2
                    },
                    upperLabel: {
                        show: true,
                        position: 'inside',
                        height: 20,
                        color: '#ffffff',
                        fontSize: 16,
                        backgroundColor: '#12006e',
                        borderRadius: 3
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: '#ddd',
                            borderRadius: 5
                        }
                    }
                },
                {
                    colorSaturation: [0.5, 0.7],
                    itemStyle: {
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2,
                        borderColorSaturation: 0.6
                    },
                    upperLabel: {
                        show: true,
                        color: '#333333',
                        fontSize: 12
                    }
                }
            ];
        };

        const options: echarts.EChartsOption = {
            title: { text: 'Heatmap Quotas', left: 'center' },
            tooltip: {
                formatter: function (params) {
                    const value = params.value as number;
                    const treePathInfo = params.treePathInfo;
                    const level = treePathInfo.length; // 2=fecha, 3=service, 4=quota
                    const treePath = treePathInfo.slice(1).map(v => v.name).join(' / ');
                    let unit = '';
                    if (level == 2) {
                        unit = ' Servicios';
                    } else if (level === 3) {
                        unit = ' Quotas';
                    } else if (level === 4) {
                        unit = ' %';
                    }
                    return `
                        <div style="font-weight:bold">${treePath}</div>
                        Valor: ${value.toFixed(2)}${unit}
                    `;
                }
            },
            series: [
                {
                    type: 'treemap',
                    visibleMin: 0,
                    itemStyle: {
                        borderRadius: 5,
                        borderWidth: 0.5,
                        gapWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            const name = params.data.name;
                            const value = params.data.value as number;
                            let unit = '';
                            const level = params.treePathInfo.length;
                            if (level == 2) {
                                unit = ' Servicios';
                            } else if (level === 3) {
                                unit = ' Quotas';
                            } else if (level === 4) {
                                unit = ' %';
                            }

                            return `${name}\n${value.toFixed(2)}${unit}`;
                        },
                        fontSize: 12
                    },
                    upperLabel: {
                        show: true,
                        height: 20,
                        formatter: function (params) {
                            if (params.name === "") {
                                return "Quotas"
                            }
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            borderRadius: 5,
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)'
                        }
                    },
                    levels: getLevelOption(),
                    data: formattedData
                }
            ],
            animation: true,
        };

        if (!chartRef.current) return

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption(options);
        }

        window.addEventListener('resize', handleResize);



        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };
    }, [data])

    console.log(`START DATE: ${startDate.toISOString().replace('Z', '').slice(0, -4)}`);
    console.log(`END DATE: ${endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''}`);

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>
    return (
        <div>
            <h1>Heatmap</h1>
            <div
                ref={chartRef}
                className='w-full h-[100vh]'
            />
        </div>
    )
}