'use client'

import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { consumptionUrl, toApiDate } from '@/lib/consumption';
import type { ConsumptionInfoResponse } from '@/interfaces/consumption';
import { ZonasDNSCardsComponent } from './info/ZonasDNSCardsComponent';
import { ZonasDNSCharts } from './graficos/ZonasDNSCharts';
import { ZonasDNSTable } from './tabla/ZonasDNSTable';

interface ZonasDNSComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    estadoUso?: string;
    tagKey?: string | null;
    tagValue?: string | null;
}

export const ZonasDNSComponent = ({ startDate, endDate, projects, estadoUso, tagKey, tagValue }: ZonasDNSComponentProps) => {
    const url = consumptionUrl('gcp', 'dns-zones', 'info', {
        date_from: startDate ? toApiDate(startDate) : undefined,
        date_to: endDate ? toApiDate(endDate) : undefined,
        project_id: projects,
        sin_uso: estadoUso === 'sin_uso' ? 'true' : estadoUso === 'con_consumo' ? 'false' : undefined,
        tagKey,
        tagValue,
    });
    const { data, error, isLoading } = useSWR<ConsumptionInfoResponse>(projects ? url : null, fetcher, { revalidateOnFocus: false });

    if (!projects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún proyecto.</div>
            </div>
        );
    }

    const resources = data?.resources ?? [];
    return (
        <DataStateComponent
            isLoading={isLoading}
            error={error}
            isEmpty={resources.length === 0}
            emptyDescription="No se encontraron zonas DNS para los filtros seleccionados."
        >
            <div className="space-y-6 mt-6 px-4">
                {data && <ZonasDNSCardsComponent summary={data.summary} />}
                <ZonasDNSCharts
                    data={resources.map((r) => ({
                        name: r.resource_name,
                        dns_name: String(r.details.dns_name ?? ''),
                        clasificacion_uso: r.status ?? '',
                        queries_por_segundo: r.metrics.queries_por_segundo ?? 0,
                    }))}
                />
                <ZonasDNSTable data={resources} dateFrom={startDate} dateTo={endDate ?? startDate} />
            </div>
        </DataStateComponent>
    );
};
