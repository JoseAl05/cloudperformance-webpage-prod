'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts, type AnySeriesDef } from '@/lib/echartsGlobalConfig';
import { Info, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

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

interface SavingsPlanLineChartComponentProps {
    data: ConsumoApiResponse;
}

type SeriesMeta = {
    instance: string;
    type: 'SavingsPlan' | 'OnDemand';
    horas: number[];
    costos: number[];
    porcentajeCobertura: number;
};

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const toUTCDate = (value: string) => {
    const normalized = value?.replace(/(\.\d{3})\d+/, '$1').replace(/\s+/g, ' ').trim();
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed;
    }
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
};

export const SavingsPlanLineChartComponent = ({ data }: SavingsPlanLineChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { series, sortedDates, seriesMeta } = useMemo<{
        series: AnySeriesDef[];
        sortedDates: string[];
        seriesMeta: Map<string, SeriesMeta>;
    }>(() => {
        const instancias = data?.instancias ?? [];

        if (!instancias.length) {
            return { series: [], sortedDates: [], seriesMeta: new Map() };
        }

        const allDates = new Set<string>();
        instancias.forEach(inst => {
            inst.consumo_diario?.forEach(dia => allDates.add(dia.date));
        });

        const sortedDates = Array.from(allDates).sort();

        if (!sortedDates.length) {
            return { series: [], sortedDates: [], seriesMeta: new Map() };
        }

        const series: AnySeriesDef[] = [];
        const seriesMeta = new Map<string, SeriesMeta>();

        instancias.forEach((instancia) => {
            const consumo = instancia.consumo_diario ?? [];

            const horasSP = sortedDates.map(date => {
                const dia = consumo.find(d => d.date === date);
                return dia ? dia.horas_savings_plan : 0;
            });

            const horasOD = sortedDates.map(date => {
                const dia = consumo.find(d => d.date === date);
                return dia ? dia.horas_ondemand : 0;
            });

            const costoSP = sortedDates.map(date => {
                const dia = consumo.find(d => d.date === date);
                return dia ? dia.costo_hipotetico_payg_sp : 0;
            });

            const costoOD = sortedDates.map(date => {
                const dia = consumo.find(d => d.date === date);
                return dia ? dia.costo_real_ondemand : 0;
            });

            series.push({
                name: `${instancia.instance_name} - SavingsPlan`,
                kind: 'line',
                data: costoSP,
                smooth: true
            });
            seriesMeta.set(
                `${instancia.instance_name} - SavingsPlan`,
                {
                    instance: instancia.instance_name,
                    type: 'SavingsPlan',
                    horas: horasSP,
                    costos: costoSP,
                    porcentajeCobertura: instancia.totales.porcentaje_cobertura_sp
                }
            );

            series.push({
                name: `${instancia.instance_name} - OnDemand`,
                kind: 'line',
                data: costoOD,
                smooth: true
            });
            seriesMeta.set(
                `${instancia.instance_name} - OnDemand`,
                {
                    instance: instancia.instance_name,
                    type: 'OnDemand',
                    horas: horasOD,
                    costos: costoOD,
                    porcentajeCobertura: instancia.totales.porcentaje_cobertura_sp
                }
            );
        });

        return { series, sortedDates, seriesMeta };
    }, [data?.instancias]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: series.map((s) => s.name),
            unitLabel: '$',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',

        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            tooltip: true,
            series: series,
            tooltipFormatter(params) {
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

                    const spMeta = spItem?.seriesName ? seriesMeta.get(spItem.seriesName) : undefined;
                    const odMeta = odItem?.seriesName ? seriesMeta.get(odItem.seriesName) : undefined;

                    const horasSP = spItem && spMeta ? spMeta.horas?.[spItem.dataIndex] ?? 0 : 0;
                    const horasOD = odItem && odMeta ? odMeta.horas?.[odItem.dataIndex] ?? 0 : 0;
                    const totalHoras = horasSP + horasOD;

                    const porcentajeSP = totalHoras > 0 ? ((horasSP / totalHoras) * 100).toFixed(1) : '0.0';

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
            extraOption: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    data: sortedDates
                },
            }
        })
        return deepMerge(base, lines);
    }, [series, seriesMeta, sortedDates])

    const isEmpty = !series.length;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');


    return (
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
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay métricas disponibles.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    )
}
