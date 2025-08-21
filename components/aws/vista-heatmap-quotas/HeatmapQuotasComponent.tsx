'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo } from "react"
import * as echarts from "echarts"
import disk from "@/disk.tree.json"

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
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<echarts.ECharts | null>(null)
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';


    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by_quota=true`,
        fetcher
    )
    // console.log(data)


    const groupedData = data ? Object.groupBy(data, ({ sync_time }) => sync_time.$date) : []
    const formattedData = groupedData ? Object.entries(groupedData).map(([key, items]) => {
        console.log(items)
        return {
            "name": key,
            "value": items?.reduce((acc, item) => acc + item.Quota_Usage_Percentage, 0),
            "children": items?.map(i => {
                return {
                    "name": `${i.QuotaName}`,
                    "value": i.Quota_Usage_Percentage,
                }
            })
        }
    }) : []
    const formattedDataTest = data
        ? Object.entries(
            Object.groupBy(data, ({ sync_time }) => sync_time.$date)
        ).map(([date, dateItems]) => {
            const groupedByService = Object.groupBy(dateItems, ({ ServiceName }) => ServiceName);

            const serviceChildren = Object.entries(groupedByService).map(([serviceName, serviceItems]) => {
                const groupedByQuota = Object.groupBy(serviceItems, ({ QuotaName }) => QuotaName);

                const quotaChildren = Object.entries(groupedByQuota).map(([quotaName, quotaItems]) => ({
                    name: quotaName,
                    value: quotaItems.reduce((acc, item) => acc + (item.Quota_Usage_Percentage ?? 0), 0),
                    children: quotaItems.map(i => ({
                        name: i.QuotaName,
                        value: +(i.Quota_Usage_Percentage ?? 0).toFixed(2),
                    })),
                }));

                // Promedio correcto por servicio
                const serviceAverage = quotaChildren.reduce((acc, q) => acc + q.value, 0) / quotaChildren.length;

                return {
                    name: serviceName,
                    value: +serviceAverage.toFixed(2),
                    children: quotaChildren,
                };
            });

            // Promedio del día
            const dateAverage = serviceChildren.reduce((acc, s) => acc + s.value, 0) / serviceChildren.length;

            return {
                name: date,
                value: +dateAverage.toFixed(2),
                children: serviceChildren,
            };
        })
        : [];
    console.log(formattedDataTest)

    useEffect(() => {
        const getLevelOption = () => {
            return [
                {
                    itemStyle: {
                        borderColor: '#999',
                        borderWidth: 2,
                        gapWidth: 2
                    },
                    upperLabel: { show: true, height: 20, color: '#000', fontSize: 14 }
                },
                {
                    itemStyle: { borderColor: '#666', borderWidth: 2, gapWidth: 1 },
                    upperLabel: { show: true, color: '#111', fontSize: 13 },
                    emphasis: { itemStyle: { borderColor: '#ddd' } }
                },
                {
                    colorSaturation: [0.5, 0.7],
                    itemStyle: { borderWidth: 2, gapWidth: 1, borderColorSaturation: 0.6 },
                    upperLabel: { show: true, color: '#333', fontSize: 12 }
                }
            ];
        };

        const options: echarts.EChartsOption = {
            title: { text: 'Heatmap Quotas', left: 'center' },
            tooltip: {
                formatter: function (info) {
                    const value = info.value as number;
                    const treePathInfo = info.treePathInfo;
                    const treePath = treePathInfo.slice(1).map(v => v.name).join(' / ');
                    return `<div style="font-weight:bold">${treePath}</div>Valor: ${value.toFixed(2)} %`;
                }
            },
            series: [
                {
                    type: 'treemap',
                    label: { show: true, formatter: '{b}\n{c} %', fontSize: 12 },
                    upperLabel: { show: true, height: 20 },
                    levels: getLevelOption(),
                    data: formattedData
                }
            ],
            animation: true,
        };

        if (!chartRef.current) return

        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption(options);
        }

        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);



        return () => {
            window.removeEventListener('resize', handleResize);
            // resizeObserver.disconnect(); // Disconnect ResizeObserver
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
                className='w-[50vw] h-[60vh]'
            />
        </div>
    )
}