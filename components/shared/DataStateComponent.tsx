'use client'

import { AlertCircle, Info } from 'lucide-react';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { FetchError } from '@/lib/fetcher';

interface DataStateComponentProps {
    isLoading?: boolean
    error?: unknown
    isEmpty?: boolean
    emptyTitle?: string
    emptyDescription?: string
    errorDescription?: string
    children: React.ReactNode
}

const DEFAULT_ERROR_DESCRIPTION =
    'Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas.';

const describeError = (error: unknown, fallback: string) => {
    if (error instanceof FetchError && typeof error.detail === 'string' && error.detail) {
        return `${fallback} (${error.status}: ${error.detail})`;
    }
    return fallback;
};

export const DataStateComponent = ({
    isLoading = false,
    error,
    isEmpty = false,
    emptyTitle = 'Sin datos para mostrar',
    emptyDescription = 'No encontramos información en el rango seleccionado.',
    errorDescription = DEFAULT_ERROR_DESCRIPTION,
    children,
}: DataStateComponentProps) => {
    if (isLoading) {
        return <LoaderComponent size='large' />
    }

    if (error) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description={describeError(error, errorDescription)}
                    tone="error"
                />
            </div>
        )
    }

    if (isEmpty) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title={emptyTitle}
                    description={emptyDescription}
                    tone="warn"
                />
            </div>
        )
    }

    return <>{children}</>
}
