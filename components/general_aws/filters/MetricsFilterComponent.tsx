// 'use client';
// import { Dispatch, SetStateAction, useState, useMemo } from 'react';
// import useSWR from 'swr';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent';

// interface MetricsFilterComponentProps {
//   selectedMetrics: string;
//   setSelectedMetrics: Dispatch<SetStateAction<string>>;
// }

// interface ApiResponse {
//   grupos_disponibles: string[];
//   detalles: {
//     [key: string]: string[];
//   };
// }

// const fetcher = (url: string) =>
//     fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
//         .then(r => r.json());

// export const MetricsFilterComponent = ({ selectedMetrics, setSelectedMetrics }: MetricsFilterComponentProps) => {
//   const [open, setOpen] = useState(false);
//   const apiUrl = `/api/aws/bridge/vm/promedio-loc-ec2/grupos-disponibles`;
//   const { data: apiResponse, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher);

//   // Crear la lista de grupos principales (en lugar de métricas individuales)
//   const metricGroups = useMemo(() => {
//     if (!apiResponse?.grupos_disponibles) return [];
//     return apiResponse.grupos_disponibles;
//   }, [apiResponse]);

//   const handleMetricToggle = (metricValue: string) => {
//     if (metricValue === 'all_metrics') {
//       setSelectedMetrics('');
//       return;
//     }
//     const metricsArray = selectedMetrics
//       ? selectedMetrics.split(',').map((item) => decodeURIComponent(item).trim()).filter(Boolean)
//       : [];
//     if (metricsArray.includes(metricValue)) {
//       const updated = metricsArray.filter((m) => m !== metricValue);
//       setSelectedMetrics(updated.map((m) => encodeURIComponent(m)).join(','));
//     } else {
//       const updated = [...metricsArray, metricValue];
//       setSelectedMetrics(updated.map((m) => encodeURIComponent(m)).join(','));
//     }
//   };

//   const getDisplayText = () => {
//     if (!selectedMetrics || selectedMetrics.trim() === '') return 'Todos los Grupos de Métricas';
//     const metricsArray = selectedMetrics
//       .split(',')
//       .map((item) => decodeURIComponent(item).trim())
//       .filter((m) => m !== '');
//     return metricsArray.length === 1 ? metricsArray[0] : `${metricsArray.length} grupos seleccionados`;
//   };

//   if (isLoading) {
//     return <LoaderComponent size='small'/>
//   }

//   if (error || !apiResponse) {
//     return (
//       <Button variant="outline" disabled className="w-[250px] justify-between">
//         Error al cargar grupos de métricas
//         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//       </Button>
//     );
//   }

//   const selectedArray = selectedMetrics
//     ? selectedMetrics.split(',').map((item) => decodeURIComponent(item).trim()).filter(Boolean)
//     : [];

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
//           {getDisplayText()}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0">
//         <Command>
//           <CommandInput placeholder="Buscar grupo de métricas..." />
//           <CommandEmpty>No se encontró el grupo de métricas.</CommandEmpty>
//           <CommandGroup className="max-h-[200px] overflow-y-auto">
//             <CommandItem value="all_metrics" onSelect={() => handleMetricToggle('all_metrics')}>
//               <Check className={`mr-2 h-4 w-4 ${!selectedMetrics || selectedMetrics.trim() === '' ? 'opacity-100' : 'opacity-0'}`} />
//               Todos los Grupos de Métricas
//             </CommandItem>
//             {metricGroups.map((group) => {
//               const groupName = group?.trim() ?? '';
//               const checked = selectedArray.includes(groupName);
//               return (
//                 <CommandItem key={groupName} value={groupName} onSelect={() => handleMetricToggle(groupName)}>
//                   <Check className={`mr-2 h-4 w-4 ${checked ? 'opacity-100' : 'opacity-0'}`} />
//                   {groupName}
//                 </CommandItem>
//               );
//             })}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };
'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface MetricsFilterComponentProps {
  /** CSV URL-encoded con los grupos seleccionados. Ej: "CPU%20Utilization,Network%20In" */
  selectedMetrics: string
  setSelectedMetrics: Dispatch<SetStateAction<string>>
  /** Activa selección múltiple (default: true). En single-select se elige un solo grupo. */
  isMetricsMultiSelect?: boolean
}

interface ApiResponse {
  grupos_disponibles: string[]
  detalles: Record<string, string[]>
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then(r => r.json())

export const MetricsFilterComponent = ({
  selectedMetrics,
  setSelectedMetrics,
  isMetricsMultiSelect = true,
}: MetricsFilterComponentProps) => {
  const [open, setOpen] = useState(false)

  // Endpoint actual de grupos de métricas
  const apiUrl = `/api/aws/bridge/vm/promedio-loc-ec2/grupos-disponibles`
  const { data: apiResponse, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher)

  const groups = useMemo<string[]>(() => apiResponse?.grupos_disponibles ?? [], [apiResponse])
  const noneAvailable = !isLoading && !error && groups.length === 0

  // Helpers para mantener compatibilidad con CSV URL-encoded
  const decodeCsv = (csv: string) =>
    csv
      .split(',')
      .map(s => decodeURIComponent(s).trim())
      .filter(Boolean)

  const encodeCsv = (arr: string[]) => arr.map(s => encodeURIComponent(s)).join(',')

  const selectedArray = selectedMetrics ? decodeCsv(selectedMetrics) : []

  const getDisplayText = () => {
    if (noneAvailable) return 'Sin grupos disponibles'

    if (!isMetricsMultiSelect) {
      return selectedArray[0] ?? 'Seleccione un grupo de métricas'
    }

    if (selectedArray.length === 0) return 'Seleccione grupos de métricas'
    if (selectedArray.includes('all_metrics')) return 'Todos los Grupos de Métricas'
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
      // Quitar selección de "todas" si se elige una específica
      curr = curr.filter(v => v !== 'all_metrics')
      if (curr.includes(val)) curr = curr.filter(v => v !== val)
      else curr.push(val)
    }

    setSelectedMetrics(curr.length ? encodeCsv(curr) : '')
  }

  if (isLoading) return <LoaderComponent size='small' />
  if (error) {
    return (
      <Button variant='outline' disabled className='w-full justify-between bg-transparent'>
        Error al cargar grupos de métricas
        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      </Button>
    )
  }

  return !isMetricsMultiSelect ? (
    // SINGLE SELECT (como modo simple del InstancesFilterComponent)
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent'
          disabled={noneAvailable}
        >
          <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Buscar grupo de métricas...' />
          <CommandList>
            <CommandEmpty>{noneAvailable ? 'No hay grupos disponibles.' : 'No se encontró el grupo.'}</CommandEmpty>
            {!noneAvailable && (
              <CommandGroup className='max-h-[250px] overflow-y-auto'>
                {groups.map(g => (
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
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent'
          disabled={noneAvailable}
        >
          <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Buscar grupo de métricas...' />
          <CommandEmpty>{noneAvailable ? 'No hay grupos disponibles.' : 'No se encontró el grupo.'}</CommandEmpty>
          {!noneAvailable && (
            <CommandGroup className='max-h-[200px] overflow-y-auto'>
              <CommandItem value='all_metrics' onSelect={() => handleToggle('all_metrics')}>
                <Check className={cn('mr-2 h-4 w-4', selectedArray.includes('all_metrics') ? 'opacity-100' : 'opacity-0')} />
                Todos los Grupos de Métricas
              </CommandItem>
              {groups.map(g => (
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
