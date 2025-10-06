'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface StorageAccountsFilterComponentProps {
    strgAccount: string;
    setStrgAccount: Dispatch<SetStateAction<string>>;
    startDate: Date;
    endDate: Date;
    region: string;
    subscriptions: string;
    selectedKey: string;
    selectedValue: string;
    isStrgAccountMultiSelect: boolean;
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());


export const StorageAccountsFilterComponent = ({
    strgAccount, setStrgAccount, startDate, endDate, region, subscriptions, selectedKey, selectedValue, isStrgAccountMultiSelect
}: StorageAccountsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/azure/bridge/azure/storage/all-storage-account?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscriptions}`;

    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { tag_key: selectedKey, tag_value: selectedValue } : null;

    const shouldFetch = !!url && !!region
    const { data, error, isLoading } = useSWR<unknown[]>(shouldFetch ? [url, tagsBody] : null, ([u, t]) => fetcherPost(u, t));

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setStrgAccount('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setStrgAccount]);


    const strgAccounts = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { strg_account_id: string; strg_account_name: string }[]).map((s) => ({
            id: s.strg_account_id,
            name: s.strg_account_name
        }))
    }, [data])

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of strgAccounts) map.set(s.id, s.name)
        return map
    }, [strgAccounts])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>


    const list: string[] = Array.isArray(data) ? data : []
    const noStrgAccounts = shouldFetch && list.length === 0

    const selectedStrgAccountsArray = strgAccount ? strgAccount.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noStrgAccounts) return 'Sin storage accounts en la región/criterios seleccionados';
        if (!strgAccount || (!isStrgAccountMultiSelect && strgAccount === 'all')) return 'Seleccione un storage account';
        if (isStrgAccountMultiSelect && selectedStrgAccountsArray.includes('all')) return 'Todos los storage accounts';
        if (selectedStrgAccountsArray.length === 1) return idToName.get(selectedStrgAccountsArray[0]) ?? selectedStrgAccountsArray[0];
        return `${selectedStrgAccountsArray.length} storage accounts seleccionados`;
    };

    const handleStrgAccountToggle = (strgAccountValue: string) => {
        let strgAccounts = [...selectedStrgAccountsArray];
        if (strgAccountValue === 'all') {
            strgAccounts = ['all'];
        } else {
            strgAccounts = strgAccounts.filter((i) => i !== 'all');
            if (strgAccounts.includes(strgAccountValue)) strgAccounts = strgAccounts.filter((i) => i !== strgAccountValue);
            else strgAccounts.push(strgAccountValue);
        }
        setStrgAccount(strgAccounts.length ? strgAccounts.join(',') : '');
    };
    return !isStrgAccountMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noStrgAccounts || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar storage account...' />
                    <CommandList>
                        <CommandEmpty>{noStrgAccounts ? 'No hay storage accounts disponibles.' : 'No se encontró storage account.'}</CommandEmpty>
                        {!noStrgAccounts && shouldFetch && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setStrgAccount(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', strgAccount === i ? 'opacity-100' : 'opacity-0')} />
                                        {i}
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
                    disabled={noStrgAccounts || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar storage account...' />
                    <CommandEmpty>{noStrgAccounts ? 'No hay storage accounts disponibles.' : 'No se encontró storage account.'}</CommandEmpty>
                    {!noStrgAccounts && shouldFetch && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleStrgAccountToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedStrgAccountsArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todos los Storage Accounts
                            </CommandItem>
                            {strgAccounts.map(({ id, name }) => (
                                <CommandItem key={id} value={`${name} ${id}`} onSelect={() => handleStrgAccountToggle(id)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedStrgAccountsArray.includes(id) ? 'opacity-100' : 'opacity-0')} />
                                    <span className="truncate">{name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
