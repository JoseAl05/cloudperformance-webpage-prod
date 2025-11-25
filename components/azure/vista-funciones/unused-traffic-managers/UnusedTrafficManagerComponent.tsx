'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedTrafficManagerCardsComponent } from '@/components/azure/vista-funciones/unused-traffic-managers/info/UnusedTrafficManagerCardsComponent';
import { UnusedTrafficManagerTable } from '@/components/azure/vista-funciones/unused-traffic-managers/table/UnusedTrafficManagerTable';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { UnusedTm } from '@/interfaces/vista-unused-resources/unusedTmInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedTrafficManagerComponentProps {
    startDate: Date;
    endDate: Date;
    selectedUnusedTm: string;
    subscription: string;
    region: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const UnusedTrafficManagerComponent = ({ startDate, endDate, selectedUnusedTm, subscription, region }: UnusedTrafficManagerComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const { data, isLoading, error } = useSWR(
        selectedUnusedTm ? `/api/azure/bridge/azure/traffic_managers/traffic_managers_unused?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscription}&tm_profile=${selectedUnusedTm}` : null,
        fetcher
    )

    const anyLoading =
        isLoading

    const anyError =
        !!error

    const unusedTmData: UnusedTm[] | null =
        isNonEmptyArray<UnusedTm>(data) ? data : null;

    const hasUnusedTmData = !!unusedTmData && unusedTmData.length > 0;
    const hasSelectedUnusedTmData = !!selectedUnusedTm && selectedUnusedTm.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!hasSelectedUnusedTmData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Traffic Manager no seleccionado"
                    description="Seleccione un traffic manager..."
                    tone="info"
                />
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }
    const noneHasData = !hasUnusedTmData;
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los traffic manager/s en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <UnusedTrafficManagerCardsComponent
                    data={unusedTmData}
                />
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Traffic Managers infautilizados</h1>
                </div>
                <UnusedTrafficManagerTable
                    data={unusedTmData}
                />
            </div>
        </div>
    )
}