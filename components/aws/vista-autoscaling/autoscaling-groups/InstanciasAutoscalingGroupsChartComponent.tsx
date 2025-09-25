"use client";

import useSWR from "swr";
import { BarChart3 } from 'lucide-react';
import { AutoscalingGroupsResourceViewInfoComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewInfoComponent";
import { MainAutoscalingGroupsResourceViewMetricsSummaryComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/graficos/MainAutoscalingGroupsResourceViewMetricsSummaryComponent";
import { AutoscalingGroupsResourceViewInstanciasComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstanciasComponent";
import { AutoscalingGroupsResourceViewStatesInstancesComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewStatesInstancesComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoscalingGroupsResourceViewInstancesVsMaxMinComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstancesVsMaxMinComponent";
import { AutoscalingGroupsEventsTableComponent } from "@/components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsTable";

interface AutoscalingGroupData {
  sync_time: { $date: string };
  region: string;
  AutoScalingGroupName: string;
  CreatedTime: { $date: string };
  LaunchTemplate_LaunchTemplateId: string | null;
  LaunchTemplate_LaunchTemplateName: string | null;
  LaunchTemplate_Version: string | null;
  MinSize: number;
  MaxSize: number;
  Tags_Key: string[];
  Tags_Value: string[];
  Capacidad_Total_ASG: number;
  Launch_Template_Info_Formatted: string | null;
  Size_Range_Formatted: string;
  Total_Tags_ASG: number;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const InstanciasAutoscalingGroupsChartComponent = (props: unknown) => {
  const { startDate, endDate, region, instance, selectedKey, selectedValue } = props;

  console.log('Instance seleccionado:', instance);

  // Construir URL usando la estructura correcta que espera tu API
  const startDateFormatted = startDate.toISOString().split(".")[0];
  const endDateFormatted = endDate.toISOString().split(".")[0];

  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/autoscaling_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

  if (region && region !== "all_regions") {
    apiUrl += `&region=${region}`;
  }

  if (selectedKey && selectedValue) {
    apiUrl += `&tag_key=${encodeURIComponent(selectedKey)}&tag_value=${encodeURIComponent(selectedValue)}`;
  }

  if (instance && instance !== "all_autoscaling_groups") {
    apiUrl += `&auto_scaling_group_name=${instance}`;
  }

  console.log('URL construida:', apiUrl);

  // TODOS LOS HOOKS JUNTOS AL PRINCIPIO
  const { data: infoList, error: infoError, isLoading: infoLoading } = useSWR<AutoscalingGroupData[]>(
    startDate && endDate ? apiUrl : null,
    fetcher
  );

  // API para instancias del autoscaling group
  const instancesApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/autoscaling_groups_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&auto_scaling_group_name=${instance}`;

  const { data: instancesData, error: instancesError, isLoading: instancesLoading } = useSWR<unknown[]>(
    (startDate && endDate && instance && instance !== "all_autoscaling_groups") ? instancesApiUrl : null,
    fetcher
  );

  // API para métricas del autoscaling group
  const metricsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/autoscaling_groups_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}`;

  const { data: metricsData, error: metricsError, isLoading: metricsLoading } = useSWR<unknown[]>(
    (startDate && endDate && instance && instance !== "all_autoscaling_groups") ? metricsApiUrl : null,
    fetcher
  );

  // API para eventos del autoscaling group (usando instance por ahora)
  const eventsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/autoscaling_groups_events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}`;

  const { data: eventsData, error: eventsError, isLoading: eventsLoading } = useSWR<unknown>(
    (startDate && endDate && instance && instance !== "all_autoscaling_groups") ? eventsApiUrl : null,
    fetcher
  );

  console.log('Datos de la API:', { infoList, infoError, infoLoading });
  console.log('Datos eventos desde API:', eventsData);

  //borrar despues estos logs 
  console.log('URL de eventos construida:', eventsApiUrl);
  console.log('Instance value usado como resource:', instance);
  console.log('URL que funciona en Postman:', 'resource=awseb-e-znjuf8dzhf-stack-AWSEBAutoScalingGroup-3AaCBeqM5dbr');

  // DESPUÉS de todos los hooks, hacer el filtrado
  const autoscalingGroupData = (infoList || []).filter((item: AutoscalingGroupData) =>
    item?.AutoScalingGroupName === instance
  );

  console.log('Datos filtrados:', autoscalingGroupData);

  if (infoLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3">Cargando Autoscaling Groups...</span>
      </div>
    );
  }

  if (infoError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar datos</h3>
        <p className="text-sm mt-1">No se pudieron obtener los Autoscaling Groups</p>
      </div>
    );
  }

  if (!instance || instance === "all_autoscaling_groups") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-500 text-lg font-medium">
          No se ha seleccionado ningún Autoscaling Group.
        </div>
      </div>
    );
  }

  if (!autoscalingGroupData || autoscalingGroupData.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="text-center text-gray-500 text-lg font-medium">
          No hay datos disponibles para el Autoscaling Group seleccionado: {instance}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 px-4 py-6">
      <div className="flex flex-col xl:flex-row gap-8 min-w-0">
        <div className="w-full xl:max-w-sm min-w-0">
          <AutoscalingGroupsResourceViewInfoComponent data={autoscalingGroupData} />
        </div>
        <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
          <MainAutoscalingGroupsResourceViewMetricsSummaryComponent data={autoscalingGroupData} />
        </div>
      </div>

      {/* Tabla de Instancias del Autoscaling Group */}
      <AutoscalingGroupsResourceViewInstanciasComponent
        data={instancesData}
        startDate={startDate}
        endDate={endDate}
        autoscalingGroup={instance}
        isLoading={instancesLoading}
      />

      {/* Gráfico de Estados de Instancias */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Estados Instancias - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoscalingGroupsResourceViewStatesInstancesComponent
            data={metricsData || []}
            title="Estados Instancias Autoscaling Group"
            height="300px"
          />
        </CardContent>
      </Card>

      {/* Gráfico de Instancias vs Max/Min */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Configuración vs Límites - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoscalingGroupsResourceViewInstancesVsMaxMinComponent
            data={metricsData || []}
            height="300px"
          />
        </CardContent>
      </Card>

      {/* Tabla de Eventos del Autoscaling Group */}
      <AutoscalingGroupsEventsTableComponent
        data={eventsData}
        startDate={startDate}
        endDate={endDate}
        autoscalingGroup={instance}
        isLoading={eventsLoading}
      />
    </div>
  );
};