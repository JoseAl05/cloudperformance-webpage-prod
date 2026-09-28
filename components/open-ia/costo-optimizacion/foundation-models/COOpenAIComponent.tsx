'use client'

import { useMemo } from 'react';
import useSWR from 'swr';
import { AlertCircle, Info } from 'lucide-react';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { OpenAICostOptimizationCardsComponent } from '@/components/open-ia/costo-optimizacion/foundation-models/info/COOpenAICardsComponent';
import {
    normalizeOpenAICostOptimizationData,
    type OpenAICostOptimizationApiModel,
} from '@/components/open-ia/costo-optimizacion/openaiCostOptimizationData';

interface OpenAICostOptimizationComponentProps {
    startDate: Date;
    endDate?: Date;
}

const fetcher = async (url: string) => {
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (!response.ok) {
        let message = 'Error al cargar datos de optimizacion de costos OpenAI';
        try {
            const payload = await response.json();
            message = payload?.detail || payload?.error || message;
        } catch {}
        throw new Error(message);
    }

    return response.json();
};

const formatApiDate = (date: Date) => date.toISOString().replace('Z', '').slice(0, -4);
const isNonEmptyArray = <T,>(value: unknown): value is T[] => Array.isArray(value) && value.length > 0;

export const OpenAICostOptimizationComponent = ({ startDate, endDate }: OpenAICostOptimizationComponentProps) => {
    const endpoint = useMemo(() => {
        const params = new URLSearchParams({
            project_id: 'all_projects',
            model: 'all_models',
        });

        if (startDate && endDate) {
            params.set('date_from', formatApiDate(startDate));
            params.set('date_to', formatApiDate(endDate));
        }

        return `/api/openai/bridge/openai/openai_get_model_price_rate?${params.toString()}`;
    }, [startDate, endDate]);

    const priceRate = useSWR<OpenAICostOptimizationApiModel[]>(endpoint, fetcher);

    const data = useMemo(() => (
        isNonEmptyArray<OpenAICostOptimizationApiModel>(priceRate.data)
            ? normalizeOpenAICostOptimizationData(priceRate.data)
            : []
    ), [priceRate.data]);

    if (priceRate.isLoading) {
        return <LoaderComponent size="large" />;
    }

    if (priceRate.error) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrio un problema al obtener la informacion desde la API de OpenAI. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos metricas de consumo OpenAI para el rango de fechas seleccionado."
                    tone="warn"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4 p-3">
            <OpenAICostOptimizationCardsComponent data={data} />
        </div>
    );
};