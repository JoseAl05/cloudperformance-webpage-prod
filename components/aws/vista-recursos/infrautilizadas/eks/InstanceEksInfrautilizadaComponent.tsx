"use client";

import useSWR from "swr";
import { ChartBar, FileSpreadsheet } from "lucide-react";
import { MainEc2ResourceInfraUsedViewMetricsSummaryComponent } from "@/components/aws/vista-recursos/infrautilizadas/eks/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent";
import { Ec2ResourceInfraUsedViewColumns } from "@/components/aws/vista-recursos/infrautilizadas/eks/table/ec2ResourceInfraUsedTableColumns";
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { ResourceInfraUsedViewUsageCreditsComponent } from '@/components/aws/vista-recursos/infrautilizadas/graficos/ResourceInfraUsedViewUsageCreditsComponent';

interface InstanceEc2CInfrautilizadaComponentProps {
  startDate: Date;
  endDate?: Date;
  eksAsgInstance: string;
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

export const InstanceEksInfrautilizadaComponent = ({
  startDate,
  endDate,
  eksAsgInstance,

}: InstanceEc2CInfrautilizadaComponentProps) => {
  const startDateFormatted = startDate
    .toISOString()
    .replace("Z", "")
    .slice(0, -4);
  const endDateFormatted = endDate
    ? endDate.toISOString().replace("Z", "").slice(0, -4)
    : "";

  // https://cloudperformance-desarrollo.eastus2.cloudapp.azure.com/api/aws/ec2/unused/unused?date_from=2025-08-01T00:00:00&date_to=2025-09-02T23:59:59&region=all&resource=i-08fc095993a5521be,i-084e4e667310b5e5b,i-0e2e4f97aaaaae90e
  const ec2InfrautilizadaInfo = useSWR(
    eksAsgInstance
      ? `/api/aws/bridge/aws/ec2/unused/unused?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${eksAsgInstance}`
      : null,
    fetcher
  );


  if (ec2InfrautilizadaInfo.isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3">Cargando datos...</span>
      </div>
    );
  }
  if (ec2InfrautilizadaInfo.error) return <div>Error al cargar datos</div>;


  if (!eksAsgInstance) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-500 text-lg font-medium">
          No se ha seleccionado ninguna instancia.
        </div>
      </div>
    );
  }

  const metricsData = ec2InfrautilizadaInfo.data;

  if (
    !metricsData ||
    !metricsData.resourceList ||
    metricsData.resourceList.length === 0
  ) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-8 min-w-0">
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-center text-gray-500 text-lg font-medium">
              No hay métricas disponibles para esta instancia en el rango seleccionado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-8 min-w-0">
          <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
            {/* <MainEc2ResourceInfraUsedViewMetricsSummaryComponent data={metricsData.ec2IntancesMetricsStatistics} /> */}
            <MainEc2ResourceInfraUsedViewMetricsSummaryComponent data={metricsData} />
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <div className="flex items-center gap-3 my-5">
            <ChartBar className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Métricas de la Instancia
            </h1>
          </div>
          <ResourceInfraUsedViewUsageCreditsComponent data={metricsData} />
        </div>



        <div className="flex  flex-col  gap-3 my-10">
          <div className="flex items-center gap-3 text-3xl font-bold text-foreground">
            {/* <Clock className="h-8 w-8 text-blue-500" /> */}
            <FileSpreadsheet className="h-8 w-8 text-blue-500" />
            Detalle Instancias Infrautilizadas
          </div>
          <DataTableGrouping
            columns={Ec2ResourceInfraUsedViewColumns}
            data={metricsData.ec2Intances}
            filterColumn="InstanceId"
            filterPlaceHolder="Buscar instancia...."
            enableGrouping={false}
          />
        </div>
      </div>
    </>
  );
};
