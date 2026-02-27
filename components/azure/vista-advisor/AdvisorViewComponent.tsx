'use client'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { MessageCard } from '@/components/azure/cards/MessageCards'
import { AlertCircle, AtomIcon, ChartBar, Info } from 'lucide-react'
import { AdvisorViewPieChartComponent } from '@/components/azure/vista-advisor/grafico/AdvisorViewPieChartComponent'
import { AdvisorViewInfoComponent } from '@/components/azure/vista-advisor/info/AdvisorViewInfoComponent'
import { AIComponentAzure } from '@/components/azure/vista-advisor/ia-recommedations/AIComponentAzure'
import { AiRecommendationReport } from '@/interfaces/ai-recommendations/aiRecommendations'
import { AiRecommendationsComponent } from '@/components/AiRecommendationsComponent'

interface AdvisorViewComponentProps {
    impact: string | null
    category: string | null
    startDate: Date
    endDate: Date
}

interface AzureAdvisorRecommendation {
    _cq_sync_time: { $date: string }
    impact: string
    high_impact: number
    medium_impact: number
    low_impact: number
    category: string
    impacted_value: string
    impacted_value_count: number
    last_updated: string
    problem: string
    total_recommendations: number
    visual_impact: string
    resource_type: string
}

type AzureAdvisorApiResponse = AzureAdvisorRecommendation[]

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AdvisorViewComponent = ({
    impact,
    category,
    startDate,
    endDate,
}: AdvisorViewComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    
    // Validación: Ambos filtros deben estar seleccionados
    // null/undefined = No seleccionado
    // '' (vacío) = "Ver todos" (SÍ está seleccionado)
    // 'valor' = Filtro específico (SÍ está seleccionado)
    const hasImpactSelected = impact !== null && impact !== undefined;
    const hasCategorySelected = category !== null && category !== undefined;
    const shouldFetch = hasImpactSelected && hasCategorySelected;
    
    // Construir URL con parámetros opcionales
    const buildUrl = () => {
        if (!shouldFetch) return null;
        
        let url = `/api/azure/bridge/azure/vista-asesor?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
        // Solo agregar filtros si NO son vacíos (vacío = "Ver todos")
        if (impact) url += `&impact=${encodeURIComponent(impact)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        return url;
    };

    const { data, error, isLoading } = useSWR<AzureAdvisorApiResponse | unknown>(
        buildUrl(),
        fetcher,
    )

    const aiRecommendations = useSWR(
        (hasImpactSelected && hasCategorySelected) ? `/api/azure/bridge/azure/get_ai_recommendations?date_from=${startDateFormatted}&date_to=${endDateFormatted}` : null,
        fetcher,
    )

    const aiRecommendationsData: AiRecommendationReport[] | null =
        isNonEmptyArray<AiRecommendationReport>(aiRecommendations.data) ? aiRecommendations.data : null;

    if (isLoading || aiRecommendations.isLoading) return <LoaderComponent />

    // Mostrar mensaje si no se han seleccionado los filtros obligatorios
    if (!shouldFetch) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-muted-foreground text-lg font-medium">
                    No se ha seleccionado ningún impacto o categoría.
                </div>
            </div>
        )
    }

    if (error || aiRecommendations.error) {
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

    if (!data || !Array.isArray(data) || data.length === 0) {
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
                    data={data as AzureAdvisorApiResponse}
                />
            </div>
            <AdvisorViewInfoComponent
                data={data as AzureAdvisorApiResponse}
                startDate={startDate}
                endDate={endDate}
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
