"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface PresupuestoMensual {
  id_presupuesto_mensual?: number | string;
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
  id_presupuesto_anual?: number | string;
}

interface PresupuestoMensualPostPut {
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
}

interface PresupuestoAnual {
  id_presupuesto_anual: number;
  id_centro_costo: number;
  anio: number;
  monto_anual_asociado: string;
  presupuestos_mensuales: PresupuestoMensualPostPut[] | null;
}

interface PresupuestoMensualFormProps {
  initialData?: PresupuestoMensual;
  onSubmit: (data: PresupuestoMensual) => void;
  onCancel: () => void;
  cloud: string;
}

export const PresupuestoMensualFormComponent: React.FC<PresupuestoMensualFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  cloud,
}) => {
  const [formData, setFormData] = useState<PresupuestoMensual>(
    initialData ?? {
      mes: 1,
      anio: new Date().getFullYear(),
      monto_mensual_asociado: "",
      monto_real_mes: "",
      monto_forecast_mes: "",
      id_presupuesto_anual: "",
    }
  );

  const [presupuestosAnuales, setPresupuestosAnuales] = useState<PresupuestoAnual[]>([]);
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [loading, setLoading] = useState(true);

  // Sincroniza los datos cuando se edita
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  // Cargar presupuestos anuales y centros de costo
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [presupuestosRes, centrosRes] = await Promise.all([
          fetch(`/api/presupuesto/bridge/${cloud}/presupuesto/anual`),
          fetch(`/api/presupuesto/bridge/${cloud}/centro-costo`)
        ]);

        if (presupuestosRes.ok && centrosRes.ok) {
          const presupuestosData = await presupuestosRes.json();
          const centrosData = await centrosRes.json();
          setPresupuestosAnuales(presupuestosData);
          setCentrosCosto(centrosData);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cloud]);

  const handleChange = (field: keyof PresupuestoMensual, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Función para obtener el nombre del centro de costo
  const getNombreCentroCosto = (idCentroCosto: number): string => {
    const centro = centrosCosto.find(c => c.id_centro_costo === idCentroCosto);
    return centro ? centro.nombre_centro : "Centro desconocido";
  };

  // Función para obtener los meses disponibles según el presupuesto anual seleccionado
  const getMesesDisponibles = (): number[] => {
    if (!formData.id_presupuesto_anual) return [];
    
    const presupuestoSeleccionado = presupuestosAnuales.find(
      p => p.id_presupuesto_anual === Number(formData.id_presupuesto_anual)
    );
    
    if (!presupuestoSeleccionado || !presupuestoSeleccionado.presupuestos_mensuales) {
      // Si no hay presupuestos mensuales, todos los meses están disponibles
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    
    // Obtener los meses que ya tienen presupuesto
    const mesesOcupados = presupuestoSeleccionado.presupuestos_mensuales.map(pm => pm.mes);
    
    // Si estamos editando, incluir el mes actual en los disponibles
    const mesActual = initialData?.mes;
    
    // Retornar todos los meses que no están ocupados (o el mes actual si estamos editando)
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(
      mes => !mesesOcupados.includes(mes) || mes === mesActual
    );
  };

  const mesesDisponibles = getMesesDisponibles();

  // Función para calcular la diferencia entre el monto anual y la suma de montos mensuales
  const calcularDiferenciaPresupuesto = () => {
    if (!formData.id_presupuesto_anual) return null;
    
    const presupuestoSeleccionado = presupuestosAnuales.find(
      p => p.id_presupuesto_anual === Number(formData.id_presupuesto_anual)
    );
    
    if (!presupuestoSeleccionado) return null;
    
    const montoAnual = parseFloat(presupuestoSeleccionado.monto_anual_asociado) || 0;
    
    // Sumar todos los montos mensuales existentes
    let sumaMensuales = 0;
    if (presupuestoSeleccionado.presupuestos_mensuales) {
      sumaMensuales = presupuestoSeleccionado.presupuestos_mensuales.reduce(
        (sum, pm) => sum + (parseFloat(pm.monto_mensual_asociado) || 0),
        0
      );
    }
    
    // Si estamos creando (no editando), sumar el monto actual del formulario
    if (!initialData && formData.monto_mensual_asociado) {
      sumaMensuales += parseFloat(formData.monto_mensual_asociado) || 0;
    }
    
    // Si estamos editando, restar el monto original y sumar el nuevo
    if (initialData && formData.monto_mensual_asociado) {
      const montoOriginal = parseFloat(String(initialData.monto_mensual_asociado)) || 0;
      const montoNuevo = parseFloat(formData.monto_mensual_asociado) || 0;
      sumaMensuales = sumaMensuales - montoOriginal + montoNuevo;
    }
    
    const diferencia = montoAnual - sumaMensuales;
    
    return {
      montoAnual,
      sumaMensuales,
      diferencia,
      porcentajeAsignado: montoAnual > 0 ? (sumaMensuales / montoAnual) * 100 : 0
    };
  };

  const infoPresupuesto = calcularDiferenciaPresupuesto();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-8">
          {/* Campos del formulario */}
          <div className="space-y-6">
            {/* Presupuesto Anual y Mes en la misma fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Presupuesto Anual <span className="text-red-500">*</span>
                </label>
                <Select
                  value={String(formData.id_presupuesto_anual ?? "")}
                  onValueChange={(val) => handleChange("id_presupuesto_anual", Number(val))}
                  disabled={!!initialData || loading}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar presupuesto anual"} />
                  </SelectTrigger>
                  <SelectContent>
                    {presupuestosAnuales.map((presupuesto) => (
                      <SelectItem 
                        key={presupuesto.id_presupuesto_anual} 
                        value={String(presupuesto.id_presupuesto_anual)}
                      >
                        {getNombreCentroCosto(presupuesto.id_centro_costo)} - {presupuesto.anio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {initialData && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    El presupuesto anual no puede ser modificado
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mes <span className="text-red-500">*</span>
                </label>
                <Select
                  value={String(formData.mes)}
                  onValueChange={(val) => handleChange("mes", Number(val))}
                  disabled={!!initialData || !formData.id_presupuesto_anual}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder={!formData.id_presupuesto_anual ? "Seleccione primero un presupuesto anual" : "Seleccionar mes"} />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio",
                      "Julio",
                      "Agosto",
                      "Septiembre",
                      "Octubre",
                      "Noviembre",
                      "Diciembre",
                    ].map((mes, idx) => {
                      const mesNumero = idx + 1;
                      const estaDisponible = mesesDisponibles.includes(mesNumero);
                      
                      if (!estaDisponible) return null;
                      
                      return (
                        <SelectItem key={mesNumero} value={String(mesNumero)}>
                          {mes}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {initialData && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    El mes no puede ser modificado
                  </p>
                )}
                {!initialData && formData.id_presupuesto_anual && mesesDisponibles.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Todos los meses ya tienen presupuesto asignado
                  </p>
                )}
              </div>
            </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Monto Asociado <span className="text-red-500">*</span>
                </label>
                <input
                  id="monto_mensual_asociado"
                  type="number"
                  name="monto_mensual_asociado"
                  value={formData.monto_mensual_asociado}
                  onChange={(e) => handleChange("monto_mensual_asociado", e.target.value)}
                  required
                  placeholder="Ej: 100000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>

              {/* Mensaje de diferencia de presupuesto */}
              {infoPresupuesto && (
                <div className={`p-4 rounded-lg border ${
                  infoPresupuesto.diferencia >= 0 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      infoPresupuesto.diferencia >= 0 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {infoPresupuesto.diferencia >= 0 ? '💰' : '⚠️'}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${
                        infoPresupuesto.diferencia >= 0 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        Información del Presupuesto Anual
                      </p>
                      <div className="text-xs space-y-0.5 text-gray-700 dark:text-gray-300">
                        <p>Monto Anual Total: <span className="font-semibold">${infoPresupuesto.montoAnual.toLocaleString()}</span></p>
                        <p>Suma de Montos Mensuales: <span className="font-semibold">${infoPresupuesto.sumaMensuales.toLocaleString()}</span></p>
                        <p>Diferencia Disponible: <span className={`font-bold ${
                          infoPresupuesto.diferencia >= 0 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          ${Math.abs(infoPresupuesto.diferencia).toLocaleString()} 
                          {infoPresupuesto.diferencia < 0 && ' (Excedido)'}
                        </span></p>
                        <p>Porcentaje Asignado: <span className="font-semibold">{infoPresupuesto.porcentajeAsignado.toFixed(1)}%</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Monto Real <span className="text-red-500">*</span>
                </label>
                <input
                  id="monto_real_mes"
                  type="number"
                  name="monto_real_mes"
                  value={formData.monto_real_mes}
                  onChange={(e) => handleChange("monto_real_mes", e.target.value)}
                  required
                  placeholder="Ej: 100000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Monto Forecast <span className="text-red-500">*</span>
                </label>
                <input
                  id="monto_forecast_mes"
                  type="number"
                  name="monto_forecast_mes"
                  value={formData.monto_forecast_mes}
                  onChange={(e) => handleChange("monto_forecast_mes", e.target.value)}
                  required
                  placeholder="Ej: 100000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
      </form>
    </div>
  );
};

export default PresupuestoMensualFormComponent;