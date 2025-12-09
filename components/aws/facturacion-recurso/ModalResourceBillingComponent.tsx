'use client'

import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ResourceBillingWrapper } from '@/components/aws/facturacion-recurso/ResourceBillingWrapper'
import { ResourceBillingStats } from '@/components/aws/facturacion-recurso/info/ResourceBillingStats'
import { ResourceBillingChart } from '@/components/aws/facturacion-recurso/grafico/ResourceBillingChart'

// --- Tipos de respuesta del Backend ---
interface BillingItem {
  start_date: string
  end_date: string
  unblendedcost: number
  netamortizedcost: number
}

interface ResourceBillingResponse {
  service: string
  resource: string
  billing: BillingItem[]
}

const fetcher = (url: string) =>
  fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    if (!res.ok) throw new Error('Error fetching data')
    return res.json()
  })

interface ModalResourceBillingProps {
  isOpen: boolean
  onClose: () => void
  resourceId: string | null,
  startDateHistory?: string
}

export const ModalResourceBillingComponent = ({
  isOpen,
  onClose,
  resourceId,
  startDateHistory
}: ModalResourceBillingProps) => {
  const searchParams = useSearchParams()

  // 1. Gestión de Fechas
  const { startDate, endDate, startDateStr, endDateStr } = useMemo(() => {
    const startParam = searchParams.get('startDate')
    const endParam = searchParams.get('endDate')

    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

    const sDate = startParam ? new Date(startParam) : firstDay
    const eDate = endParam ? new Date(endParam) : now

    const sStr = sDate.toISOString().split('.')[0]
    const eStr = eDate.toISOString().split('.')[0]

    return { startDate: sDate, endDate: eDate, startDateStr: sStr, endDateStr: eStr }
  }, [searchParams])

  // 2. Fetch Data
  const shouldFetch = isOpen && resourceId
  const { data, isLoading, error } = useSWR<ResourceBillingResponse[]>(
    shouldFetch
      ? `/api/aws/bridge/facturacion/get_resource_billing?resource_id=${resourceId}&date_from=${startDateStr}&date_to=${startDateHistory ? startDateHistory : endDateStr}`
      : null,
    fetcher
  )

  // 3. Generar URL para redirección completa
  const fullViewPath = useMemo(() => {
    const params = new URLSearchParams()
    params.set('startDate', startDate.toISOString())
    params.set('endDate', endDate.toISOString())

    if (resourceId) {
      params.set('selectedKey', 'RESOURCE_ID')
      params.set('selectedValue', resourceId)
      params.set('services', 'all_services')
    }
    return `/dashboard/aws/top-dolares-recurso?${params.toString()}`
  }, [startDate, endDate, resourceId])

  // --- Render Content ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground animate-in fade-in duration-300">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
          <p className="text-sm font-medium">Consultando facturación detallada...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
          <p className="font-medium">Error cargando los datos</p>
          <p className="text-sm opacity-80 mt-1">Intenta nuevamente más tarde.</p>
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <p>No se encontraron registros de facturación para este periodo.</p>
        </div>
      )
    }

    return (
      <div className="space-y-8 px-1">
        {/* Componente de KPIs (Cards) */}
        <ResourceBillingStats data={data} />

        {/* Componente de Gráfico ECharts */}
        <ResourceBillingChart data={data} />

        <div className="text-xs text-muted-foreground text-right italic">
          * Los costos mostrados son unblended costs y pueden variar respecto a la factura final.
        </div>
      </div>
    )
  }

  return (
    <ResourceBillingWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle Financiero: ${resourceId}`}
      fullViewPath={fullViewPath}
    >
      {renderContent()}
    </ResourceBillingWrapper>
  )
}