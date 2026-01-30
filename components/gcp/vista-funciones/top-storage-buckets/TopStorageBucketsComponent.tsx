'use client'

import React from 'react';
import useSWR from 'swr';
import { TopStorageBucketsCardsComponent } from './info/TopStorageBucketsCardsComponent';
import { TopStorageBucketsChart } from './graficos/TopStorageBucketsChart';

interface TopStorageBucketsComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    storageClass: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const TopStorageBucketsComponent = ({ 
    startDate, 
    endDate, 
    projects, 
    regions,
    storageClass,
    tagKey,
    tagValue 
}: TopStorageBucketsComponentProps) => {

    // Construcción de URL
    let url = `/api/gcp/bridge/gcp/funcion/cloud_storage_buckets?`;

    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) url += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') url += `location=${regions}&`;
    if (storageClass && storageClass !== 'all') url += `storage_class=${storageClass}&`;
    if (tagKey && tagKey !== 'allKeys') {
        url += `tag_key=${encodeURIComponent(tagKey)}&`;
        if (tagValue && tagValue !== 'allValues') {
            url += `tag_value=${encodeURIComponent(tagValue)}&`;
        }
    }

    const shouldFetch = !!projects;

    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

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
                <p className="text-sm mt-1">No se pudieron obtener los datos de buckets</p>
            </div>
        );
    }

    // Estado: Sin datos
    if (!data || !data.buckets || data.buckets.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron buckets para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Cards */}
            <TopStorageBucketsCardsComponent 
                summary={data?.resumen}
                buckets={data?.buckets || []}
                isLoading={isLoading}
            />

            {/* 2 Gráficos TOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopStorageBucketsChart 
                    data={data?.buckets || []} 
                    type="objects" 
                />
                <TopStorageBucketsChart 
                    data={data?.buckets || []} 
                    type="size" 
                />
            </div>

            {/* TODO: 2 Gráficos temporales */}
            <div className="text-sm text-muted-foreground">
                Gráficos temporales aquí
            </div>

            {/* TODO: Tabla */}
            <div className="text-sm text-muted-foreground">
                Tabla aquí
            </div>
        </div>
    );
};