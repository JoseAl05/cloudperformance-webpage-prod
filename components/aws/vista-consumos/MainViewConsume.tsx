'use client'

import useSWR from 'swr'
import React, { useEffect, useRef, useMemo } from "react"
import * as echarts from "echarts"

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiQ0wxIiwiZGJfbmFtZSI6IlVDX0NocmlzdHVzX0Nsb3VkX1BlcmZvcm1hbmNlX0FXUyJ9.NhG1nE-ROnhAkvDuoNhbrPyhe4pbuIi6HUFcyyD7ePg",
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const MainViewConsume = () => {
    const chartRef = useRef<HTMLDivElement>(null)   // ← Aquí defines chartRef
    const chartInstance = useRef<echarts.ECharts | null>(null)
    const { data, error, isLoading } = useSWR(
        "http://20.81.178.168:8070/api/db/consumo_rds_sqlserver/cpu_usage?date_from=2025-06-01T00:00:00&date_to=2025-08-07T00:00:00&region=all_regions",
        fetcher
    )

    const chartData = useMemo(() => {
        if (!data) return []
        return data.map(d => ({
            ...d,
            timestamp: new Date(d.timestamp),
        }))
    }, [data])

    useEffect(() => {
        const options: echarts.EChartsOption = {
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "time",
                boundaryGap: false,
            },
            yAxis: {
                type: "value",
            },
            legend: {
                data: ["total", "used", "unused"],
            },
            series: [
                {
                    name: "total",
                    type: "line",
                    data: chartData.map(d => [d.timestamp, d.total_cpu]),
                },
                {
                    name: "used",
                    type: "line",
                    data: chartData.map(d => [d.timestamp, d.used_cpu]),
                },
                {
                    name: "unused",
                    type: "line",
                    data: chartData.map(d => [d.timestamp, d.unused_cpu]),
                },
            ],
        }
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
    }, [chartData])

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>
    if (!chartData.length) return <div>No hay datos</div>



    return (
        <div>
            <h2>Gráfico de métricas</h2>
            <div
                ref={chartRef}
                id="consume-sqlserver-chart-cpu"
                className='w-full h-[60vh]'
            />
        </div>
    )
}
