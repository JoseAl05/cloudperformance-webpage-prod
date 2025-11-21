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
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface ResourceGroupFilterProps {
  startDate: Date,
  endDate: Date,
  region: string,
  subscription: string,
  collection: string,
  subscriptionField: string,
  selectedTagKey?: string | null,
  selectedTagValue?: string | null,
  selectedResourceGroup: string | null,
  setSelectedResourceGroup: Dispatch<SetStateAction<string | null>>,
  onChange?: (next: { resourceGroup: string | null }) => void
}

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json())

export const ResourceGroupFilterComponent = ({
  startDate,
  endDate,
  region,
  subscription,
  collection,
  subscriptionField,
  selectedTagKey,
  selectedTagValue,
  selectedResourceGroup,
  setSelectedResourceGroup,
  onChange
}: ResourceGroupFilterProps) => {
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
      resource_group_field: "resource_group"
    })

    if (selectedTagKey) params.append('nombre_tag', selectedTagKey)
    if (selectedTagValue) params.append('valor_tag', selectedTagValue)

    return `/api/azure/bridge/azure/get-resource-groups?${params.toString()}`
  }

  // Solo hacer fetch si hay región y suscripción específicas seleccionadas
  const shouldFetch = !!subscription && !!region

  const { data, error, isLoading } = useSWR(
    shouldFetch ? buildUrl() : null,
    fetcher
  )

  useEffect(() => { setIsMounted(true) }, [])
  console.log(selectedResourceGroup);
  // Resetear el resource group seleccionado cuando cambian región o suscripción
  useEffect(() => {
    if (!shouldFetch && selectedResourceGroup && selectedResourceGroup !== 'all_resource_groups') {
      setSelectedResourceGroup('all_resource_groups')
      onChange?.({ resourceGroup: 'all_resource_groups' })
    }
  }, [region, subscription])

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
  if (error) return <div className="text-sm text-red-500">Error al cargar grupos de recursos</div>

  const resourceGroups = Array.isArray(data) ? data.map((item: unknown) => item.resource_group) : []
  const noGroups = resourceGroups.length === 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
          {noGroups
            ? 'Sin grupos disponibles'
            : (!selectedResourceGroup || selectedResourceGroup === 'all_resource_groups')
              ? 'Todos los grupos'
              : selectedResourceGroup}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar grupo..." />
          <CommandList>
            <CommandEmpty>{noGroups ? 'No hay grupos de recursos disponibles.' : 'No hay coincidencias.'}</CommandEmpty>
            {!noGroups && (
              <CommandGroup>
                <CommandItem
                  value="all_resource_groups"
                  onSelect={() => {
                    setSelectedResourceGroup('all_resource_groups')
                    setOpen(false)
                    onChange?.({ resourceGroup: 'all_resource_groups' })
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", (!selectedResourceGroup || selectedResourceGroup === 'all_resource_groups') ? "opacity-100" : "opacity-0")} />
                  Todos los grupos
                </CommandItem>
                {resourceGroups.map((rg: string, idx: number) => (
                  <CommandItem
                    key={`${rg}-${idx}`}
                    value={rg}
                    onSelect={() => {
                      setSelectedResourceGroup(rg)
                      setOpen(false)
                      onChange?.({ resourceGroup: rg })
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedResourceGroup === rg ? "opacity-100" : "opacity-0")} />
                    {rg}
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