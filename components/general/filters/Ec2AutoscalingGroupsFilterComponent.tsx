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

// === Fetcher para SWR ===
const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface AutoScalingGroupFilterProps {
  selectedGroup: string;
  setSelectedGroup: Dispatch<SetStateAction<string>>;
  startDate: Date;
  endDate: Date;
}

export const AutoScalingGroupFilterComponent = ({
  selectedGroup,
  setSelectedGroup,
  startDate,
  endDate,
}: AutoScalingGroupFilterProps) => {
  const [open, setOpen] = useState(false);

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate
    ? endDate.toISOString().replace('Z', '').slice(0, -4)
    : '';

  // Llamada a la API de AutoScaling Groups (string[])
  const { data, error } = useSWR<string[]>(
    `/api/aws/bridge/aws/ec2/autoscaling/groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  );

  const groupsList = Array.isArray(data) ? data : [];

  const getDisplayText = () => {
    if (!selectedGroup || selectedGroup.trim() === '') return 'Selecciona AutoScaling Group';
    return selectedGroup;
  };

  if (error) return <div>Error cargando grupos</div>;
  if (!data) return <div>Cargando grupos...</div>;

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
          <CommandInput placeholder="Buscar grupo..." />
          <CommandList>
            <CommandEmpty>No se encontró grupo.</CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-y-auto">
              {groupsList.map((group, index) => (
                <CommandItem
                  key={group || `group-${index}`}
                  value={group}
                  onSelect={(currentValue) => {
                    setSelectedGroup(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedGroup === group ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {group}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
