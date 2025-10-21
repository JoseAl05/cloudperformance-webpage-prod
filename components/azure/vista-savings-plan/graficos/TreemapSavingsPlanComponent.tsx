'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useCallback, useMemo } from "react"
import * as echarts from "echarts"

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" role="status" aria-label="Cargando datos" />
  </div>
)

interface TreemapSavingsPlanProps {
  startDate: Date
  endDate: Date
}

interface TooltipData {
  instance_name: string
  meter_category: string
  total_horas_sp: number
  total_horas_ondemand: number
  total_horas: number
  costo_hipotetico_sp: number
  costo_ondemand: number
  costo_total: number
  porcentaje_cobertura: number
  dias_con_datos: number
}

interface FormattedInstance {
  name: string
  value: number
  tooltipData: TooltipData
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// Funciones puras para transformación de datos
const formatTooltip = (info: TooltipData): string => {
  const formatCurrency = (val: number) => `$${val.toFixed(2)}`
  const formatHours = (val: number) => `${val.toFixed(2)}h`

  return `
    <div style="font-weight:bold;margin-bottom:8px;font-size:14px">${info.instance_name}</div>
    <div style="color:#666;margin-bottom:6px">${info.meter_category}</div>
    <hr style="margin:6px 0;border:none;border-top:1px solid #ddd"/>
    <div><b>💰 Costo Exceso On-Demand:</b> ${formatCurrency(info.costo_ondemand)}</div>
    <div><b>Costo Savings Plan:</b> ${formatCurrency(info.costo_hipotetico_sp)}</div>
    <div><b>Costo Total:</b> ${formatCurrency(info.costo_total)}</div>
    <hr style="margin:6px 0;border:none;border-top:1px solid #ddd"/>
    <div><b>⏱️ Horas On-Demand:</b> ${formatHours(info.total_horas_ondemand)}</div>
    <div><b>Horas Savings Plan:</b> ${formatHours(info.total_horas_sp)}</div>
    <div><b>Total Horas:</b> ${formatHours(info.total_horas)}</div>
    <hr style="margin:6px 0;border:none;border-top:1px solid #ddd"/>
    <div><b>📊 Cobertura SP:</b> ${info.porcentaje_cobertura.toFixed(2)}%</div>
    <div><b>📅 Días con datos:</b> ${info.dias_con_datos}</div>
  `
}

const transformData = (data: unknown): FormattedInstance[] => {
  if (!data?.instancias || !Array.isArray(data.instancias)) return []

  return data.instancias
    .filter((instancia: unknown) => instancia.totales.costo_real_ondemand > 0)
    .map((instancia: unknown) => ({
      name: instancia.instance_name,
      value: instancia.totales.costo_real_ondemand,
      tooltipData: {
        instance_name: instancia.instance_name,
        meter_category: instancia.meter_category,
        total_horas_sp: instancia.totales.total_horas_savings_plan,
        total_horas_ondemand: instancia.totales.total_horas_ondemand,
        total_horas: instancia.totales.total_horas,
        costo_hipotetico_sp: instancia.totales.costo_hipotetico_payg_savings_plan,
        costo_ondemand: instancia.totales.costo_real_ondemand,
        costo_total: instancia.totales.costo_total_hipotetico,
        porcentaje_cobertura: instancia.totales.porcentaje_cobertura_sp,
        dias_con_datos: instancia.totales.dias_con_datos
      }
    }))
    .sort((a: FormattedInstance, b: FormattedInstance) => b.value - a.value)
}

const getChartOptions = (formattedData: FormattedInstance[]): echarts.EChartsOption => ({
  title: {
    text: 'Exceso de Consumo On-Demand por Instancia',
    subtext: 'Costo que excede la cobertura del Savings Plan',
    left: 'center',
    textStyle: { fontSize: 18, fontWeight: 'bold' },
    subtextStyle: { fontSize: 12, color: '#666' },
    top: 1
  },
  tooltip: {
    formatter: (params: unknown) => {
      if (!params.data?.tooltipData) return ''
      return formatTooltip(params.data.tooltipData)
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    textStyle: { color: '#333' }
  },
  series: [
    {
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      visibleMin: 0.0001,
      itemStyle: {
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
        gapWidth: 3,
        opacity: 1
      },
      label: {
        show: true,
        formatter: '{name|{b}}\n{value|${c}}',
        rich: {
          name: {
            fontSize: 13,
            fontWeight: 'bold',
            color: '#fff',
            width: 140,
            overflow: 'truncate',
            lineHeight: 18
          },
          value: {
            fontSize: 15,
            fontWeight: 'bold',
            color: '#fff',
            lineHeight: 22
          }
        },
        padding: 8
      },
      emphasis: {
        itemStyle: {
          borderWidth: 3,
          borderColor: '#0078d4',
          shadowBlur: 15,
          shadowColor: 'rgba(0,0,0,0.4)'
        }
      },
      levels: [
        { itemStyle: { borderWidth: 0, gapWidth: 3 } },
        { itemStyle: { borderWidth: 2, borderColor: '#fff', gapWidth: 2 } }
      ],
      data: formattedData
    }
  ]
})

export const TreemapSavingsPlanComponent = ({ startDate, endDate }: TreemapSavingsPlanProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.EChartsType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Memoizar URLs para evitar cambios innecesarios
  const url = useMemo(() => {
    const start = startDate.toISOString().split('.')[0]
    const end = endDate?.toISOString().split('.')[0] ?? ''
    return `/api/azure/bridge/azure/saving-plan/instancias_consumo_diario?date_from=${start}&date_to=${end}`
  }, [startDate, endDate])

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 300000
  })

  // Memoizar datos transformados
  const formattedData = useMemo(() => transformData(data), [data])

  // Memoizar opciones del gráfico
  const chartOptions = useMemo(() => getChartOptions(formattedData), [formattedData])

  const handleResize = useCallback(() => {
    chartInstance.current?.resize()
  }, [])

  // Usar requestAnimationFrame para resize más eficiente
  const debouncedResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        handleResize()
      }, 250)
    }
  }, [handleResize])

  useEffect(() => {
    if (!formattedData.length) return

    if (!chartRef.current) return

    // Inicializar o reutilizar instancia
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, null, {
        useDirtyRect: true, // Optimización de rendimiento
        useCoarsePointer: true
      })
    }

    chartInstance.current.setOption(chartOptions, {
      notMerge: true,
      lazyUpdate: false
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }
  }, [chartOptions, formattedData.length])

  useEffect(() => {
    const chartEl = chartRef.current
    if (!chartEl || !chartInstance.current) return

    const debouncedHandler = debouncedResize()

    // ResizeObserver con mejor rendimiento
    const resizeObserver = new ResizeObserver(() => {
      debouncedHandler()
    })

    resizeObserver.observe(chartEl)
    window.addEventListener('resize', debouncedHandler, { passive: true })

    return () => {
      window.removeEventListener('resize', debouncedHandler)
      resizeObserver.disconnect()
    }
  }, [debouncedResize])

  if (isLoading) return <LoaderComponent />
  if (error) return (
    <div className="text-red-500 p-4" role="alert">
      Error al cargar datos de Azure: {error.message}
    </div>
  )
  if (!formattedData.length) {
    return <div className="p-4 text-gray-600">No hay datos disponibles</div>
  }

  return (
    <div className="w-full h-full bg-gray-50">
      <div 
        ref={chartRef} 
        className="w-full h-full min-h-[500px]"
        role="img"
        aria-label="Treemap de exceso de consumo on-demand por instancia"
      />
    </div>
  )
}