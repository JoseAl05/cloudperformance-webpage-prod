'use client'


import { AiRecommendationStatusesInfoComponent } from '@/components/ai-recommendation-statuses/info/AiRecommendationStatusesInfoComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { RecommendationStatusGroup } from '@/interfaces/ai-recommendations/aiRecommendations';
import { AlertCircle, Info, History } from 'lucide-react';
import useSWR from 'swr';

interface AiRecommendationStatusesComponentProps {
    startDate: Date;
    endDate: Date;
    cloud: string;
}


const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AiRecommendationStatusesComponent = ({ startDate, endDate, cloud }: AiRecommendationStatusesComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    let url = '';

    switch (cloud) {
        case 'aws':
            url = '/api/aws/bridge/advisor/get_all_recomendations_statuses_events';
            break;
        case 'azure':
            url = '/api/azure/bridge/azure/get_all_recomendations_statuses_events';
            break;
        case 'gcp':
            url = '/api/gcp/bridge/gcp/ai_recommendations/get_all_recomendations_statuses_events'
            break;
        default:
            break;
    }

    const allRecommendationStatuses = useSWR(
        (startDateFormatted && endDateFormatted) ? `${url}?date_from=${startDateFormatted}&date_to=${endDateFormatted}` : null,
        fetcher
    )

    const recStatusesData: RecommendationStatusGroup[] | null =
        isNonEmptyArray<RecommendationStatusGroup>(allRecommendationStatuses.data) ? allRecommendationStatuses.data : null;

    const hasRecommendationStatusesData = !!recStatusesData;

    const anyLoading =
        allRecommendationStatuses.isLoading;


    const anyError =
        !!allRecommendationStatuses.error;


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

    if (!hasRecommendationStatusesData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos recomendaciones en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const recData = recStatusesData;
    console.log(recData);

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detalle</h1>
            </div>
            <div className='flex flex-col gap-5'>
                <section>
                    <AiRecommendationStatusesInfoComponent
                        data={recData}
                    />
                </section>
            </div>
        </div>
    )
}