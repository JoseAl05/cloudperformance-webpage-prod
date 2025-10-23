'use client'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Hash, Tag, Clock, FolderTree, Cloud, AlertCircle, Info } from 'lucide-react'
import { VmDeploymentsChart } from '@/components/azure/vista-recursos-vm/graficos/VmDeploymetsChartComponent'
import { VmDeploymentsTableComponent } from '@/components/azure/vista-recursos-vm/table/VmDeploymentsTableComponent'
import { VmBillingChart, VmBillingChartComponent } from '@/components/azure/vista-recursos-vm/graficos/VmBillingChartComponent'
import { VmMeasuresChart, VmMeasuresChartComponent } from '@/components/azure/vista-recursos-vm/graficos/VmMeasuresChartComponent'
import { VmBillingPropertiesComponent } from '@/components/azure/vista-recursos-vm/graficos/VmBillingPropertiesComponent'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { RecursosVmCardsComponent } from '@/components/azure/vista-recursos-vm/info/RecursosVmCardsComponent'
import { RecursosVmCpuMetricsComponent } from '@/components/azure/vista-recursos-vm/graficos/RecursosVmCpuMetricsComponent'
import { RecursosVmMemoryMetricsComponent } from '@/components/azure/vista-recursos-vm/graficos/RecursosVmMemoryMetricsComponent'
import { RecursosVmIopsMetrics } from '@/components/azure/vista-recursos-vm/graficos/RecursosVmIopsMetrics'


interface RecursosVmProps {
  startDate: Date;
  endDate: Date;
  selectedVm: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined



export const RecursosVmComponent = ({ startDate, endDate, selectedVm }: RecursosVmProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const vmProperties = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/propiedades?date_from=${startDateFormatted}&date_to=${endDateFormatted}&vm_id=${selectedVm}` : null,
    fetcher,
  )

  const vmCpuMetrics = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/consumo-metricas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&vm_id=${selectedVm}&metric_name=Percentage%20CPU` : null,
    fetcher
  )
  const vmMemoryMetrics = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/consumo-metricas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&vm_id=${selectedVm}&metric_name=Available%20Memory` : null,
    fetcher
  )
  const vmIopsMetrics = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/consumo-metricas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&vm_id=${selectedVm}&metric_name=Disks%20IOPS` : null,
    fetcher
  )

  const vmDeployments = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/deployments-por-fecha?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_id=${selectedVm}` : null,
    fetcher
  )

  const vmMeasures = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/facturacion/medidas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${selectedVm}` : null,
    fetcher
  )

  const vmBillingProperties = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/facturacion/propiedades?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${selectedVm}` : null,
    fetcher
  )
  const vmBilling = useSWR(
    selectedVm ? `/api/azure/bridge/azure/recursos/vm/facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${selectedVm}` : null,
    fetcher
  )

  const anyLoading =
    vmProperties.isLoading ||
    vmCpuMetrics.isLoading ||
    vmMemoryMetrics.isLoading ||
    vmIopsMetrics.isLoading ||
    vmDeployments.isLoading ||
    vmMeasures.isLoading ||
    vmBillingProperties.isLoading ||
    vmBilling.isLoading

  const anyError =
    !!vmProperties.error ||
    !!vmCpuMetrics.error ||
    !!vmMemoryMetrics.error ||
    !!vmIopsMetrics.error ||
    !!vmDeployments.error ||
    !!vmMeasures.error ||
    !!vmBillingProperties.error ||
    !!vmBilling.error

  const vmPropertiesData: unknown | null =
    !isNullish<unknown>(vmProperties.data) ? vmProperties.data : null;

  const vmCpuMetricsData: unknown | null =
    !isNullish<unknown>(vmCpuMetrics.data) ? vmCpuMetrics.data : null;

  const vmMemoryMetricsData: unknown | null =
    !isNullish<unknown>(vmMemoryMetrics.data) ? vmMemoryMetrics.data : null;

  const vmIopsMetricsData: unknown | null =
    !isNullish<unknown>(vmIopsMetrics.data) ? vmIopsMetrics.data : null;

  const vmDeploymentsData: unknown | null =
    !isNullish<unknown>(vmDeployments.data) ? vmDeployments.data : null;

  const vmMeasuresData: unknown | null =
    !isNullish<unknown>(vmMeasures.data) ? vmMeasures.data : null;

  const vmBillingPropertiesData: unknown | null =
    !isNullish<unknown>(vmBillingProperties.data) ? vmBillingProperties.data : null;

  const vmBillingData: unknown | null =
    !isNullish<unknown>(vmBilling.data) ? vmBilling.data : null;

  const hasPropertiesData = !!vmPropertiesData && vmPropertiesData.length > 0;
  const hasCpuMetricsData = !!vmCpuMetricsData && vmCpuMetricsData.length > 0;
  const hasMemoryMetricsData = !!vmMemoryMetricsData && vmMemoryMetricsData.length > 0;
  const hasIopsMetricsData = !!vmIopsMetricsData && vmIopsMetricsData.length > 0;
  const hasDeploymentsData = !!vmDeploymentsData && vmDeploymentsData.length > 0;
  const hasMeasuresData = !!vmMeasuresData && vmMeasuresData.length > 0;
  const hasBillingPropertiesData = !!vmBillingPropertiesData && vmBillingPropertiesData.length > 0;
  const hasBillingData = !!vmBillingData && vmBillingData.length > 0;

  if (anyLoading) {
    return <LoaderComponent />
  }

  if (!selectedVm) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna VM.</div>
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

  const noneHasData =
    !hasPropertiesData && !hasCpuMetricsData && !hasMemoryMetricsData && hasIopsMetricsData && hasDeploymentsData && hasMeasuresData && hasBillingPropertiesData && hasBillingData;

  if (noneHasData) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <MessageCard
          icon={Info}
          title="Sin datos para mostrar"
          description="No encontramos métricas ni información de la instancia en el rango seleccionado."
          tone="warn"
        />
      </div>
    )
  }
  const vmData = vmPropertiesData[0] ?? {};

  return (
    <div className="w-full min-w-0 px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <Cloud className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {vmData.nombre_vm}
            </h1>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Última modificación: {vmData.ultima_modificacion}
            </p>
          </div>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-blue-500">
          Propiedades del Recurso
        </h2>
        <RecursosVmCardsComponent
          data={vmPropertiesData[0]}
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-green-500">
          Métricas de Consumo
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecursosVmCpuMetricsComponent
              data={vmCpuMetricsData}
              title='Consumo CPU'
            />
            <RecursosVmMemoryMetricsComponent
              data={vmMemoryMetricsData}
              title='Memoria Disponible'
            />
          </div>
          <div>
            <RecursosVmIopsMetrics
              data={vmIopsMetricsData}
              title='IOPS Disco'
            />
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-purple-500">
          Historial de Deployments
        </h2>
        <div className="space-y-4">
          <VmDeploymentsChart
            data={vmDeploymentsData}
            title='Deployments'
          />
          <VmDeploymentsTableComponent
            startDate={startDate}
            endDate={endDate}
            vmName={selectedVm}
          />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-amber-500">
          Facturación Recursos Costo Acumulado Pago por Uso y Costo Acumulado Fijo
        </h2>
        <VmBillingChart
          data={vmBillingData}
          title='Facturación del Recurso'
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-indigo-500">
          Medidas Costos No Cuantificables
        </h2>
        <VmMeasuresChart
          data={vmMeasuresData}
          title='Costos medidas no cuantificables'
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-cyan-500">
          Propiedades de Facturación
        </h2>
        <VmBillingPropertiesComponent
          startDate={startDate}
          endDate={endDate}
          instanceName={selectedVm}
        />
      </section>
    </div>
  )
}