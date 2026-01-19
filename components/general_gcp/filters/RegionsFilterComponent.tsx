'use client'
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'

interface RegionsFilterComponentProps {
    regions: string
    setRegions: Dispatch<SetStateAction<string>>
}

interface ApiGcpRegion {
    region_id: string
    region_name: string
}

// Endpoint sugerido. Si no existe, devuelve array vacío o crea uno estático.
const fetcher = (url: string) => fetch(url).then(r => r.json());

export const RegionsFilterComponent = ({
    regions,
    setRegions,
}: RegionsFilterComponentProps) => {
    const [open, setOpen] = useState(false)
    const url = `/api/gcp/bridge/gcp/general/all-regions` // Ajustar si el endpoint es diferente
    
    const { data, error, isLoading } = useSWR<ApiGcpRegion[]>(url, fetcher)

    const regionList = useMemo(() => {
        if (!Array.isArray(data)) return []
        return data.map((r) => ({
            id: r.region_name || r.region_id,
            name: r.region_name || r.region_id,
        }))
    }, [data])

    const hasData = regionList.length > 0

    // Auto-seleccionar "Todas" si no hay selección
    useEffect(() => {
        if (!isLoading && hasData && !regions) {
            setRegions('all_regions')
        }
    }, [isLoading, hasData, regions, setRegions])

    const selectedIds = useMemo(() => regions ? regions.split(',').filter(Boolean) : [], [regions])

    const handleToggle = (val: string) => {
        let current = [...selectedIds]
        if (val === 'all_regions') {
            current = ['all_regions']
        } else {
            current = current.filter(s => s !== 'all_regions')
            if (current.includes(val)) current = current.filter(s => s !== val)
            else current.push(val)
        }
        setRegions(current.length ? current.join(',') : '')
    }

    const getDisplayText = () => {
        if (selectedIds.includes('all_regions')) return 'Todas las Regiones'
        if (selectedIds.length === 1) return selectedIds[0]
        return `${selectedIds.length} regiones`
    }

    if (isLoading) return <LoaderComponent size="small" />

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    <span className="truncate text-left max-w-[85%]">{hasData ? getDisplayText() : 'Sin regiones'}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar región..." />
                    <CommandEmpty>No encontrada.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        <CommandItem value="all_regions" onSelect={() => handleToggle('all_regions')}>
                            <Check className={cn('mr-2 h-4 w-4', selectedIds.includes('all_regions') ? 'opacity-100' : 'opacity-0')} />
                            Todas las Regiones
                        </CommandItem>
                        {regionList.map((r) => (
                            <CommandItem key={r.id} value={r.id} onSelect={() => handleToggle(r.id)}>
                                <Check className={cn('mr-2 h-4 w-4', selectedIds.includes(r.id) && !selectedIds.includes('all_regions') ? 'opacity-100' : 'opacity-0')} />
                                {r.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}