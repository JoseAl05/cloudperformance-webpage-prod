'use client'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { AlertCircle, ChartBar, Info } from 'lucide-react'
import type {
    AdvisorApiResponse,
    AdvisorRecommendation,
    AllAdvisorRecommendations
} from '@/interfaces/vista-advisor/advisorViewInterfaces'
import { AdvisorViewPieChartComponent } from '@/components/aws/vista-advisor/grafico/AdvisorViewPieChartComponent'
import { AdvisorViewInfoComponent } from '@/components/aws/vista-advisor/info/AdvisorViewInfoComponent'
import { AIComponentAws } from '@/components/aws/vista-advisor/ia-recommendations/AIComponentAws'

interface AdvisorViewComponentProps {
    advisorCategory: string
    advisorStatus: string
    startDate: Date
    endDate: Date
    region: string
}
type CheckDetail = {
    status?: string
    sync_time?: string
    categorySpecificSummary?: {
        costOptimizing?: {
            estimatedMonthlySavings?: number
            estimatedPercentMonthlySavings?: number
        }
        [k: string]: unknown
    }
    resourcesSummary?: {
        resourcesProcessed?: number
        resourcesFlagged?: number
        resourcesIgnored?: number
        resourcesSuppressed?: number
    }
    flaggedResources?: Array<{
        status?: string
        region?: string
        resourceId?: string
        isSuppressed?: boolean
        metadata?: unknown[]
    }>
}

type AdvisorRecMaybeDetails = AdvisorRecommendation & {
    check_details?: CheckDetail[]
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

const hasCheckDetails = (rec: unknown): rec is AdvisorRecMaybeDetails =>
    !!rec && typeof rec === 'object' && Array.isArray((rec as unknown).check_details)

const fmtCurrencyUSD = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : null

const fmtPct = (n?: number) =>
    typeof n === 'number' ? `${n}%` : null

const shortId = (id?: string, left = 6, right = 6) =>
    id && id.length > left + right + 3 ? `${id.slice(0, left)}...${id.slice(-right)}` : id ?? ''

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

    const { data, error, isLoading } = useSWR<AdvisorApiResponse | unknown>(
        advisorCategory || advisorStatus
            ? `/api/aws/bridge/advisor/get_advisor_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&category=${advisorCategoryFormatted}&status=${advisorStatusFormatted}`
            : null,
        fetcher,
    )

    if (isLoading) return <LoaderComponent />

    if (!advisorCategory || !advisorStatus) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-muted-foreground text-lg font-medium">
                    No se ha seleccionado ninguna categoría o status.
                </div>
            </div>
        )
    }

    if (error) {
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

    if (!data || data.length === 0) {
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
                    data={data as AdvisorApiResponse}
                />
            </div>
            <AdvisorViewInfoComponent
                data={data as AllAdvisorRecommendations[] | null}
            />

            <div className="mt-12">
                <AIComponentAws />
            </div>
        </div>
    )
}
