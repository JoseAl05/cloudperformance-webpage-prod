'use client'
import type { ComponentProps } from 'react';

import { fetcher } from '@/lib/fetcher';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { TopStorageBucketsCardsComponent } from './info/TopStorageBucketsCardsComponent';
import { TopStorageBucketsChart } from './graficos/TopStorageBucketsChart';
import { TrendStorageLineChart } from './graficos/TrendStorageLineChart';
import { BucketsHistoricalTable } from './table/BucketsHistoricalTable';

type StorageBucket = NonNullable<ComponentProps<typeof BucketsHistoricalTable>['data']>[number] & NonNullable<ComponentProps<typeof TopStorageBucketsChart>['data']>[number];
interface TopStorageBucketsResponse {
    resumen?: ComponentProps<typeof TopStorageBucketsCardsComponent>['summary'];
    buckets?: StorageBucket[];
}

const bucketDate = (bucket: StorageBucket): string => {
    const raw: unknown = bucket.sync_time;
    if (raw && typeof raw === 'object' && '$date' in raw) return String((raw as { $date: string }).$date);
    return typeof raw === 'string' ? raw : '';
};

interface TopStorageBucketsComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    storageClass: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const TopStorageBucketsComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    storageClass,
    tagKey,
    tagValue
}: TopStorageBucketsComponentProps) => {

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

    const { data, error, isLoading } = useSWR<TopStorageBucketsResponse>(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

    const metricsTimeSeries = useMemo(() => {
        if (!data?.buckets) return [];

        const grouped: Record<string, { date: string; object_count: number; total_size_gb: number }> = {};

        data.buckets.forEach((bucket) => {
            const date = bucketDate(bucket);
            if (!date) return;

            if (!grouped[date]) {
                grouped[date] = {
                    date,
                    object_count: 0,
                    total_size_gb: 0,
                };
            }

            grouped[date].object_count += bucket.object_count || 0;
            grouped[date].total_size_gb += bucket.tamano_gb ?? (bucket as { size_gb?: number }).size_gb ?? 0;
        });

        return Object.values(grouped).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [data]);

    const bucketsForTop = useMemo(() => {
        if (!data?.buckets || data.buckets.length === 0) return [];

        const latestTimestamp = Math.max(
            ...data.buckets
                .map((b) => new Date(bucketDate(b)).getTime())
                .filter((t: number) => !isNaN(t))
        );

        if (!latestTimestamp) return [];

        return data.buckets.filter((b) => {
            const t = new Date(bucketDate(b)).getTime();
            return t === latestTimestamp;
        });
    }, [data]);

    if (!projects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    No se ha seleccionado ningún proyecto.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de buckets</p>
            </div>
        );
    }

    if (!data || !data.buckets || data.buckets.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron buckets para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            <TopStorageBucketsCardsComponent
                summary={data?.resumen}
                buckets={data?.buckets || []}
                isLoading={isLoading}
            />

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

            <BucketsHistoricalTable
                data={data.buckets}
                startDate={startDate.toISOString().split('T')[0]}
                endDate={endDate.toISOString().split('T')[0]}
            />
        </div>
    );
};