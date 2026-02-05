'use client'

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { TopStorageBucketsCardsComponent } from './info/TopStorageBucketsCardsComponent';
import { TopStorageBucketsChart } from './graficos/TopStorageBucketsChart';
import { TrendStorageLineChart } from './graficos/TrendStorageLineChart';
import { BucketsHistoricalTable } from './table/BucketsHistoricalTable';

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

    // Preparar datos para gráficos de tendencia
    const metricsTimeSeries = useMemo(() => {
        if (!data?.buckets) return [];

        const grouped: Record<string, { date: string; object_count: number; total_size_gb: number }> = {};

        data.buckets.forEach((bucket: any) => {
            const date = bucket.sync_time?.$date || bucket.sync_time;
            if (!date) return;

            if (!grouped[date]) {
                grouped[date] = {
                    date,
                    object_count: 0,
                    total_size_gb: 0,
                };
            }

            grouped[date].object_count += bucket.object_count || 0;
            grouped[date].total_size_gb += bucket.tamano_gb ?? bucket.size_gb ?? 0;
        });

        return Object.values(grouped).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [data]);
    
    //DATOS PARA LOS TOP
    const bucketsForTop = useMemo(() => {
        if (!data?.buckets || data.buckets.length === 0) return [];

        // Obtener timestamp más reciente real
        const latestTimestamp = Math.max(
            ...data.buckets
                .map((b: any) => new Date(b.sync_time?.$date || b.sync_time).getTime())
                .filter((t: number) => !isNaN(t))
        );

        if (!latestTimestamp) return [];

        // Nos quedamos SOLO con buckets de ese último snapshot exacto
        return data.buckets.filter((b: any) => {
            const t = new Date(b.sync_time?.$date || b.sync_time).getTime();
            return t === latestTimestamp;
        });
    }, [data]);

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
                    data={bucketsForTop} 
                    type="objects" 
                />
                <TopStorageBucketsChart 
                    data={bucketsForTop} 
                    type="size" 
                />
            </div>

            {/* Gráficos de Tendencia */}
            <div className="grid grid-cols-1 gap-6">
                <TrendStorageLineChart
                    data={metricsTimeSeries}
                    metric="object_count"
                    title="Tendencia Cantidad de Objetos - Cloud Storage"
                    yAxisLabel="Objetos"
                />

                <TrendStorageLineChart
                    data={metricsTimeSeries}
                    metric="total_size_gb"
                    title="Tendencia Tamaño Cloud Storage"
                    yAxisLabel="Tamaño (GB)"
                />
            </div>

            {/* TODO: Tabla */}
                <BucketsHistoricalTable
                    data={data.buckets}
                    startDate={startDate.toISOString().split('T')[0]}
                    endDate={endDate.toISOString().split('T')[0]}
                />
        </div>
    );
};