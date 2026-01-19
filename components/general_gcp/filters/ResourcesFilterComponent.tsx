'use client'
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'

interface ResourcesFilterComponentProps {
    resourceId: string
    setResourceId: Dispatch<SetStateAction<string>>
    service: 'disks' | 'instances' | 'addresses' // Ampliable
    projects: string
    regions: string
}

// Interfaz genérica para la respuesta de la lista de recursos
interface ResourceItem {
    id: string
    name: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export const ResourcesFilterComponent = ({
    resourceId,
    setResourceId,
    service,
    projects,
    regions
}: ResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false)

    // Lógica para determinar endpoint según el servicio
    // NOTA: Ajustar estas rutas según tus endpoints reales de listas simplificadas
    const getEndpoint = () => {
        const base = '/api/gcp/bridge/gcp'
        const params = `?projects=${projects}&regions=${regions}&simple_list=true`
        switch(service) {
            case 'disks': return `${base}/recursos-sin-uso/discos-persistentes-sin-uso${params}`
            case 'instances': return `${base}/recursos-sin-uso/compute-engine-sin-uso${params}`
            default: return null
        }
    }

    const url = getEndpoint()
    const { data, isLoading } = useSWR<any[]>(url, fetcher)

    const resourceList = useMemo(() => {
        if (!Array.isArray(data)) return []
        // Mapeo defensivo dependiendo de qué devuelve tu API (resource_name, instance_id, etc)
        return data.map(r => ({
            id: r.resource_name || r.id || r.name,
            name: r.resource_name || r.name || r.id
        }))
    }, [data])

    const hasData = resourceList.length > 0

    // Resetear si cambian los filtros padres (proyecto/region)
    useEffect(() => {
        setResourceId('')
    }, [projects, regions, setResourceId])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent" disabled={!hasData || !projects}>
                    <span className="truncate text-left max-w-[85%]">
                        {resourceId ? resourceList.find(r => r.id === resourceId)?.name || resourceId : "Todos los recursos"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar recurso..." />
                    <CommandEmpty>No encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                         <CommandItem value="all" onSelect={() => { setResourceId(''); setOpen(false) }}>
                            <Check className={cn('mr-2 h-4 w-4', !resourceId ? 'opacity-100' : 'opacity-0')} />
                            Todos los recursos
                        </CommandItem>
                        {resourceList.map((r) => (
                            <CommandItem key={r.id} value={r.name} onSelect={() => { setResourceId(r.id); setOpen(false) }}>
                                <Check className={cn('mr-2 h-4 w-4', resourceId === r.id ? 'opacity-100' : 'opacity-0')} />
                                {r.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}