'use client'

import React from 'react';
import useSWR from 'swr';
import { ZonasDNSCardsComponent } from './info/ZonasDNSCardsComponent';
import { ZonasDNSCharts } from './graficos/ZonasDNSCharts';
import { ZonasDNSTable } from './tabla/ZonasDNSTable';

interface ZonasDNSComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    estadoUso: string;
    tagKey: string;
    tagValue: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const ZonasDNSComponent = ({
    startDate,
    endDate,
    projects,
    estadoUso,
    tagKey,    
    tagValue   
}: ZonasDNSComponentProps) => {

    const params = new URLSearchParams();
    
    if (startDate) params.append('date_from', startDate.toISOString().slice(0, 19));
    if (endDate) params.append('date_to', endDate.toISOString().slice(0, 19));
    if (projects) params.append('project_id', projects);
    
    if (estadoUso === 'sin_uso') {
        params.append('sin_uso', 'true');
    } else if (estadoUso === 'con_consumo') {
        params.append('sin_uso', 'false');
    }
    
    if (tagKey) params.append('tagKey', tagKey);
    if (tagValue) params.append('tagValue', tagValue);

    const url = `/api/gcp/bridge/gcp/consumo/zonas_dns?${params.toString()}`;

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener las zonas DNS</p>
            </div>
        );
    }

    if (!data || !data.zonas || data.zonas.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-xl mt-6">
                <p>No se encontraron zonas DNS para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            <ZonasDNSCardsComponent
                summary={data?.resumen}
                zonas={data?.zonas || []}
                isLoading={isLoading}
            />

            <ZonasDNSCharts 
                data={data?.zonas || []} 
            />

            <ZonasDNSTable 
                data={data?.zonas || []} 
                dateFrom={startDate}
                dateTo={endDate}
            />
            
            <div className="text-sm text-muted-foreground">¡¡¡Estamos trabajando para que disfrutes de una experiencia única!!!</div>
        </div>
    );
};