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
import { gcp_services } from '@/lib/gcp_services';

interface ServiceFilterComponentProps {
  selectedService: string;
  setSelectedService: Dispatch<SetStateAction<string>>;
  isServiceMultiselect: boolean;
}

export const ServiceFilterComponent = ({
  selectedService,
  setSelectedService,
  isServiceMultiselect,
}: ServiceFilterComponentProps) => {
  const [open, setOpen] = useState(false);

  const getDisplayText = () => {
    if (!selectedService || selectedService.trim() === '')
      return 'Selecciona servicio';

    if (selectedService === 'all') return 'Todos los Servicios';

    const serviceArray = selectedService.split(',').filter((s) => s.trim() !== '');

    if (serviceArray.length === 1) {
      const found = gcp_services.find((s) => s.value === serviceArray[0]);
      return found ? found.label : serviceArray[0];
    }

    return `${serviceArray.length} servicios seleccionados`;
  };

  const handleServiceToggle = (serviceValue: string) => {
    let serviceArray = selectedService
      ? selectedService.split(',').filter(Boolean)
      : [];

    if (serviceValue === 'all') {
      serviceArray = ['all'];
    } else {
      serviceArray = serviceArray.filter((s) => s !== 'all');

      if (serviceArray.includes(serviceValue)) {
        serviceArray = serviceArray.filter((s) => s !== serviceValue);
      } else {
        serviceArray.push(serviceValue);
      }
    }

    setSelectedService(serviceArray.length ? serviceArray.join(',') : 'all');
  };

  const selectedServiceArray = selectedService
    ? selectedService.split(',').filter(Boolean)
    : [];

  // ---------- SINGLE SELECT ----------
  if (!isServiceMultiselect) {
    return (
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
            <CommandInput placeholder="Buscar servicios GCP..." />
            <CommandList>
              <CommandEmpty>No se encontró el servicio.</CommandEmpty>
              <CommandGroup className="max-h-[250px] overflow-y-auto">
                {gcp_services
                  .filter((s) => s.value !== 'all')
                  .map((service) => (
                    <CommandItem
                      key={service.value}
                      value={service.value}
                      onSelect={(currentValue) => {
                        setSelectedService(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedService === service.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {service.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // ---------- MULTI SELECT ----------
  return (
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
          <CommandInput placeholder="Buscar servicio GCP..." />
          <CommandEmpty>No se encontró el servicio.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            <CommandItem value="all" onSelect={() => handleServiceToggle('all')}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedService === 'all' ? 'opacity-100' : 'opacity-0'
                }`}
              />
              Todos los Servicios
            </CommandItem>

            {gcp_services
              .filter((s) => s.value !== 'all')
              .map((service) => (
                <CommandItem
                  key={service.value}
                  value={service.value}
                  onSelect={() => handleServiceToggle(service.value)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedServiceArray.includes(service.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                  {service.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};