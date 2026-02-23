'use client'

import React from 'react';
import useSWR from 'swr';
import { LoadBalancersCardsComponent } from './info/LoadBalancersCardsComponent';
import { LoadBalancersCharts } from './graficos/LoadBalancersCharts';
import { LoadBalancersTable } from './tabla/LoadBalancersTable';

interface LoadBalancersComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    esquema: string;
    estadoUso: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const LoadBalancersComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    esquema,
    estadoUso
}: LoadBalancersComponentProps) => {

    let url = `/api/gcp/bridge/gcp/consumo/load_balancers?`;
    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate)   url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects)  url += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') url += `region=${regions}&`;
    if (esquema && esquema !== 'all') url += `esquema=${esquema}&`;
    
    // Traducir estadoUso a sin_trafico según prompt de Gemini
    if (estadoUso === 'sin_uso') url += `sin_trafico=true&`;
    if (estadoUso === 'con_consumo') url += `sin_trafico=false&`;

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los load balancers</p>
            </div>
        );
    }

    if (!data || !data.load_balancers || data.load_balancers.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron load balancers para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Cards */}
            <LoadBalancersCardsComponent
                summary={data?.resumen}
                loadBalancers={data?.load_balancers || []}
                isLoading={isLoading}
            />

            {/* Gráficos */}
            <LoadBalancersCharts 
                data={data?.load_balancers || []} 
                porEsquema={data?.resumen?.por_load_balancing_scheme || {}}
            />

            {/* Tabla */}
            <LoadBalancersTable 
                data={data?.load_balancers || []} 
                dateFrom={startDate}
                dateTo={endDate}
            />
            {/* trabajando */}
            <div className="text-sm text-muted-foreground">Trabajando en algo espectacular aquí...</div>
        </div>
    );
};