'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { RecommenderPieChartComponent } from '@/components/gcp/vista-recommender/grafico/RecommenderPieChartComponent';
import { RecommenderInfoComponent } from '@/components/gcp/vista-recommender/info/RecommenderInfoComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { RecommenderGcp } from '@/interfaces/vista-recommender/gcpRecommenderInterfaces';
import { AlertCircle, ChartBar, Info } from 'lucide-react';
import useSWR from 'swr';

interface RecommenderComponentProps {
    startDate: Date;
    endDate: Date;
    category: string;
    priority: string;
    regions: string;
    projects: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const RecommenderComponent = ({
    startDate,
    endDate,
    category,
    priority,
    regions,
    projects

}: RecommenderComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allRecommendations = useSWR(
        (category && priority) ? `/api/gcp/bridge/gcp/recommender/get_recommendations?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&category=${category}&priority=${priority}&project_id=${projects}` : null,
        fetcher
    )

    const recommenderData: RecommenderGcp[] | null =
        isNonEmptyArray<RecommenderGcp>(allRecommendations.data) ? allRecommendations.data : null;

    const hasRecommenderData = !!recommenderData;

    const anyLoading =
        allRecommendations.isLoading


    const anyError =
        !!allRecommendations.error

    if (!category) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado categoría.</div>
            </div>
        )
    }

    if (!priority) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div>No se ha seleccionado prioridad.</div>
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

    if (!hasRecommenderData) {
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

    console.log(recommenderData);

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <ChartBar className="h-7 w-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recomendaciones</h1>
            </div>
            <div className='my-5'>
                <RecommenderPieChartComponent
                    data={recommenderData}
                />
            </div>
            <RecommenderInfoComponent
                data={recommenderData}
            />
        </div>
    )
}