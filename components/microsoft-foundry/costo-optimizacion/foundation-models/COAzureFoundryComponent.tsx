'use client'

import { AzureFoundryCardsComponent } from '@/components/microsoft-foundry/costo-optimizacion/foundation-models/info/COFoundationCardsComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { AzureModelCost } from '@/interfaces/foundry-cost-optimization/foundationModels'
import { AlertCircle, Info } from 'lucide-react'
import useSWR from 'swr'

interface AzureFoundryComponentProps {
    startDate: Date
    endDate?: Date
    selectedInstance?: string | null 
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AzureFoundryComponent = ({ startDate, endDate, selectedInstance, region }: AzureFoundryComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const azurePriceRate = useSWR(
        (selectedInstance && selectedInstance !== 'all_instances')
            ? `/api/azure/bridge/azure/foundry/azure_get_model_price_rate?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource_name=${selectedInstance}`
            : null,
        fetcher
    )
    
    const anyLoading = azurePriceRate.isLoading
    const anyError = !!azurePriceRate.error

    const priceRateData: AzureModelCost[] | null =
        isNonEmptyArray<AzureModelCost>(azurePriceRate.data) ? azurePriceRate.data : null

    const hasPriceRateData = !!priceRateData && priceRateData.length > 0

    if (anyLoading) {
        return (
            <LoaderComponent />
        )
    }

    if (!selectedInstance || selectedInstance === 'all_instances') {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna cuenta de Azure AI.</div>
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

    const noneHasData = !hasPriceRateData
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas de consumo para la cuenta seleccionada en el rango de fechas."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className='p-3'>
            <AzureFoundryCardsComponent
                data={priceRateData}
            />
        </div>
    )
}