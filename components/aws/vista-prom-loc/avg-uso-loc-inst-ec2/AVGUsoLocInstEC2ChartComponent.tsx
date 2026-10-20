'use client';

import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { useMemo } from 'react';
import { AVGUsoLocInstEC2ViewUsoPorRegionComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/graficos/AVGUsoLocInstEC2ViewUsoPorRegionComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';

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

interface MetricAverageGeneral {
  metric_groups: string[];
  metric_label: string;
  metric_label_original: string;
  average_value: number;
  min_value: number;
  max_value: number;
  metric_count: number;
  resource_region: string;
}

interface ApiResponseGeneral {
  metric_groups_requested: string[];
  metric_averages: MetricAverageGeneral[];
  instances_by_sync_time: unknown[];
}

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

type ApiResponse = ApiResponseGeneral | ApiResponseDetail;

interface MetricValues {
  avg: number;
  min: number;
  max: number;
  count: number;
}

interface ProcessedHeatmapData {
  region: string;
  metrics: { [key: string]: MetricValues };
}

export const AVGUsoLocInstEC2ChartComponent = ({
  startDate,
  endDate,
  instance,
  region,
  metrics
}: Props) => {
  const apiUrl = useMemo(() => {
    if (!metrics || metrics.trim() === '') return null;

    const formatDate = (date: Date) => {
      return date.toISOString().split('.')[0];
    };

    const metricGroups = metrics.split(',').map(m => decodeURIComponent(m.trim())).join(',');
    const baseUrl = '/api/aws/bridge';

    if (instance && instance !== '' && instance !== 'all') {
      const queryParams = [
        `date_from=${formatDate(startDate)}`,
        `date_to=${formatDate(endDate || new Date())}`,
        `resource_region=${region === 'all_regions' ? 'all' : region}`,
        `metric_label=${metricGroups}`,
        `instance_id=${instance}`
      ].join('&');

      return `${baseUrl}/vm/promedio-loc-ec2-detalle?${queryParams}`;
    } else {
      const queryParams = [
        `date_from=${formatDate(startDate)}`,
        `date_to=${formatDate(endDate || new Date())}`,
        region === 'all_regions' ? `resource_region=all` : `resource_region=${region}`,
        `metric_label=${metricGroups}`
      ].filter(Boolean).join('&');

      return `${baseUrl}/vm/promedio-loc-ec2?${queryParams}`;
    }
  }, [startDate, endDate, region, metrics, instance]);

  const shouldFetch = !!(startDate && endDate && apiUrl);



  const { data: apiData, error, isLoading } = useSWR<ApiResponse>(
    shouldFetch ? apiUrl : null,
    fetcher
  );

  const processedData = useMemo(() => {
    if (!apiData) return [];

    if ('instance_info' in apiData) {
      const detailData = apiData as ApiResponseDetail;

      if (!detailData.metric_averages?.length) return [];

      const regionKey = detailData.instance_info.resource_region;

      const metrics: { [key: string]: MetricValues } = {};

      detailData.metric_averages.forEach(metric => {
        metrics[metric.metric_label] = {
          avg: metric.average_value,
          min: metric.min_value,
          max: metric.max_value,
          count: metric.metric_count,
        };
      });

      return [{
        region: regionKey,
        metrics
      }];

    } else {
      const generalData = apiData as ApiResponseGeneral;

      if (!generalData.metric_averages?.length) return [];

      const regionData: { [key: string]: { [key: string]: MetricValues } } = {};

      generalData.metric_averages.forEach(metric => {
        const regionKey = metric.resource_region;

        if (!regionData[regionKey]) {
          regionData[regionKey] = {};
        }

        regionData[regionKey][metric.metric_label] = {
          avg: metric.average_value,
          min: metric.min_value,
          max: metric.max_value,
          count: metric.metric_count,
        };
      });

      return Object.entries(regionData).map(([regionName, metrics]) => ({
        region: regionName,
        metrics
      }));
    }
  }, [apiData]);

  const allMetrics = useMemo(() => {
    const metricsSet = new Set<string>();
    processedData.forEach(item => {
      Object.keys(item.metrics).forEach(metric => metricsSet.add(metric));
    });
    return Array.from(metricsSet).sort();
  }, [processedData]);

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