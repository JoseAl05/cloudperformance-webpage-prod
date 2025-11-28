'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import useSWR from 'swr';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';

interface ServiceFilterComponentProps {
  selectedServices: string;
  setSelectedServices: Dispatch<SetStateAction<string>>;
}

interface ServiceData {
  SERVICE: string;
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

export const ServiceFilterComponent = ({ selectedServices, setSelectedServices }: ServiceFilterComponentProps) => {
  const [open, setOpen] = useState(false);
  const apiUrl = `/api/aws/bridge/funcion/servicios-disponibles`;
  const { data: services, error, isLoading } = useSWR<ServiceData[]>(apiUrl, fetcher);

  const handleServiceToggle = (serviceValue: string) => {
    if (serviceValue === 'all_services') {
      setSelectedServices('all_services');
      return;
    }

    let servicesArray = selectedServices
      ? selectedServices.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    if (servicesArray.includes('all_services')) {
      servicesArray = [];
    }

    if (servicesArray.includes(serviceValue)) {
      const updated = servicesArray.filter((s) => s !== serviceValue);
      if (updated.length === 0) {
        setSelectedServices('all_services');
      } else {
        setSelectedServices(updated.map((s) => s).join(','));
      }
    } else {
      const updated = [...servicesArray, serviceValue];
      setSelectedServices(updated.map((s) => s).join(','));
    }
  };

  const getDisplayText = () => {
    if (!selectedServices || selectedServices.trim() === 'all_services') return 'Todos los Servicios';
    const servicesArray = selectedServices
      .split(',')
      .map((item) => decodeURIComponent(item).trim())
      .filter((s) => s !== '');
    return servicesArray.length === 1 ? servicesArray[0] : `${servicesArray.length} servicios seleccionados`;
  };

  if (isLoading) {
    return <LoaderComponent size='small' />
  }

  if (error || !services) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        Error al cargar servicios
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const selectedArray = selectedServices
    ? selectedServices.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

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
            <CommandItem value="all_services" onSelect={() => handleServiceToggle('all_services')}>
              <Check className={`mr-2 h-4 w-4 ${!selectedServices || selectedServices.trim() === '' ? 'opacity-100' : 'opacity-0'}`} />
              Todos los Servicios
            </CommandItem>
            {services.map((service) => {
              const svc = service.SERVICE?.trim() ?? '';
              const checked = selectedArray.includes(svc);
              return (
                <CommandItem key={svc} value={svc} onSelect={() => handleServiceToggle(svc)}>
                  <Check className={`mr-2 h-4 w-4 ${checked ? 'opacity-100' : 'opacity-0'}`} />
                  {svc}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
