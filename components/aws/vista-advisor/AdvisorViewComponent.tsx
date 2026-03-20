'use client'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { AlertCircle, AtomIcon, ChartBar, Info } from 'lucide-react'
import type {
    AdvisorApiResponse,
} from '@/interfaces/vista-advisor/advisorViewInterfaces'
import { AdvisorViewPieChartComponent } from '@/components/aws/vista-advisor/grafico/AdvisorViewPieChartComponent'
import { AdvisorViewInfoComponent } from '@/components/aws/vista-advisor/info/AdvisorViewInfoComponent'
import { AiRecommendationReport } from '@/interfaces/ai-recommendations/aiRecommendations';
import { AiRecommendationsComponent } from '@/components/AiRecommendationsComponent';

interface AdvisorViewComponentProps {
    advisorCategory: string
    advisorStatus: string
    startDate: Date
    endDate: Date
    region: string
}


const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AdvisorViewComponent = ({
    advisorCategory,
    advisorStatus,
    startDate,
    endDate,
    region,
}: AdvisorViewComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const advisorCategoryFormatted = advisorCategory?.toLowerCase() ?? '';
    const advisorStatusFormatted = advisorStatus?.toLowerCase() ?? '';

    const advisor = useSWR<AdvisorApiResponse | unknown>(
        advisorCategory || advisorStatus
            ? `/api/aws/bridge/advisor/get_advisor_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&category=${advisorCategoryFormatted}&status=${advisorStatusFormatted}`
            : null,
        fetcher,
    )

    const advisorAiData = useSWR<AiRecommendationReport>(
        advisorCategory || advisorStatus
            ? `/api/aws/bridge/advisor/get_ai_recommendations?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
            : null,
        fetcher,
    )

    const advisorData: AdvisorApiResponse | null =
        isNonEmptyArray<AdvisorApiResponse>(advisor.data) ? advisor.data : null;

    const aiRecommendationsData: AiRecommendationReport[] | null =
        isNonEmptyArray<AiRecommendationReport>(advisorAiData.data) ? advisorAiData.data : null;

    const hasAdvisorData = !!advisorData
    const hasAiRecommendationsData = !!aiRecommendationsData;

    const anyLoading =
        advisor.isLoading || advisorAiData.isLoading;


    const anyError =
        !!advisor.error || !!advisorAiData.error;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!advisorCategory || !advisorStatus) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-muted-foreground text-lg font-medium">
                    No se ha seleccionado ninguna categoría o status.
                </div>
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

    if (!hasAdvisorData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos información del advisor en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <ChartBar className="h-7 w-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recomendaciones</h1>
            </div>
            <div className='my-5'>
                <AdvisorViewPieChartComponent
                    data={advisorData}
                />
            </div>
            <AdvisorViewInfoComponent
                data={advisorData}
            />

            <div className="flex items-center gap-3 my-10">
                <AtomIcon className="h-7 w-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recomendaciones IA</h1>
            </div>
            <AiRecommendationsComponent
                data={aiRecommendationsData}
            />
        </div>
    )
}
