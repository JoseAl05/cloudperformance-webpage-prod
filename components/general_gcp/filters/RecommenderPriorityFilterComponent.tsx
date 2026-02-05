'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { gcp_recommender_priorities } from '@/lib/gcp_recommender_priorities';

interface RecommenderPriorityFilterComponentProps {
    priority: string;
    setPriority: Dispatch<SetStateAction<string>>;
    isRecommenderPriorityMultiSelect: boolean;
}

export const RecommenderPriorityFilterComponent = ({
    priority,
    setPriority,
    isRecommenderPriorityMultiSelect
}: RecommenderPriorityFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!priority || priority.trim() === '') return 'Selecciona prioridad';
        if (priority === 'all_priorities') return 'Todas las Prioridades';
        const priorityArray = priority.split(',').filter((s) => s.trim() !== '');
        if (priorityArray.length === 1) {
            const found = gcp_recommender_priorities.find((r) => r.value === priorityArray[0]);
            return found ? found.label : priorityArray[0];
        }
        return `${priorityArray.length} prioridades seleccionadas`;
    };

    const handlePriorityToggle = (priorityValue: string) => {
        let priorityArray = priority ? priority.split(',').filter(Boolean) : [];

        if (priorityValue === 'all_priorities') {
            priorityArray = ['all_priorities'];
        } else {
            priorityArray = priorityArray.filter((r) => r !== 'all_priorities');
            if (priorityArray.includes(priorityValue)) {
                priorityArray = priorityArray.filter((r) => r !== priorityValue);
            } else {
                priorityArray.push(priorityValue);
            }
        }
        setPriority(priorityArray.length ? priorityArray.join(',') : 'all_priorities');
    };

    const selectedPriorityArray = priority ? priority.split(',').filter(Boolean) : [];

    return !isRecommenderPriorityMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar prioridad..." />
                    <CommandList>
                        <CommandEmpty>No se encontró prioridad.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {gcp_recommender_priorities.map((priority) => (
                                <CommandItem
                                    key={priority.value}
                                    value={priority.value}
                                    onSelect={(currentValue) => {
                                        setPriority(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', priority === priority.value ? 'opacity-100' : 'opacity-0')} />
                                    {priority.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    ) : (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar prioridad..." />
                    <CommandEmpty>No se encontró la prioridad.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        <CommandItem value="all_priorities" onSelect={() => handlePriorityToggle('all_priorities')}>
                            <Check className={`mr-2 h-4 w-4 ${priority === 'all_priorities' ? 'opacity-100' : 'opacity-0'}`} />
                            Todas las Prioridades
                        </CommandItem>
                        {gcp_recommender_priorities
                            .filter((p) => p.value !== 'all_priorities')
                            .map((priority) => (
                                <CommandItem key={priority.value} value={priority.value} onSelect={() => handlePriorityToggle(priority.value)}>
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedPriorityArray.includes(priority.value) ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {priority.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
