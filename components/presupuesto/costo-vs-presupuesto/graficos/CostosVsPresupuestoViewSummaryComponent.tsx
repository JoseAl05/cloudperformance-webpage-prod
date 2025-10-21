'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

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

interface CostosVsPresupuestoChartProps {
    data: PresupuestoAnual[] | null;
    facturacionData?: FacturacionAnual[] | null;
}

export const CostosVsPresupuestoChart = ({ data, facturacionData }: CostosVsPresupuestoChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { presupuestoData, realData, forecastData, facturacionRealData, yMaxRounded } = useMemo(() => {
        if (!data || data.length === 0) {
            return { 
                presupuestoData: [], 
                realData: [], 
                forecastData: [], 
                facturacionRealData: [],
                yMaxRounded: 1000 
            };
        }

        // Agrupar todos los datos mensuales
        const allMonthlyData: Record<string, { presupuesto: number; real: number; forecast: number }> = {};

        data.forEach(presupuestoAnual => {
            if (presupuestoAnual.presupuestos_mensuales) {
                presupuestoAnual.presupuestos_mensuales.forEach(mensual => {
                    // Crear clave única: año-mes (formato YYYY-MM)
                    const monthKey = `${mensual.anio}-${String(mensual.mes).padStart(2, '0')}`;
                    
                    if (!allMonthlyData[monthKey]) {
                        allMonthlyData[monthKey] = { presupuesto: 0, real: 0, forecast: 0 };
                    }

                    allMonthlyData[monthKey].presupuesto += parseFloat(mensual.monto_mensual_asociado || '0');
                    allMonthlyData[monthKey].real += parseFloat(mensual.monto_real_mes || '0');
                    allMonthlyData[monthKey].forecast += parseFloat(mensual.monto_forecast_mes || '0');
                });
            }
        });

        // Procesar datos de facturación
        const facturacionRealData: [string, number][] = [];
        if (facturacionData && facturacionData.length > 0) {
            facturacionData.forEach(item => {
                const monthKey = `${item.year}-${String(item.month).padStart(2, '0')}`;
                facturacionRealData.push([
                    `${monthKey}-01T00:00:00`,
                    parseFloat(item.total_cost.toFixed(2))
                ]);
            });
            // Ordenar por fecha
            facturacionRealData.sort((a, b) => a[0].localeCompare(b[0]));
        }

        // Ordenar por fecha y convertir a arrays para el gráfico
        const sortedKeys = Object.keys(allMonthlyData).sort();
        
        const presupuestoData: [string, number][] = sortedKeys.map(key => [
            `${key}-01T00:00:00`,
            parseFloat(allMonthlyData[key].presupuesto.toFixed(2))
        ]);

        const realData: [string, number][] = sortedKeys.map(key => [
            `${key}-01T00:00:00`,
            parseFloat(allMonthlyData[key].real.toFixed(2))
        ]);

        const forecastData: [string, number][] = sortedKeys.map(key => [
            `${key}-01T00:00:00`,
            parseFloat(allMonthlyData[key].forecast.toFixed(2))
        ]);

        // Calcular el máximo para el eje Y
        const maxValuePresupuesto = Math.max(
            ...Object.values(allMonthlyData).flatMap(d => [d.presupuesto, d.real, d.forecast])
        );
        
        const maxValueFacturacion = facturacionRealData.length > 0 
            ? Math.max(...facturacionRealData.map(d => d[1]))
            : 0;

        const maxValue = Math.max(maxValuePresupuesto, maxValueFacturacion);

        const yMaxRaw = Math.ceil(maxValue * 1.2);
        const factor = Math.pow(10, Math.floor(Math.log10(yMaxRaw)));
        const yMaxRounded = Math.max(100, Math.ceil(yMaxRaw / factor) * factor);

        return { presupuestoData, realData, forecastData, facturacionRealData, yMaxRounded };
    }, [data, facturacionData]);

    const getThemeColors = () => {
        if (isDark) {
            return {
                background: 'transparent',
                textColor: '#e4e4e7',
                gridColor: '#3f3f46',
                presupuestoColor: '#60a5fa',
                presupuestoAreaColor: 'rgba(96, 165, 250, 0.2)',
                realColor: '#34d399',
                realAreaColor: 'rgba(52, 211, 153, 0.2)',
                forecastColor: '#f87171',
                forecastAreaColor: 'rgba(248, 113, 113, 0.2)',
                facturacionColor: '#a78bfa',
                facturacionAreaColor: 'rgba(167, 139, 250, 0.2)',
            };
        } else {
            return {
                background: 'transparent',
                textColor: '#3f3f46',
                gridColor: '#e4e4e7',
                presupuestoColor: '#2563eb',
                presupuestoAreaColor: 'rgba(37, 99, 235, 0.2)',
                realColor: '#10b981',
                realAreaColor: 'rgba(16, 185, 129, 0.2)',
                forecastColor: '#dc2626',
                forecastAreaColor: 'rgba(220, 38, 38, 0.2)',
                facturacionColor: '#7c3aed',
                facturacionAreaColor: 'rgba(124, 58, 237, 0.2)',
            };
        }
    };

    const option = useMemo(() => {
        const colors = getThemeColors();
        
        const legendItems = ['Presupuesto Mensual', 'Costo Real', 'Forecast'];
        if (facturacionRealData && facturacionRealData.length > 0) {
            legendItems.push('Facturación Real');
        }

        const base = makeBaseOptions({
            legend: legendItems,
            legendPos: 'top',
            unitLabel: '$',
            useUTC: false,
            showToolbox: true,
            metricType: 'default',
        });

        const series: any[] = [
            {
                kind: 'line',
                name: 'Presupuesto Mensual',
                data: presupuestoData,
                smooth: true,
                extra: {
                    color: colors.presupuestoColor,
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 30,
                        label: { show: false },
                        itemStyle: {
                            color: colors.presupuestoColor,
                            borderColor: isDark ? '#18181b' : '#ffffff',
                            borderWidth: 2
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: (param: any) => {
                                if (param.data.coord) {
                                    const date = new Date(param.data.coord[0]).toLocaleDateString('es-CL', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    });
                                    return `${param.name}<br/>${date}<br/>${param.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                                return `${param.name}: ${param.value}`;
                            }
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Max',
                                label: {
                                    formatter: (params: any) => `Max\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: any) => `Min\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            }
                        ]
                    }
                }
            },
            {
                kind: 'line',
                name: 'Costo Real',
                data: realData,
                smooth: true,
                extra: {
                    color: colors.realColor,
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 30,
                        label: { show: false },
                        itemStyle: {
                            color: colors.realColor,
                            borderColor: isDark ? '#18181b' : '#ffffff',
                            borderWidth: 2
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: (param: any) => {
                                if (param.data.coord) {
                                    const date = new Date(param.data.coord[0]).toLocaleDateString('es-CL', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    });
                                    return `${param.name}<br/>${date}<br/>${param.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                                return `${param.name}: ${param.value}`;
                            }
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Max',
                                label: {
                                    formatter: (params: any) => `Max\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: any) => `Min\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            }
                        ]
                    }
                }
            },
            {
                kind: 'line',
                name: 'Forecast',
                data: forecastData,
                smooth: true,
                extra: {
                    color: colors.forecastColor,
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 30,
                        label: { show: false },
                        itemStyle: {
                            color: colors.forecastColor,
                            borderColor: isDark ? '#18181b' : '#ffffff',
                            borderWidth: 2
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: (param: any) => {
                                if (param.data.coord) {
                                    const date = new Date(param.data.coord[0]).toLocaleDateString('es-CL', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    });
                                    return `${param.name}<br/>${date}<br/>${param.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                                return `${param.name}: ${param.value}`;
                            }
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Max',
                                label: {
                                    formatter: (params: any) => `Max\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: any) => `Min\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            }
                        ]
                    }
                }
            }
        ];

        // Agregar serie de Facturación Real si existe
        if (facturacionRealData && facturacionRealData.length > 0) {
            series.push({
                kind: 'line',
                name: 'Facturación Real',
                data: facturacionRealData,
                smooth: true,
                extra: {
                    color: colors.facturacionColor,
                    lineStyle: {
                        width: 3,
                        type: 'solid'
                    },
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 30,
                        label: { show: false },
                        itemStyle: {
                            color: colors.facturacionColor,
                            borderColor: isDark ? '#18181b' : '#ffffff',
                            borderWidth: 2
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: (param: any) => {
                                if (param.data.coord) {
                                    const date = new Date(param.data.coord[0]).toLocaleDateString('es-CL', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    });
                                    return `${param.name}<br/>${date}<br/>${param.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                                return `${param.name}: ${param.value}`;
                            }
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Max',
                                label: {
                                    formatter: (params: any) => `Max\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: any) => `Min\n${params.data.coord[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                }
                            }
                        ]
                    }
                }
            });
        }

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: series,
            extraOption: {
                xAxis: { 
                    axisLabel: { 
                        rotate: 30,
                        formatter: (value: string) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
                        }
                    } 
                },
                yAxis: { 
                    min: 0,
                    max: yMaxRounded,
                    axisLabel: {
                        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`
                    }
                },
                tooltip: {
                    formatter: (params: any) => {
                        if (Array.isArray(params)) {
                            const date = new Date(params[0].value[0]).toLocaleDateString('es-CL', { 
                                year: 'numeric', 
                                month: 'long' 
                            });
                            let tooltip = `<strong>${date}</strong><br/>`;
                            params.forEach((param: any) => {
                                tooltip += `${param.marker} ${param.seriesName}: ${param.value[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>`;
                            });
                            return tooltip;
                        }
                        return '';
                    }
                },
                grid: { left: 60, right: 20, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [presupuestoData, realData, forecastData, facturacionRealData, yMaxRounded, isDark]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Costos vs Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Comparación mensual entre presupuesto asignado, costos reales, pronóstico y facturación real.
                    </p>
                </div>
                {(!data || data.length === 0) ? (
                    <div className="text-center text-gray-500 py-6">No hay datos de presupuesto disponibles.</div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};