'use client'

import useSWR from 'swr'
import { useMemo } from 'react'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'
import { AvgUsageByLocationComponent } from './graficos/AvgUsageByLocationComponent'
import { UsageCostLocationSummaryCards } from './graficos/UsageCostLocationSummaryCards'
import { AverageByLocationCardsGCPComponent } from './graficos/AverageByLocationCardsGCPComponent'
import { ChartBar } from 'lucide-react'

interface UsedCostLocationComponentProps {
  startDate: Date
  endDate: Date
  regions: string
  projects?: string | string[]   // 👈 ahora acepta ambos
  service?: string
}

/* ================== TIPOS API ================== */

interface MetricaPromedio {
  promedio: number
  minimo: number
  maximo: number
  muestras: number
}

interface RegionMetricas {
  region: string
  total_recursos: number
  total_muestras: number
  metricas_promedio: Record<string, MetricaPromedio>
}

interface ApiResponse {
  servicio: string
  servicio_display: string
  resumen: {
    total_regiones: number
    total_recursos: number
    total_muestras: number
    costo_total_global: number
    costo_total_global_usd: number
    currency: string
  }
  metricas_por_region: RegionMetricas[]
  costos_por_region: unknown[]
}

/* ================== FETCHER ================== */

const fetcher = (url: string) =>
  fetch(url, { headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())

/* ================== COMPONENTE ================== */

export const UsedCostLocationComponent = ({
  startDate,
  endDate,
  regions,
  projects,
  service,
}: UsedCostLocationComponentProps) => {

  const apiUrl = useMemo(() => {
    const formatDate = (d: Date) => d.toISOString().split('.')[0]

    const params = new URLSearchParams({
      date_from: formatDate(startDate),
      date_to: formatDate(endDate),
    })

    if (regions && regions !== 'all_regions') {
      params.append('region', regions)
    }


    if (projects) {
      if (Array.isArray(projects)) {
        params.append('project_id', projects.join(','))
      } else if (typeof projects === 'string' && projects.trim() !== '') {
        params.append('project_id', projects)
      }
    }

    if (service && service !== 'all') {
      params.append('service', service)
    }
    
    return `/api/gcp/bridge/gcp/funcion/uso_costo_por_localizacion?${params.toString()}`
  }, [startDate, endDate, regions, projects, service])

  const { data: apiData, error, isLoading } = useSWR<ApiResponse>(
    apiUrl,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <LoaderComponent size="large" />
        <span className="ml-3"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar datos</h3>
        <p className="text-sm mt-1">
          No se pudieron obtener métricas de uso por localización
        </p>
      </div>
    )
  }

  if (!apiData?.metricas_por_region?.length) {
    return (
      <div className="text-center text-gray-500 text-lg font-medium p-8">
        No hay datos disponibles para los filtros seleccionados
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 px-4 py-6 space-y-8">

      {/* 🧠 TÍTULO DE LA VISTA */}
      <div className="flex items-center gap-3">
        <ChartBar className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-foreground">
          Análisis de uso y costos por localización
        </h1>
      </div>

      {/* 🌍 1️⃣ RESUMEN GLOBAL (todas las regiones juntas) */}
      <UsageCostLocationSummaryCards
        resumen={apiData?.resumen}
        isLoading={isLoading}
      />

      {/* 📊 2️⃣ MÉTRICAS PROMEDIO POR REGIÓN (tabla interactiva) */}
      <AvgUsageByLocationComponent
        data={apiData.metricas_por_region}
        isLoading={false}
        error={null}
      />

      {/* 🧩 3️⃣ TARJETAS DETALLE POR CADA REGIÓN */}
      <AverageByLocationCardsGCPComponent
        data={apiData.metricas_por_region}
      />

    </div>
  )
}