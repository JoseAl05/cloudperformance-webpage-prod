'use client'

import React from 'react';
import useSWR from 'swr';
import { SubnetsSinRecursosCardsComponent } from './info/SubnetsSinRecursosCardsComponent';
import { SubnetsSinRecursosCharts } from './graficos/SubnetsSinRecursosCharts';
import { SubnetsSinRecursosTable } from './tabla/SubnetsSinRecursosTable';

interface SubnetsSinRecursosComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const SubnetsSinRecursosComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    tagKey,
    tagValue
}: SubnetsSinRecursosComponentProps) => {

    let url = `/api/gcp/bridge/gcp/networking/subnets_sin_recursos?`;
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener las subnets sin recursos</p>
            </div>
        );
    }

    if (!data || !data.subnets_sin_recursos || data.subnets_sin_recursos.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron subnets sin recursos para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Cards */}
            <SubnetsSinRecursosCardsComponent
                summary={data?.resumen}
                subnets={data?.subnets_sin_recursos || []}
                isLoading={isLoading}
            />

            {/* Gráficos */}
            <SubnetsSinRecursosCharts 
                data={data?.subnets_sin_recursos || []} 
                porRegion={data?.resumen?.por_region || {}}
                porPurpose={data?.resumen?.por_purpose || {}}
            />

            {/* Tabla */}
            <SubnetsSinRecursosTable 
                data={data?.subnets_sin_recursos || []} 
                dateFrom={startDate}
                dateTo={endDate}
            />

            {/* TRABAJANDO */}
            <div className="text-sm text-muted-foreground">Trabajando aquí en algo que cambiara tu vida.</div>
        </div>
    );
};