
'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ConsumoHorarioChartComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/grafico/ConsumoHorarioChartComponent';
import { ConsumoHorarioCardsComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/info/ConsumoHorarioCardsComponent';
import { ConsumoHorarioTableComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/table/ConsumoHorarioTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { WorkingNonWorkingHoursUsage, WorkingNonWorkingHoursUsageSummary, WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface ConsumoRdsHorarioComponentProps {
  startDate: Date,
  endDate: Date,
  instance: string
  region: string,
  dbType: string
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const ConsumoRdsHorarioComponent = ({ startDate, endDate, region, instance, dbType}: ConsumoRdsHorarioComponentProps) => {

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const workingNonWorkingUsage = useSWR(
    instance ? `/api/aws/bridge/aws/rds/business-vs-offhours_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}&db_type=${dbType}` : null,
    fetcher
  )

  const workingNonWorkingUsageSummary = useSWR(
    instance ? `/api/aws/bridge/aws/rds/business-vs-offhours_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}&db_type=${dbType}` : null,
    fetcher
  )

  const workingNonWorkingUsageSummaryByResource = useSWR(
    instance ? `/api/aws/bridge/aws/rds/business-vs-offhours_summary_by_resource?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}&db_type=${dbType}` : null,
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


  if (!instance) {
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
          <ConsumoHorarioCardsComponent
            data={workingNonWorkingUsageSummaryData}
          />
        </div>
        <div className="flex items-center gap-3 my-10">
          <Clock className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-foreground">Métricas compute engines horario hábil vs no hábil.</h1>
        </div>
        <ConsumoHorarioChartComponent
          data={workingNonWorkingUsageData}
        />
        <div className="flex items-center gap-3 my-10">
          <Clock className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-foreground">Detalle instancias compute engines horario hábil vs no hábil.</h1>
        </div>
        <ConsumoHorarioTableComponent
          data={workingNonWorkingUsageSummaryByResourceData}
        />
      </div>
    </>
  )
}