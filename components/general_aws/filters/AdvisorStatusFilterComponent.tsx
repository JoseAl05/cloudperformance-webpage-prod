'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface AdvisorStatusFilterComponentProps {
    advisorStatus: string,
    advisorCategory: string,
    setAdvisorStatus: Dispatch<SetStateAction<string>>,
    isAdvisorStatusMultiselect: boolean
}

const ADVISOR_STATUSES = ['OK', 'ERROR', 'NOT_AVAILABLE', 'WARNING']

export const AdvisorStatusFilterComponent = ({
    advisorStatus,
    advisorCategory,
    setAdvisorStatus,
    isAdvisorStatusMultiselect
}: AdvisorStatusFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const list: string[] = Array.isArray(ADVISOR_STATUSES) ? ADVISOR_STATUSES : [];
    const selectedStatusArray = advisorStatus ? advisorStatus.split(',').filter(Boolean) : [];

    const shouldShow = !!advisorCategory

    useEffect(() => {
        if (shouldShow) {
            setAdvisorStatus('');
        }
    }, [shouldShow,setAdvisorStatus]);

    const getDisplayText = () => {
        if (!advisorStatus || (!isAdvisorStatusMultiselect && advisorStatus === 'all')) return 'Seleccione uno o más status';
        if (isAdvisorStatusMultiselect && selectedStatusArray.includes('all')) return 'Todos los status';
        if (selectedStatusArray.length === 1) return selectedStatusArray[0];
        return `${selectedStatusArray.length} status seleccionados`;
    };

    const handleEventToggle = (statusValue: string) => {
        let status = selectedStatusArray.slice();
        if (statusValue === 'all') {
            status = ['all'];
        } else {
            status = status.filter((i) => i !== 'all');
            if (status.includes(statusValue)) status = status.filter((i) => i !== statusValue);
            else status.push(statusValue);
        }
        setAdvisorStatus(status.length ? status.join(',') : '');
    };


    return !isAdvisorStatusMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={!shouldShow}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar status..' />
                    <CommandList>
                        {/* <CommandEmpty>{ADVISOR_STATUSES ? 'No hay status disponibles.' : 'No se encontró status.'}</CommandEmpty> */}
                        {shouldShow && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setAdvisorStatus(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', advisorStatus === i ? 'opacity-100' : 'opacity-0')} />
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
                    disabled={!shouldShow}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar status...' />
                    {/* <CommandEmpty>{!ADVISOR_STATUSES ? 'No hay status disponibles.' : 'No se encontró status.'}</CommandEmpty> */}
                    {shouldShow && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleEventToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedStatusArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todos los status
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleEventToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedStatusArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
                                    {i}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
