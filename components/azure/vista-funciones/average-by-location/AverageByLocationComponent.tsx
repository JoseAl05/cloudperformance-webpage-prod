'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { AverageByLocation } from '@/interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces';
import { AlertCircle, ChartBar, Info } from 'lucide-react';
import useSWR from 'swr';
import { AverageByLocationMetricsComponent } from './grafico/AverageByLocationMetricsComponent';
import { AverageByLocationCardsComponent } from './info/AverageByLocationCardsComponent';

interface AverageByLocationComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    selectedService: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const isNullish = (v: unknown) => v === null || v === undefined;

export const AverageByLocationComponent = ({ startDate, endDate, region, subscription, selectedService }: AverageByLocationComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        selectedService ? `/api/azure/bridge/azure/recursos/avg_by_location?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription=${subscription}&service=${selectedService}` : null,
        fetcher
    );

    const anyLoading =
        isLoading

    const anyError =
        !!error

    const avgByLocationData: AverageByLocation[] | null =
        isNonEmptyArray<AverageByLocation>(data) ? data : null;

    const hasAvgByLocationData = !!avgByLocationData && avgByLocationData.length > 0;
    const hasSelectedService = !!selectedService && selectedService.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!hasSelectedService) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Servicio no seleccionado"
                    description="Seleccione un Servicio..."
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
    const noneHasData = !hasAvgByLocationData;
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los volúmen/es en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    console.log(avgByLocationData);
    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className='flex flex-col gap-5 mb-10'>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Análisis por localización</h1>
                </div>
                <div className='grid grid-cols-1 gap-5 lg:grid-cols-1'>
                    <AverageByLocationMetricsComponent
                        data={avgByLocationData}
                    />
                </div>
            </div>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <AverageByLocationCardsComponent
                    data={avgByLocationData}
                />
            </div>

        </div>
    )
}