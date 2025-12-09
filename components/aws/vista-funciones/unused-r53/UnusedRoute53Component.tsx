'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedRoute53CardsComponent } from '@/components/aws/vista-funciones/unused-r53/info/UnusedRoute53CardsComponent';
import { UnusedRoute53Table } from '@/components/aws/vista-funciones/unused-r53/table/UnusedRoute53Table';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { UnusedRoute53 } from '@/interfaces/vista-unused-resources/unusedRoutes53Interfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedRoute53ComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    unusedR53: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const UnusedRoute53Component = ({ startDate, endDate, region, unusedR53 }: UnusedRoute53ComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const unusedRoutes = useSWR(
        unusedR53 ? `/api/aws/bridge/route53/unused_route53?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&hz_id=${unusedR53}` : null,
        fetcher
    )


    const anyLoading =
        unusedRoutes.isLoading


    const anyError =
        !!unusedRoutes.error

    const unusedRoutesData: UnusedRoute53[] | null =
        isNonEmptyArray<UnusedRoute53>(unusedRoutes.data) ? unusedRoutes.data : null;

    const hasUnusedData = !!unusedRoutesData && unusedRoutesData.length > 0;

    if (!unusedR53) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún record set.</div>
            </div>
        )
    }
    if (anyLoading) {
        return <LoaderComponent />
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
    const noneHasData = !hasUnusedData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los record set/s en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedRoute53CardsComponent
                        data={unusedRoutesData}
                    />
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Routes 53 no utilizados</h1>
                </div>
                <UnusedRoute53Table
                    data={unusedRoutesData}
                />
            </div>
        </>
    )
}