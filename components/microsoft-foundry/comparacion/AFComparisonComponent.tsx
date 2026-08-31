'use client'

import { MessageCard } from '@/components/azure/cards/MessageCards';
import { LoaderComponent } from '@/components/general_azure/LoaderComponent';
import { AzureFoundryComparisonView } from '@/components/microsoft-foundry/comparacion/info/AFComparisonViewComponent';
import { AlertCircle } from 'lucide-react';
import useSWR from 'swr';

interface AzureFoundryComparisonComponent {
    startDate: Date
    endDate?: Date
    selectedInstance?: string | null
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const AzureFoundryComparisonComponent = ({ startDate, endDate, selectedInstance }: AzureFoundryComparisonComponent) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const foundryComparison = useSWR(
        (selectedInstance)
            ? `/api/azure/bridge/azure/foundry/comparison/get_azure_bedrock_comparison?date_from=${startDateFormatted}&date_to=${endDateFormatted}&account_name=${selectedInstance}`
            : null,
        fetcher
    )

    if (foundryComparison.isLoading) {
        return (
            <LoaderComponent />
        )
    }

    if (!selectedInstance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna cuenta de Azure AI.</div>
            </div>
        )
    }

    if (foundryComparison.error) {
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

    return (
        <div className='p-3'>
            <AzureFoundryComparisonView
                data={foundryComparison.data}
            />
        </div>
    )
}
