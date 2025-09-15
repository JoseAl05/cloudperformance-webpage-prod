'use client'

import { LoaderComponent } from '@/components/general/LoaderComponent'
import { EventsApiResponse } from '@/interfaces/vista-eventos/eventsViewInterfaces'
import useSWR from 'swr'
import { MessageCard } from '../cards/MessageCards'
import { AlertCircle, ChartBar, Info } from 'lucide-react'
import { EventsViewTableComponent } from './table/EventsViewTableComponent'
import { EventsViewInfoComponent } from './info/EventsViewInfoComponent'
import { EventsViewEventCountComponent } from './graficos/EventsViewEventCountComponent'

interface EventsViewComponentProps {
    startDate: Date
    endDate: Date
    eventType: string
    region: string
};

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const EventsViewComponent = ({ startDate, endDate, eventType, region }: EventsViewComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allEvents = useSWR(
        eventType
            ? `${process.env.NEXT_PUBLIC_API_URL}/eventos/get_eventos?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&event_name=${eventType}`
            : null,
        fetcher
    )

    const anyLoading =
        allEvents.isLoading

    const anyError =
        !!allEvents.error

    const allEventsData: EventsApiResponse | null =
        isNonEmptyArray<EventsApiResponse>(allEvents.data) ? allEvents.data : null;

    const hasEventsData = !!allEventsData && allEventsData.length > 0;

    if (anyLoading) {
        return (
            <LoaderComponent />
        )
    }

    if (!eventType) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningun evento.</div>
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

    const noneHasData = !hasEventsData;
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const eventsData = allEventsData.map(inf => (inf.events || []).map(ev => ev));
    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <EventsViewInfoComponent
                    infoData={allEventsData}
                />
            </div>

            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Eventos AWS</h1>
                </div>
                <EventsViewEventCountComponent
                    data={eventsData}
                />
                {/* <Ec2ResourceConsumeViewUsageCreditsComponent data={creditsMetricsData} />
                <Ec2ResourceConsumeViewUsageCpuComponent data={cpuMetricsData} /> */}
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    {/* <Clock className="h-8 w-8 text-blue-500" /> */}
                    <h1 className="text-3xl font-bold text-foreground">Detalle Instancias</h1>
                </div>
                <EventsViewTableComponent
                    data={allEventsData}
                    startDate={startDateFormatted}
                    endDate={endDateFormatted}
                    eventType={eventType}
                />
                {/* <Ec2ConsumeViewInstanceTable
                    data={infoData}
                    startDate={startDate}
                    endDate={endDate}
                    instance={instance}
                    enableGrouping
                /> */}
            </div>
        </div>
    )
}