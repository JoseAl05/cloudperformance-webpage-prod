'use client'

import { COCustomModelsCardsComponent } from '@/components/amazon-bedrock/costo-optimizacion/custom-models/info/COCustomModelsCardsComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { CustomModelsPriceRate } from '@/interfaces/bedrock-cost-optimization/customModels'
import { AlertCircle, Info } from 'lucide-react'
import useSWR from 'swr'

interface COCustomModelsComponentProps {
    startDate: Date
    endDate: Date
    instance: string
    region: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const COCustomModelsComponent = ({ startDate, endDate, instance, region }: COCustomModelsComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const cMPriceRate = useSWR(
        instance
            ? `/api/aws/bridge/bedrock/custom_models/get_model_price_rate?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&model_name=${instance}`
            : null,
        fetcher
    )
    const anyLoading = cMPriceRate.isLoading

    const anyError = !!cMPriceRate.error

    const priceRateData: CustomModelsPriceRate[] | null =
        isNonEmptyArray<CustomModelsPriceRate>(cMPriceRate.data) ? cMPriceRate.data : null

    const hasPriceRateData = !!priceRateData && priceRateData.length > 0


    if (anyLoading) {
        return (
            <LoaderComponent />
        )
    }

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún modelo custom.</div>
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
                    description="No encontramos métricas ni información del/los modelo/s custom en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className='p-3'>
            <COCustomModelsCardsComponent
                data={priceRateData}
            />
        </div>
    )
}