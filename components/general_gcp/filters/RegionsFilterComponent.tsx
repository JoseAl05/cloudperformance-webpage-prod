'use client';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
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
// Importamos la lista que acabamos de crear
import { gcp_regions } from '@/lib/gcp_regions';

interface RegionsFilterComponentProps {
    // Mantengo los nombres de props que usa tu padre (FiltersComponent)
    regions: string;
    setRegions: Dispatch<SetStateAction<string>>;
}

export const RegionsFilterComponent = ({
    regions,
    setRegions,
}: RegionsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    // Auto-seleccionar "Todas" si viene vacío al inicio
    useEffect(() => {
        if (!regions) {
            setRegions('all_regions');
        }
    }, [regions, setRegions]);

    const getDisplayText = () => {
        if (!regions || regions.trim() === '') return 'Selecciona región';
        if (regions === 'all_regions') return 'Todas las Regiones';
        
        const regionArray = regions.split(',').filter((s) => s.trim() !== '');
        
        if (regionArray.length === 1) {
            const found = gcp_regions.find((r) => r.value === regionArray[0]);
            return found ? found.label : regionArray[0];
        }
        return `${regionArray.length} regiones seleccionadas`;
    };

    const handleRegionToggle = (regionValue: string) => {
        let regionArray = regions ? regions.split(',').filter(Boolean) : [];

        if (regionValue === 'all_regions') {
            regionArray = ['all_regions'];
        } else {
            // Si selecciono una específica, quito "all_regions"
            regionArray = regionArray.filter((r) => r !== 'all_regions');
            
            if (regionArray.includes(regionValue)) {
                // Si ya estaba, la quito (toggle off)
                regionArray = regionArray.filter((r) => r !== regionValue);
            } else {
                // Si no estaba, la agrego (toggle on)
                regionArray.push(regionValue);
            }
        }
        // Si me quedé sin nada, vuelvo a 'all_regions' por defecto
        setRegions(regionArray.length ? regionArray.join(',') : 'all_regions');
    };

    const selectedRegionArray = regions ? regions.split(',').filter(Boolean) : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar región..." />
                    <CommandList>
                        <CommandEmpty>No se encontró la región.</CommandEmpty>
                    <CommandGroup className="max-h-[250px] overflow-y-auto">
                        
                        {/* 1. Opción Manual "Todas las Regiones" (Déjala tal cual) */}
                        <CommandItem value="all_regions" onSelect={() => handleRegionToggle('all_regions')}>
                            <Check className={cn('mr-2 h-4 w-4', regions === 'all_regions' ? 'opacity-100' : 'opacity-0')} />
                            Todas las Regiones
                        </CommandItem>

                        {/* 2. Lista filtrada (Aquí es donde agregamos el .filter) */}
                        {gcp_regions
                            .filter((r) => r.value !== 'all_regions') // <--- ESTA ES LA LÍNEA MÁGICA
                            .map((region) => (
                                <CommandItem 
                                    key={region.value} 
                                    value={region.value} 
                                    onSelect={() => handleRegionToggle(region.value)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedRegionArray.includes(region.value) && !selectedRegionArray.includes('all_regions') 
                                                ? 'opacity-100' 
                                                : 'opacity-0'
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
    );
};