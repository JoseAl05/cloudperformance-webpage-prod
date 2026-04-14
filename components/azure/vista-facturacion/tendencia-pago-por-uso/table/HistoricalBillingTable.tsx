'use client'

import React, { useMemo, useCallback } from 'react'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { Button } from '@/components/ui/button'
import { Download, Info } from 'lucide-react'


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { exportHistoricalBillingToExcel } from '@/lib/exportExcelHistoricalBilling' 

export interface HistoricoConsumoItem {
  mes: string;
  costo: number;
}

export interface DesviacionItem {
  periodo: string;
  valor: number;
}

export interface ResumenMensual {
  periodo: string;
  alzas: number;
  bajas: number;
  neto: number;
}

export interface FilaServicioHistorico {
  service_category: string;
  total_historico: number;
  consumo_historico: HistoricoConsumoItem[];
  desviaciones_mensuales: DesviacionItem[];
}

export interface RespuestaHistoricoConsumo {
  datos_historicos_tabla: FilaServicioHistorico[];
  totales_generales: {
    por_mes: { mes: string; total: number }[];
    gran_total: number;
  };
  resumen_desviaciones_mensuales: ResumenMensual[];
}

interface HistoricalBillingTableProps {
  data: RespuestaHistoricoConsumo | null;
  isLoading: boolean;
}

// --- UTILIDADES DE FORMATO ---
const formatCurrency = (value: number): string => {
  if (value === undefined || value === null) return '-';
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2, 
  });
  return value < 0 ? `($${formatted})` : `$${formatted}`;
};

const formatDevLabel = (periodo: string, meses: string[]) => {
  const parts = periodo.split('_');
  if (parts.length > 1) {
    const mesActual = parts[parts.length - 1];
    const currentIndex = meses.indexOf(mesActual);
    
    if (currentIndex > 0) {
      const mesAnterior = meses[currentIndex - 1];
      return `${mesAnterior} vs ${mesActual}`;
    }
    return `vs ${mesActual}`;
  }
  return periodo;
};

export const HistoricalBillingTable = ({ data, isLoading }: HistoricalBillingTableProps) => {
  
  const { meses, periodosDesviacion } = useMemo(() => {
    if (!data || data.datos_historicos_tabla.length === 0) return { meses: [], periodosDesviacion: [] };
    
    const allMonths = new Set<string>();
    data.datos_historicos_tabla.forEach(row => {
      row.consumo_historico.forEach(c => allMonths.add(c.mes));
    });
    
    const meses = Array.from(allMonths).sort();
    const periodosDesviacion = meses.slice(1).map(m => `Desviacion_hacia_${m}`);
    
    return { meses, periodosDesviacion };
  }, [data]);

  const handleExportExcel = useCallback(async () => {
    if (!data) return;
    try {
      await exportHistoricalBillingToExcel(data, meses, periodosDesviacion);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  }, [data, meses, periodosDesviacion]);

  if (isLoading) return <LoaderComponent />;
  if (!data || data.datos_historicos_tabla.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No hay datos para mostrar en este rango de fechas.</div>;
  }

  // Clases de Tailwind
  const cellBase = "px-2 py-1.5 text-right text-sm whitespace-nowrap border-r border-slate-300 dark:border-slate-700";
  const headerCell = "px-2 py-2 text-center text-xs font-bold whitespace-nowrap border-r border-slate-300 dark:border-slate-700 uppercase tracking-wider";
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700 shadow-sm">
        <table className="w-full border-collapse bg-white dark:bg-slate-900">
          <thead>
            {/* SUPER HEADER */}
            <tr className="bg-[#002060] text-white">
              <th className={headerCell}></th>
              <th colSpan={meses.length + 1} className={`${headerCell} border-l border-white/20`}>
                CONSUMO HISTÓRICO
              </th>
              {periodosDesviacion.length > 0 && (
                <th colSpan={periodosDesviacion.length} className={`${headerCell} border-l border-white/20`}>
                  DESVIACIONES MENSUALES
                </th>
              )}
            </tr>
            
            {/* SUB HEADER */}
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <th className={`${headerCell} text-left pl-4`}>Service Category</th>
              {meses.map(m => <th key={m} className={headerCell}>{m}</th>)}
              <th className={`${headerCell} bg-slate-200 dark:bg-slate-700`}>Total</th>
              {periodosDesviacion.map(d => (
                <th key={d} className={headerCell}>{formatDevLabel(d, meses)}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.datos_historicos_tabla.map((fila) => (
              <tr key={fila.service_category} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <td className={`${cellBase} text-left pl-4 font-medium`}>{fila.service_category}</td>
                
                {meses.map((m) => {
                  const consumo = fila.consumo_historico.find(c => c.mes === m);
                  return (
                    <td key={m} className={cellBase}>
                      {consumo ? formatCurrency(consumo.costo) : formatCurrency(0)}
                    </td>
                  );
                })}
                
                <td className={`${cellBase} font-bold bg-slate-50 dark:bg-slate-800`}>
                  {formatCurrency(fila.total_historico)}
                </td>

                {periodosDesviacion.map((d) => {
                  const desviacion = fila.desviaciones_mensuales.find(dev => dev.periodo === d);
                  if (!desviacion) {
                    return <td key={d} className={`${cellBase} text-slate-400`}>-</td>;
                  }
                  const colorClass = desviacion.valor > 0 ? "text-amber-500 font-medium" : desviacion.valor < 0 ? "text-emerald-500 font-medium" : "text-slate-400";
                  return (
                    <td key={d} className={`${cellBase} ${colorClass}`}>
                      {formatCurrency(desviacion.valor)}
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr className="bg-[#002060] text-white font-bold">
              <td className={`${cellBase} text-left pl-4 border-white/20`}>Total General</td>
              {meses.map(m => {
                const totalMes = data.totales_generales.por_mes.find(t => t.mes === m);
                return (
                  <td key={m} className={`${cellBase} border-white/20`}>
                    {totalMes ? formatCurrency(totalMes.total) : formatCurrency(0)}
                  </td>
                );
              })}
              <td className={`${cellBase} border-white/20 bg-blue-900`}>
                {formatCurrency(data.totales_generales.gran_total)}
              </td>
              <td colSpan={periodosDesviacion.length} className="bg-slate-100 dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TABLA INFERIOR: Resumen de Desviaciones con GLOSARIO */}
      {periodosDesviacion.length > 0 && (
        <div className="flex justify-end mt-6">
          <div className="w-full overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 shadow-sm">
            <TooltipProvider>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#002060] text-white">
                    <th className="px-4 py-2 text-left font-bold border-r border-white/20">Resumen Desviaciones Mensuales</th>
                    {data.resumen_desviaciones_mensuales.map(r => (
                      <th key={r.periodo} className="px-4 py-2 text-center font-bold border-r border-white/20">
                        {formatDevLabel(r.periodo, meses)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900">
                  
                  {/* Fila Alzas */}
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-2 font-bold bg-[#002060] text-white border-r border-slate-300">
                      <div className="flex items-center gap-1.5">
                        T10-Alzas
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 cursor-pointer text-slate-300 hover:text-white transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs font-normal">Suma total de los incrementos de costo de los servicios que <strong>subieron</strong> frente al mes anterior.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    {data.resumen_desviaciones_mensuales.map(r => (
                      <td key={r.periodo} className="px-4 py-2 text-right text-amber-500 font-bold border-r border-slate-200">
                        {formatCurrency(r.alzas)}
                      </td>
                    ))}
                  </tr>

                  {/* Fila Bajas */}
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-2 font-bold bg-[#002060] text-white border-r border-slate-300">
                      <div className="flex items-center gap-1.5">
                        T10-Bajas
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 cursor-pointer text-slate-300 hover:text-white transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs font-normal">Suma total de los ahorros o reducciones de costo de los servicios que <strong>bajaron</strong> frente al mes anterior.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    {data.resumen_desviaciones_mensuales.map(r => (
                      <td key={r.periodo} className="px-4 py-2 text-right text-emerald-500 font-bold border-r border-slate-200">
                        {formatCurrency(r.bajas)}
                      </td>
                    ))}
                  </tr>

                  {/* Fila Neto */}
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <td className="px-4 py-2 font-bold bg-[#002060] text-white border-r border-slate-300">
                      <div className="flex items-center gap-1.5">
                        Neto
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 cursor-pointer text-slate-300 hover:text-white transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs font-normal">Balance final del mes (Alzas + Bajas). Un valor negativo (en verde) indica que hubo un <strong>ahorro real global</strong> en ese mes.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    {data.resumen_desviaciones_mensuales.map(r => (
                      <td key={r.periodo} className={`px-4 py-2 text-right font-bold border-r border-slate-200 ${r.neto < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {formatCurrency(r.neto)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};