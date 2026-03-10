'use client'

import React from 'react';
import useSWR from 'swr';
import { ComputeEngineConsumeCardsComponent } from '@/components/gcp/vista-consumos/compute-engine/info/ComputeEngineConsumeCardsComponent';
import { ComputeEngineConsumeChartComponent } from '@/components/gcp/vista-consumos/compute-engine/grafico/ComputeEngineConsumeChartComponent';
import { ComputeEngineConsumeTableComponent } from '@/components/gcp/vista-consumos/compute-engine/table/ComputeEngineConsumeTableComponent';

interface InstanceGroupConsumeComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    resourceId: string;
    // tagKey?: string | null;
    // tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const InstanceGroupConsumeComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    resourceId
    // tagKey,
    // tagValue
}: InstanceGroupConsumeComponentProps) => {

    // Construcción de URL
    let infoUrl = `/api/gcp/bridge/gcp/consumo/instance_group/info?`;

    if (startDate) infoUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) infoUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) infoUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') infoUrl += `region=${regions}&`;
    if (resourceId) infoUrl += `resources_id=${resourceId}&`;
    // if (tagKey && tagKey !== 'allKeys') {
    //     infoUrl += `tag_key=${encodeURIComponent(tagKey)}&`;
    //     if (tagValue && tagValue !== 'allValues') {
    //         infoUrl += `tag_value=${encodeURIComponent(tagValue)}&`;
    //     }
    // }

    const shouldFetch = !!projects;

    const infoData = useSWR(shouldFetch ? infoUrl : null, fetcher, {
        revalidateOnFocus: false,
    });

    // Fetch eficiencia global
    let efficiencyUrl = `/api/gcp/bridge/gcp/consumo/instance_group/global_efficiency?`;

    if (startDate) efficiencyUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) efficiencyUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) efficiencyUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') efficiencyUrl += `location=${regions}&`;
    if (resourceId) efficiencyUrl += `resource=${resourceId}&`;

    const efficiencyData = useSWR(
        shouldFetch ? efficiencyUrl : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    // Fetch gráficos
    let metricsUrl = `/api/gcp/bridge/gcp/consumo/consumo_instance_group?`;
    if (startDate) metricsUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) metricsUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) metricsUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') metricsUrl += `location=${regions}&`;
    if (resourceId) metricsUrl += `resource=${resourceId}&`;


    const metricsData = useSWR(shouldFetch ? metricsUrl : null, fetcher, { revalidateOnFocus: false });

    const anyLoading =
        infoData.isLoading ||
        efficiencyData.isLoading ||
        metricsData.isLoading;
    const anyError =
        infoData.error ||
        efficiencyData.error ||
        metricsData.error;

        console.log(infoData.data);
    const hasInfoData = !!infoData.data && infoData.data.length > 0;
    const hasEfficiencyData = !!efficiencyData.data && efficiencyData.data.length > 0;
    const hasMetricsData = !!metricsData.data && metricsData.data.length > 0;

    const noneHasData = !hasInfoData && !hasEfficiencyData && !hasMetricsData;

    // Estado: Sin proyecto seleccionado
    if (!projects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    No se ha seleccionado ningún proyecto.
                </div>
            </div>
        );
    }

    // Estado: Cargando
    if (anyLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    // Estado: Error
    if (anyError) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de Compute Engine</p>
            </div>
        );
    }

    // Estado: Sin datos
    if (noneHasData) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron instancias Compute Engine para los filtros seleccionados.</p>
            </div>
        );
    }

    console.log(metricsData.data);

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Tarjetas */}
            <ComputeEngineConsumeCardsComponent
                summary={infoData?.data.resumen}
                instancias={infoData?.data.instancias}
                efficiency={efficiencyData.data}
                isLoading={infoData.isLoading}
            />
            {/* <CloudSQLCardsComponent
                summary={data?.resumen}
                instancias={data?.instancias || []}
                efficiency={efficiencyData}
                isLoading={isLoading}
            /> */}

            {/* Gráficos de métricas */}
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <ComputeEngineConsumeChartComponent
                    data={metricsData.data}
                />
                {/* <CloudSQLCPUChart data={cpuData} />
                <CloudSQLConnectionsChart data={connectionsData} />
                <CloudSQLStorageChart data={storageData} />
                <CloudSQLMemoryChart data={memoryData} /> */}
            </div>

            {/* Tabla */}
            {/* <CloudSQLTable data={data?.instancias || []} /> */}
            <ComputeEngineConsumeTableComponent
                data={infoData?.data.instancias || []}
            />
        </div>
    );
};