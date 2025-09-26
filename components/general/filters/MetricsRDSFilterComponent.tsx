'use client';
import { Dispatch, SetStateAction, useState, useMemo, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface MetricsRDSFilterComponentProps {
  selectedMetrics: string;
  setSelectedMetrics: Dispatch<SetStateAction<string>>;
  rdsService: 'postgresql' | 'oracle' | 'mysql' | 'sqlserver' | 'mariadb';
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

export const MetricsRDSFilterComponent = ({ selectedMetrics, setSelectedMetrics, rdsService }: MetricsRDSFilterComponentProps) => {
  const [open, setOpen] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(250); // Estado para el ancho dinámico
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  
  // URL dinámica basada en el servicio RDS
  const getApiUrl = (service: string) => {
    const serviceMap: { [key: string]: string } = {
      'postgresql': 'rds-pg',
      'oracle': 'rds-oracle',
      'mysql': 'rds-mysql',
      'sqlserver': 'rds-sqlserver',
      'mariadb': 'rds-mariadb'
    };
    
    const endpoint = serviceMap[service] || 'rds-pg';
    return `/api/bridge/db/promedio-loc-${endpoint}/grupos-disponibles`;
  };

  const apiUrl = getApiUrl(rdsService);
  const { data: apiResponse, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher);

  // Crear la lista de grupos principales para RDS
  const metricGroups = useMemo(() => {
    if (!apiResponse?.grupos_disponibles) return [];
    return apiResponse.grupos_disponibles;
  }, [apiResponse]);

  const getDisplayText = () => {
    if (!selectedMetrics || selectedMetrics.trim() === '') return `Todos los Grupos de Métricas RDS ${rdsService.charAt(0).toUpperCase() + rdsService.slice(1)}`;
    const metricsArray = selectedMetrics
      .split(',')
      .map((item) => decodeURIComponent(item).trim())
      .filter((m) => m !== '');
    return metricsArray.length === 1 ? metricsArray[0] : `${metricsArray.length} grupos seleccionados`;
  };

  // Calcular ancho dinámico basado en el texto
  useEffect(() => {
    if (hiddenSpanRef.current) {
      const textWidth = hiddenSpanRef.current.offsetWidth;
      // Ancho mínimo 200px, máximo 400px, con padding para el ícono
      const calculatedWidth = Math.max(200, Math.min(400, textWidth + 60));
      setButtonWidth(calculatedWidth);
    }
  }, [selectedMetrics, rdsService, apiResponse]); // Recalcular cuando cambien estos valores

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

  if (isLoading) {
    return <LoaderComponent size='small'/>
  }

  if (error || !apiResponse) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className="min-w-[200px] max-w-[400px] w-auto justify-between"
      >
        <span className="truncate">
          Error al cargar grupos de métricas RDS {rdsService}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const selectedArray = selectedMetrics
    ? selectedMetrics.split(',').map((item) => decodeURIComponent(item).trim()).filter(Boolean)
    : [];

  const displayText = getDisplayText();

  return (
    <div className="relative">
      {/* Elemento oculto para medir el texto */}
      <span 
        ref={hiddenSpanRef}
        className="invisible absolute whitespace-nowrap text-sm px-3 py-2"
        style={{ 
          fontFamily: 'inherit',
          fontSize: '14px', // Mismo tamaño que el botón
          fontWeight: '400'
        }}
      >
        {displayText}
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open} 
            style={{ width: `${buttonWidth}px` }}
            className="justify-between min-w-[200px] max-w-[400px]"
          >
            <span className="truncate flex-1 text-left">
              {displayText}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0"
          style={{ width: `${Math.max(buttonWidth, 300)}px` }} // Al menos tan ancho como el botón
        >
          <Command>
            <CommandInput placeholder={`Buscar grupo de métricas RDS ${rdsService}...`} />
            <CommandEmpty>No se encontró el grupo de métricas RDS.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              <CommandItem value="all_metrics" onSelect={() => handleMetricToggle('all_metrics')}>
                <Check className={`mr-2 h-4 w-4 ${!selectedMetrics || selectedMetrics.trim() === '' ? 'opacity-100' : 'opacity-0'}`} />
                <span className="truncate">
                  Todos los Grupos de Métricas RDS {rdsService.charAt(0).toUpperCase() + rdsService.slice(1)}
                </span>
              </CommandItem> 
              {metricGroups.map((group) => {
                const groupName = group?.trim() ?? '';
                const checked = selectedArray.includes(groupName);
                return (
                  <CommandItem key={groupName} value={groupName} onSelect={() => handleMetricToggle(groupName)}>
                    <Check className={`mr-2 h-4 w-4 ${checked ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="truncate">
                      {groupName}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};