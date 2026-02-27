'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { TopFilestoreSubUtilizadoCardsComponent } from './info/TopFilestoreSubUtilizadoCardsComponent';
import { TopFilestoreSubUtilizadoChart } from './graficos/TopFilestoreSubUtilizadoChart';
import { TopFilestoreSubUtilizadoTendenciaChart } from './graficos/TopFilestoreSubUtilizadoTendenciaChart';
import { TopFilestoreSubUtilizadoSinMetricasTable } from './tabla/TopFilestoreSubUtilizadoSinMetricasTable';

interface TopFilestoreSubUtilizadoComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    filestoreTier?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const TopFilestoreSubUtilizadoComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    filestoreTier,
    tagKey,
    tagValue,
}: TopFilestoreSubUtilizadoComponentProps) => {

    // Construcción de URL
    let url = `/api/gcp/bridge/gcp/funcion/top_filestore_sub_utilizado?`;

    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects && projects !== 'all_projects') url += `project_id=${projects}&`;
    
    if (regions && regions !== 'all_regions') url += `location=${regions}&`;
    if (filestoreTier && filestoreTier !== 'all') url += `tier=${filestoreTier}&`;
    if (tagKey && tagKey !== 'allKeys') {
        url += `nombre_tag=${encodeURIComponent(tagKey)}&`;
        if (tagValue && tagValue !== 'allValues') {
            url += `valor_tag=${encodeURIComponent(tagValue)}&`;
        }
    }

    const shouldFetch = !!projects;

    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

    // Top items del snapshot más reciente para los gráficos de barras
    const topItems = useMemo(() => {
        if (!data?.top_sub_utilizados || data.top_sub_utilizados.length === 0) return [];
        return data.top_sub_utilizados;
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
                <p className="text-sm mt-1">No se pudieron obtener los datos de Filestore</p>
            </div>
        );
    }

    // Estado: Sin datos
    if (!data || !data.top_sub_utilizados || data.top_sub_utilizados.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron instancias Filestore sub-utilizadas para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">

            {/* Cards resumen */}
            <TopFilestoreSubUtilizadoCardsComponent
                resumen={data?.resumen}
                isLoading={isLoading}
            />

            {/* 2 Gráficos TOP en 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopFilestoreSubUtilizadoChart
                    data={topItems}
                    type="desperdicio_gb"
                />
                <TopFilestoreSubUtilizadoChart
                    data={topItems}
                    type="costo_desperdiciado"
                />
            </div>

            {/* Gráficos de Tendencia (ancho completo) */}
            <div className="grid grid-cols-1 gap-6">
                <TopFilestoreSubUtilizadoTendenciaChart
                    data={data?.tendencias || []}
                    metric="total_used_gb"
                    title="Tendencia GB Utilizado - Filestore"
                    yAxisLabel="GB Usado"
                />
                <TopFilestoreSubUtilizadoTendenciaChart
                    data={data?.tendencias || []}
                    metric="total_unused_gb"
                    title="Tendencia GB Desperdiciado - Filestore"
                    yAxisLabel="GB Desperdiciado"
                />
            </div>

            {/* Tabla instancias sin métricas */}
            {data?.sin_metricas && data.sin_metricas.length > 0 && (
                <TopFilestoreSubUtilizadoSinMetricasTable
                    data={data.sin_metricas}
                />
            )}

        </div>
    );
};