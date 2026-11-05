'use client'

import type { ComponentProps } from 'react';
import { fetcher } from '@/lib/fetcher';
import React from 'react';
import useSWR from 'swr';
import { SpotVsStandardCardsComponent } from './info/SpotVsStandardCardsComponent';
import { SpotVsStandardChart } from './graficos/SpotVsStandardChart';
import { SpotVsStandardTable } from './table/SpotVsStandardTable';

interface SpotVsStandardResponse {
    resumen?: ComponentProps<typeof SpotVsStandardCardsComponent>['summary'];
    vms?: Array<NonNullable<ComponentProps<typeof SpotVsStandardTable>['data']>[number] & NonNullable<ComponentProps<typeof SpotVsStandardChart>['data']>[number] & NonNullable<ComponentProps<typeof SpotVsStandardCardsComponent>['vms']>[number]>;
}

interface SpotVsStandardComponentProps {
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const SpotVsStandardComponent = ({ 
    startDate, 
    endDate, 
    projects, 
    regions,
    tagKey,
    tagValue 
}: SpotVsStandardComponentProps) => {

    let url = `/api/gcp/bridge/gcp/versus/spot_vs_standard_vms?`;

    if (startDate) url += `date_from=${startDate.toISOString().slice(0, 19)}&`;
    if (endDate) url += `date_to=${endDate.toISOString().slice(0, 19)}&`;
    if (projects) url += `project_id=${projects}&`;
    if (regions && regions !== 'all_regions') url += `location=${regions}&`;
    if (tagKey && tagKey !== 'allKeys') {
        url += `tag_key=${encodeURIComponent(tagKey)}&`;
        if (tagValue && tagValue !== 'allValues') {
            url += `tag_value=${encodeURIComponent(tagValue)}&`;
        }
    }

    const shouldFetch = !!projects;

    const { data, error, isLoading } = useSWR<SpotVsStandardResponse>(shouldFetch ? url : null, fetcher, {
        revalidateOnFocus: false,
    });

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de VMs</p>
            </div>
        );
    }

    if (!data || !data.vms || data.vms.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No se encontraron VMs para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4">
            <SpotVsStandardCardsComponent 
                summary={data?.resumen}
                vms={data?.vms || []}
                isLoading={isLoading}
            />

            <SpotVsStandardChart data={data?.vms || []} />

            <SpotVsStandardTable 
                data={data?.vms || []} 
                startDate={startDate.toISOString().slice(0, 10)}
                endDate={endDate.toISOString().slice(0, 10)}
            />
        </div>
    );
};