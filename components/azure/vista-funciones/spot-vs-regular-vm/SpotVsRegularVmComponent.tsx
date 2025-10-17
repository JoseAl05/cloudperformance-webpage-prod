'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import { useRef } from 'react';
import useSWR from 'swr';
import { SpotVsRegularVmTimelineComponent } from './grafico/SpotVsRegularVmTimelineComponent';
import { SpotVsRegularVmCardsComponent } from './info/SpotVsRegularVmCardsComponent';
import { SpotVsRegularVmTable } from './table/SpotVsRegularVmTable';

interface SpotVsRegularVmComponentProps {
    startDate: Date;
    endDate: Date;
    subscription: string;
    region: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const isNullish = (v: unknown) => v === null || v === undefined;



export const SpotVsRegularVmComponent = ({ startDate, endDate, subscription, region }: SpotVsRegularVmComponentProps) => {

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        subscription ? `/api/azure/bridge/azure/vms/vm-vs-spot?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription=${subscription}` : null,
        fetcher
    );

    const anyLoading =
        isLoading

    const anyError =
        !!error

    const spotVsRegularVmData: SpotVsRegularVm[] | null =
        isNonEmptyArray<SpotVsRegularVm>(data) ? data : null;

    const hasSpotVsRegularVmData = !!spotVsRegularVmData && spotVsRegularVmData.length > 0;


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
    const noneHasData = !hasSpotVsRegularVmData;
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

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <SpotVsRegularVmCardsComponent
                    data={spotVsRegularVmData}
                />
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Spot vs Regular VM (Linea de Tiempo)</h1>
                </div>
                <SpotVsRegularVmTimelineComponent
                    data={spotVsRegularVmData}
                />
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle VMs</h1>
                </div>
                <SpotVsRegularVmTable
                    data={spotVsRegularVmData}
                />
            </div>
        </div>
    )
}