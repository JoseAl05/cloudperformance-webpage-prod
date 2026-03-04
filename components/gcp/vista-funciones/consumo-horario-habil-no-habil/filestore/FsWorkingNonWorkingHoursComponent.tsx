'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { WorkingNonWorkingHoursChartComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/grafico/WorkingNonWorkingHoursChartComponent';
import { WorkingNonWorkingHoursCardsComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/info/WorkingNonWorkingHoursCardsComponent';
import { WorkingNonWorkingHoursTableComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { AlertCircle, Clock } from 'lucide-react';
import { useMemo } from 'react';
import useSWR from 'swr';

interface FilestoreWorkingNonWorkingHoursComponentProps {
    startDate: Date;
    endDate: Date;
    resourceId: string;
    regions: string;
    projects: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const FilestoreWorkingNonWorkingHoursComponent = ({ startDate, endDate, regions, projects, resourceId }: FilestoreWorkingNonWorkingHoursComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const workingUsage = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/filestore/horario_habil_vs_no_habil/working_hours_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )

    const workingSummary = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/filestore/horario_habil_vs_no_habil/working_hours_usage_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )

    const workingSummaryByResource = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/filestore/horario_habil_vs_no_habil/working_hours_usage_summary_by_resource?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )


    const safeTableData = useMemo(() => {
        const rawData = workingSummaryByResource.data;
        if (!Array.isArray(rawData)) return [];

        const grouped: Record<string, unknown> = {};

        rawData.forEach(item => {
            const key = `${item.resource_id}-${item.sync_time}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    resource_name: item.resource_name,
                    resource_id: item.resource_id,
                    sync_time: item.sync_time,
                    metric_data: [],
                    metric_activity_summary: []
                };
            }

            // Normalizamos el nombre de la métrica para que WorkingNonWorkingColumns.tsx no falle
            const normalizedMetricName = item.metric_name || 'unknown';

            // Insertamos las métricas en el array del recurso correspondiente
            if (Array.isArray(item.metric_data)) {
                item.metric_data.forEach((m: unknown) => {
                    grouped[key].metric_data.push({
                        ...m,
                        metric_name: normalizedMetricName // Inyectamos el nombre en cada entrada
                    });
                });
            }

            // Alimentamos el resumen de actividad que requiere la tabla
            grouped[key].metric_activity_summary.push({
                metric_name: normalizedMetricName
            });
        });

        return Object.values(grouped);
    }, [workingSummaryByResource.data]);

    const anyLoading = workingUsage.isLoading || workingSummary.isLoading || workingSummaryByResource.isLoading;
    const anyError = !!workingUsage.error || !!workingSummary.error || !!workingSummaryByResource.error;

    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 font-medium">
                No se ha seleccionado ninguna instancia de Filestore.
            </div>
        )
    }

    if (anyLoading) return <LoaderComponent />

    if (anyError) {
        return (
            <div className="px-4 py-10">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información de horarios para Filestore."
                    tone="error"
                />
            </div>
        )
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0">
                {/* Reutilizamos el componente de Cards genérico */}
                <WorkingNonWorkingHoursCardsComponent data={workingSummary.data} />
            </div>

            <div className="flex items-center gap-3 my-10">
                <Clock className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Análisis de Almacenamiento: Horario Hábil vs No Hábil</h1>
            </div>

            {/* Reutilizamos el gráfico genérico */}
            <WorkingNonWorkingHoursChartComponent data={workingUsage.data} />

            <div className="flex items-center gap-3 my-10">
                <Clock className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Detalle de Eficiencia por Instancia</h1>
            </div>

            {/* Pasamos la data transformada que ahora sí agrupa todas las métricas por instancia */}
            <WorkingNonWorkingHoursTableComponent data={safeTableData} />

        </div>
    )
}