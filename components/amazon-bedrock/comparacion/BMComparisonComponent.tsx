'use client'

import { MessageCard } from '@/components/azure/cards/MessageCards';
import { LoaderComponent } from '@/components/general_azure/LoaderComponent';
import { BMComparisonView } from '@/components/amazon-bedrock/comparacion/info/BMComparisonViewComponent';
import { AlertCircle } from 'lucide-react';
import useSWR from 'swr';
import { AwsBedrockComparison, AwsBedrockComparisonResponse } from '@/interfaces/bedrock-comparison/awsBedrockComparisonInterfaces';

interface BMComparisonComponent {
    startDate: Date
    endDate?: Date
    instance?: string | null
    region?: string | null
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const BMComparisonComponent = ({ startDate, endDate, instance, region }: BMComparisonComponent) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const bedrockComparison = useSWR<AwsBedrockComparison | AwsBedrockComparisonResponse>(
        (instance)
            ? `/api/aws/bridge/bedrock/comparison/get_aws_bedrock_comparison?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_id=${instance}&region=${region || 'all_regions'}`
            : null,
        fetcher,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    )

    if (bedrockComparison.isLoading) {
        return (
            <LoaderComponent size='large' />
        )
    }

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningun perfil de Bedrock.</div>
            </div>
        )
    }

    if (bedrockComparison.error) {
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
            <BMComparisonView
                data={bedrockComparison.data}
            />
        </div>
    )
}
