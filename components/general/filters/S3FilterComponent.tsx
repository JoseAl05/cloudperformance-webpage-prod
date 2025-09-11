'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import useSWR from 'swr';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface S3BucketFilterProps {
  selectedBuckets: string;
  setSelectedBuckets: Dispatch<SetStateAction<string>>;
  startDate: Date;
  endDate: Date;
  region?: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

export const S3BucketFilter = ({
  selectedBuckets,
  setSelectedBuckets,
  startDate,
  endDate,
  region = 'all_regions',
}: S3BucketFilterProps) => {
  const [open, setOpen] = useState(false);

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate
    ? endDate.toISOString().replace('Z', '').slice(0, -4)
    : '';

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/s3/s3_buckets/list?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;

  const { data, error, isLoading } = useSWR<{ buckets: string[] }>(apiUrl, fetcher);

  const bucketsList = data?.buckets || [];

  const handleBucketToggle = (bucket: string) => {
    if (bucket === 'all') {
      setSelectedBuckets('all');
      return;
    }

    const current =
      selectedBuckets === 'all'
        ? []
        : selectedBuckets.split(',').filter((b) => b.trim() !== '');

    const alreadySelected = current.includes(bucket);

    const updated = alreadySelected
      ? current.filter((b) => b !== bucket)
      : [...current, bucket];

    setSelectedBuckets(updated.length === 0 ? '' : updated.join(','));
  };

  const getDisplayText = () => {
    if (!selectedBuckets.trim()) return 'Selecciona un Bucket';
    if (selectedBuckets === 'all') return 'Todos los Buckets';

    const selectedArray = selectedBuckets.split(',').filter(Boolean);
    if (selectedArray.length === 1) return selectedArray[0];

    return `${selectedArray.length} buckets seleccionados`;
  };

  const selectedArray =
    selectedBuckets === 'all'
      ? []
      : selectedBuckets.split(',').filter(Boolean);

  // --- Render States ---
  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        Cargando buckets...
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    );
  }

  if (error || !data) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        Error al cargar buckets
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    );
  }

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
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar bucket..." />
          <CommandEmpty>No se encontró el bucket.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {/* Opción: Todos */}
            <CommandItem value="all" onSelect={() => handleBucketToggle('all')}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedBuckets === 'all' ? 'opacity-100' : 'opacity-0'
                }`}
              />
              Todos los Buckets
            </CommandItem>

            {/* Buckets individuales */}
            {bucketsList.map((bucket) => {
              const checked = selectedArray.includes(bucket);
              return (
                <CommandItem
                  key={bucket}
                  value={bucket}
                  onSelect={() => handleBucketToggle(bucket)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      checked ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {bucket}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
