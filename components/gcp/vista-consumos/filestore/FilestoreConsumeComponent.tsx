'use client'

import React from 'react';
import useSWR from 'swr';
// Aquí importaremos los componentes que crearemos a continuación
import { FilestoreConsumeCardsComponent } from '@/components/gcp/vista-consumos/filestore/info/FilestoreConsumeCardsComponent';
import { FilestoreConsumeChartComponent } from '@/components/gcp/vista-consumos/filestore/grafico/FilestoreConsumeChartComponent';
import { FilestoreConsumeTableComponent } from '@/components/gcp/vista-consumos/filestore/table/FilestoreConsumeTableComponent';

interface FilestoreConsumeComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    resourceId: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const FilestoreConsumeComponent = ({
    startDate,
    endDate,
    projects,
    regions,
    resourceId
}: FilestoreConsumeComponentProps) => {

    // 1. Fetch de Información General e Instancias
    // Nota: Usamos la ruta de filestore que estuvimos probando
    let infoUrl = `/api/gcp/bridge/gcp/consumo/filestore/info?`;
    if (startDate) infoUrl += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) infoUrl += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) infoUrl += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') infoUrl += `location=${regions}&`;
    if (resourceId) infoUrl += `resource_id=${resourceId}&`;

    const shouldFetch = !!projects;

    const { data: infoData, error: infoError, isLoading: infoLoading } = useSWR(
        shouldFetch ? infoUrl : null, 
        fetcher, 
        { revalidateOnFocus: false }
    );

    // 2. Fetch de Métricas Temporales (para los gráficos)
    // En Filestore, la data histórica viene dentro del objeto 'history' de cada instancia,
    // pero si tu API tiene un endpoint separado de métricas planas, lo apuntamos aquí.
    let metricsUrl = `/api/gcp/bridge/gcp/consumo/consumo_filestore?`;
    if (projects) metricsUrl += `project_id=${projects}&`;
    // ... otros filtros

    const { data: metricsData, error: metricsError, isLoading: metricsLoading } = useSWR(
        shouldFetch ? metricsUrl : null, 
        fetcher, 
        { revalidateOnFocus: false }
    );

    // Manejo de estados de carga y error
    const anyLoading = infoLoading || metricsLoading;
    const anyError = infoError || metricsError;
    
    // Validación de datos basada en tu JSON: buscamos 'instancias'
    const hasData = infoData?.instancias && infoData.instancias.length > 0;

    if (!projects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 font-medium">
                No se ha seleccionado ningún proyecto.
            </div>
        );
    }

    if (anyLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos de Filestore...</p>
            </div>
        );
    }

    if (anyError) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de Filestore</p>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron instancias de Filestore para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            {/* 1. Tarjetas de Resumen (Costos, Capacidad Total, etc.) */}
            <FilestoreConsumeCardsComponent
                summary={infoData.resumen}
                instancias={infoData.instancias}
                isLoading={infoLoading}
            />

            {/* 2. Gráficos de Consumo (Capacidad Usada vs Libre e IOPS) */}
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <FilestoreConsumeChartComponent
                    data={infoData.instancias} // Usamos la data que trae el historial
                />
            </div>

            {/* 3. Tabla de Detalle */}
            <FilestoreConsumeTableComponent
                data={infoData.instancias}
            />
        </div>
    );
};