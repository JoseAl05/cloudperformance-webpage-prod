'use client'

import React from 'react';
import useSWR from 'swr';
//Las tarjetas
import { CloudSQLCardsComponent } from './info/CloudSQLCardsComponent';
//Los Graficos
import { CloudSQLCPUChart } from './graficos/CloudSQLCPUChart';
import { CloudSQLConnectionsChart } from './graficos/CloudSQLConnectionsChart';
import { CloudSQLStorageChart } from './graficos/CloudSQLStorageChart';
import { CloudSQLMemoryChart } from './graficos/CloudSQLMemoryChart';
//La Tabla
import { CloudSQLTable } from './table/CloudSQLTable';

interface CloudSQLComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    databaseType: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const CloudSQLComponent = ({ 
    startDate, 
    endDate, 
    projects, 
    regions,
    databaseType,
    tagKey,
    tagValue 
}: CloudSQLComponentProps) => {

    // Construcción de URL    
    let url = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/info?`;

    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) url += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') url += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') url += `database_type=${databaseType}&`;
    if (tagKey && tagKey !== 'allKeys') {
        url += `tagKey=${encodeURIComponent(tagKey)}&`;
        if (tagValue && tagValue !== 'allValues') {
            url += `tagValue=${encodeURIComponent(tagValue)}&`;
        }
    }

    const shouldFetch = !!projects;

    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

    // Fetch eficiencia global
    let efficiencyUrl = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/global_efficiency?`;
    
    if (startDate) efficiencyUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) efficiencyUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) efficiencyUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') efficiencyUrl += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') efficiencyUrl += `database_type=${databaseType}&`;

    const { data: efficiencyData, error: efficiencyError } = useSWR(
        shouldFetch ? efficiencyUrl : null, 
        fetcher, 
        { revalidateOnFocus: false }
    );    

    // Fetch gráficos
    let cpuUrl = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/cpu_usage?`;
    if (startDate) cpuUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) cpuUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) cpuUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') cpuUrl += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') cpuUrl += `database_type=${databaseType}&`;

    let connectionsUrl = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/connections?`;
    if (startDate) connectionsUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) connectionsUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) connectionsUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') connectionsUrl += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') connectionsUrl += `database_type=${databaseType}&`;

    let storageUrl = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/storage?`;
    if (startDate) storageUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) storageUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) storageUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') storageUrl += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') storageUrl += `database_type=${databaseType}&`;

    let memoryUrl = `/api/gcp/bridge/gcp/consumo/consumo_cloud_sql/memory?`;
    if (startDate) memoryUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) memoryUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) memoryUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') memoryUrl += `location=${regions}&`;
    if (databaseType && databaseType !== 'all') memoryUrl += `database_type=${databaseType}&`;

    const { data: cpuData } = useSWR(shouldFetch ? cpuUrl : null, fetcher, { revalidateOnFocus: false });
    const { data: connectionsData } = useSWR(shouldFetch ? connectionsUrl : null, fetcher, { revalidateOnFocus: false });
    const { data: storageData } = useSWR(shouldFetch ? storageUrl : null, fetcher, { revalidateOnFocus: false });
    const { data: memoryData } = useSWR(shouldFetch ? memoryUrl : null, fetcher, { revalidateOnFocus: false });

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
    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    // Estado: Error
    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de Cloud SQL</p>
            </div>
        );
    }

    // Estado: Sin datos
    if (!data || !data.instancias || data.instancias.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron instancias Cloud SQL para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Tarjetas */}
            <CloudSQLCardsComponent 
                summary={data?.resumen}
                instancias={data?.instancias || []}
                efficiency={efficiencyData}
                isLoading={isLoading}
            />

            {/* Gráficos de métricas */}
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <CloudSQLCPUChart data={cpuData} />
                <CloudSQLConnectionsChart data={connectionsData} />
                <CloudSQLStorageChart data={storageData} />
                <CloudSQLMemoryChart data={memoryData} />
            </div>

            {/* Tabla */}
            <CloudSQLTable data={data?.instancias || []} />
        </div>
    );
};