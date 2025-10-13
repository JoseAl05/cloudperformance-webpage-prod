'use client'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface InstancesFilterProps {
  startDate: Date,
  endDate: Date,
  region: string,
  subscription: string,
  collection: string,
  subscriptionField: string,
  instanceField: string,
  selectedTagKey?: string | null,
  selectedTagValue?: string | null,
  selectedResourceGroup?: string | null,
  selectedInstance: string | null,
  setSelectedInstance: Dispatch<SetStateAction<string | null>>,
  onChange?: (next: { instance: string | null }) => void
}

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json())

export const InstancesFilterComponentV2 = ({
  startDate,
  endDate,
  region,
  subscription,
  collection,
  subscriptionField,
  instanceField,
  selectedTagKey,
  selectedTagValue,
  selectedResourceGroup,
  selectedInstance,
  setSelectedInstance,
  onChange
}: InstancesFilterProps) => {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const buildUrl = () => {
    const params = new URLSearchParams({
      date_from: startDateFormatted,
      date_to: endDateFormatted,
      region: region,
      subscription_id: subscription,
      collection: collection,
      subscription_field: subscriptionField,
      instance_field: instanceField
    })

    if (selectedTagKey) params.append('nombre_tag', selectedTagKey)
    if (selectedTagValue) params.append('valor_tag', selectedTagValue)
    if (selectedResourceGroup && selectedResourceGroup !== 'all_resource_groups') {
      params.append('resource_group', selectedResourceGroup)
    }

    return `/api/azure/bridge/azure/get-instances-custom?${params.toString()}`
  }

  // Solo hacer fetch si hay región y suscripción específicas seleccionadas
  const shouldFetch = !!subscription && !!region

  const { data, error, isLoading } = useSWR(
    shouldFetch ? buildUrl() : null,
    fetcher
  )

  useEffect(() => { setIsMounted(true) }, [])

  // Resetear la instancia seleccionada cuando cambian los filtros principales
  useEffect(() => {
    if (!shouldFetch && selectedInstance && selectedInstance !== 'all_instances') {
      setSelectedInstance('all_instances')
      onChange?.({ instance: 'all_instances' })
    }
  }, [region, subscription, selectedResourceGroup])

  if (!isMounted) return null

  // Si no se puede hacer fetch, mostrar mensaje informativo
  if (!shouldFetch) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className="w-full justify-between bg-transparent opacity-60"
      >
        Selecciona región y suscripción primero
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  if (isLoading) return <LoaderComponent size="small" />
  if (error) return <div className="text-sm text-red-500">Error al cargar instancias</div>

  const instances = Array.isArray(data) ? data.map((item: unknown) => item.instance) : []
  const noInstances = instances.length === 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
          {noInstances
            ? 'Sin instancias disponibles'
            : (!selectedInstance || selectedInstance === 'all_instances')
              ? 'Todas las instancias'
              : selectedInstance}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar instancia..." />
          <CommandList>
            <CommandEmpty>{noInstances ? 'No hay instancias disponibles.' : 'No hay coincidencias.'}</CommandEmpty>
            {!noInstances && (
              <CommandGroup>
                <CommandItem
                  value="all_instances"
                  onSelect={() => {
                    setSelectedInstance('all_instances')
                    setOpen(false)
                    onChange?.({ instance: 'all_instances' })
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", (!selectedInstance || selectedInstance === 'all_instances') ? "opacity-100" : "opacity-0")} />
                  Todas las instancias
                </CommandItem>
                {instances.map((inst: string, idx: number) => (
                  <CommandItem
                    key={`${inst}-${idx}`}
                    value={inst}
                    onSelect={() => {
                      setSelectedInstance(inst)
                      setOpen(false)
                      onChange?.({ instance: inst })
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedInstance === inst ? "opacity-100" : "opacity-0")} />
                    {inst}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}