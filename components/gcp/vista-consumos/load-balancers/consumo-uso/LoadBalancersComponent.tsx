'use client'

import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { consumptionUrl, toApiDate } from '@/lib/consumption';
import type { ConsumptionInfoResponse } from '@/interfaces/consumption';
import { LoadBalancersCardsComponent } from './info/LoadBalancersCardsComponent';
import { LoadBalancersCharts } from './graficos/LoadBalancersCharts';
import { LoadBalancersTable } from './tabla/LoadBalancersTable';

interface LoadBalancersComponentProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    esquema?: string;
    estadoUso?: string;
}

export const LoadBalancersComponent = ({ startDate, endDate, projects, regions, esquema, estadoUso }: LoadBalancersComponentProps) => {
    const url = consumptionUrl('gcp', 'load-balancers', 'info', {
        date_from: startDate ? toApiDate(startDate) : undefined,
        date_to: endDate ? toApiDate(endDate) : undefined,
        project_id: projects,
        region: regions && regions !== 'all_regions' ? regions : undefined,
        load_balancing_scheme: esquema && esquema !== 'all' ? esquema : undefined,
        sin_trafico: estadoUso === 'sin_uso' ? 'true' : estadoUso === 'con_consumo' ? 'false' : undefined,
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
            emptyDescription="No se encontraron load balancers para los filtros seleccionados."
        >
            <div className="space-y-6 mt-6 px-4">
                {data && <LoadBalancersCardsComponent summary={data.summary} />}
                <LoadBalancersCharts
                    data={resources.map((r) => ({
                        name: r.resource_name,
                        region: r.region ?? '',
                        loadBalancingScheme: r.resource_type ?? '',
                        requests_totales: r.metrics.requests_totales ?? 0,
                        clasificacion_trafico: r.status ?? '',
                    }))}
                    porEsquema={data?.summary.breakdowns.por_load_balancing_scheme ?? {}}
                />
                <LoadBalancersTable data={resources} dateFrom={startDate} dateTo={endDate ?? startDate} />
            </div>
        </DataStateComponent>
    );
};
