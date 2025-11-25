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
// import { aws_regions } from '@/lib/aws_regions';
import { aws_variacion_servicios } from '@/lib/aws_variacion_servicios'

// interface RegionFilterComponentProps {
//     selectedRegion: string;
//     setSelectedRegion: Dispatch<SetStateAction<string>>;
//     isRegionMultiSelect: boolean;
// }

interface VariationServiceFilterComponentProps {
    selectedService: string;
    setSelectedService: Dispatch<SetStateAction<string>>;
}

export const VariationServiceFilterComponent = ({
    selectedService,
    setSelectedService,
}: VariationServiceFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!selectedService || selectedService.trim() === '') return 'Selecciona servicio';
        if (selectedService === 'all_services') return 'Todos los servicios';
        const serviceArray = selectedService.split(',').filter((s) => s.trim() !== '');
        if (serviceArray.length === 1) {
            const found = aws_variacion_servicios.find((r) => r.value === serviceArray[0]);
            return found ? found.label : serviceArray[0];
        }
        return `${serviceArray.length} Servicios seleccionados`;
    };

    const handleServiceToggle = (serviceValue: string) => {
        let serviceArray = selectedService ? selectedService.split(',').filter(Boolean) : [];

        if (serviceValue === 'all_services') {
            serviceArray = ['all_services'];
        } else {
            serviceArray = serviceArray.filter((r) => r !== 'all_services');
            if (serviceArray.includes(serviceValue)) {
                serviceArray = serviceArray.filter((r) => r !== serviceValue);
            } else {
                serviceArray.push(serviceValue);
            }
        }
        setSelectedService(serviceArray.length ? serviceArray.join(',') : 'all_services');
    };

    const selectedserviceArray = selectedService ? selectedService.split(',').filter(Boolean) : [];

    // return ( 
    //     <Popover open={open} onOpenChange={setOpen}>
    //         <PopoverTrigger asChild>
    //             <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
    //                 {getDisplayText()}
    //                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //             </Button>
    //         </PopoverTrigger>
    //         <PopoverContent className="w-[300px] p-0">
    //             <Command>
    //                 <CommandInput placeholder="Buscar región..." />
    //                 <CommandEmpty>No se encontró el servicio.</CommandEmpty>
    //                 <CommandGroup className="max-h-[200px] overflow-y-auto">
    //                     <CommandItem value="all_services" onSelect={() => handleServiceToggle('all_services')}>
    //                         <Check className={`mr-2 h-4 w-4 ${selectedService === 'all_services' ? 'opacity-100' : 'opacity-0'}`} />
    //                         Todos los servicios
    //                     </CommandItem>
    //                     {aws_variacion_servicios
    //                         .filter((r) => r.value !== 'all_services')
    //                         .map((service) => (
    //                             <CommandItem key={service.value} value={service.value} onSelect={() => handleServiceToggle(service.value)}>
    //                                 <Check
    //                                     className={`mr-2 h-4 w-4 ${selectedserviceArray.includes(service.value) ? 'opacity-100' : 'opacity-0'}`}
    //                                 />
    //                                 {service.label}
    //                             </CommandItem>
    //                         ))}
    //                 </CommandGroup>
    //             </Command>
    //         </PopoverContent>
    //     </Popover>
    // );

    return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                        {getDisplayText()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar servicio..." />
                        <CommandList>
                            <CommandEmpty>No se encontró servicio.</CommandEmpty>
                            <CommandGroup className="max-h-[250px] overflow-y-auto">
                                {aws_variacion_servicios.map((servicio) => (
                                    <CommandItem
                                        key={servicio.value}
                                        value={servicio.value}
                                        onSelect={(currentValue) => {
                                            setSelectedService(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedService === servicio.value ? 'opacity-100' : 'opacity-0')} />
                                        {servicio.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
};
