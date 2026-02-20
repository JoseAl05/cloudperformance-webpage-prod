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
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const ZonasDNSComponent = ({
    startDate,
    endDate,
    projects,
    estadoUso
}: ZonasDNSComponentProps) => {

    // let url = `/api/gcp/bridge/gcp/consumo/zonas_dns?`;
    // if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    // if (endDate)   url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    // if (projects)  url += `project_id=${projects}&`;
    // if (estadoUso && estadoUso !== 'all') url += `estado_uso=${estadoUso}&`;

    // inicio correccion mmontt ... Construimos la URL de forma segura
    const params = new URLSearchParams();
    
    if (startDate) params.append('date_from', startDate.toISOString().slice(0, 19));
    if (endDate) params.append('date_to', endDate.toISOString().slice(0, 19));
    if (projects) params.append('project_id', projects);
    
    // TRADUCTOR CLAVE: Mapeamos el string del frontend al booleano que espera Python
    if (estadoUso === 'sin_uso') {
        params.append('sin_uso', 'true');
    } else if (estadoUso === 'con_consumo') {
        params.append('sin_uso', 'false');
    }
    // Si estadoUso es 'all' (o vacío), no agregamos el parámetro y la API nos devuelve todo

    const url = `/api/gcp/bridge/gcp/consumo/zonas_dns?${params.toString()}`;
    //fin correccion mmontt

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
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron zonas DNS para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* Cards */}
            <ZonasDNSCardsComponent
                summary={data?.resumen}
                zonas={data?.zonas || []}
                isLoading={isLoading}
            />

            {/* Gráficos */}
            <ZonasDNSCharts 
                data={data?.zonas || []} 
            />

            {/* Tabla */}
            <ZonasDNSTable 
                data={data?.zonas || []} 
                dateFrom={startDate}
                dateTo={endDate}
            />

            {/* trabajando para usted... */}
            <div className="text-sm text-muted-foreground">¡¡¡Estamos trabajando para que disfrutes de una experiencia única!!!</div>
        </div>
    );
};