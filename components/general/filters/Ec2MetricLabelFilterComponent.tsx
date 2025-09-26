'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import useSWR from 'swr';
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

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface EC2MetricFilterProps {
  selectedMetric: string;
  setSelectedMetric: Dispatch<SetStateAction<string>>;
  startDate: Date;
  endDate: Date;
}

export const EC2MetricFilterComponent = ({
  selectedMetric,
  setSelectedMetric,
  startDate,
  endDate,
}: EC2MetricFilterProps) => {
  const [open, setOpen] = useState(false);

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate
    ? endDate.toISOString().replace('Z', '').slice(0, -4)
    : '';

  const { data, error } = useSWR<string[]>(
    `/api/bridge/aws/ec2/metrics/labels?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  );

  const metricsList = Array.isArray(data) ? data : [];

  const getDisplayText = () => {
    if (!selectedMetric || selectedMetric.trim() === '') return 'Selecciona métrica';
    return selectedMetric;
  };

  if (error) return <div>Error cargando métricas</div>;
  if (!data) return <div>Cargando métricas...</div>;

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
          <CommandInput placeholder="Buscar métrica..." />
          <CommandList>
            <CommandEmpty>No se encontró métrica.</CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-y-auto">
              {metricsList.map((metric) => (
                <CommandItem
                  key={metric}
                  value={metric}
                  onSelect={(currentValue) => {
                    setSelectedMetric(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedMetric === metric ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {metric}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
