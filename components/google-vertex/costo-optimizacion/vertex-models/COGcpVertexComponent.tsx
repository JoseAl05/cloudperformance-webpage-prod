'use client'

import { GcpVertexCardsComponent } from './info/COGcpVertexCardsComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { AlertCircle, Info } from 'lucide-react'
import useSWR from 'swr'
import { VertexModelCost, VertexPriceRateResponse } from '@/interfaces/vertex-cost-optimization/gcpVertexModels'

interface GcpVertexComponentProps {
  startDate: Date
  endDate?: Date
  projects: string
  regions: string
  resourceId?: string | null
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())

const formatApiDate = (date?: Date) => date ? date.toISOString().replace('Z', '').slice(0, -4) : ''

export const GcpVertexComponent = ({ startDate, endDate, projects, regions, resourceId }: GcpVertexComponentProps) => {
  const startDateFormatted = formatApiDate(startDate)
  const endDateFormatted = formatApiDate(endDate)
  const selectedResource = resourceId && resourceId.trim() !== '' ? resourceId : 'all'

  const priceRate = useSWR<VertexPriceRateResponse>(
    endDateFormatted
      ? `/api/gcp/bridge/gcp/vertex/gcp_get_model_price_rate?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects || 'all_projects'}&region=${regions || 'all_regions'}&resource_id=${selectedResource}`
      : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  )

  if (priceRate.isLoading) return <LoaderComponent />

  if (priceRate.error) {
    return (
      <div className='w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4'>
        <MessageCard
          icon={AlertCircle}
          title='Error al cargar datos'
          description='Ocurrio un problema al obtener la informacion de Vertex AI. Intenta nuevamente o ajusta los filtros.'
          tone='error'
        />
      </div>
    )
  }

  const response = priceRate.data
  const vertexData: VertexModelCost[] = Array.isArray(response?.data) ? response.data : []

  if (!response?.has_data || vertexData.length === 0) {
    return (
      <div className='w-full min-w-0 px-4 py-6'>
        <MessageCard
          icon={Info}
          title='Sin datos para mostrar'
          description={response?.message || 'No encontramos metricas de consumo para Vertex AI en el rango de fechas seleccionado.'}
          tone='warn'
        />
      </div>
    )
  }

  return (
    <div className='p-3'>
      <GcpVertexCardsComponent data={vertexData} />
    </div>
  )
}
