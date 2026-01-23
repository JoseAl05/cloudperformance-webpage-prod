'use client'

import React from 'react';
import useSWR from 'swr';
import { DiscosPersistentesCardsComponent } from './info/DiscosPersistentesCardsComponent'; 
// import { DiscosPersistentesTableComponent } from './info/DiscosPersistentesTableComponent'; // (Aún no existe, lo haremos después)
import { DiscosPersistentesTable } from './table/DiscosPersistentesTable';

interface DiscosComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    resourceId?: string;
    // Nuevos props de Tags
    tagKey?: string | null;
    tagValue?: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const DiscosPersistentesComponent = ({ 
    startDate, 
    endDate, 
    projects, 
    regions, 
    resourceId,
    tagKey,
    tagValue 
}: DiscosComponentProps) => {

    // 1. Construcción de URL Dinámica
    // Base URL apuntando al bridge
    //let url = `/api/gcp/bridge/gcp/recursos-sin-uso/discos-persistentes-sin-uso?simple_list=true`;
    //let url = `/api/gcp/bridge/gcp/recursos_sin_uso/discos_persistentes?simple_list=true`;
    let url = `/api/gcp/bridge/gcp/recursos_sin_uso/discos_persistentes?simple_list=true&discos_en_uso=false`;

    // Fechas
    if (startDate) url += `&date_from=${startDate.toISOString().slice(0, 19)}`; // Quitamos milisegundos para evitar problemas
    if (endDate) url += `&date_to=${endDate.toISOString().slice(0, 19)}`;

    // Filtros obligatorios y opcionales
    if (projects) url += `&project_id=${projects}`;
    if (regions && regions !== 'all_regions') url += `&location=${regions}`;
    
    // Filtros de Tags (Si existen)
    if (tagKey && tagKey !== 'allKeys') {
        url += `&tag_key=${encodeURIComponent(tagKey)}`;
        if (tagValue && tagValue !== 'allValues') {
            url += `&tag_value=${encodeURIComponent(tagValue)}`;
        }
    }

    // 2. Fetch de datos
    // Solo hacemos fetch si tenemos al menos un proyecto seleccionado para no saturar
    const shouldFetch = !!projects; 

    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false, // Evita recargas innecesarias
    });

    return (
        <div className="space-y-6 mt-6">
            {/* Mensaje si no hay proyecto seleccionado */}
            {!projects && (
                <div className="text-center text-gray-500 text-lg font-medium py-4">
                    No se ha seleccionado ningún proyecto.
                </div>
            )}

            {/* Contenido cuando hay proyecto */}
            {projects && (
                <>
                    <DiscosPersistentesCardsComponent 
                        summary={data?.resumen}
                        discos={data?.discos || []}
                        isLoading={isLoading}
                    />

                    <div className="rounded-md border bg-white dark:bg-slate-950">
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-medium">
                                Detalle de Discos ({data?.discos?.length || 0})
                            </h3>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm p-4">
                                Error al cargar los datos.
                            </div>
                        )}
                        {!isLoading && data?.discos && (
                            <DiscosPersistentesTable 
                                data={data.discos} 
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};