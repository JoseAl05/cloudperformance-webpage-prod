// 'use client'

// import useSWR from 'swr'
// import { Card, CardContent } from '@/components/ui/card'
// import { BarChart3, Moon, Clock } from 'lucide-react'
// import { TableEC2Metrics } from "@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/table/tableComponent"
// import { bytesToMB } from '@/lib/bytesToMbs'
// import { ConsumoHorarioChartComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/grafico/ConsumoHorarioChartComponent'

// const fetcher = (url: string) =>
//   fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
//     .then(r => r.json());

// interface ConsumoEC2HorarioProps {
//   startDate: Date,
//   endDate: Date,
//   metric?: string
//   instance?: string
// }

// const metricUnits: Record<string, string> = {
//   "CPUUtilization Average": "%",
//   "CPUUtilization Maximum": "%",
//   "CPUUtilization Minimum": "%",
//   "CPUCreditBalance Average": "Créditos",
//   "CPUCreditBalance Maximum": "Créditos",
//   "CPUCreditBalance Minimum": "Créditos",
//   "CPUCreditUsage Average": "Créditos",
//   "CPUCreditUsage Maximum": "Créditos",
//   "CPUCreditUsage Minimum": "Créditos",
//   "NetworkIn Average": "MBs",
//   "NetworkIn Maximum": "MBs",
//   "NetworkIn Minimum": "MBs",
//   "NetworkOut Average": "MBs",
//   "NetworkOut Maximum": "MBs",
//   "NetworkOut Minimum": "MBs",
// }

// export const MainViewConsumoEC2Horario = ({ startDate, endDate, metric, instance }: ConsumoEC2HorarioProps) => {
//   const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
//   const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
//   let avgDataHabil: unknown = 0;
//   let avgDataNoHabil: unknown = 0;

//   const { data, error, isLoading } = useSWR(
//     `/api/aws/bridge/aws/ec2/business-vs-offhours?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&resource=${instance || "all"}`,
//     fetcher
//   );


//   const avgStatisticsFormatted = data && data.avgStatistics ? (data.avgStatistics as unknown[]).map((item: unknown) => {
//     if (metric?.includes('NetworkIn') || metric?.includes('NetworkOut')) {
//       return {
//         ...item,
//         average: Number(bytesToMB(Number(item.average ?? 0)))
//       }
//     }
//     return item;
//   }) : [];


//   if (metric?.includes('NetworkIn') || metric?.includes('NetworkOut')) {
//     avgDataHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average ?? "--" : 0;
//     avgDataNoHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average ?? "--" : 0;
//   } else {
//     avgDataHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average?.toFixed?.(2) ?? "--" : 0;
//     avgDataNoHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average?.toFixed?.(2) ?? "--" : 0;
//   }

//   if (isLoading) return <p>Cargando datos...</p>
//   if (error) return <p>Error al cargar datos</p>

//   const unit = metricUnits[metric || ""] || ""

//   return (
//     <div className="space-y-6 p-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {avgStatisticsFormatted && (
//           <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">
//                     Uso Horario Hábil
//                   </p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {avgDataHabil} {unit}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Promedio de consumo en horas hábiles
//                   </p>
//                 </div>
//                 <Clock className="h-8 w-8 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>
//         )}
//         {avgStatisticsFormatted && (
//           <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">
//                     Uso Horario No Hábil
//                   </p>
//                   <p className="text-2xl font-bold text-red-600">
//                     {avgDataNoHabil} {unit}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Promedio de consumo en horas no hábiles
//                   </p>
//                 </div>
//                 <Moon className="h-8 w-8 text-red-500" />
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//       <Card className="shadow-lg rounded-2xl">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold">
//               Evolución de {metric || 'Métrica'}
//             </h2>
//             <BarChart3 className="h-6 w-6 text-blue-500" />
//           </div>
//           <ConsumoHorarioChartComponent
//             data={data}
//             metric={metric ? metric : ''}
//             metricUnits={metricUnits}
//           />
//         </CardContent>
//       </Card>
//       <div>
//         <TableEC2Metrics
//           startDateFormatted={startDateFormatted}
//           endDateFormatted={endDateFormatted}
//           metric={metric}
//           instance={instance || "all"}
//         />
//       </div>
//     </div>
//   )
// }

'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ConsumoHorarioChartComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/grafico/ConsumoHorarioChartComponent';
import { ConsumoHorarioCardsComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/info/ConsumoHorarioCardsComponent';
import { ConsumoHorarioTableComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/table/ConsumoHorarioTableComponent';
import { WorkingNonWorkingHoursChartComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/grafico/WorkingNonWorkingHoursChartComponent';
import { WorkingNonWorkingHoursTableComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { WorkingNonWorkingHoursUsage, WorkingNonWorkingHoursUsageSummary, WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface ConsumoEC2HorarioComponentProps {
  startDate: Date,
  endDate: Date,
  instance: string
  region: string,
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const ConsumoEC2HorarioComponent = ({ startDate, endDate, region, instance}: ConsumoEC2HorarioComponentProps) => {

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const workingNonWorkingUsage = useSWR(
    instance ? `/api/aws/bridge/aws/ec2/business-vs-offhours_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}` : null,
    fetcher
  )

  const workingNonWorkingUsageSummary = useSWR(
    instance ? `/api/aws/bridge/aws/ec2/business-vs-offhours_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}` : null,
    fetcher
  )

  const workingNonWorkingUsageSummaryByResource = useSWR(
    instance ? `/api/aws/bridge/aws/ec2/business-vs-offhours_summary_by_resource?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instances=${instance}` : null,
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