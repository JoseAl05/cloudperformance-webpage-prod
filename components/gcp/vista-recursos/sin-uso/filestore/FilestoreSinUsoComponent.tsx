'use client';

import React from 'react';
import useSWR from 'swr';
import { FilestoreSinUsoCardsComponent } from './info/FilestoreSinUsoCardsComponent';
import { FilestoreSinUsoTable } from './tabla/FilestoreSinUsoTable';
import { FilestoreSinUsoSinMetricasTable } from './tabla/FilestoreSinUsoSinMetricasTable';

interface FilestoreSinUsoComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    filestoreTier?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const FilestoreSinUsoComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    filestoreTier,
    tagKey,
    tagValue,
}: FilestoreSinUsoComponentProps) => {

    let url = `/api/gcp/bridge/gcp/recursos_sin_uso/filestore_sin_uso?`;

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

    const { data, error, isLoading } = useSWR(!!projects ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

    if (!projects) {
        return (
            <div className="text-center text-gray-500 text-lg font-medium py-8">
                No se ha seleccionado ningún proyecto.
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
                <p className="text-sm mt-1">No se pudieron obtener los datos de Filestore</p>
            </div>
        );
    }

    if (!data || !data.filestores || data.filestores.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron instancias Filestore para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">

            {/* Tarjetas resumen */}
            <FilestoreSinUsoCardsComponent resumen={data?.resumen} />

            {/* Tabla principal */}
            <FilestoreSinUsoTable data={data?.filestores || []} />

            {/* Tabla instancias sin métricas */}
            {data?.sin_metricas && data.sin_metricas.length > 0 && (
                <FilestoreSinUsoSinMetricasTable data={data.sin_metricas} />
            )}

        </div>
    );
};