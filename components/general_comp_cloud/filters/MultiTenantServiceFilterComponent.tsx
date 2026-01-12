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
    PopoverTrigger
} from '@/components/ui/popover';
import { azure_compute_services } from '@/lib/azure_services';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { aws_compute_services } from '@/lib/aws_services';

interface MultiTenantServiceFilterComponentProps {
    service: string;
    setService: Dispatch<SetStateAction<string>>;
    payload: ReqPayload;
}

export const MultiTenantServiceFilterComponent = ({
    service,
    setService,
    payload
}: MultiTenantServiceFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    let servicesList = [];

    if (payload.cloud_provider === 'Azure') {
        servicesList = azure_compute_services;
    } else if (payload.cloud_provider === 'AWS') {
        servicesList = aws_compute_services;
    }


    const getDisplayText = () => {
        if (!service || service.trim() === '') return 'Selecciona servicio';

        const selectedService = servicesList.find((s) => s.value === service);

        // Si encuentra el servicio, muestra el label. 
        // Si no (ej. error de datos), muestra el valor crudo o un fallback, pero no "undefined"
        return selectedService ? selectedService.label : service;
    };

    const handleServiceToggle = (serviceValue: string) => {
        setService(serviceValue ? serviceValue : '');
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar servicio..." />
                    <CommandEmpty>No se encontró el servicio.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {servicesList
                            .filter((s) => s.value !== 'all')
                            .map((serv) => (
                                <CommandItem key={serv.value} value={serv.value} onSelect={() => handleServiceToggle(serv.value)}>
                                    <Check
                                        className={`mr-2 h-4 w-4 ${service === serv.value ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {serv.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
};
