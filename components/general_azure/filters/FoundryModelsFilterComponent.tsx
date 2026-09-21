'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface FoundryModelsFilterComponentProps {
    foundryModel: string;
    setFoundryModel: Dispatch<SetStateAction<string>>;
}

type ApiFoundryModel =
    | { model_id_lowercase: string; model_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const FoundryModelsFilterComponent = ({ foundryModel, setFoundryModel }: FoundryModelsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = '/api/azure/bridge/azure/foundry/prompt_optimization/all_chat_foundry_models'
    const { data, error, isLoading } = useSWR<ApiFoundryModel[]>(url, fetcher)

    const foundryModels = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { model_id_lowercase: string; model_name: string }[]).map((s) => ({
            id: s.model_name,
            name: s.model_name,
        }))
    }, [data])

    const noFoundryModels = foundryModels.length === 0

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of foundryModels) map.set(s.id, s.name)
        return map
    }, [foundryModels])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar foundry models</div>

    const getDisplayText = () => {
        if (noFoundryModels) return 'Sin foundry models disponibles'
        if (!foundryModel) return 'Selecciona foundry model'
        return idToName.get(foundryModel) ?? foundryModel
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noFoundryModels}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar foundry models...' />
                    <CommandList>
                        <CommandEmpty>
                            {noFoundryModels ? 'No hay foundry models disponibles.' : 'No se encontró foundry model.'}
                        </CommandEmpty>
                        {!noFoundryModels && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {foundryModels.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setFoundryModel(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', foundryModel === id ? 'opacity-100' : 'opacity-0')} />
                                        <span className='truncate'>{name}</span>
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
