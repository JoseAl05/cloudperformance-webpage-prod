'use client'

import useSWR from 'swr'
import React, { useState, useRef, useEffect } from "react"
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, AlertTriangle, X, DollarSign, Clock, Activity, TrendingUp, Server } from "lucide-react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import {SavingsPlanInstancesTable} from '@/components/azure/vista-savings-plan/table/SavingPlanTableComponent';
import {TreemapSavingsPlanComponent} from '@/components/azure/vista-savings-plan/graficos/TreemapSavingsPlanComponent';

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

const toUTCDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const SavingsPlanComponent = ({ startDate, endDate }: SavingsPlanProps) => {
  const [selectedInstance, setSelectedInstance] = useState<string>('all')
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data: resumen, error: errorResumen, isLoading: loadingResumen } = useSWR(
    `/api/azure/bridge/azure/saving-plan/resumen?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: analisis, error: errorAnalisis, isLoading: loadingAnalisis } = useSWR(
    `/api/azure/bridge/azure/saving-plan/analisis?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: recursos, error: errorRecursos, isLoading: loadingRecursos } = useSWR(
    `/api/azure/bridge/azure/saving-plan/recursos_activos?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: consumo, error: errorConsumo, isLoading: loadingConsumo } = useSWR<ConsumoApiResponse>(
    `/api/azure/bridge/azure/saving-plan/instancias_consumo_diario?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const formatDatesAdaptive = (dates: string[]) => {
    if (!Array.isArray(dates) || !dates.length) return [] as string[];

    const dateCount = dates.length;
    const start = toUTCDate(dates[0]);
    const end = toUTCDate(dates[dateCount - 1]);
    const daysDiff = Math.floor((+end - +start) / 86_400_000) + 1;

    const bigStep = Math.max(1, Math.ceil(dateCount / 12));
    const midStep = Math.max(1, Math.ceil(dateCount / 20));

    return dates.map((s, i) => {
        const d = toUTCDate(s);
        if (daysDiff > 365) return i === 0 || i === dateCount - 1 || i % bigStep === 0 ? fmt.format(d) : '';
        if (daysDiff > 30) return i % midStep === 0 ? fmt.format(d) : '';
        return fmt.format(d);
    });
  };

  useEffect(() => {
      if (!consumo?.instancias?.length || !chartRef.current) return;

      const instancias = selectedInstance === 'all' 
          ? consumo.instancias 
          : consumo.instancias.filter(inst => inst.instance_name === selectedInstance);

      if (!instancias.length || !instancias[0]?.consumo_diario?.length) {
        if (chartInstance.current) chartInstance.current.dispose();
        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;
        chart.setOption({
          title: {
            text: 'No hay datos disponibles para el periodo seleccionado',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 }
          },
          xAxis: { type: 'category', show: false },
          yAxis: { type: 'value', show: false },
          series: []
        });
        return;
      }

      if (chartInstance.current) chartInstance.current.dispose();
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      const allDates = new Set<string>();
      instancias.forEach(inst => {
          inst.consumo_diario.forEach(dia => allDates.add(dia.date));
      });
      const sortedDates = Array.from(allDates).sort();
      const formattedDates = formatDatesAdaptive(sortedDates);

      const series: unknown[] = [];

      instancias.forEach((instancia) => {
          const horasSP = sortedDates.map(date => {
              const dia = instancia.consumo_diario.find(d => d.date === date);
              return dia ? dia.horas_savings_plan : 0;
          });

          const horasOD = sortedDates.map(date => {
              const dia = instancia.consumo_diario.find(d => d.date === date);
              return dia ? dia.horas_ondemand : 0;
          });

          const costoSP = sortedDates.map(date => {
              const dia = instancia.consumo_diario.find(d => d.date === date);
              return dia ? dia.costo_hipotetico_payg_sp : 0;
          });

          const costoOD = sortedDates.map(date => {
              const dia = instancia.consumo_diario.find(d => d.date === date);
              return dia ? dia.costo_real_ondemand : 0;
          });

          series.push({
              name: `${instancia.instance_name} - SavingsPlan`,
              type: 'line',
              data: costoSP,
              smooth: true,
              lineStyle: { width: 2, color: '#0078D4' },
              itemStyle: { color: '#0078D4' },
              areaStyle: { color: 'rgba(0, 120, 212, 0.1)' },
              symbol: 'circle',
              symbolSize: 6,
              emphasis: { focus: 'series', lineStyle: { width: 3 } },
              instanceData: {
                  instance: instancia.instance_name,
                  type: 'SavingsPlan',
                  horas: horasSP,
                  costos: costoSP,
                  porcentajeCobertura: instancia.totales.porcentaje_cobertura_sp
              }
          });

          series.push({
              name: `${instancia.instance_name} - OnDemand`,
              type: 'line',
              data: costoOD,
              smooth: true,
              lineStyle: { width: 2, color: '#FF6B35', type: 'dashed' },
              itemStyle: { color: '#FF6B35' },
              areaStyle: { color: 'rgba(255, 107, 53, 0.1)' },
              symbol: 'diamond',
              symbolSize: 6,
              emphasis: { focus: 'series', lineStyle: { width: 3 } },
              instanceData: {
                  instance: instancia.instance_name,
                  type: 'OnDemand',
                  horas: horasOD,
                  costos: costoOD,
                  porcentajeCobertura: instancia.totales.porcentaje_cobertura_sp
              }
          });
      });

      const option = {
          backgroundColor: 'transparent',
          tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'line', snap: true },
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderColor: '#ddd',
              borderWidth: 1,
              enterable: true,
              confine: true,
              textStyle: { fontSize: 12, color: '#111' },
              extraCssText: 'max-width:400px; white-space:normal; box-shadow:0 4px 12px rgba(0,0,0,.08); border-radius:10px; padding:12px;',
              formatter: (params: unknown[]) => {
                  if (!params?.length) return '';

                  const originalDate = toUTCDate(sortedDates[params[0].dataIndex]);
                  const dateStr = fmt.format(originalDate);

                  let html = `<div style="font-weight:600;margin-bottom:10px;font-size:13px;">${dateStr}</div>`;

                  const instanceGroups = new Map<string, unknown[]>();
                  params.forEach(p => {
                      const instanceName = p.seriesName.split(' - ')[0];
                      if (!instanceGroups.has(instanceName)) {
                          instanceGroups.set(instanceName, []);
                      }
                      instanceGroups.get(instanceName)!.push(p);
                  });

                  instanceGroups.forEach((items, instanceName) => {
                      const spItem = items.find(i => i.seriesName.includes('SavingsPlan'));
                      const odItem = items.find(i => i.seriesName.includes('OnDemand'));

                      const costoHipoteticoSP = spItem?.value || 0;
                      const costoRealOD = odItem?.value || 0;
                      const totalCostoHipotetico = costoHipoteticoSP + costoRealOD;

                      const horasSP = spItem?.seriesName ? series.find(s => s.name === spItem.seriesName)?.instanceData?.horas?.[spItem.dataIndex] || 0 : 0;
                      const horasOD = odItem?.seriesName ? series.find(s => s.name === odItem.seriesName)?.instanceData?.horas?.[odItem.dataIndex] || 0 : 0;
                      const totalHoras = horasSP + horasOD;

                      const porcentajeSP = totalHoras > 0 ? ((horasSP / totalHoras) * 100).toFixed(1) : '0.0';
                      const porcentajeCostoSP = totalCostoHipotetico > 0 ? ((costoHipoteticoSP / totalCostoHipotetico) * 100).toFixed(1) : '0.0';

                      html += `
                      <div style="margin-bottom:12px;padding:8px;background:#f8f9fa;border-radius:6px;">
                          <div style="font-weight:600;margin-bottom:6px;color:#333;">${instanceName}</div>
                          
                          <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
                              <span style="color:#0078D4;">●</span>
                              <span style="flex:1;">Costo Hipotético SP:</span>
                              <span style="font-weight:600;">$${costoHipoteticoSP.toFixed(2)}</span>
                          </div>
                          
                          <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
                              <span style="color:#0078D4;font-size:11px;margin-left:18px;">Horas:</span>
                              <span style="flex:1;"></span>
                              <span style="font-weight:500;color:#0078D4;">${horasSP.toFixed(2)}h</span>
                              <span style="color:#666;font-size:11px;">(${porcentajeSP}%)</span>
                          </div>
                          
                          <div style="display:flex;align-items:center;gap:8px;margin:4px 0;margin-top:6px;">
                              <span style="color:#FF6B35;">◆</span>
                              <span style="flex:1;">Costo Real OD:</span>
                              <span style="font-weight:600;">$${costoRealOD.toFixed(2)}</span>
                          </div>
                          
                          <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
                              <span style="color:#FF6B35;font-size:11px;margin-left:18px;">Horas:</span>
                              <span style="flex:1;"></span>
                              <span style="font-weight:500;color:#FF6B35;">${horasOD.toFixed(2)}h</span>
                              <span style="color:#666;font-size:11px;">(${(100 - parseFloat(porcentajeSP)).toFixed(1)}%)</span>
                          </div>
                          
                          <div style="border-top:1px solid #ddd;margin-top:6px;padding-top:6px;">
                              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                  <span style="font-weight:600;">Total Costo Hipotético:</span>
                                  <span style="font-weight:600;">$${totalCostoHipotetico.toFixed(2)}</span>
                              </div>
                              <div style="display:flex;justify-content:space-between;">
                                  <span style="font-weight:600;">Total Horas:</span>
                                  <span style="font-weight:600;">${totalHoras.toFixed(2)}h</span>
                              </div>
                          </div>
                      </div>`;
                  });

                  return html;
              },
          },
          legend: {
              type: 'scroll',
              orient: 'horizontal',
              top: 10,
              left: 'center',
              textStyle: { fontSize: 11, color: '#666' },
              selectedMode: 'multiple',
              data: series.map((s: unknown) => s.name),
          },
          grid: { left: 80, right: 60, top: 60, bottom: 100, containLabel: true },
          dataZoom: [
              { type: 'inside', start: 0, end: 100, filterMode: 'filter' },
              {
                  type: 'slider',
                  start: 0,
                  end: 100,
                  height: 20,
                  bottom: 30,
                  handleStyle: { color: '#0078D4' },
                  dataBackground: { 
                      areaStyle: { color: 'rgba(0, 120, 212, 0.3)' }, 
                      lineStyle: { opacity: 0.8, color: '#0078D4' } 
                  },
                  selectedDataBackground: { 
                      areaStyle: { color: 'rgba(0, 120, 212, 0.5)' }, 
                      lineStyle: { color: '#0078D4' } 
                  },
              },
          ],
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: formattedDates,
              axisLine: { lineStyle: { color: '#d0d0d0' } },
              axisTick: { show: false },
              axisLabel: { 
                  fontSize: 10, 
                  color: '#666', 
                  rotate: 45, 
                  margin: 8 
              },
              splitLine: { show: true, lineStyle: { color: '#f5f5f5', type: 'dashed' } },
          },
          yAxis: {
              type: 'value',
              name: 'Costo de Facturación',
              nameTextStyle: { color: '#666', fontSize: 12, padding: [0, 0, 10, 0] },
              nameGap: 25,
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: {
                  formatter: (value: number) => {
                      return '$' + value.toFixed(2);
                  },
                  color: '#666',
                  fontSize: 10,
              },
              splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
          },
          series: series,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
      } as echarts.EChartsOption;

      chart.setOption(option);
      chart.resize();

      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (chartRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          if (chart && !chart.isDisposed()) chart.resize();
        });
        resizeObserverRef.current.observe(chartRef.current);
      }

      return () => {
        resizeObserverRef.current?.disconnect();
        if (chartInstance.current) {
          chartInstance.current.dispose();
          chartInstance.current = null;
        }
      };
  }, [consumo, selectedInstance]);

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
                        <p className={`text-2xl font-bold ${
                          diferencia > 0 ? 'text-yellow-600' : 
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
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Consumo Diario: SavingsPlan vs OnDemand
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparación de horas cubiertas por SavingsPlan y horas facturadas como OnDemand por instancia
            </p>
          </CardHeader>

          <CardContent>
            <div ref={chartRef} className="w-full" style={{ height: '500px', minHeight: '500px' }} />
          </CardContent>
        </Card>

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