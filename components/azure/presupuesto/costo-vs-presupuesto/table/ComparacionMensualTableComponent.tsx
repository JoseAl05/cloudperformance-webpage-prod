"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

interface DatosMensuales {
  mes: number;
  nombreMes: string;
  presupuesto: number;
  real: number;
  forecast: number;
  facturacion: number;
  diferencia: number;
  porcentajeUsado: number;
}

interface ComparacionMensualTableComponentProps {
  dataPresupuesto: PresupuestoAnual[] | null;
  dataFacturacion: FacturacionAnual[] | null;
}

type SortField = keyof DatosMensuales | null;
type SortOrder = "asc" | "desc" | null;

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const ComparacionMensualTableComponent = ({ dataPresupuesto, dataFacturacion }: ComparacionMensualTableComponentProps) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = (field: keyof DatosMensuales) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof DatosMensuales) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
    return <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const datosMensuales = useMemo((): DatosMensuales[] => {
    const datosPorMes: Record<number, { 
      presupuesto: number; 
      real: number; 
      forecast: number; 
      facturacion: number 
    }> = {};

    // Inicializar todos los meses
    for (let i = 1; i <= 12; i++) {
      datosPorMes[i] = { presupuesto: 0, real: 0, forecast: 0, facturacion: 0 };
    }

    // Sumar presupuestos, real y forecast por mes
    dataPresupuesto?.forEach(presupuesto => {
      if (presupuesto.presupuestos_mensuales) {
        presupuesto.presupuestos_mensuales.forEach(mensual => {
          datosPorMes[mensual.mes].presupuesto += parseFloat(mensual.monto_mensual_asociado || "0");
          datosPorMes[mensual.mes].real += parseFloat(mensual.monto_real_mes || "0");
          datosPorMes[mensual.mes].forecast += parseFloat(mensual.monto_forecast_mes || "0");
        });
      }
    });

    // Sumar facturación por mes
    dataFacturacion?.forEach(factura => {
      datosPorMes[factura.month].facturacion += factura.total_cost;
    });

    // Crear array final
    const datos = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const presupuesto = datosPorMes[mes].presupuesto;
      const real = datosPorMes[mes].real;
      const forecast = datosPorMes[mes].forecast;
      const facturacion = datosPorMes[mes].facturacion;
      const diferencia = presupuesto - facturacion;
      const porcentajeUsado = presupuesto > 0 ? (facturacion / presupuesto) * 100 : 0;

      return {
        mes,
        nombreMes: MESES[i],
        presupuesto,
        real,
        forecast,
        facturacion,
        diferencia,
        porcentajeUsado
      };
    });

    // Aplicar ordenamiento
    if (sortField && sortOrder) {
      datos.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return datos;
  }, [dataPresupuesto, dataFacturacion, sortField, sortOrder]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat('en-US', { 
      style: 'percent', 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);

  const totales = useMemo(() => ({
    presupuesto: datosMensuales.reduce((acc, d) => acc + d.presupuesto, 0),
    real: datosMensuales.reduce((acc, d) => acc + d.real, 0),
    forecast: datosMensuales.reduce((acc, d) => acc + d.forecast, 0),
    facturacion: datosMensuales.reduce((acc, d) => acc + d.facturacion, 0),
    diferencia: datosMensuales.reduce((acc, d) => acc + d.diferencia, 0),
  }), [datosMensuales]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("nombreMes")}
              >
                <div className="flex items-center gap-2">
                  Mes
                  {getSortIcon("nombreMes")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("presupuesto")}
              >
                <div className="flex items-center justify-end gap-2">
                  Presupuesto
                  {getSortIcon("presupuesto")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("real")}
              >
                <div className="flex items-center justify-end gap-2">
                  Real
                  {getSortIcon("real")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("forecast")}
              >
                <div className="flex items-center justify-end gap-2">
                  Forecast
                  {getSortIcon("forecast")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("facturacion")}
              >
                <div className="flex items-center justify-end gap-2">
                  Facturación
                  {getSortIcon("facturacion")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("diferencia")}
              >
                <div className="flex items-center justify-end gap-2">
                  Diferencia
                  {getSortIcon("diferencia")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("porcentajeUsado")}
              >
                <div className="flex items-center justify-end gap-2">
                  % Usado
                  {getSortIcon("porcentajeUsado")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {datosMensuales.map((dato) => {
              const esSobrepresupuesto = dato.diferencia < 0;
              
              return (
                <tr
                  key={dato.mes}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-1">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {dato.nombreMes}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(dato.presupuesto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(dato.real)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrency(dato.forecast)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(dato.facturacion)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-bold ${
                      esSobrepresupuesto 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {formatCurrency(dato.diferencia)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`text-sm font-bold ${
                        dato.porcentajeUsado > 100 
                          ? 'text-red-600 dark:text-red-400' 
                          : dato.porcentajeUsado > 80
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {formatPercent(dato.porcentajeUsado)}
                      </span>
                      <div className={`w-16 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
                        <div 
                          className={`h-full transition-all ${
                            dato.porcentajeUsado > 100 
                              ? 'bg-red-500' 
                              : dato.porcentajeUsado > 80
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(dato.porcentajeUsado, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* Fila de totales */}
            <tr className="bg-gray-100 dark:bg-gray-900 font-bold border-t-2 border-gray-300 dark:border-gray-600">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-gray-900 dark:text-gray-100">TOTAL</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-gray-100">
                {formatCurrency(totales.presupuesto)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 dark:text-green-400">
                {formatCurrency(totales.real)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-purple-600 dark:text-purple-400">
                {formatCurrency(totales.forecast)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-gray-100">
                {formatCurrency(totales.facturacion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-gray-100">
                {formatCurrency(totales.diferencia)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-gray-100">
                {formatPercent((totales.facturacion / totales.presupuesto) * 100)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparacionMensualTableComponent;