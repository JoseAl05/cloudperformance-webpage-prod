'use client'
import useSWR from 'swr'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface ResourcesFilterComponentProps {
  startDate: Date
  endDate: Date
  selectedMetric?: string
  selectedResourceType?: string
  selectedResource: string
  setSelectedResource: (resource: string) => void
}

export const ResourcesFilterComponent = ({
  startDate,
  endDate,
  selectedMetric,
  selectedResourceType,
  selectedResource,
  setSelectedResource
}: ResourcesFilterComponentProps) => {

  const startDateFormatted = startDate?.toISOString().replace('Z', '').slice(0, -4) || ''
  const endDateFormatted = endDate?.toISOString().replace('Z', '').slice(0, -4) || ''

  // Construir URL con filtros opcionales
  const buildApiUrl = () => {
    if (!startDate || !endDate) return null

    const params = new URLSearchParams({
      date_from: startDateFormatted,
      date_to: endDateFormatted
    })

    if (selectedMetric) {
      params.append('metric_name', selectedMetric)
    }

    if (selectedResourceType) {
      params.append('tipo', selectedResourceType)
    }

    return `/api/azure/bridge/azure/get-all-resources?${params.toString()}`
  }

  const apiUrl = buildApiUrl()

  const { data: resources, error, isLoading } = useSWR(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  )

  const handleResourceChange = (value: string) => {
    setSelectedResource(value === 'all' ? '' : value)
  }

  return (
    <Select
      value={selectedResource || 'all'}
      onValueChange={handleResourceChange}
      disabled={!startDate || !endDate || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccione un recurso">
          {isLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando recursos...</span>
            </div>
          )}
          {!isLoading && (selectedResource || 'Todos los recursos')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los recursos</SelectItem>
        {!isLoading && !error && resources && Array.isArray(resources) && resources.length > 0 ? (
          <>
            <div className="px-2 pb-2">
              <input
                type="text"
                placeholder="Buscar recurso..."
                className="w-full px-2 py-1 text-sm border rounded"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase()
                  const items = document.querySelectorAll('[data-resource-item]')
                  items.forEach((item) => {
                    const text = item.textContent?.toLowerCase() || ''
                    const parent = item.parentElement
                    if (parent) {
                      parent.style.display = text.includes(value) ? '' : 'none'
                    }
                  })
                }}
              />
            </div>
            {resources.map((resource: string) => (
              <SelectItem key={resource} value={resource} data-resource-item>
                {resource}
              </SelectItem>
            ))}
          </>
        ) : null}
        {!isLoading && error && (
          <SelectItem value="error" disabled>
            Error al cargar recursos
          </SelectItem>
        )}
        {!isLoading && !error && (!resources || resources.length === 0) && (
          <SelectItem value="empty" disabled>
            No hay recursos disponibles
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}