'use client'
import useSWR from 'swr'
import { useEffect, useRef, useMemo, useCallback, useState } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Users, FolderKanban, Server, MapPin, X } from "lucide-react"

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface TopRecursosGeneralChartProps {
  startDate: Date
  endDate: Date
}

interface FilterState {
  type: 'subscription' | 'resourceGroup' | 'service' | 'location' | null
  value: string | null
}

export const TopRecursosGeneralChartComponent = ({
  startDate,
  endDate
}: TopRecursosGeneralChartProps) => {

  const [activeFilter, setActiveFilter] = useState<FilterState>({ type: null, value: null })

  const chartRefSubscriptions = useRef<HTMLDivElement>(null)
  const chartRefResourceGroups = useRef<HTMLDivElement>(null)
  const chartRefServices = useRef<HTMLDivElement>(null)
  const chartRefLocations = useRef<HTMLDivElement>(null)

  const chartInstanceSubscriptions = useRef<echarts.ECharts | null>(null)
  const chartInstanceResourceGroups = useRef<echarts.ECharts | null>(null)
  const chartInstanceServices = useRef<echarts.ECharts | null>(null)
  const chartInstanceLocations = useRef<echarts.ECharts | null>(null)

  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const startDateFormatted = startDate?.toISOString().split('.')[0] || ''
  const endDateFormatted = endDate?.toISOString().split('.')[0] || ''

  // Fetch del endpoint agregado (original)
  const apiUrl = !startDate || !endDate
    ? null
    : `/api/azure/bridge/azure/top-recursos-general?date_from=${startDateFormatted}&date_to=${endDateFormatted}`

  // Fetch del endpoint detallado (para relaciones)
  const apiUrlDetallado = !startDate || !endDate
    ? null
    : `/api/azure/bridge/azure/top-recursos-general-detallado?date_from=${startDateFormatted}&date_to=${endDateFormatted}`

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { data: dataDetallado } = useSWR(apiUrlDetallado, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { topSubscriptions, topResourceGroups, topServices, topLocations, summary } = useMemo(() => {
    if (!data) {
      return {
        topSubscriptions: [],
        topResourceGroups: [],
        topServices: [],
        topLocations: [],
        summary: null
      }
    }

    const formatNumber = (value: number) => 
      new Intl.NumberFormat('es-CL', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)

    // Si hay filtro activo, recalcular basado en relaciones
    if (activeFilter.type && activeFilter.value && dataDetallado?.relationships) {
      const relationships = dataDetallado.relationships

      // Filtrar relaciones según el filtro activo
      let filteredRelationships = relationships
      
      switch (activeFilter.type) {
        case 'subscription':
          filteredRelationships = relationships.filter((r: unknown) => r.display_name === activeFilter.value)
          break
        case 'resourceGroup':
          filteredRelationships = relationships.filter((r: unknown) => r.resource_group === activeFilter.value)
          break
        case 'service':
          filteredRelationships = relationships.filter((r: unknown) => r.providers === activeFilter.value)
          break
        case 'location':
          filteredRelationships = relationships.filter((r: unknown) => r.location === activeFilter.value)
          break
      }

      // Recalcular Top 5 para cada dimensión
      const subscriptionMap = new Map<string, number>()
      const resourceGroupMap = new Map<string, number>()
      const serviceMap = new Map<string, number>()
      const locationMap = new Map<string, number>()

      filteredRelationships.forEach((rel: unknown) => {
        subscriptionMap.set(rel.display_name, (subscriptionMap.get(rel.display_name) || 0) + rel.resource_count)
        resourceGroupMap.set(rel.resource_group, (resourceGroupMap.get(rel.resource_group) || 0) + rel.resource_count)
        serviceMap.set(rel.providers, (serviceMap.get(rel.providers) || 0) + rel.resource_count)
        locationMap.set(rel.location, (locationMap.get(rel.location) || 0) + rel.resource_count)
      })

      const topSubscriptions = Array.from(subscriptionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({
          name: name || 'Sin nombre',
          value,
          formatted: formatNumber(value)
        }))

      const topResourceGroups = Array.from(resourceGroupMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({
          name: name || 'Sin especificar',
          value,
          formatted: formatNumber(value)
        }))

      const topServices = Array.from(serviceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({
          name: name || 'Sin servicio',
          value,
          formatted: formatNumber(value)
        }))

      const topLocations = Array.from(locationMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({
          name: name || 'Sin ubicación',
          value,
          formatted: formatNumber(value)
        }))

      return {
        topSubscriptions,
        topResourceGroups,
        topServices,
        topLocations,
        summary: data.summary
      }
    }

    // Sin filtro: usar datos originales
    const topSubscriptions = (data.top_by_subscriptions || [])
      .slice(0, 5)
      .map((item: unknown) => ({
        name: item.display_name || 'Sin nombre',
        value: item.resource_count || 0,
        formatted: formatNumber(item.resource_count || 0)
      }))

    const topResourceGroups = (data.top_by_resource_groups || [])
      .slice(0, 5)
      .map((item: unknown) => ({
        name: item.resource_group || 'Sin especificar',
        value: item.resource_count || 0,
        formatted: formatNumber(item.resource_count || 0)
      }))

    const topServices = (data.top_by_services || [])
      .slice(0, 5)
      .map((item: unknown) => ({
        name: item.providers || 'Sin servicio',
        value: item.resource_count || 0,
        formatted: formatNumber(item.resource_count || 0)
      }))

    const topLocations = (data.top_by_locations || [])
      .slice(0, 5)
      .map((item: unknown) => ({
        name: item.location || 'Sin ubicación',
        value: item.resource_count || 0,
        formatted: formatNumber(item.resource_count || 0)
      }))

    return {
      topSubscriptions,
      topResourceGroups,
      topServices,
      topLocations,
      summary: data.summary
    }
  }, [data, dataDetallado, activeFilter])

  const handleResize = useCallback(() => {
    chartInstanceSubscriptions.current?.resize()
    chartInstanceResourceGroups.current?.resize()
    chartInstanceServices.current?.resize()
    chartInstanceLocations.current?.resize()
  }, [])

  const hasDataWithValue = useCallback((data: unknown[]) => {
    return data.some(item => item.value > 0)
  }, [])

  const handleChartClick = useCallback((type: FilterState['type'], name: string) => {
    setActiveFilter(prev => {
      // Si hacen clic en el mismo elemento, deseleccionar
      if (prev.type === type && prev.value === name) {
        return { type: null, value: null }
      }
      // Sino, seleccionar el nuevo elemento
      return { type, value: name }
    })
  }, [])

  const clearFilter = useCallback(() => {
    setActiveFilter({ type: null, value: null })
  }, [])

  const createChartOptions = (
    title: string, 
    data: unknown[], 
    hasData: boolean,
    chartType: FilterState['type']
  ): echarts.EChartsOption => ({
    title: {
      text: title,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        if (!hasData) return 'No hay datos'
        const item = params[0]
        return `<strong>${item.name}</strong><br/>Recursos: ${item.data.formatted}`
      }
    },
    grid: { left: 120, right: 60, top: 50, bottom: 20 },
    xAxis: {
      type: 'value',
      name: 'Cantidad',
      axisLabel: { 
        formatter: (value: number) => {
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
          return value.toString()
        }
      },
      splitLine: { show: true, lineStyle: { color: '#f3f4f6' } }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: hasData ? data.map(r => r.name) : [],
      axisLabel: { 
        width: 100, 
        overflow: 'truncate',
        fontSize: 11
      }
    },
    series: [{
      type: 'bar',
      data: hasData ? data.map(r => {
        const isSelected = activeFilter.type === chartType && activeFilter.value === r.name
        return {
          value: r.value,
          formatted: r.formatted,
          name: r.name,
          itemStyle: {
            color: isSelected ? '#1e40af' : '#60a5fa',
            borderRadius: [0, 4, 4, 0],
            borderWidth: isSelected ? 3 : 0,
            borderColor: '#1e3a8a'
          },
          emphasis: {
            itemStyle: {
              color: '#1e40af',
              shadowBlur: 15,
              shadowColor: 'rgba(30, 64, 175, 0.7)',
              borderWidth: 2,
              borderColor: '#1e3a8a'
            }
          }
        }
      }) : [],
      label: {
        show: hasData,
        position: 'right',
        formatter: (params: unknown) => params.data.formatted,
        fontSize: 10,
        fontWeight: 'bold'
      },
      barMaxWidth: 25
    }],
    graphic: !hasData ? [{
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: 'No hay datos disponibles',
        font: '12px sans-serif',
        fill: '#999'
      }
    }] : []
  })

  // Chart 1: Subscriptions
  useEffect(() => {
    if (!chartRefSubscriptions.current) return
    const hasData = topSubscriptions.length > 0 && hasDataWithValue(topSubscriptions)
    const options = createChartOptions('Top 5 Recursos Por Suscripciones', topSubscriptions, hasData, 'subscription')

    chartInstanceSubscriptions.current = echarts.init(chartRefSubscriptions.current, null, { renderer: 'canvas' })
    chartInstanceSubscriptions.current.setOption(options, { notMerge: true, lazyUpdate: true })

    chartInstanceSubscriptions.current.off('click')
    chartInstanceSubscriptions.current.on('click', (params: unknown) => {
      if (params.componentType === 'series') {
        handleChartClick('subscription', params.name)
      }
    })

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(chartRefSubscriptions.current)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      chartInstanceSubscriptions.current?.dispose()
      chartInstanceSubscriptions.current = null
    }
  }, [topSubscriptions, handleResize, hasDataWithValue, handleChartClick, activeFilter])

  // Chart 2: Resource Groups
  useEffect(() => {
    if (!chartRefResourceGroups.current) return
    const hasData = topResourceGroups.length > 0 && hasDataWithValue(topResourceGroups)
    const options = createChartOptions('Top 5 Recursos Por Grupos de Recursos', topResourceGroups, hasData, 'resourceGroup')

    chartInstanceResourceGroups.current = echarts.init(chartRefResourceGroups.current, null, { renderer: 'canvas' })
    chartInstanceResourceGroups.current.setOption(options, { notMerge: true, lazyUpdate: true })

    chartInstanceResourceGroups.current.off('click')
    chartInstanceResourceGroups.current.on('click', (params: unknown) => {
      if (params.componentType === 'series') {
        handleChartClick('resourceGroup', params.name)
      }
    })

    return () => {
      chartInstanceResourceGroups.current?.dispose()
      chartInstanceResourceGroups.current = null
    }
  }, [topResourceGroups, hasDataWithValue, handleChartClick, activeFilter])

  // Chart 3: Services
  useEffect(() => {
    if (!chartRefServices.current) return
    const hasData = topServices.length > 0 && hasDataWithValue(topServices)
    const options = createChartOptions('Top 5 Recursos Por Servicios', topServices, hasData, 'service')

    chartInstanceServices.current = echarts.init(chartRefServices.current, null, { renderer: 'canvas' })
    chartInstanceServices.current.setOption(options, { notMerge: true, lazyUpdate: true })

    chartInstanceServices.current.off('click')
    chartInstanceServices.current.on('click', (params: unknown) => {
      if (params.componentType === 'series') {
        handleChartClick('service', params.name)
      }
    })

    return () => {
      chartInstanceServices.current?.dispose()
      chartInstanceServices.current = null
    }
  }, [topServices, hasDataWithValue, handleChartClick, activeFilter])

  // Chart 4: Locations
  useEffect(() => {
    if (!chartRefLocations.current) return
    const hasData = topLocations.length > 0 && hasDataWithValue(topLocations)
    const options = createChartOptions('Top 5 Recursos Por Localización', topLocations, hasData, 'location')

    chartInstanceLocations.current = echarts.init(chartRefLocations.current, null, { renderer: 'canvas' })
    chartInstanceLocations.current.setOption(options, { notMerge: true, lazyUpdate: true })

    chartInstanceLocations.current.off('click')
    chartInstanceLocations.current.on('click', (params: unknown) => {
      if (params.componentType === 'series') {
        handleChartClick('location', params.name)
      }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstanceLocations.current?.dispose()
      chartInstanceLocations.current = null
    }
  }, [topLocations, handleResize, hasDataWithValue, handleChartClick, activeFilter])

  const isEmpty = (topSubscriptions.length === 0 || !hasDataWithValue(topSubscriptions)) &&
                  (topResourceGroups.length === 0 || !hasDataWithValue(topResourceGroups)) &&
                  (topServices.length === 0 || !hasDataWithValue(topServices)) &&
                  (topLocations.length === 0 || !hasDataWithValue(topLocations))

  if (isLoading) return <p className="p-8 text-center">Cargando datos...</p>
  if (error) return <p className="p-8 text-center text-red-500">Error al cargar datos</p>
  
  if (!startDate || !endDate) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm">
            Seleccione período y presione Aplicar Filtros
          </p>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-white mb-1">Sin datos para mostrar</h3>
              <p className="text-sm text-gray-400">
                No se encontraron recursos para el período seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Indicador de filtro activo */}
      {activeFilter.type && activeFilter.value && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  {activeFilter.type === 'subscription' && <Users className="h-5 w-5 text-white" />}
                  {activeFilter.type === 'resourceGroup' && <FolderKanban className="h-5 w-5 text-white" />}
                  {activeFilter.type === 'service' && <Server className="h-5 w-5 text-white" />}
                  {activeFilter.type === 'location' && <MapPin className="h-5 w-5 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Filtro activo</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{activeFilter.value}</p>
                </div>
              </div>
              <button
                onClick={clearFilter}
                className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos en grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <div ref={chartRefSubscriptions} style={{ width: '100%', height: '320px' }} />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <div ref={chartRefResourceGroups} style={{ width: '100%', height: '320px' }} />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <div ref={chartRefServices} style={{ width: '100%', height: '320px' }} />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <div ref={chartRefLocations} style={{ width: '100%', height: '320px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suscripciones</p>
                <p className="text-3xl font-bold text-blue-600">{summary?.total_subscriptions || 0}</p>
                <p className="text-xs text-muted-foreground">Totales</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Grupos de Recursos</p>
                <p className="text-3xl font-bold text-green-600">{summary?.total_resource_groups || 0}</p>
                <p className="text-xs text-muted-foreground">Totales</p>
              </div>
              <FolderKanban className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                <p className="text-3xl font-bold text-purple-600">{summary?.total_services || 0}</p>
                <p className="text-xs text-muted-foreground">Totales</p>
              </div>
              <Server className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ubicaciones</p>
                <p className="text-3xl font-bold text-orange-600">{summary?.total_locations || 0}</p>
                <p className="text-xs text-muted-foreground">Totales</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        <p className="text-xs">Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      </div>
    </div>
  )
}