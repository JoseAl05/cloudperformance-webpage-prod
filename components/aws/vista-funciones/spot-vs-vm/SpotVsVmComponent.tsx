'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from "@/components/ui/card"
import { Server, Cloud, Percent, BarChart3 } from "lucide-react"
import { TableComponentSpotVsVm } from "@/components/aws/vista-funciones/spot-vs-vm/table/SpotVsVmTableComponent"

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface SpotVsVmProps {
  startDate: Date,
  endDate: Date
}

export const MainViewSpotVsVm = ({ startDate, endDate }: SpotVsVmProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const { data, error, isLoading } = useSWR(
    `/api/bridge/vm/spot_vs_vm?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=all_regions`,
    fetcher
  )

    // 📌 Calcular métricas finales
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalVMs: null, totalSpot: null, spotPercentage: null }
    }

    const last = data[data.length - 1] // último registro
    const totalVMs = last.total_instancias || 0
    const totalSpot = last.total_spot || 0
    const spotPercentage = totalVMs > 0 ? ((totalSpot / totalVMs) * 100).toFixed(2) : null

    return { totalVMs, totalSpot, spotPercentage }
  }, [data])

  useEffect(() => {
    if (!chartRef.current || !data) return

    const times = data.map((item: unknown) => item.sync_time)
    const totalInstancias = data.map((item: unknown) => item.total_instancias)
    const totalSpot = data.map((item: unknown) => item.total_spot)

    const options: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Total Instancias EC2', 'Total Instancias Spot'],
        top: 10,
        left: 'center'
      },
      grid: {
        left: 50,
        right: 30,
        top: 60,
        bottom: 60,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: times.map((t: string) => {
            const d = new Date(t)
            // Solo día/mes (si prefieres dd/mm/yyyy agrega también d.getUTCFullYear())
            return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`
        }),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: 'Instancias'
      },
      series: [
        {
          name: 'Total Instancias EC2',
          type: 'line',
          smooth: true,
          data: totalInstancias,
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Total Instancias Spot',
          type: 'line',
          smooth: true,
          data: totalSpot,
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    }

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }
    chartInstance.current.setOption(options)

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    resizeObserverRef.current = new ResizeObserver(handleResize)
    resizeObserverRef.current.observe(chartRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data])

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error al cargar datos</p>

     return (
    <div className="space-y-6 p-4">
      {/* 📌 Tarjetas métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total VMs */}
        <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cantidad Total VMs
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {metrics.totalVMs !== null ? metrics.totalVMs : '(En blanco)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Última captura registrada
                </p>
              </div>
              <Server className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Spot VMs */}
        <Card className="border-l-4 border-l-orange-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cantidad Total Spot VMs
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.totalSpot !== null ? metrics.totalSpot : '(En blanco)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Última captura registrada
                </p>
              </div>
              <Cloud className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* % Spot */}
        <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Porcentaje de Spot VMs
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.spotPercentage !== null ? `${metrics.spotPercentage}%` : '(En blanco)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Relación Spot vs Total
                </p>
              </div>
              <Percent className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📊 Gráfico*/}
        <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">SPOT Virtual vs Máquinas Virtuales</h2>
            <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
        </CardContent>
        </Card>


        {/* === Tabla === */}
        <TableComponentSpotVsVm
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
        />
    </div>

  )
}
