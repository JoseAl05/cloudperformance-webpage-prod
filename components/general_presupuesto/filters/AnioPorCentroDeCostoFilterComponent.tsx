'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface CentroDeCosto {
  id_centro_costo: number
  nombre_centro: string
  responsable_centro: string
  localizacion: string
}

interface CentroDeCostoFilterComponentProps {
  cloudType: string
  CentroDeCosto: string
  setCentroDeCosto: Dispatch<SetStateAction<string>>
  isCentroDeCostoMultiselect: boolean
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())

export const CentroDeCostoFilterComponent = ({
  cloudType,
  CentroDeCosto,
  setCentroDeCosto,
  isCentroDeCostoMultiselect,
}: CentroDeCostoFilterComponentProps) => {

  const [open, setOpen] = useState(false)

  const url = `/api/presupuesto/bridge/${cloudType.toLowerCase()}/centro-costo`
  //const url = `/api/presupuesto/bridge/aws/centro-costo`

  const shouldFetch = !!cloudType
  const { data, error, isLoading } = useSWR<CentroDeCosto[]>(shouldFetch ? url : null, fetcher)

  useEffect(() => {
    if (!isLoading && !error && shouldFetch) {
      if (!Array.isArray(data) || data.length === 0) {
        setCentroDeCosto('')
      }
    }
  }, [data, isLoading, error, shouldFetch, setCentroDeCosto])

  if (isLoading) return <LoaderComponent size='small' />
  if (error) return <div>Error al cargar datos</div>

  const list: CentroDeCosto[] = Array.isArray(data) ? data : []
  const noCentroDeCosto = shouldFetch && list.length === 0
  const selectedCentroDeCostoArray = CentroDeCosto ? CentroDeCosto.split(',').filter(Boolean) : []

  const getDisplayText = () => {
    if (noCentroDeCosto) return 'Sin centros de costos para la plataforma seleccionada'
    if (!CentroDeCosto || (!isCentroDeCostoMultiselect && CentroDeCosto === 'all'))
      return 'Seleccione uno o más centro de costo'
    if (isCentroDeCostoMultiselect && selectedCentroDeCostoArray.includes('all'))
      return 'Todos los centro de costo'
    if (selectedCentroDeCostoArray.length === 1) return selectedCentroDeCostoArray[0]
    return `${selectedCentroDeCostoArray.length} centros de costos seleccionados`
  }

  const handleCentroDeCostoToggle = (CentroDeCostoValue: string) => {
    let CentroDeCosto = selectedCentroDeCostoArray.slice()
    if (CentroDeCostoValue === 'all') {
      CentroDeCosto = ['all']
    } else {
      CentroDeCosto = CentroDeCosto.filter(i => i !== 'all')
      if (CentroDeCosto.includes(CentroDeCostoValue))
        CentroDeCosto = CentroDeCosto.filter(i => i !== CentroDeCostoValue)
      else CentroDeCosto.push(CentroDeCostoValue)
    }
    setCentroDeCosto(CentroDeCosto.length ? CentroDeCosto.join(',') : '')
  }

  return !isCentroDeCostoMultiselect ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent'
          disabled={noCentroDeCosto || !shouldFetch}
        >
          <span className="truncate text-left max-w-[85%]">
            {getDisplayText()}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Buscar centro de costo..' />
          <CommandList>
            <CommandEmpty>{noCentroDeCosto ? 'No hay centro de costos disponibles.' : 'No se encontró centros de costos.'}</CommandEmpty>
            {!noCentroDeCosto && shouldFetch && (
              <CommandGroup className='max-h-[250px] overflow-y-auto'>
                {list.map((centro) => (
                  <CommandItem
                    key={centro.id_centro_costo}
                    value={centro.nombre_centro}
                    onSelect={() => { setCentroDeCosto(centro.nombre_centro); setOpen(false); }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', CentroDeCosto === centro.nombre_centro ? 'opacity-100' : 'opacity-0')} />
                    {centro.nombre_centro}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent'
          disabled={noCentroDeCosto || !shouldFetch}
        >
          <span className="truncate text-left max-w-[85%]">
            {getDisplayText()}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Buscar centros de costos...' />
          <CommandEmpty>{noCentroDeCosto ? 'No hay centros de costos disponibles.' : 'No se encontró centro de costos.'}</CommandEmpty>
          {!noCentroDeCosto && shouldFetch && (
            <CommandGroup className='max-h-[200px] overflow-y-auto'>
              <CommandItem value='all' onSelect={() => handleCentroDeCostoToggle('all')}>
                <Check className={cn('mr-2 h-4 w-4', selectedCentroDeCostoArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                Todos los centros de costo
              </CommandItem>
              {list.map((centro) => (
                <CommandItem
                  key={centro.id_centro_costo}
                  value={centro.nombre_centro}
                  onSelect={() => handleCentroDeCostoToggle(centro.nombre_centro)}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedCentroDeCostoArray.includes(centro.nombre_centro) ? 'opacity-100' : 'opacity-0')} />
                  {centro.nombre_centro}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
