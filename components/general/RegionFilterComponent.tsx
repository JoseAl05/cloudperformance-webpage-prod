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

import { aws_regions } from '@/lib/aws_regions';

interface RegionFilterComponentProps {
    selectedRegion: string;
    setSelectedRegion: Dispatch<SetStateAction<string>>;
    isRegionMultiSelect: boolean;
}

export const RegionFilterComponent = ({
    selectedRegion,
    setSelectedRegion,
    isRegionMultiSelect,
}: RegionFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!selectedRegion || selectedRegion.trim() === '') {
            return 'Selecciona región';
        }
        if (selectedRegion === 'all_regions') {
            return 'Todas las Regiones';
        }
        const regionArray = selectedRegion.split(',').filter((s) => s.trim() !== '');
        if (regionArray.length === 1) {
            const found = aws_regions.find((r) => r.value === regionArray[0]);
            return found ? found.label : regionArray[0];
        }
        return `${regionArray.length} regiones seleccionadas`;
    };

    const handleRegionToggle = (regionValue: string) => {
        if (regionValue === 'all_regions') {
            setSelectedRegion('all_regions');
        } else {
            const regionArray = selectedRegion ? selectedRegion.split(',') : [];
            if (regionArray.includes(regionValue)) {
                const updated = regionArray.filter((s) => s !== regionValue);
                setSelectedRegion(updated.join(','));
            } else {
                const updated = [...regionArray, regionValue];
                setSelectedRegion(updated.join(','));
            }
        }
    };

    const selectedRegionArray = selectedRegion ? selectedRegion.split(',') : [];

    return !isRegionMultiSelect ? (
        // === SINGLE SELECT MODE ===
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                >
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar región..." />
                    <CommandList>
                        <CommandEmpty>No se encontró región.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {aws_regions.map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={(currentValue) => {
                                        setSelectedRegion(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedRegion === region.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {region.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    ) : (
        // === MULTI SELECT MODE ===
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                >
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar región..." />
                    <CommandEmpty>No se encontró la región.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        <CommandItem
                            value="all_regions"
                            onSelect={() => setSelectedRegion('all_regions')}
                        >
                            <Check
                                className={`mr-2 h-4 w-4 ${selectedRegion === 'all_regions' ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                            Todas las Regiones
                        </CommandItem>
                        {aws_regions
                            .filter((r) => r.value !== 'all_regions')
                            .map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={() => handleRegionToggle(region.value)}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedRegionArray.includes(region.value)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            }`}
                                    />
                                    {region.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
