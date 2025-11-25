'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface MetricsRDSFilterComponentProps {
  /** CSV URL-encoded con los grupos seleccionados. Ej: "CPU%20Utilization,Network%20In" */
  selectedMetrics: string
  setSelectedMetrics: Dispatch<SetStateAction<string>>
  /** Motor RDS para construir el endpoint */
  rdsService: 'postgresql' | 'oracle' | 'mysql' | 'sqlserver' | 'mariadb'
  /** Activa selección múltiple (default: true). En single-select se elige un solo grupo. */
  isMetricsMultiSelect?: boolean
}

interface ApiResponse {
  grupos_disponibles: string[]
  detalles: Record<string, string[]>
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then((r) => r.json())

const getApiUrl = (service: string) => {
  const serviceMap: Record<string, string> = {
    postgresql: 'rds-pg',
    oracle: 'rds-oracle',
    mysql: 'rds-mysql',
    sqlserver: 'rds-sqlserver',
    mariadb: 'rds-mariadb',
  }
  const endpoint = serviceMap[service] || 'rds-pg'
  return `/api/aws/bridge/db/promedio-loc-${endpoint}/grupos-disponibles`
}

export const MetricsRDSFilterComponent = ({
  selectedMetrics,
  setSelectedMetrics,
  rdsService,
  isMetricsMultiSelect = true,
}: MetricsRDSFilterComponentProps) => {
  const [open, setOpen] = useState(false)

  const apiUrl = getApiUrl(rdsService)
  const { data: apiResponse, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher)

  const groups = useMemo<string[]>(() => apiResponse?.grupos_disponibles ?? [], [apiResponse])
  const noneAvailable = !isLoading && !error && groups.length === 0

  // Helpers CSV URL-encoded (idéntico a MetricsFilterComponent)
  const decodeCsv = (csv: string) =>
    csv
      .split(',')
      .map((s) => decodeURIComponent(s).trim())
      .filter(Boolean)

  const encodeCsv = (arr: string[]) => arr.map((s) => encodeURIComponent(s)).join(',')

  const selectedArray = selectedMetrics ? decodeCsv(selectedMetrics) : []

  const servicePretty = rdsService.charAt(0).toUpperCase() + rdsService.slice(1)

  const getDisplayText = () => {
    if (noneAvailable) return 'Sin grupos disponibles'

    if (!isMetricsMultiSelect) {
      return selectedArray[0] ?? `Seleccione un grupo de métricas RDS ${servicePretty}`
    }

    if (selectedArray.length === 0) return `Seleccione grupos de métricas RDS ${servicePretty}`
    if (selectedArray.includes('all_metrics')) return `Todos los Grupos de Métricas RDS ${servicePretty}`
    if (selectedArray.length === 1) return selectedArray[0]
    return `${selectedArray.length} grupos seleccionados`
  }

  const handleToggle = (val: string) => {
    if (!isMetricsMultiSelect) {
      setSelectedMetrics(encodeCsv([val]))
      setOpen(false)
      return
    }

    let curr = [...selectedArray]

    if (val === 'all_metrics') {
      curr = ['all_metrics']
    } else {
      // Si se elige una específica, se quita "all_metrics"
      curr = curr.filter((v) => v !== 'all_metrics')
      if (curr.includes(val)) curr = curr.filter((v) => v !== val)
      else curr.push(val)
    }

    setSelectedMetrics(curr.length ? encodeCsv(curr) : '')
  }

  if (isLoading) return <LoaderComponent size="small" />

  if (error) {
    return (
      <Button variant="outline" disabled className="w-full justify-between bg-transparent">
        Error al cargar grupos de métricas RDS {servicePretty}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return !isMetricsMultiSelect ? (
    // SINGLE SELECT
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={noneAvailable}
        >
          <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Buscar grupo de métricas RDS ${servicePretty}...`} />
          <CommandList>
            <CommandEmpty>{noneAvailable ? 'No hay grupos disponibles.' : 'No se encontró el grupo.'}</CommandEmpty>
            {!noneAvailable && (
              <CommandGroup className="max-h-[250px] overflow-y-auto">
                {groups.map((g) => (
                  <CommandItem key={g} value={g} onSelect={() => handleToggle(g)}>
                    <Check className={cn('mr-2 h-4 w-4', selectedArray[0] === g ? 'opacity-100' : 'opacity-0')} />
                    {g}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    // MULTI SELECT (con "Todas las Métricas")
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={noneAvailable}
        >
          <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Buscar grupo de métricas RDS ${servicePretty}...`} />
          <CommandEmpty>{noneAvailable ? 'No hay grupos disponibles.' : 'No se encontró el grupo.'}</CommandEmpty>
          {!noneAvailable && (
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              <CommandItem value="all_metrics" onSelect={() => handleToggle('all_metrics')}>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedArray.includes('all_metrics') ? 'opacity-100' : 'opacity-0'
                  )}
                />
                Todos los Grupos de Métricas RDS {servicePretty}
              </CommandItem>
              {groups.map((g) => (
                <CommandItem key={g} value={g} onSelect={() => handleToggle(g)}>
                  <Check className={cn('mr-2 h-4 w-4', selectedArray.includes(g) ? 'opacity-100' : 'opacity-0')} />
                  {g}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
