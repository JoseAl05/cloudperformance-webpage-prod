'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { WorkingNonWorkingHoursChartComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/grafico/WorkingNonWorkingHoursChartComponent';
import { WorkingNonWorkingHoursCardsComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/info/WorkingNonWorkingHoursCardsComponent';
import { WorkingNonWorkingHoursTableComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { WorkingNonWorkingHoursUsage, WorkingNonWorkingHoursUsageSummary, WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface GkeWorkingNonWorkingHoursComponentProps {
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

export const GkeWorkingNonWorkingHoursComponent = ({ startDate, endDate, regions, projects, resourceId }: GkeWorkingNonWorkingHoursComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const workingNonWorkingUsage = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/cluster_gke/working_hours_non_working_hours_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )

    const workingNonWorkingUsageSummary = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/cluster_gke/working_hours_non_working_hours_usage_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )

    const workingNonWorkingUsageSummaryByResource = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/cluster_gke/working_hours_non_working_hours_usage_summary_by_resource?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&instances=${resourceId}` : null,
        fetcher
    )

    const workingNonWorkingUsageData: WorkingNonWorkingHoursUsage[] | null =
        isNonEmptyArray<WorkingNonWorkingHoursUsage>(workingNonWorkingUsage.data) ? workingNonWorkingUsage.data : null;

    const workingNonWorkingUsageSummaryData: WorkingNonWorkingHoursUsageSummary[] | null =
        isNonEmptyArray<UnusedCeCardsMetricSummary>(workingNonWorkingUsageSummary.data) ? workingNonWorkingUsageSummary.data : null;

    const workingNonWorkingUsageSummaryByResourceData: WorkingNonWorkingHoursUsageSummaryByResource[] | null =
        isNonEmptyArray<UnusedCeCardsMetricSummary>(workingNonWorkingUsageSummaryByResource.data) ? workingNonWorkingUsageSummaryByResource.data : null;

    const hasUnusedData = !!workingNonWorkingUsageData || !!workingNonWorkingUsageSummaryData || !!workingNonWorkingUsageSummaryByResourceData;

    const anyLoading =
        workingNonWorkingUsage.isLoading ||
        workingNonWorkingUsageSummary.isLoading ||
        workingNonWorkingUsageSummaryByResource.isLoading


    const anyError =
        !!workingNonWorkingUsage.error ||
        !!workingNonWorkingUsageSummary.error ||
        !!workingNonWorkingUsageSummaryByResource.error


    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningúna instancia.</div>
            </div>
        )
    }

    if (anyLoading) {
        return <LoaderComponent />
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

    if (!hasUnusedData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos instancias en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }



    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0">
                    <WorkingNonWorkingHoursCardsComponent
                        data={workingNonWorkingUsageSummaryData}
                    />
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas compute engines horario hábil vs no hábil.</h1>
                </div>
                <WorkingNonWorkingHoursChartComponent
                    data={workingNonWorkingUsageData}
                />
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle instancias compute engines horario hábil vs no hábil.</h1>
                </div>
                <WorkingNonWorkingHoursTableComponent
                    data={workingNonWorkingUsageSummaryByResourceData}
                />
            </div>
        </>
    )
}