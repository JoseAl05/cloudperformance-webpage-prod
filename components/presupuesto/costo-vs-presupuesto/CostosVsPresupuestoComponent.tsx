"use client";

import { LoaderComponent } from "@/components/general_presupuesto/LoaderComponent";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar, Search, CircleDollarSignIcon, Tickets } from "lucide-react";
import useSWR from "swr";
import { CostosVsPresupuestoChart } from "@/components/presupuesto/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent";
import ComparacionMensualTableComponent from "@/components/presupuesto/costo-vs-presupuesto/table/ComparacionMensualTableComponent";

interface CentroDeCostoComponentProps {
  cloud: string;
  anio: string;
}

interface PresupuestoMensual {
  id_presupuesto_mensual: number;
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

interface PresupuestoAnual {
  id_presupuesto_anual: number;
  id_centro_costo: number;
  anio: number;
  monto_anual_asociado: string;
  presupuestos_mensuales: PresupuestoMensual[] | null;
}

interface FacturacionAnual {
  year: number;
  month: number;
  total_cost: number;
  count: number;
}

const fetcher = (url: string) =>
  fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
    .then((r) => r.json());

export const CostosVsPresupuestoComponent = ({ cloud, anio }: CentroDeCostoComponentProps) => {

  const cloudTypeMap: Record<string, string> = {
    AWS: "aws",
    AZURE: "azure",
  };
  const cloudType = cloud ? cloudTypeMap[cloud] ?? undefined : undefined;

  const urlPresupuesto = cloud && anio
    ? `/api/presupuesto/bridge/${cloudType}/presupuesto/summary/anual?anio=${anio}`
    : null;

  // const urlFacturacion = cloud && anio
  //   ? `/api/${cloudType}/bridge/facturacion/facturacion-anual?year=${anio}`
  //   : null;
  let urlFacturacion: string | null = null;

  if (cloud && anio && cloudType) {
    switch (cloudType) {
      case "aws":
        urlFacturacion = `/api/${cloudType}/bridge/facturacion/facturacion-anual?year=${anio}`;
        break;
      case "azure":
        urlFacturacion = `/api/${cloudType}/bridge/${cloudType}/facturacion/facturacion-anual?year=${anio}`;
        break;
      default:
        urlFacturacion = null;
        break;
    }
  }

  // SWR para presupuesto anual
  const { data: dataPresupuesto, error: errorPresupuesto, isLoading: isLoadingPresupuesto } = useSWR<PresupuestoAnual[]>(
    urlPresupuesto,
    fetcher
  );

  // SWR para facturación anual
  const { data: dataFacturacion, error: errorFacturacion, isLoading: isLoadingFacturacion } = useSWR<FacturacionAnual[]>(
    urlFacturacion,
    fetcher
  );

  const facturacionArray = Array.isArray(dataFacturacion)
    ? dataFacturacion
    : Array.isArray(dataFacturacion?.data)
    ? dataFacturacion.data
    : [];
  
  console.log("RAW FACTURACION", dataFacturacion);
  console.log("NORMALIZADO", facturacionArray);


  // Loader
  if (isLoadingPresupuesto || isLoadingFacturacion) {
    return <LoaderComponent size="small" />;
  }

  // Error
  if (errorPresupuesto || errorFacturacion) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
        <p className="text-lg font-semibold text-red-500">Error al cargar los datos</p>
        <p className="text-sm text-gray-400 mt-1">
          {errorPresupuesto?.message || errorFacturacion?.message}
        </p>
      </div>
    );
  }

  // Validar data
  if ((!dataPresupuesto || dataPresupuesto.length === 0) && (!dataFacturacion || dataFacturacion.length === 0)) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <div>
            <p className="text-lg font-semibold">No se encontraron datos</p>
          </div>
        </div>
      </div>
    );
  }

  // Función para calcular totales de presupuesto anual
  const calcularTotales = (presupuesto: PresupuestoAnual) => {
    if (!presupuesto.presupuestos_mensuales || presupuesto.presupuestos_mensuales.length === 0) {
      return { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 };
    }
    return presupuesto.presupuestos_mensuales.reduce(
      (acc, mensual) => ({
        totalMensualAsociado: acc.totalMensualAsociado + parseFloat(mensual.monto_mensual_asociado || "0"),
        totalRealMes: acc.totalRealMes + parseFloat(mensual.monto_real_mes || "0"),
        totalForecastMes: acc.totalForecastMes + parseFloat(mensual.monto_forecast_mes || "0"),
      }),
      { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 }
    );
  };

  // Totales presupuesto anual
  const totalAnualAsociado = dataPresupuesto?.reduce(
    (acc, presupuesto) => acc + parseFloat(presupuesto.monto_anual_asociado || "0"),
    0
  ) || 0;

  const totalesGenerales = dataPresupuesto?.reduce(
    (acc, presupuesto) => {
      const totales = calcularTotales(presupuesto);
      return {
        totalMensualAsociado: acc.totalMensualAsociado + totales.totalMensualAsociado,
        totalRealMes: acc.totalRealMes + totales.totalRealMes,
        totalForecastMes: acc.totalForecastMes + totales.totalForecastMes
      };
    },
    { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 }
  ) || { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 };

  // Formatear números a USD
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  return (
    <>
      <div className="space-y-8 p-4">
        <div className="flex items-center gap-3 my-5">
          <ChartBar className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-foreground">Presupuestos {anio} - {cloud}</h1>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facturación */}
          <Card className="border-l-4 border-l-purple-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Facturación Anual</p>
                <p className="text-2xl font-bold text-purple-600">
                  {/* {formatCurrency(dataFacturacion?.reduce((acc, f) => acc + f.total_cost, 0) || 0)} */}
                  {formatCurrency(facturacionArray.reduce((acc, f) => acc + f.total_cost, 0))}

                </p>
                <p className="text-xs text-muted-foreground">Total Facturado</p>
              </div>
              <CircleDollarSignIcon className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>

          {/* Total Presupuesto */}
          <Card className="border-l-4 border-l-purple-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Presupuesto Anual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAnualAsociado)}</p>
                <p className="text-xs text-muted-foreground">Sumatoria de todos los presupuestos anuales</p>
              </div>
              <CircleDollarSignIcon className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>

        {/* Totales mensuales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Presupuesto Mensual</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalesGenerales.totalMensualAsociado)}</p>
                <p className="text-xs text-muted-foreground">Sumatoria de todos los presupuestos mensuales</p>
              </div>
              <Tickets className="h-8 w-8 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Real</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalesGenerales.totalRealMes)}</p>
                <p className="text-xs text-muted-foreground">Sumatoria de todos los valores reales mensuales</p>
              </div>
              <Tickets className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Forecast</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalesGenerales.totalForecastMes)}</p>
                <p className="text-xs text-muted-foreground">Sumatoria de todos los forecast mensuales</p>
              </div>
              <Tickets className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-10 p-6">
        <CostosVsPresupuestoChart 
          data={dataPresupuesto || []} 
          // facturacionData={dataFacturacion || []}
          facturacionData={facturacionArray}
        />
        <ComparacionMensualTableComponent 
          dataPresupuesto={dataPresupuesto} 
          // dataFacturacion={dataFacturacion}
          dataFacturacion={facturacionArray}
        />

      {/* Presupuestos por Centro de Costo */}
       <div className="space-y-4">
         {dataPresupuesto.map((presupuesto) => {
          const totales = calcularTotales(presupuesto);
          
          return (
            <div key={presupuesto.id_presupuesto_anual} className="p-4 border rounded-lg dark:border-gray-700">
              <div className="mb-3">
                <h4 className="text-lg font-semibold">Centro de Costo ID: {presupuesto.id_centro_costo}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monto Anual: {formatCurrency(parseFloat(presupuesto.monto_anual_asociado || "0"))}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Presupuesto Mensual</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(totales.totalMensualAsociado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real Mensual</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(totales.totalRealMes)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Forecast Mensual</p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {formatCurrency(totales.totalForecastMes)}
                  </p>
                </div>
              </div>

              {presupuesto.presupuestos_mensuales && (
                <p className="text-xs text-gray-500 mt-2">
                  {presupuesto.presupuestos_mensuales.length} meses registrados
                </p>
              )}
            </div>
          );
        })}
      </div>


      </div>
    </>
  );
};