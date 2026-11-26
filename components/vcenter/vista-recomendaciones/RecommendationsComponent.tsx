'use client'

import useSWR from 'swr';
import { AlertCircle, AtomIcon, Info } from 'lucide-react';
import { AiRecommendationsComponent } from '@/components/AiRecommendationsComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { AiRecommendationReport } from '@/interfaces/ai-recommendations/aiRecommendations';
import { toApiDate } from '@/lib/consumption';
import { fetcher } from '@/lib/fetcher';

interface RecommendationsComponentProps {
    startDate?: Date;
    endDate?: Date;
}

const AI_RECOMMENDATIONS_ENDPOINT = '/api/vcenter/bridge/vcenter/ai_recommendations/get_ai_recommendations';

const isNonEmptyArray = <T,>(value: unknown): value is T[] => Array.isArray(value) && value.length > 0;

export const RecommendationsComponent = ({ startDate, endDate }: RecommendationsComponentProps) => {
    const swrKey = startDate && endDate
        ? `${AI_RECOMMENDATIONS_ENDPOINT}?date_from=${toApiDate(startDate)}&date_to=${toApiDate(endDate)}`
        : null;

    const { data, error, isLoading } = useSWR<unknown>(swrKey, fetcher);

    const aiRecommendationsData: AiRecommendationReport[] | null =
        isNonEmptyArray<AiRecommendationReport>(data) ? data : null;

    if (!startDate || !endDate) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <MessageCard
                    icon={Info}
                    title='Sin período seleccionado'
                    description='Selecciona un rango de fechas para ver las recomendaciones.'
                    tone='warn'
                />
            </div>
        );
    }

    if (isLoading) {
        return <LoaderComponent size='large' />;
    }

    if (error) {
        return (
            <div className='w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4'>
                <MessageCard
                    icon={AlertCircle}
                    title='Error al cargar datos'
                    description='Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas.'
                    tone='error'
                />
            </div>
        );
    }

    if (!aiRecommendationsData) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <MessageCard
                    icon={Info}
                    title='Sin datos para mostrar'
                    description='No encontramos recomendaciones de la IA en el rango seleccionado.'
                    tone='warn'
                />
            </div>
        );
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className='flex items-center gap-3 mb-6'>
                <AtomIcon className='h-7 w-7 text-blue-500' />
                <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Recomendaciones IA</h1>
            </div>
            <AiRecommendationsComponent
                data={aiRecommendationsData}
                cloud='vcenter'
            />
        </div>
    );
};
