'use client'

import useSWR from 'swr'
import { useState, useRef, useEffect } from "react"
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, AlertTriangle, X, DollarSign, Clock, Activity, TrendingUp, Server, Info } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { SavingsPlanInstancesTable } from '@/components/azure/vista-savings-plan/table/SavingPlanTableComponent';
import { TreemapSavingsPlanComponent } from '@/components/azure/vista-savings-plan/graficos/TreemapSavingsPlanComponent';
import { SavingsPlanLineChartComponent } from '@/components/azure/vista-savings-plan/graficos/SavingsPlanLineChartComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

interface SavingsPlanProps {
  startDate: Date;
  endDate: Date;
}

interface ConsumoDiario {
  date: string;
  horas_savings_plan: number;
  horas_ondemand: number;
  costo_hipotetico_payg_sp: number;
  costo_real_ondemand: number;
  total_horas: number;
  total_costo_hipotetico: number;
  pay_g_price: number;
}

interface Instancia {
  instance_name: string;
  meter_category: string;
  totales: {
    total_horas_savings_plan: number;
    total_horas_ondemand: number;
    total_horas: number;
    costo_hipotetico_payg_savings_plan: number;
    costo_real_ondemand: number;
    costo_total_hipotetico: number;
    porcentaje_cobertura_sp: number;
    dias_con_datos: number;
  };
  consumo_diario: ConsumoDiario[];
}

interface ConsumoApiResponse {
  resumen: {
    total_instancias: number;
    total_horas_savings_plan: number;
    total_horas_ondemand: number;
    costo_hipotetico_payg_savings_plan: number;
    costo_real_ondemand: number;
  };
  instancias: Instancia[];
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

const isNullish = (v: unknown) => v === null || v === undefined

export const SavingsPlanComponent = ({ startDate, endDate }: SavingsPlanProps) => {
  const [selectedInstance, setSelectedInstance] = useState<string>('all')

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data: resumen, error: errorResumen, isLoading: loadingResumen } = useSWR(
    `/api/azure/bridge/azure/saving-plan/resumen?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
  )

  const { data: analisis, error: errorAnalisis, isLoading: loadingAnalisis } = useSWR(
    `/api/azure/bridge/azure/saving-plan/analisis?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
  )

  const { data: recursos, error: errorRecursos, isLoading: loadingRecursos } = useSWR(
    `/api/azure/bridge/azure/saving-plan/recursos_activos?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
  )

  const { data: consumo, error: errorConsumo, isLoading: loadingConsumo } = useSWR<ConsumoApiResponse>(
    `/api/azure/bridge/azure/saving-plan/instancias_consumo_diario?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
  )

  const consumoData: ConsumoApiResponse | null =
    !isNullish<ConsumoApiResponse>(consumo) ? consumo : null;

  const hasConsumoData = !!consumoData;

  const noneHasData =
    !hasConsumoData

  if (noneHasData) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <MessageCard
          icon={Info}
          title="Sin datos para mostrar"
          description="No encontramos métricas ni información de la instancia en el rango seleccionado."
          tone="warn"
        />
      </div>
    )
  }

  if (loadingResumen || loadingAnalisis || loadingRecursos || loadingConsumo) return <LoaderComponent />
  if (errorResumen || errorAnalisis || errorRecursos || errorConsumo) return <div className="text-red-500 p-4">Error al cargar datos</div>
  if (!resumen || !analisis || !recursos) return <div className="p-4">No hay datos disponibles</div>


  return (
    <div className="w-full min-w-0 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA - 2/3 del ancho */}
        <div className="lg:col-span-2 space-y-6">
          {/* ========== SECCIÓN: RESUMEN SAVING PLAN ========== */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Valor Fijo Mensual */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Valor Fijo Mensual</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        ${resumen.valor_fijo_mensual_saving_plan}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{resumen.unidad_monetaria}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Valor Compromiso por Hora */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Compromiso por Hora</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">
                        ${resumen.valor_compromiso_por_hora}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{resumen.unidad_monetaria}/hora</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Moneda */}
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Moneda</p>
                      <p className="text-2xl font-bold text-amber-600 mt-2">
                        {resumen.unidad_monetaria}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Unidad de medida</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ========== TREEMAP - VISUALIZACIÓN DE EXCESO ========== */}
          <div className="space-y-4">
            <Card className="border-l-4">
              <div style={{ height: '500px' }}>
                <TreemapSavingsPlanComponent
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* COLUMNA DERECHA - 1/3 del ancho */}
        <div className="lg:col-span-1 space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Card className="border-l-4 border-l-slate-500 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Estado Saving Plan</p>
                  <div className="flex items-center gap-2 mt-2">
                    {(() => {
                      const compromiso = resumen.valor_compromiso_por_hora;
                      const precio = analisis.suma_pay_g_price_instancias;

                      if (compromiso > precio) {
                        return (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">Excesivo</p>
                          </>
                        );
                      } else if (compromiso < precio) {
                        return (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                              <X className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">Insuficiente</p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">Adecuado</p>
                          </>
                        );
                      }
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click para ver detalles</p>
                </CardContent>
              </Card>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Detalle del Saving Plan</h4>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Compromiso por hora</p>
                  <p className="text-lg font-bold">
                    {resumen.valor_compromiso_por_hora.toFixed(2)} {resumen.unidad_monetaria}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Uso real por hora</p>
                  <p className="text-lg font-bold">
                    {analisis.suma_pay_g_price_instancias.toFixed(2)} {resumen.unidad_monetaria}
                  </p>
                </div>

                <div className="border-t pt-3">
                  {(() => {
                    const diferencia = resumen.valor_compromiso_por_hora - analisis.suma_pay_g_price_instancias;

                    return (
                      <>
                        <p className="text-xs text-muted-foreground mb-1">Diferencia</p>
                        <p className={`text-2xl font-bold ${diferencia > 0 ? 'text-yellow-600' :
                          diferencia < 0 ? 'text-red-600' :
                            'text-green-600'
                          }`}>
                          {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)} {resumen.unidad_monetaria}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {diferencia > 0 ? '⚠️ Excedente de capacidad contratada' :
                            diferencia < 0 ? '❌ Falta cobertura del plan' :
                              '✅ Cobertura óptima'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Costo Cubierto por Saving Plan</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${analisis.costo_por_uso_savings_plan.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{resumen.unidad_monetaria}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Costo Exceso del Plan</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  ${analisis.costo_exceso_ondemand.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{resumen.unidad_monetaria}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Costo Total</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${analisis.costo_hipotetico_ondemand.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{resumen.unidad_monetaria}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ========== SECCIÓN: GRÁFICO DE CONSUMO DIARIO ========== */}
      <div className="mt-8 space-y-6">
        {/* Tarjetas de Resumen de Consumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Instancias</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {consumo.resumen.total_instancias}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Con SavingsPlan</p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Horas SavingsPlan</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {consumo.resumen.total_horas_savings_plan.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Cubiertas por SP</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Horas OnDemand</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    {consumo.resumen.total_horas_ondemand.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Exceso no cubierto</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Controles del Gráfico */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Instancia:</span>
            <Select
              value={selectedInstance}
              onValueChange={setSelectedInstance}
            >
              <SelectTrigger className="h-9 w-[300px]">
                <SelectValue placeholder="Seleccionar instancia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las instancias</SelectItem>
                {consumo.instancias.map((inst) => (
                  <SelectItem key={inst.instance_name} value={inst.instance_name}>
                    {inst.instance_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gráfico */}
        <SavingsPlanLineChartComponent
          data={consumoData}
        />

        {/* Tabla de Instancias y Detalles */}
        <Card className="shadow-lg mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              Detalle de Instancias con SavingsPlan
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Información detallada de cada instancia cubierta por el Saving Plan
            </p>
          </CardHeader>

          <CardContent>
            <SavingsPlanInstancesTable
              startDateFormatted={startDateFormatted}
              endDateFormatted={endDateFormatted}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}