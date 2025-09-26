'use client';
import { Dispatch, SetStateAction, useState, useMemo } from 'react';
import useSWR from 'swr';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface MetricsFilterComponentProps {
  selectedMetrics: string;
  setSelectedMetrics: Dispatch<SetStateAction<string>>;
}

interface ApiResponse {
  grupos_disponibles: string[];
  detalles: {
    [key: string]: string[];
  };
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const MetricsFilterComponent = ({ selectedMetrics, setSelectedMetrics }: MetricsFilterComponentProps) => {
  const [open, setOpen] = useState(false);
  const apiUrl = `/api/bridge/vm/promedio-loc-ec2/grupos-disponibles`;
  const { data: apiResponse, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher);

  // Crear la lista de grupos principales (en lugar de métricas individuales)
  const metricGroups = useMemo(() => {
    if (!apiResponse?.grupos_disponibles) return [];
    return apiResponse.grupos_disponibles;
  }, [apiResponse]);

  const handleMetricToggle = (metricValue: string) => {
    if (metricValue === 'all_metrics') {
      setSelectedMetrics('');
      return;
    }
    const metricsArray = selectedMetrics
      ? selectedMetrics.split(',').map((item) => decodeURIComponent(item).trim()).filter(Boolean)
      : [];
    if (metricsArray.includes(metricValue)) {
      const updated = metricsArray.filter((m) => m !== metricValue);
      setSelectedMetrics(updated.map((m) => encodeURIComponent(m)).join(','));
    } else {
      const updated = [...metricsArray, metricValue];
      setSelectedMetrics(updated.map((m) => encodeURIComponent(m)).join(','));
    }
  };

  const getDisplayText = () => {
    if (!selectedMetrics || selectedMetrics.trim() === '') return 'Todos los Grupos de Métricas';
    const metricsArray = selectedMetrics
      .split(',')
      .map((item) => decodeURIComponent(item).trim())
      .filter((m) => m !== '');
    return metricsArray.length === 1 ? metricsArray[0] : `${metricsArray.length} grupos seleccionados`;
  };

  if (isLoading) {
    return <LoaderComponent size='small'/>
  }

  if (error || !apiResponse) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        Error al cargar grupos de métricas
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const selectedArray = selectedMetrics
    ? selectedMetrics.split(',').map((item) => decodeURIComponent(item).trim()).filter(Boolean)
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
          <CommandInput placeholder="Buscar grupo de métricas..." />
          <CommandEmpty>No se encontró el grupo de métricas.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            <CommandItem value="all_metrics" onSelect={() => handleMetricToggle('all_metrics')}>
              <Check className={`mr-2 h-4 w-4 ${!selectedMetrics || selectedMetrics.trim() === '' ? 'opacity-100' : 'opacity-0'}`} />
              Todos los Grupos de Métricas
            </CommandItem>
            {metricGroups.map((group) => {
              const groupName = group?.trim() ?? '';
              const checked = selectedArray.includes(groupName);
              return (
                <CommandItem key={groupName} value={groupName} onSelect={() => handleMetricToggle(groupName)}>
                  <Check className={`mr-2 h-4 w-4 ${checked ? 'opacity-100' : 'opacity-0'}`} />
                  {groupName}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};