"use client";

import { LoaderComponent } from "@/components/general_presupuesto/LoaderComponent";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar, Search, CircleDollarSignIcon, Tickets, ChevronDown, ChevronUp } from "lucide-react";
import useSWR from "swr";
import { CostosVsPresupuestoChart } from "@/components/gcp/presupuesto/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent";
import ComparacionMensualTableComponent from "@/components/gcp/presupuesto/costo-vs-presupuesto/table/ComparacionMensualTableComponent";
import { useEffect, useState } from "react";

interface CentroDeCostoComponentProps {
  cloud: string;
  anio: string;
  centroDeCosto: string;
}

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
  tags?: Record<string, string>;
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
  centro_costo: CentroCosto;
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

export const CostosVsPresupuestoComponentGCP = ({ anio, cloud, centroDeCosto }: CentroDeCostoComponentProps) => {

  const [facturacionPorCentro, setFacturacionPorCentro] = useState<Record<number, FacturacionAnual[]>>({});
  const [expandedCentros, setExpandedCentros] = useState<Record<number, boolean>>({});

  const cloudType = cloud || "gcp";

  const toggleCentro = (id: number) => {
    setExpandedCentros(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // =========================================================================
  // 1. OBTENER PRESUPUESTOS (SWR)
  // =========================================================================
  const urlPresupuesto = cloudType && anio
    ? `/api/presupuesto/bridge/${cloudType}/presupuesto/summary/anual?anio=${anio}&centroCostoName=${centroDeCosto || 'Todos'}`
    : null;

  const { data: dataPresupuesto, error: errorPresupuesto, isLoading: isLoadingPresupuesto } = useSWR<PresupuestoAnual[]>(
    urlPresupuesto,
    fetcher
  );

  // =========================================================================
  // 2. OBTENER FACTURACIÓN GLOBAL (SWR)
  // =========================================================================
  const urlFacturacionGlobal = cloudType && anio
    ? `/api/presupuesto/bridge/${cloudType}/presupuesto/facturacion/facturacion-anual?year=${anio}`
    : null;

  const { data: dataFacturacion, error: errorFacturacion, isLoading: isLoadingFacturacion } = useSWR<FacturacionAnual[]>(
    urlFacturacionGlobal,
    fetcher
  );

  const facturacionGlobalArray: FacturacionAnual[] = Array.isArray(dataFacturacion)
    ? dataFacturacion
    : ((dataFacturacion as unknown as { data?: FacturacionAnual[] })?.data) || [];

  // =========================================================================
  // 3. OBTENER FACTURACIÓN RELACIONAL (useEffect)
  // =========================================================================
  useEffect(() => {
    if (!dataPresupuesto) return;

    const cargarFacturacion = async () => {
      const resultado: Record<number, FacturacionAnual[]> = {};

      for (const presupuesto of dataPresupuesto) {
        const idCentroCosto = presupuesto.id_centro_costo;

        const url = `/api/presupuesto/bridge/${cloudType}/presupuesto/facturacion/facturacion-anual/tags-centro-costo?year=${anio}&id_centro_costo=${idCentroCosto}`;

        try {
          const res = await fetch(url);
          const json = await res.json();

          resultado[presupuesto.id_centro_costo] = Array.isArray(json)
            ? json
            : (json as { data?: FacturacionAnual[] })?.data ?? [];
        } catch (e) {
          console.error("Error facturación centro costo GCP", presupuesto.id_centro_costo, e);
          resultado[presupuesto.id_centro_costo] = [];
        }
      }

      setFacturacionPorCentro(resultado);
    };

    cargarFacturacion();
  }, [dataPresupuesto, anio, cloudType]);

  if (isLoadingPresupuesto || isLoadingFacturacion) {
    return <LoaderComponent size="small" />;
  }

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

  if ((!dataPresupuesto || dataPresupuesto.length === 0) && facturacionGlobalArray.length === 0) {
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

  const totalFacturacionCentro = (idCentro: number): number => {
    const data = facturacionPorCentro[idCentro] || [];
    return data.reduce((acc: number, f: FacturacionAnual) => acc + f.total_cost, 0);
  };

  const calcularTotales = (presupuesto: PresupuestoAnual) => {
    if (!presupuesto.presupuestos_mensuales || presupuesto.presupuestos_mensuales.length === 0) {
      return { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 };
    }
    return presupuesto.presupuestos_mensuales.reduce(
      (
        acc: { totalMensualAsociado: number; totalRealMes: number; totalForecastMes: number },
        mensual: PresupuestoMensual
      ) => ({
        totalMensualAsociado: acc.totalMensualAsociado + parseFloat(mensual.monto_mensual_asociado || "0"),
        totalRealMes: acc.totalRealMes + parseFloat(mensual.monto_real_mes || "0"),
        totalForecastMes: acc.totalForecastMes + parseFloat(mensual.monto_forecast_mes || "0"),
      }),
      { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 }
    );
  };

  const totalAnualAsociado = (dataPresupuesto ?? []).reduce(
    (acc: number, presupuesto: PresupuestoAnual) => acc + parseFloat(presupuesto.monto_anual_asociado || "0"),
    0
  );

  const totalesGenerales = (dataPresupuesto ?? []).reduce(
    (
      acc: { totalMensualAsociado: number; totalRealMes: number; totalForecastMes: number },
      presupuesto: PresupuestoAnual
    ) => {
      const totales = calcularTotales(presupuesto);
      return {
        totalMensualAsociado: acc.totalMensualAsociado + totales.totalMensualAsociado,
        totalRealMes: acc.totalRealMes + totales.totalRealMes,
        totalForecastMes: acc.totalForecastMes + totales.totalForecastMes
      };
    },
    { totalMensualAsociado: 0, totalRealMes: 0, totalForecastMes: 0 }
  );

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
          <h1 className="text-3xl font-bold text-foreground">Presupuestos {anio} - GCP</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-purple-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Facturación Anual (Global)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(facturacionGlobalArray.reduce((acc: number, f: FacturacionAnual) => acc + f.total_cost, 0))}
                </p>
                <p className="text-xs text-muted-foreground">Consumo total de la cuenta GCP</p>
              </div>
              <CircleDollarSignIcon className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Presupuesto Anual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAnualAsociado)}</p>
                <p className="text-xs text-muted-foreground">Sumatoria de presupuestos anuales</p>
              </div>
              <CircleDollarSignIcon className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Presupuesto Mensual</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalesGenerales.totalMensualAsociado)}</p>
              </div>
              <Tickets className="h-8 w-8 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Real Asignado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalesGenerales.totalRealMes)}</p>
              </div>
              <Tickets className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Forecast</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalesGenerales.totalForecastMes)}</p>
              </div>
              <Tickets className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-10 p-6">
        
        <CostosVsPresupuestoChart 
          data={dataPresupuesto ?? []} 
          facturacionData={facturacionGlobalArray}
        />
        <ComparacionMensualTableComponent 
          dataPresupuesto={dataPresupuesto ?? []} 
          dataFacturacion={facturacionGlobalArray}
        />

       <div className="space-y-4">
         {(dataPresupuesto ?? []).map((presupuesto: PresupuestoAnual) => {
          const totales = calcularTotales(presupuesto);
          const isExpanded = expandedCentros[presupuesto.id_centro_costo];
          const facturacionMensual = facturacionPorCentro[presupuesto.id_centro_costo] || [];
          
          return (
            <div key={presupuesto.id_presupuesto_anual} className="p-4 border rounded-xl dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm transition-all hover:shadow-md">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {presupuesto.centro_costo.nombre_centro} <span className="text-sm font-normal text-gray-500">| ID {presupuesto.id_centro_costo}</span>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Presupuesto Anual Asignado: <span className="font-medium text-gray-900 dark:text-gray-200">{formatCurrency(parseFloat(presupuesto.monto_anual_asociado || "0"))}</span>
                  </p>
                </div>
                
                <button 
                  onClick={() => toggleCentro(presupuesto.id_centro_costo)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {isExpanded ? (
                    <><ChevronUp className="w-4 h-4" /> Ocultar Detalle</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Ver Desglose Mensual</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ppto. Mensual Total</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(totales.totalMensualAsociado)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real Manual Total</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(totales.totalRealMes)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Forecast Total</p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(totales.totalForecastMes)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recursos Vinculados</p>
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-xs font-medium">
                    ID Relacional: {presupuesto.id_centro_costo}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Facturación GCP Asignada</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalFacturacionCentro(presupuesto.id_centro_costo))}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 fade-in duration-200">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Rendimiento Mes a Mes (Recursos Asignados)</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Mes</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Ppto. Asignado</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Facturación Asignada</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Diferencia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[...(presupuesto.presupuestos_mensuales || [])].sort((a, b) => a.mes - b.mes).map((mes: PresupuestoMensual) => {
                          const nombreMes = new Date(2000, mes.mes - 1).toLocaleString('es-CL', { month: 'long' });
                          const montoPresupuesto = parseFloat(mes.monto_mensual_asociado || "0");
                          
                          const consumoGCP = facturacionMensual.find((f: FacturacionAnual) => f.month === mes.mes)?.total_cost || 0;
                          const diferencia = montoPresupuesto - consumoGCP;

                          return (
                            <tr key={mes.mes} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="px-4 py-2 text-gray-900 dark:text-gray-200 capitalize">{nombreMes}</td>
                              <td className="px-4 py-2 text-right text-blue-600 dark:text-blue-400">{formatCurrency(montoPresupuesto)}</td>
                              <td className="px-4 py-2 text-right text-red-600 dark:text-red-400 font-medium">{formatCurrency(consumoGCP)}</td>
                              <td className={`px-4 py-2 text-right font-semibold ${diferencia < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {formatCurrency(diferencia)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      </div>
    </>
  );
};