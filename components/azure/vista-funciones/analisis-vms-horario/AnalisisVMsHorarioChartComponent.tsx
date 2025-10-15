'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo, useState } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from '@/components/ui/card'
import { Clock, TrendingDown, AlertTriangle, FileSpreadsheet, X } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableDetalleHorarioComponent } from './table/TableDetalleHorarioComponent'

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface AnalisisVMsHorarioChartProps {
  startDate: Date
  endDate: Date
  selectedMetric?: string
}

export const AnalisisVMsHorarioChartComponent = ({ 
  startDate, 
  endDate,
  selectedMetric
}: AnalisisVMsHorarioChartProps) => {

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [selectedVM, setSelectedVM] = useState<string | null>(null)

  const startDateFormatted = startDate?.toISOString().replace('Z', '').slice(0, -4) || ''
  const endDateFormatted = endDate?.toISOString().replace('Z', '').slice(0, -4) || ''

  const apiUrl = !startDate || !endDate || !selectedMetric
    ? null
    : `/api/azure/bridge/azure/analisis-vms-horario?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_name=${encodeURIComponent(selectedMetric)}`

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { datosHabil, datosNoHabil, tarjetas, unidad } = useMemo(() => {
    if (!data || !data.datos) {
      return { datosHabil: [], datosNoHabil: [], tarjetas: null, unidad: '' }
    }

    // Filtrar por VM si hay una seleccionada
    const datosFiltrados = selectedVM
      ? data.datos.filter((d: unknown) => d.vm_name === selectedVM)
      : data.datos


    const habil = datosFiltrados.filter((d: unknown) => d.Tipo_Horario === "Horario Hábil" || d.Tipo_Horario === "Horario HÃ¡bil")
    const noHabil = datosFiltrados.filter((d: unknown) => d.Tipo_Horario === "Horario No Hábil" || d.Tipo_Horario === "Horario No HÃ¡bil")

    // Extraer unidad del primer valor de las tarjetas originales
    const primeraMetrica = data.tarjetas?.Promedio_Recurso_Utilizado_Habil || ''
    const match = primeraMetrica.match(/\((.*?)\)/)
    const unidadExtraida = match ? match[1] : ''

    // Recalcular tarjetas si hay VM seleccionada
    let tarjetasCalculadas = data.tarjetas
    
    if (selectedVM) {
      // Calcular promedios para la VM seleccionada
      const recursoUtilizadoHabil = habil.filter(d => d.used > 0)
      const recursoUtilizadoNoHabil = noHabil.filter(d => d.used > 0)
      const recursoNoUtilizadoHabil = habil.filter(d => d.used === 0)
      const recursoNoUtilizadoNoHabil = noHabil.filter(d => d.used === 0)

      const promedioUtilizadoHabil = recursoUtilizadoHabil.length > 0
        ? recursoUtilizadoHabil.reduce((sum, d) => sum + d.used, 0) / recursoUtilizadoHabil.length
        : 0

      const promedioUtilizadoNoHabil = recursoUtilizadoNoHabil.length > 0
        ? recursoUtilizadoNoHabil.reduce((sum, d) => sum + d.used, 0) / recursoUtilizadoNoHabil.length
        : 0

      const promedioNoUtilizadoHabil = recursoNoUtilizadoHabil.length > 0
        ? recursoNoUtilizadoHabil.reduce((sum, d) => sum + d.used, 0) / recursoNoUtilizadoHabil.length
        : 0

      const promedioNoUtilizadoNoHabil = recursoNoUtilizadoNoHabil.length > 0
        ? recursoNoUtilizadoNoHabil.reduce((sum, d) => sum + d.used, 0) / recursoNoUtilizadoNoHabil.length
        : 0

      tarjetasCalculadas = {
        Promedio_Recurso_Utilizado_Habil: `${promedioUtilizadoHabil.toFixed(2)} (${unidadExtraida})`,
        Promedio_Recurso_Utilizado_No_Habil: `${promedioUtilizadoNoHabil.toFixed(2)} (${unidadExtraida})`,
        Promedio_Recursos_No_Utilizados_Habil: `${promedioNoUtilizadoHabil.toFixed(2)} (${unidadExtraida})`,
        Promedio_Recursos_No_Utilizados_No_Habil: `${promedioNoUtilizadoNoHabil.toFixed(2)} (${unidadExtraida})`
      }
    }

    return {
      datosHabil: habil,
      datosNoHabil: noHabil,
      tarjetas: tarjetasCalculadas,
      unidad: unidadExtraida
    }
  }, [data, selectedVM])

  const handleSelectVM = (vmName: string) => {
    if (selectedVM === vmName) {
      setSelectedVM(null) // Si ya está seleccionada, deseleccionar
    } else {
      setSelectedVM(vmName)
    }
  }

  const handleClearSelection = () => {
    setSelectedVM(null)
  }

  useEffect(() => {
    if (!chartRef.current || (datosHabil.length === 0 && datosNoHabil.length === 0)) return

    const prepararDatos = (datos: unknown[]) => {
      // Agrupar por día y tomar el promedio, guardando también la hora
      const porDia = new Map()
      
      datos.forEach(item => {
        const fecha = item.Fecha // Ya está en formato DD/MM/YYYY
        const [dia, mes, anio] = fecha.split('/')
        const fechaKey = `${anio}-${mes}-${dia}`
        
        if (!porDia.has(fechaKey)) {
          porDia.set(fechaKey, { suma: 0, count: 0, hora: item.Hora || '10:00:00' })
        }
        
        const actual = porDia.get(fechaKey)
        actual.suma += item.used
        actual.count += 1
      })
      
      return Array.from(porDia.entries())
        .map(([fecha, vals]) => ({
          value: [fecha, vals.suma / vals.count],
          hora: vals.hora
        }))
        .sort((a, b) => a.value[0].localeCompare(b.value[0]))
    }

    const serieHabil = prepararDatos(datosHabil)
    const serieNoHabil = prepararDatos(datosNoHabil)

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    const chartTitle = selectedVM 
      ? `Análisis Consumo Horario - ${selectedVM}`
      : 'Análisis Consumo Horario'

    const option: echarts.EChartsOption = {
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      legend: {
        data: ['Horario Hábil', 'Horario No Hábil'],
        top: '40px',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params: unknown) {
          if (!params || params.length === 0) return ''
          
          const fecha = new Date(params[0].value[0]).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          
          const hora = params[0].data.hora || '10:00:00'
          
          let result = `<strong>${fecha} ${hora}</strong><br/>`
          params.forEach((param: unknown) => {
            const valor = param.value[1] || param.data.value[1]
            result += `${param.marker}${param.seriesName}: ${valor.toFixed(2)} ${unidad}<br/>`
          })
          return result
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: function(value: number) {
            const date = new Date(value)
            return date.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short'
            })
          },
          rotate: 45,
          fontSize: 10
        },
        splitNumber: 8
      },
      yAxis: {
        type: 'value',
        name: `Uso (${unidad})`,
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Horario Hábil',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#3b82f6'
          },
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            opacity: 0.2,
            color: '#3b82f6'
          },
          data: serieHabil
        },
        {
          name: 'Horario No Hábil',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#1e3a8a'
          },
          itemStyle: {
            color: '#1e3a8a'
          },
          areaStyle: {
            opacity: 0.2,
            color: '#1e3a8a'
          },
          data: serieNoHabil
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ]
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [datosHabil, datosNoHabil, unidad, selectedVM])

  if (isLoading) return <p className="p-8 text-center">Cargando datos...</p>
  if (error) return <p className="p-8 text-center text-red-500">Error al cargar datos</p>
  if (!startDate || !endDate || !selectedMetric) {
    return <p className="p-8 text-center text-muted-foreground">Seleccione todos los filtros y presione Aplicar Filtros</p>
  }
  
  if (!data?.datos || data.datos.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Sin datos para mostrar</h3>
              <p className="text-sm text-muted-foreground">No se encontraron datos para el período y métrica seleccionados.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Indicador de VM seleccionada */}
      {selectedVM && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white text-sm px-3 py-1">
                  VM Seleccionada
                </Badge>
                <span className="font-semibold text-lg">{selectedVM}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Ver todas las VMs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-4">
          <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
        </CardContent>
      </Card>

      {/* Tarjetas */}
      {tarjetas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">Consumo Horario Laboral</p>
                  <p className="text-xl font-bold text-blue-600 truncate">
                    {tarjetas.Promedio_Recurso_Utilizado_Habil}
                  </p>
                </div>
                <Clock className="h-7 w-7 text-blue-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">Consumo Fuera de Horario</p>
                  <p className="text-xl font-bold text-indigo-600 truncate">
                    {tarjetas.Promedio_Recurso_Utilizado_No_Habil}
                  </p>
                </div>
                <Clock className="h-7 w-7 text-indigo-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">Sin Uso Horario Laboral</p>
                  <p className="text-xl font-bold text-green-600 truncate">
                    {tarjetas.Promedio_Recursos_No_Utilizados_Habil}
                  </p>
                </div>
                <TrendingDown className="h-7 w-7 text-green-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">Sin Uso Fuera de Horario</p>
                  <p className="text-xl font-bold text-emerald-600 truncate">
                    {tarjetas.Promedio_Recursos_No_Utilizados_No_Habil}
                  </p>
                </div>
                <TrendingDown className="h-7 w-7 text-emerald-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        <p>Métrica: <strong>{selectedMetric}</strong></p>
        <p className="text-xs">Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      </div>

      {/* Tabla de Detalle */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <FileSpreadsheet className="h-7 w-7 text-blue-500" />
          Detalle de Consumo por Horario
          {selectedVM && (
            <Badge className="bg-blue-500 text-white">
              Mostrando: {selectedVM}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          💡 Haz clic en cualquier nombre de VM para filtrar el gráfico
        </p>
        <TableDetalleHorarioComponent 
          datos={data?.datos || []} 
          selectedVM={selectedVM}
          onSelectVM={handleSelectVM}
        />
      </div>
    </div>
  )
}