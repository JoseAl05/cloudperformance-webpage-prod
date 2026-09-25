'use client'
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from 'react'
import { AlertCircle, Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'

interface FoundryModelsFilterComponentProps {
    foundryModel: string;
    setFoundryModel: Dispatch<SetStateAction<string>>;
}

type ApiFoundryModel =
    | { model_id_lowercase: string; model_name: string }
    | string

interface FoundryModelProvider {
    id: string;
    label: string;
    dotClassName: string;
    pattern: RegExp;
}

interface FoundryModelOption {
    id: string;
    name: string;
    provider: FoundryModelProvider;
}

const FOUNDRY_MODEL_PROVIDERS: FoundryModelProvider[] = [
    { id: 'openai', label: 'OpenAI', dotClassName: 'bg-emerald-500', pattern: /^(gpt|chatgpt|o\d)/ },
    { id: 'anthropic', label: 'Anthropic', dotClassName: 'bg-orange-500', pattern: /^claude/ },
    { id: 'meta', label: 'Meta', dotClassName: 'bg-blue-500', pattern: /^(llama|meta-llama)/ },
    { id: 'mistral', label: 'Mistral AI', dotClassName: 'bg-amber-500', pattern: /^(mistral|ministral|codestral)/ },
    { id: 'microsoft', label: 'Microsoft', dotClassName: 'bg-sky-500', pattern: /^phi/ },
    { id: 'deepseek', label: 'DeepSeek', dotClassName: 'bg-indigo-500', pattern: /^deepseek/ },
    { id: 'xai', label: 'xAI', dotClassName: 'bg-violet-500', pattern: /^grok/ },
    { id: 'cohere', label: 'Cohere', dotClassName: 'bg-rose-500', pattern: /^cohere/ }
]

const OTHER_FOUNDRY_MODEL_PROVIDER: FoundryModelProvider = {
    id: 'other',
    label: 'Otros proveedores',
    dotClassName: 'bg-slate-400',
    pattern: /^$/
}

const resolveFoundryModelProvider = (name: string) => {
    const normalized = name.toLowerCase()
    return FOUNDRY_MODEL_PROVIDERS.find((provider) => provider.pattern.test(normalized)) ?? OTHER_FOUNDRY_MODEL_PROVIDER
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const FoundryModelsFilterComponent = ({ foundryModel, setFoundryModel }: FoundryModelsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = '/api/azure/bridge/azure/foundry/prompt_optimization/all_chat_foundry_models'
    const { data, error, isLoading } = useSWR<ApiFoundryModel[]>(url, fetcher)

    const foundryModels = useMemo<FoundryModelOption[]>(() => {
        if (!Array.isArray(data) || data.length === 0) return []
        const rows = typeof data[0] === 'string'
            ? (data as string[]).map((id) => ({ id, name: id }))
            : (data as { model_id_lowercase: string; model_name: string }[]).map((s) => ({
                id: s.model_name,
                name: s.model_name,
            }))
        return rows.map((row) => ({ ...row, provider: resolveFoundryModelProvider(row.name) }))
    }, [data])

    const noFoundryModels = foundryModels.length === 0

    const groupedFoundryModels = useMemo(() => {
        return [...FOUNDRY_MODEL_PROVIDERS, OTHER_FOUNDRY_MODEL_PROVIDER]
            .map((provider) => ({
                provider,
                models: foundryModels
                    .filter((model) => model.provider.id === provider.id)
                    .sort((a, b) => a.name.localeCompare(b.name))
            }))
            .filter((group) => group.models.length > 0)
    }, [foundryModels])

    const selectedFoundryModel = useMemo(
        () => foundryModels.find((model) => model.id === foundryModel) ?? null,
        [foundryModels, foundryModel]
    )

    if (isLoading) {
        return (
            <Button variant='outline' className='w-full justify-between bg-transparent font-normal' disabled>
                <span className='truncate text-left text-muted-foreground'>Cargando modelos...</span>
                <Loader2 className='ml-2 h-4 w-4 shrink-0 animate-spin opacity-70' />
            </Button>
        )
    }

    if (error) {
        return (
            <Button variant='outline' className='w-full justify-between bg-transparent font-normal' disabled>
                <span className='truncate text-left text-destructive'>Error al cargar los modelos</span>
                <AlertCircle className='ml-2 h-4 w-4 shrink-0 text-destructive' />
            </Button>
        )
    }

    const getDisplayText = () => {
        if (noFoundryModels) return 'Sin modelos disponibles'
        if (!foundryModel) return 'Selecciona un modelo'
        return selectedFoundryModel?.name ?? foundryModel
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent font-normal'
                    disabled={noFoundryModels}
                >
                    <span className='flex min-w-0 items-center gap-2'>
                        {selectedFoundryModel && (
                            <span className={cn('h-2 w-2 shrink-0 rounded-full', selectedFoundryModel.provider.dotClassName)} />
                        )}
                        <span className={cn('truncate text-left', !selectedFoundryModel && 'text-muted-foreground')}>
                            {getDisplayText()}
                        </span>
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-[var(--radix-popover-trigger-width)] min-w-[18rem] p-0'>
                <Command>
                    <CommandInput placeholder='Buscar por modelo o proveedor...' />
                    <CommandList className='max-h-[320px]'>
                        <CommandEmpty>
                            {noFoundryModels ? 'No hay modelos disponibles.' : 'No se encontraron modelos.'}
                        </CommandEmpty>
                        {groupedFoundryModels.map((group, index) => (
                            <Fragment key={group.provider.id}>
                                {index > 0 && <CommandSeparator />}
                                <CommandGroup
                                    className="[&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:justify-between [&_[cmdk-group-heading]]:gap-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase"
                                    heading={
                                        <>
                                            <span className='flex items-center gap-2'>
                                                <span className={cn('h-1.5 w-1.5 rounded-full', group.provider.dotClassName)} />
                                                {group.provider.label}
                                            </span>
                                            <span className='rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums'>
                                                {group.models.length}
                                            </span>
                                        </>
                                    }
                                >
                                    {group.models.map(({ id, name, provider }) => {
                                        const isSelected = foundryModel === id
                                        return (
                                            <CommandItem
                                                key={id}
                                                value={`${name} ${provider.label}`}
                                                onSelect={() => {
                                                    setFoundryModel(id)
                                                    setOpen(false)
                                                }}
                                                className={cn('cursor-pointer gap-2', isSelected && 'bg-accent/60 font-medium')}
                                            >
                                                <span className={cn('h-2 w-2 shrink-0 rounded-full', provider.dotClassName, !isSelected && 'opacity-60')} />
                                                <span className='truncate'>{name}</span>
                                                <Check className={cn('ml-auto h-4 w-4 text-blue-600 dark:text-blue-400', isSelected ? 'opacity-100' : 'opacity-0')} />
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </Fragment>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
