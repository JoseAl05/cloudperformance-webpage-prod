'use client'

import React from 'react';
import useSWR from 'swr';
import { IPsSinUsoCardsComponent } from './info/IPsSinUsoCardsComponent';
import { IPsSinUsoCharts } from './graficos/IPsSinUsoCharts';
import { IPsSinUsoTable } from './tabla/IPsSinUsoTable';

interface IPsSinUsoComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const IPsSinUsoComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    tagKey,
    tagValue
}: IPsSinUsoComponentProps) => {

    let url = `/api/gcp/bridge/gcp/networking/ips_sin_uso?`;
    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate)   url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects)  url += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') url += `region=${regions}&`;
    if (tagKey && tagKey !== 'allKeys') {
        url += `tag_key=${encodeURIComponent(tagKey)}&`;
        if (tagValue && tagValue !== 'allValues') {
            url += `tag_value=${encodeURIComponent(tagValue)}&`;
        }
    }

    const shouldFetch = !!projects;

    const { data, error, isLoading } = useSWR(
        shouldFetch ? url : null, 
        fetcher, 
        { revalidateOnFocus: false }
    );

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener las IPs sin uso</p>
            </div>
        );
    }

    if (!data || !data.ips_sin_uso || data.ips_sin_uso.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron IPs sin uso para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Cards */}
            <IPsSinUsoCardsComponent
                summary={data?.resumen}
                ips={data?.ips_sin_uso || []}
                isLoading={isLoading}
            />

            {/* Gráficos */}
            <IPsSinUsoCharts 
                data={data?.ips_sin_uso || []} 
                porRegion={data?.resumen?.por_region || {}}
            />
            {/* Tabla */}
            <IPsSinUsoTable 
                data={data?.ips_sin_uso || []} 
                dateFrom={startDate}
                dateTo={endDate}
            />
            {/* trabajando */}
            <div className="text-sm text-muted-foreground">Trabajando en algo que lo cambiara todo!!!</div>
        </div>
    );
};