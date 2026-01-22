'use client'

import React from 'react';
import useSWR from 'swr';
import { DiscosPersistentesCardsComponent } from './info/DiscosPersistentesCardsComponent'; 
// import { DiscosPersistentesTableComponent } from './info/DiscosPersistentesTableComponent'; // (Aún no existe, lo haremos después)

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
    let url = `/api/gcp/bridge/gcp/recursos_sin_uso/discos_persistentes?simple_list=true`;

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
            <DiscosPersistentesCardsComponent 
                // Usamos los nombres exactos de tu respuesta de Postman
                summary={{
                    discos_sin_uso: data?.resumen?.discos_sin_uso || 0,
                    tamano_sin_uso_gb: data?.resumen?.tamano_sin_uso_gb || 0,
                    costo_total_usd: data?.resumen?.costo_total_usd || 0
                }} 
                isLoading={isLoading}
            />

            {/* SECCIÓN 2: TABLA DE DETALLE (Placeholder por ahora) */}
            <div className="rounded-md border p-4 bg-white dark:bg-slate-950">
                <h3 className="text-sm font-medium mb-4">Detalle de Discos ({data?.discos?.length || 0})</h3>
                {error && <div className="text-red-500 text-sm">Error al cargar los datos.</div>}
                
                {!isLoading && data?.discos && (
                    <div className="text-sm text-gray-500">
                        Aquí irá la tabla con los {data.discos.length} discos encontrados. 
                        (Ej: {data.discos[0]?.name})
                    </div>
                )}
            </div>

        </div>
    );
};