'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { GcpVertexComparisonView } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonViewComponent';
import { AlertCircle, Info } from 'lucide-react';
import useSWR from 'swr';
import { GcpVertexComparison, GcpVertexComparisonResponse } from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';

interface GcpVertexComparisonComponentProps {
    startDate: Date
    endDate?: Date
    projects: string
    regions: string
    resourceId?: string | null
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const formatApiDate = (date?: Date) => date ? date.toISOString().replace('Z', '').slice(0, -4) : '';

export const GcpVertexComparisonComponent = ({ startDate, endDate, projects, regions, resourceId }: GcpVertexComparisonComponentProps) => {
    const startDateFormatted = formatApiDate(startDate);
    const endDateFormatted = formatApiDate(endDate);
    const selectedResource = resourceId && resourceId.trim() !== '' ? resourceId : 'all';

    const gcpVertexComparison = useSWR<GcpVertexComparison | GcpVertexComparisonResponse>(
        endDateFormatted
            ? `/api/gcp/bridge/gcp/vertex/comparison/get_gcp_vertex_comparison?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects || 'all_projects'}&region=${regions || 'all_regions'}&resource_id=${selectedResource}`
            : null,
        fetcher,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    if (gcpVertexComparison.isLoading) {
        return <LoaderComponent size='large' />;
    }

    if (gcpVertexComparison.error) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrio un problema al obtener la comparacion de Vertex AI. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        );
    }

    if (!gcpVertexComparison.data) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos informacion de comparacion para Vertex AI en el periodo seleccionado."
                    tone="warn"
                />
            </div>
        );
    }

    return (
        <div className='p-3'>
            <GcpVertexComparisonView data={gcpVertexComparison.data} />
        </div>
    );
}