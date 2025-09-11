"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useEffect } from "react";
import useSWR from "swr";
import * as echarts from "echarts";
import { Database, BarChart3, HardDrive } from "lucide-react";
import { RdsOracleResourceViewInfoComponent } from "./info/RdsOracleResourceViewInfoComponent";
import { MainRdsOracleResourceViewMetricsSummaryComponent } from "./graficos/MainRdsOracleResourceViewMetricsSummaryComponent";
import { RdsOracleCpuCreditsLineChart } from "./graficos/RdsOracleResourceViewCpuCreditsComponent";
import { RdsOracleCpuUsageChart } from "./graficos/RdsOracleResourceViewCpuUsageComponent";
import { RdsOracleDbConnectionsChart } from "./graficos/RdsOracleResourceViewDbConnectionsComponent";
import { RdsOracleMemoryChart } from "./graficos/RdsOracleResourceViewMemoryComponent";
import { RdsOracleIopsChart } from "./graficos/RdsOracleResourceViewIopsComponent";
import { RdsOracleStorageChart } from "./graficos/RdsOracleResourceViewStorageComponent";
import { RdsOracleEventsTableComponent } from "./events/RdsOracleEventsTable";


interface InstanciasRdsOracleProps {
  startDate: Date;
  endDate: Date;
  region?: string;
  instance?: string;
  selectedKey?: string | null;
  selectedValue?: string | null;
}

interface RdsOracleInstanceData {
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
  Total_Subnets_RDS_Oracle: number;
  EnginePlusVersion: string;
  Allocated_Storage_RDS_Oracle_Formatted: string;
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

// Función para transformar los datos de métricas al formato esperado por el gráfico
const transformMetricsForChart = (
  metricsData: RdsMetricsData
): MetricPoint[] => {
  if (!metricsData?.metrics_data) return [];
  return metricsData.metrics_data as MetricPoint[];
};

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const InstanciasRdsOracleChartComponent = ({
  startDate,
  endDate,
  region,
  instance = "",
  selectedKey,
  selectedValue,
}: InstanciasRdsOracleProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const startDateFormatted = startDate.toISOString().split(".")[0];
  const endDateFormatted = endDate.toISOString().split(".")[0];

  let infoUrl = `${process.env.NEXT_PUBLIC_API_URL}/db/instancias-rds-oracle?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;
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
  } = useSWR<RdsOracleInstanceData[]>(shouldFetchInfo ? infoUrl : null, fetcher);

  const shouldFetchMetrics = !!(
    startDate &&
    endDate &&
    instance &&
    instance !== "all_instances"
  );
  const metricsUrl = shouldFetchMetrics
    ? `${
        process.env.NEXT_PUBLIC_API_URL
      }/db/instancias-rds-oracle-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${encodeURIComponent(
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
    ? `${process.env.NEXT_PUBLIC_API_URL}/db/instancias-rds-oracle-events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${encodeURIComponent(instance)}`
    : null;

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(eventsUrl, fetcher);

  // ---------- eCharts para "Estado de Instancias" (vista general) ----------
  const processChartData = (rawData: RdsOracleInstanceData[] = []) => {
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

  // -------- Loaders / errores --------
  if (infoLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3">Cargando instancias RDS Oracle...</span>
      </div>
    );
  }
  if (infoError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold">Error al cargar datos</h3>
        <p className="text-sm mt-1">
          No se pudieron obtener las instancias RDS Oracle
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3">Cargando métricas de RDS Oracle {instance}...</span>
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
    <div className="w-full min-w-0 px-4 py-6">
      <div className="flex flex-col xl:flex-row gap-8 min-w-0">
        {/* Panel izquierdo - Información de la instancia */}
        <div className="w-full xl:max-w-sm min-w-0">
           <RdsOracleResourceViewInfoComponent data={instanceData} /> 
        </div>

        {/* Panel derecho - Resumen de métricas */}
        <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
          <MainRdsOracleResourceViewMetricsSummaryComponent
            data={metricsData ?? null}
          />
        </div>
      </div>
      {/* Consumo y Balance de Créditos de CPU (Burstable) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            CPU Credits - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleCpuCreditsLineChart
            data={transformMetricsForChart(metricsData)}
            title="Consumo y Balance de Créditos de CPU (Burstable)"
            height="300px"
          />
        </CardContent>
      </Card>
      {/* Uso vs No Uso de Cores de CPU */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-600" />
            CPU Usage - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleCpuUsageChart
            data={transformMetricsForChart(metricsData)}
            title="Uso vs No Uso de Cores de CPU"
            height="300px"
          />
        </CardContent>
      {/* Conexiones a Base de Datos */}  
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            Conexiones DB - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleDbConnectionsChart
            data={transformMetricsForChart(metricsData)}
            title="Conexiones a Base de Datos"
            height="300px"
          />
        </CardContent>
      </Card>
      {/* Memoria Disponible */}  
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            Memoria - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleMemoryChart
            data={transformMetricsForChart(metricsData)}
            title="Memoria Disponible"
            height="300px"
          />
        </CardContent>
      </Card>
      {/* Operaciones Lectura/Escritura (IOPS/seg) */}        
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            IOPS - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleIopsChart
            data={transformMetricsForChart(metricsData)}
            title="Operaciones Lectura/Escritura (IOPS/seg)"
            height="300px"
          />
        </CardContent>
      </Card>
      {/* Storage Disponible */}              
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-purple-600" />
            Storage - {instance}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RdsOracleStorageChart
            data={transformMetricsForChart(metricsData)}
            title="Storage Disponible"
            height="300px"
          />
        </CardContent>
      </Card>  
      {/* Tabla de Eventos RDS Oracle */}
      <RdsOracleEventsTableComponent
        data={eventsData}
        startDate={startDate}
        endDate={endDate}
        instance={instance}
      />          
    </div>
  );
};