"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Plus, Trash2, Calendar, DollarSign, TrendingUp, Building2, X, Eye, EyeOff } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
}

interface PresupuestoMensualPostPut {
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

interface PresupuestoMensualGet {
  id_presupuesto_mensual?: number;
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

export interface PresupuestoAnual {
  id_presupuesto_anual?: number;
  id_centro_costo: number | string;
  anio: number | string;
  monto_anual_asociado: string;
  presupuestos_mensuales: PresupuestoMensualPostPut[] | null;  
}

interface PresupuestoAnualFormProps {
  onSubmit: (data: PresupuestoAnual) => void;
  onCancel?: () => void;
  initialData?: PresupuestoAnual | null;
  cloud?: string;
}

const MESES_NOMBRES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const PresupuestoAnualFormComponent: React.FC<PresupuestoAnualFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  cloud,
}) => {
  const [formData, setFormData] = useState<PresupuestoAnual>({
    id_centro_costo: "",
    anio: new Date().getFullYear(),
    monto_anual_asociado: "",
    presupuestos_mensuales: null,
  });

  const [showMensualForm, setShowMensualForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");

  // Fetch centros de costo
  const { data: centrosCosto, isLoading: loadingCentros } = useSWR<CentroCosto[]>(
    cloud ? `/api/presupuesto/bridge/${cloud}/centro-costo` : null,
    fetcher
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Si tiene meses, mostrar el formulario mensual
      setShowMensualForm(!!initialData.presupuestos_mensuales && initialData.presupuestos_mensuales.length > 0);
    } else {
      setFormData({
        id_centro_costo: "",
        anio: new Date().getFullYear(),
        monto_anual_asociado: "",
        presupuestos_mensuales: null,
      });
      setShowMensualForm(false);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleMensualForm = () => {
    // Solo cambiar la visibilidad, NO modificar los datos
    setShowMensualForm(!showMensualForm);
    
    // Si no hay meses y estamos mostrando el form, inicializar con array vacío
    if (!showMensualForm && !formData.presupuestos_mensuales) {
      setFormData((prev) => ({ ...prev, presupuestos_mensuales: [] }));
    }
  };

  // Obtener meses ya agregados
  const getMesesAgregados = (): number[] => {
    if (!formData.presupuestos_mensuales) return [];
    return formData.presupuestos_mensuales.map(m => m.mes);
  };

  // Obtener meses disponibles para agregar
  const getMesesDisponibles = (): number[] => {
    const agregados = getMesesAgregados();
    return Array.from({ length: 12 }, (_, i) => i + 1).filter(mes => !agregados.includes(mes));
  };

  // Agregar nuevo mes
  const agregarMes = () => {
    if (!selectedMonth || selectedMonth === "") return;
    
    const anio = typeof formData.anio === 'string' ? parseInt(formData.anio) : formData.anio;
    const nuevoMes: PresupuestoMensualPostPut = {
      mes: selectedMonth,
      anio: anio,
      monto_mensual_asociado: "0",
      monto_real_mes: "0",
      monto_forecast_mes: "0",
    };

    const nuevosMeses = [...(formData.presupuestos_mensuales || []), nuevoMes];
    setFormData((prev) => ({ ...prev, presupuestos_mensuales: nuevosMeses }));
    setSelectedMonth("");
  };

  // Eliminar mes (solo en modo creación)
  const eliminarMes = (index: number) => {
    // No permitir eliminar en modo edición
    if (initialData) return;
    
    if (!formData.presupuestos_mensuales) return;
    const nuevosMeses = formData.presupuestos_mensuales.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, presupuestos_mensuales: nuevosMeses.length > 0 ? nuevosMeses : [] }));
  };

  // Verificar si estamos en modo edición
  const isEditMode = !!initialData;

  const handleMensualChange = (index: number, field: keyof PresupuestoMensualPostPut, value: string) => {
    if (!formData.presupuestos_mensuales) return;
    
    const newMensual = [...formData.presupuestos_mensuales];
    newMensual[index] = { ...newMensual[index], [field]: value };
    setFormData((prev) => ({ ...prev, presupuestos_mensuales: newMensual }));
  };

  const calcularTotalMensual = () => {
    if (!formData.presupuestos_mensuales) return 0;
    return formData.presupuestos_mensuales.reduce((sum, mes) => {
      const monto = parseFloat(mes.monto_mensual_asociado) || 0;
      return sum + monto;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const totalMensual = calcularTotalMensual();
  const montoAnualFloat = parseFloat(formData.monto_anual_asociado) || 0;
  const diferencia = totalMensual !== montoAnualFloat;
  const porcentajeAsignado = montoAnualFloat > 0 ? (totalMensual / montoAnualFloat) * 100 : 0;
  const mesesDisponibles = getMesesDisponibles();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <form 
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          {/* Campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Centro de Costo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Centro de Costo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none z-10" />
                <select
                  name="id_centro_costo"
                  value={formData.id_centro_costo}
                  onChange={handleChange}
                  required
                  disabled={loadingCentros || !!initialData}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCentros ? "Cargando..." : "Seleccione un centro de costo"}
                  </option>
                  {centrosCosto?.map((centro) => (
                    <option key={centro.id_centro_costo} value={centro.id_centro_costo}>
                      {centro.id_centro_costo} - {centro.nombre_centro}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Año */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Año <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  required
                  min="2020"
                  max="2100"
                  placeholder="2025"
                  disabled={!!initialData}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                />
              </div>
            </div>

            {/* Monto Anual */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Monto Anual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                <input
                  type="number"
                  name="monto_anual_asociado"
                  value={formData.monto_anual_asociado ? Math.floor(Number(formData.monto_anual_asociado)) : ""}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="120000000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Toggle Desglose Mensual */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={toggleMensualForm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium"
            >
              {showMensualForm ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Ocultar desglose mensual
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Ver desglose mensual
                </>
              )}
            </button>
          </div>

          {/* Formulario de desglose mensual */}
          {showMensualForm && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Desglose Mensual
                  </h4>
                </div>
                
                {/* Selector para agregar meses */}
                {mesesDisponibles.length > 0 && (
                  <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Agregar mes
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : "")}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                      >
                        <option value="">Seleccione un mes</option>
                        {mesesDisponibles.map(mes => (
                          <option key={mes} value={mes}>
                            {MESES_NOMBRES[mes - 1]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={agregarMes}
                        disabled={!selectedMonth}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                  </div>
                )}

                {/* Información del total con porcentaje */}
                {formData.presupuestos_mensuales && formData.presupuestos_mensuales.length > 0 && (
                  <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total Mensual:
                        </span>
                        <span className={`text-lg font-bold ${diferencia ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                          {formatCurrency(totalMensual)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Presupuesto Anual:
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(montoAnualFloat)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Barra de progreso de porcentaje asignado */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Porcentaje Asignado:
                        </span>
                        <span className={`text-lg font-bold ${
                          porcentajeAsignado > 100 
                            ? 'text-red-600 dark:text-red-400' 
                            : porcentajeAsignado === 100 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {porcentajeAsignado.toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            porcentajeAsignado > 100 
                              ? 'bg-red-500' 
                              : porcentajeAsignado === 100 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(porcentajeAsignado, 100)}%` }}
                        />
                      </div>
                    </div>

                    {diferencia && montoAnualFloat > 0 && (
                      <div className={`p-3 rounded-lg border ${
                        porcentajeAsignado > 100
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      }`}>
                        <p className={`text-xs font-medium flex items-center gap-2 ${
                          porcentajeAsignado > 100
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-orange-700 dark:text-orange-300'
                        }`}>
                          <span className="text-base">{porcentajeAsignado > 100 ? '🚨' : '⚠️'}</span>
                          {porcentajeAsignado > 100 ? (
                            <>
                              El presupuesto mensual EXCEDE el monto anual por 
                              <span className="font-bold ml-1">
                                {formatCurrency(Math.abs(totalMensual - montoAnualFloat))}
                              </span>
                            </>
                          ) : (
                            <>
                              El total mensual ({formatCurrency(totalMensual)}) no coincide con el monto anual ({formatCurrency(montoAnualFloat)})
                              <span className="font-bold ml-1">
                                Diferencia: {formatCurrency(Math.abs(totalMensual - montoAnualFloat))}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Grid de meses */}
                {formData.presupuestos_mensuales && formData.presupuestos_mensuales.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.presupuestos_mensuales
                      .slice()
                      .sort((a, b) => a.mes - b.mes)
                      .map((mes, index) => {
                        const originalIndex = formData.presupuestos_mensuales!.findIndex(m => m.mes === mes.mes);
                        return (
                          <div
                            key={mes.mes}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 hover:shadow-md transition-shadow relative"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                {MESES_NOMBRES[mes.mes - 1]}
                              </h5>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  Mes {mes.mes}
                                </span>
                                {/* Solo mostrar botón eliminar en modo creación */}
                                {!isEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => eliminarMes(originalIndex)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    title="Eliminar mes"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Presupuestado <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={mes.monto_mensual_asociado ? Math.floor(Number(mes.monto_mensual_asociado)) : ""}
                                onChange={(e) => handleMensualChange(originalIndex, "monto_mensual_asociado", e.target.value)}
                                required
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                              />
                              {montoAnualFloat > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {((parseFloat(mes.monto_mensual_asociado) || 0) / montoAnualFloat * 100).toFixed(1)}% del total anual
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Real
                              </label>
                              <input
                                type="number"
                                value={mes.monto_real_mes ? Math.floor(Number(mes.monto_real_mes)) : ""}
                                onChange={(e) => handleMensualChange(originalIndex, "monto_real_mes", e.target.value)}
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Forecast
                              </label>
                              <input
                                type="number"
                                value={mes.monto_forecast_mes ? Math.floor(Number(mes.monto_forecast_mes)) : ""}
                                onChange={(e) => handleMensualChange(originalIndex, "monto_forecast_mes", e.target.value)}
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay meses agregados. Selecciona un mes para comenzar.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md"
            >
              {initialData ? "✓ Actualizar Presupuesto" : "✓ Crear Presupuesto"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(243 244 246);
            border-radius: 4px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(31 41 55);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(209 213 219);
            border-radius: 4px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(75 85 99);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(156 163 175);
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(107 114 128);
          }
          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type=number] {
            -moz-appearance: textfield;
          }
        `}</style>
      </form>
    </div>
  );
};

export default PresupuestoAnualFormComponent;