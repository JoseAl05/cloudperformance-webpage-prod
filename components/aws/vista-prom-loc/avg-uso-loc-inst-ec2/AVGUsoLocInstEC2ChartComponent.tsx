'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { AVGUsoLocInstEC2ViewUsoPorRegionComponent } from './graficos/AVGUsoLocInstEC2ViewUsoPorRegionComponent';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface Props {
  startDate: Date;
  endDate?: Date;
  instance: string;
  region: string;
  selectedKey?: string | null;
  selectedValue?: string | null;
  services?: string;
  metrics?: string;
}

// Interfaces para respuesta general (/promedio-loc-ec2)
interface MetricAverageGeneral {
  metric_groups: string[];
  metric_label: string;
  metric_label_original: string;
  average_value: number;
  metric_count: number;
  resource_region: string;
}

interface ApiResponseGeneral {
  metric_groups_requested: string[];
  metric_averages: MetricAverageGeneral[];
  instances_by_sync_time: unknown[];
}

// Interfaces para respuesta de detalle (/promedio-loc-ec2-detalle)
interface MetricAverageDetail {
  metric_group?: string;
  metric_groups?: string[];
  metric_label: string;
  metric_label_original: string;
  average_value: number;
  min_value: number;
  max_value: number;
  metric_count: number;
  resource_region?: string;
}

interface InstanceInfo {
  instance_id: string;
  instance_type: string | null;
  resource_region: string;
  is_from_asg: boolean;
  sync_time_range: {
    from: string;
    to: string;
  };
}

interface ApiResponseDetail {
  instance_info: InstanceInfo;
  metric_averages: MetricAverageDetail[];
}

// Union type para ambas respuestas
type ApiResponse = ApiResponseGeneral | ApiResponseDetail;

interface ProcessedHeatmapData {
  region: string;
  metrics: { [key: string]: number };
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const AVGUsoLocInstEC2ChartComponent = ({
  startDate,
  endDate,
  instance,
  region,
  metrics
}: Props) => {
  // Construir la URL de la API con lógica híbrida
  const apiUrl = useMemo(() => {
    if (!metrics || metrics.trim() === '') return null;

    // Formatear fechas exactamente como en tu ejemplo: 2025-08-01T00:00:00
    const formatDate = (date: Date) => {
      return date.toISOString().split('.')[0]; // Elimina milisegundos y Z
    };

    // Los grupos de métricas decodificados y separados por coma
    const metricGroups = metrics.split(',').map(m => decodeURIComponent(m.trim())).join(',');
    const baseUrl = '/api/bridge';

    // LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
    if (instance && instance !== '' && instance !== 'all') {
      // Endpoint para instancia específica
      const queryParams = [
        `date_from=${formatDate(startDate)}`,
        `date_to=${formatDate(endDate || new Date())}`,
        `resource_region=${region === 'all_regions' ? 'all' : region}`,
        `metric_label=${metricGroups}`,
        `instance_id=${instance}`
      ].join('&');

      return `${baseUrl}/vm/promedio-loc-ec2-detalle?${queryParams}`;
    } else {
      // Endpoint general (comportamiento original)
      const queryParams = [
        `date_from=${formatDate(startDate)}`,
        `date_to=${formatDate(endDate || new Date())}`,
        region === 'all_regions' ? `resource_region=all` : `resource_region=${region}`,
        `metric_label=${metricGroups}`
      ].filter(Boolean).join('&');

      return `${baseUrl}/vm/promedio-loc-ec2?${queryParams}`;
    }
  }, [startDate, endDate, region, metrics, instance]);

  // Solo hacer la petición si tenemos los parámetros mínimos
  const shouldFetch = !!(startDate && endDate && apiUrl);

  // Debug: log de la URL generada
  if (apiUrl) {
    console.log('Generated API URL:', apiUrl);
    console.log('Instance parameter:', instance);
    console.log('Using endpoint:', instance && instance !== '' && instance !== 'all' ? 'DETALLE' : 'GENERAL');
  }

  const { data: apiData, error, isLoading } = useSWR<ApiResponse>(
    shouldFetch ? apiUrl : null,
    fetcher
  );

  // Procesar datos para el heatmap con lógica híbrida
  const processedData = useMemo(() => {
    if (!apiData) return [];

    // Detectar tipo de respuesta basado en la estructura
    if ('instance_info' in apiData) {
      // RESPUESTA DE DETALLE - instancia específica
      const detailData = apiData as ApiResponseDetail;

      if (!detailData.metric_averages?.length) return [];

      const regionKey = detailData.instance_info.resource_region;

      console.log('DEBUG DETALLE - instance_info:', detailData.instance_info);
      console.log('DEBUG DETALLE - regionKey:', regionKey);
      console.log('DEBUG DETALLE - primera métrica:', detailData.metric_averages[0]);


      const metrics: { [key: string]: number } = {};

      detailData.metric_averages.forEach(metric => {
        metrics[metric.metric_label] = metric.average_value;
      });

      return [{
        region: regionKey,
        metrics
      }];

    } else {
      // RESPUESTA GENERAL - todas las instancias (lógica original)
      const generalData = apiData as ApiResponseGeneral;

      if (!generalData.metric_averages?.length) return [];

      // Agrupar métricas por región real (solo regiones con datos)
      const regionData: { [key: string]: { [key: string]: number } } = {};

      generalData.metric_averages.forEach(metric => {
        const regionKey = metric.resource_region; // Usar la región real de cada métrica

        if (!regionData[regionKey]) {
          regionData[regionKey] = {};
        }

        regionData[regionKey][metric.metric_label] = metric.average_value;
      });

      // Solo devolver regiones que realmente tienen datos
      return Object.entries(regionData).map(([regionName, metrics]) => ({
        region: regionName,
        metrics
      }));
    }
  }, [apiData]);

  // Obtener todas las métricas únicas
  const allMetrics = useMemo(() => {
    const metricsSet = new Set<string>();
    processedData.forEach(item => {
      Object.keys(item.metrics).forEach(metric => metricsSet.add(metric));
    });
    return Array.from(metricsSet).sort();
  }, [processedData]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <LoaderComponent size="large" />
        <span className="ml-3">Cargando métricas EC2...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar datos</h3>
        <p className="text-sm mt-1">
          No se pudieron obtener las métricas de EC2: {error.message}
        </p>
      </div>
    );
  }

  if (!metrics || metrics.trim() === '') {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="text-center text-gray-500 text-lg font-medium">
          Selecciona al menos una métrica para visualizar los datos
        </div>
      </div>
    );
  }

  // Mensaje cuando no hay instancia seleccionada (opcional)
  if (!instance || instance === '' || instance === 'all') {
    if (processedData.length === 0) {
      return (
        <div className="w-full min-w-0 px-4 py-6">
          <div className="text-center text-gray-500 text-lg font-medium">
            No hay datos disponibles para el período y métricas seleccionadas
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full min-w-0">
      <AVGUsoLocInstEC2ViewUsoPorRegionComponent
        data={processedData}
        allMetrics={allMetrics}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};