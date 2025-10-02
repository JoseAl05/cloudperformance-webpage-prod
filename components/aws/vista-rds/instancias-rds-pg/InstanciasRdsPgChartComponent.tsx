"use client";

import { useRef, useEffect } from "react";
import useSWR from "swr";
import * as echarts from "echarts";
import { Database, ChartBar, Clock, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RdsResourceViewInfoComponent } from "./info/RdsResourceViewInfoComponent";
import { MainRdsPgResourceViewMetricsSummaryComponent } from "./graficos/MainRdsPgResourceViewMetricsSummaryComponent";
import { RdsMemoryChart } from "./graficos/RdsPgResourceViewMemoryComponent";
import { RdsCpuCreditsLineChart } from "./graficos/RdsPgResourceViewCpuCreditsComponent";
import { RdsCpuUsageChart } from "./graficos/RdsPgResourceViewCpuUsageComponent";
import { RdsDbConnectionsChart } from "./graficos/RdsPgResourceViewDbConnectionsComponent";
import { RdsIopsChart } from "./graficos/RdsPgResourceViewIopsComponent";
import { RdsStorageChart } from "./graficos/RdsPgResourceViewStorageComponent";
import { RdsPgEventsTableComponent } from "./events/RdsPgEventsTable";

interface InstanciasRdsPgProps {
  startDate: Date;
  endDate: Date;
  region?: string;
  instance?: string;
  selectedKey?: string | null;
  selectedValue?: string | null;
}

interface RdsInstanceData {
  sync_time: { $date: string };
  TagList_Key: string[];
  TagList_Value: string[];
  region: string;
  DBInstanceIdentifier: string;
  InstanceCreateTime: { $date: string };
  DBInstanceStatus: string;
  DBInstanceClass: string;
  LicenseModel: string;
  DBSubnetGroup_Subnets_SubnetIdentifier: string[];
  Engine: string;
  EngineVersion: string;
  AllocatedStorage: number;
  StorageType: string;
  DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name: string[];
  DBSubnetGroup_Subnets_SubnetStatus: string[];
  Total_Subnets_RDS_Postgresql: number;
  EnginePlusVersion: string;
  Allocated_Storage_RDS_Postgresql_Formatted: string;
}

interface RdsMetricItem {
  MetricLabel: string;
  Value: number;
  sync_time: string;
  Unit?: string;
}

interface RdsMetricsData {
  metrics_data: RdsMetricItem[];
  calculated_summary?: Record<string, unknown>;
}

interface MetricPoint {
  sync_time: { $date: string };
  Resource: string;
  Timestamp: string;
  Value: number;
  total?: number;
  unused?: number;
  used?: number;
  MetricId: string;
  MetricLabel: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const InstanciasRdsPgChartComponent = ({
  startDate,
  endDate,
  region,
  instance = "",
  selectedKey,
  selectedValue,
}: InstanciasRdsPgProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const startDateFormatted = startDate.toISOString().split(".")[0];
  const endDateFormatted = endDate.toISOString().split(".")[0];

  let infoUrl = `/api/aws/bridge/db/instancias-rds-pg?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
  if (region && region !== "all_regions") infoUrl += `&region=${region}`;
  if (selectedKey && selectedValue) {
    infoUrl += `&tag_key=${encodeURIComponent(
      selectedKey
    )}&tag_value=${encodeURIComponent(selectedValue)}`;
  }
  if (instance && instance !== "all_instances")
    infoUrl += `&db_instance_identifier=${instance}`;

  const shouldFetchInfo = !!(startDate && endDate);
  const {
    data: infoList,
    error: infoError,
    isLoading: infoLoading,
  } = useSWR<RdsInstanceData[]>(shouldFetchInfo ? infoUrl : null, fetcher);

  const shouldFetchMetrics = !!(
    startDate &&
    endDate &&
    instance &&
    instance !== "all_instances"
  );
  const metricsUrl = shouldFetchMetrics
    ? `/api/aws/bridge/db/instancias-rds-pg-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${encodeURIComponent(
        instance
      )}`
    : null;

  const {
    data: metricsData,
    error: metricsError,
    isLoading: metricsLoading,
  } = useSWR<RdsMetricsData>(metricsUrl, fetcher);

  // -------- Eventos de la instancia --------
  const shouldFetchEvents = !!(
    startDate &&
    endDate &&
    instance &&
    instance !== "all_instances"
  );
  const eventsUrl = shouldFetchEvents
    ? `/api/aws/bridge/db/instancias-rds-pg-events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${encodeURIComponent(instance)}`
    : null;

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(eventsUrl, fetcher);

  // ---------- eCharts para "Estado de Instancias" (vista general) ----------
  const processChartData = (rawData: RdsInstanceData[] = []) => {
    const statusCounts = rawData.reduce((acc, item) => {
      acc[item.DBInstanceStatus] = (acc[item.DBInstanceStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  useEffect(() => {
    if (!infoList || !chartRef.current) return;

    const pieData = processChartData(infoList);

    if (chartInstance.current) chartInstance.current.dispose();
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    chart.setOption({
      tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
      legend: { top: "5%", left: "center" },
      series: [
        {
          name: "Estado de Instancias",
          type: "pie",
          radius: ["40%", "70%"],
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
          itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) chartInstance.current.dispose();
    };
  }, [infoList]);

  // ← Función para transformar los datos de métricas al formato esperado por el gráfico
  const transformMetricsForChart = (
    metricsData: RdsMetricsData
  ): MetricPoint[] => {
    if (!metricsData?.metrics_data) return [];

    // Los datos ya vienen en el formato correcto desde la API
    return metricsData.metrics_data as MetricPoint[];
  };

  // -------- Loaders / errores --------
  if (infoLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3">Cargando instancias RDS PostgreSQL...</span>
      </div>
    );
  }
  if (infoError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar datos</h3>
        <p className="text-sm mt-1">
          No se pudieron obtener las instancias RDS PostgreSQL
        </p>
      </div>
    );
  }

  // Sin selección de instancia -> mensaje
  if (!instance || instance === "all_instances") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-500 text-lg font-medium">
          No se ha seleccionado ninguna instancia.
        </div>
      </div>
    );
  }

  // Datos de la instancia concreta
  const instanceData =
    infoList?.filter((item) => item.DBInstanceIdentifier === instance) || [];

  if (instanceData.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <div className="text-center text-gray-500 text-lg font-medium">
          No hay datos disponibles para la instancia seleccionada: {instance}
        </div>
      </div>
    );
  }

  // Carga/errores de métricas del summary
  if (metricsLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3">Cargando métricas de RDS {instance}...</span>
      </div>
    );
  }
  if (metricsError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar métricas</h3>
        <p className="text-sm mt-1">
          No se pudieron obtener las métricas de la instancia {instance}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-8 min-w-0">
          {/* Panel izquierdo - Información de la instancia */}
          <div className="w-full xl:max-w-sm min-w-0">
            <RdsResourceViewInfoComponent data={instanceData} />
          </div>

          {/* Panel derecho - Resumen de métricas */}
          <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
            <MainRdsPgResourceViewMetricsSummaryComponent
              data={metricsData ?? null}
            />
          </div>
        </div>

        {/* Sección "Métricas de la Instancia" */}
        <div className="flex flex-col gap-5 mt-10">
          <div className="flex items-center gap-3 my-5">
            <ChartBar className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Métricas de la Instancia
            </h1>
          </div>

          {/* ← Aquí se integra el gráfico de CPU Credits */}
          {!metricsData || !metricsData.metrics_data?.length ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Sin métricas en el rango
              </h3>
              <p className="text-gray-500">
                Ajusta el rango de fechas o verifica la instancia seleccionada.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gráfico 1: CPU Credits */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5 text-blue-600" />
                    CPU Credits - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsCpuCreditsLineChart
                    data={transformMetricsForChart(metricsData)}
                    title="Consumo y Balance de Créditos de CPU (Burstable)"
                    height="300px"
                  />
                </CardContent>
              </Card>

              {/* Gráfico 2: CPU Usage */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5 text-red-600" />
                    CPU Usage - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsCpuUsageChart
                    data={transformMetricsForChart(metricsData)}
                    title="Uso vs No Uso de Cores de CPU"
                    height="300px"
                  />
                </CardContent>
              </Card>

              {/* Gráfico 3: Database Connections */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    Conexiones DB - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsDbConnectionsChart
                    data={transformMetricsForChart(metricsData)}
                    title="Conexiones a Base de Datos"
                    height="300px"
                  />
                </CardContent>
              </Card>
              {/* Gráfico 4: Memory */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    Memoria - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsMemoryChart
                    data={transformMetricsForChart(metricsData)}
                    title="Memoria Disponible"
                    height="300px"
                  />
                </CardContent>
              </Card>
              {/* Gráfico 5: IOPS */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-600" />
                    IOPS - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsIopsChart
                    data={transformMetricsForChart(metricsData)}
                    title="Operaciones Lectura/Escritura (IOPS/seg)"
                    height="300px"
                  />
                </CardContent>
              </Card>
              {/* Gráfico 6: Storage */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-purple-600" />
                    Storage - {instance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RdsStorageChart
                    data={transformMetricsForChart(metricsData)}
                    title="Storage Disponible"
                    height="300px"
                  />
                </CardContent>
              </Card>
              {/* Tabla de Eventos RDS PostgreSQL */}
              <RdsPgEventsTableComponent
                data={eventsData}
                startDate={startDate}
                endDate={endDate}
                instance={instance}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
