'use client'

import { useRef, useEffect } from 'react';
import useSWR from 'swr';
import * as echarts from 'echarts';
import { TrendingUp, DollarSign, Download, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aws_regions } from '@/lib/aws_regions';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface TendenciaFacturacionProps {
    startDate: Date;
    endDate: Date;
    services?: string;
    region?: string;
}

interface FacturacionData {
    SERVICE: string;
    start_date: string;
    unblendedcost: number;
    REGION: string;
    RESOURCE_ID: string | null;
    sync_time: { $date: string };
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json());

const generateUniqueColors = (count: number) => {
    const colors: string[] = [];
    const saturation = 70; // Saturación consistente para colores vibrantes
    const lightness = 65;  // Luminosidad consistente para buena legibilidad

    // Usar el ángulo dorado para distribución óptima de colores
    const goldenAngle = 137.5; // Aproximación del ángulo dorado en grados

    for (let i = 0; i < count; i++) {
        // Distribución uniforme usando el ángulo dorado
        const hue = (i * goldenAngle) % 360;

        // Generar color en formato HSL y convertir a rgba
        const color = `hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, 0.8)`;
        colors.push(color);
    }

    return colors;
};

// Cache para colores por servicio (mantiene consistencia entre renders)
const serviceColorCache = new Map<string, string>();

const getServiceColor = (serviceName: string, serviceIndex: number, totalServices: number) => {
    // Si ya tenemos un color para este servicio, lo devolvemos
    if (serviceColorCache.has(serviceName)) {
        return serviceColorCache.get(serviceName)!;
    }

    // Generar colores únicos para todos los servicios
    if (serviceColorCache.size === 0) {
        const colors = generateUniqueColors(Math.max(totalServices, 50)); // Mínimo 50 colores

        // Solo asignamos el color del servicio actual para evitar conflictos
        const color = colors[serviceIndex % colors.length];
        serviceColorCache.set(serviceName, color);
        return color;
    }

    // Para servicios nuevos que aparezcan después
    const usedColors = Array.from(serviceColorCache.values());
    const allColors = generateUniqueColors(usedColors.length + 20); // Generar más colores

    // Buscar el primer color no usado
    for (const color of allColors) {
        if (!usedColors.includes(color)) {
            serviceColorCache.set(serviceName, color);
            return color;
        }
    }

    // Fallback: generar un color específico para este servicio
    const hue = (serviceName.charCodeAt(0) + serviceName.length * 137.5) % 360;
    const fallbackColor = `hsla(${Math.round(hue)}, 70%, 65%, 0.8)`;
    serviceColorCache.set(serviceName, fallbackColor);
    return fallbackColor;
};

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region }: TendenciaFacturacionProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];
    const serviceParam = services ? `services=${services}` : '';

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&${serviceParam}&region=${region}`;

    const { data, error, isLoading } = useSWR<FacturacionData[]>(apiUrl, fetcher);

    const processChartData = (rawData: FacturacionData[]) => {
        if (!rawData || rawData.length === 0) return { dates: [], series: [] };

        // Paso 1: Agregar costos por servicio y fecha
        const serviceMap = new Map<string, Map<string, number>>();
        const allDates = new Set<string>();

        rawData.forEach(item => {
            const service = item.SERVICE;
            const date = new Date(item.start_date).toISOString().slice(0, 10);
            const cost = item.unblendedcost;

            allDates.add(date);

            if (!serviceMap.has(service)) {
                serviceMap.set(service, new Map());
            }
            const currentCost = serviceMap.get(service)!.get(date) || 0;
            serviceMap.get(service)!.set(date, currentCost + cost);
        });

        // Paso 2: Ordenar fechas cronológicamente
        const sortedDates = Array.from(allDates).sort();

        // Paso 3: Filtrar servicios con costo significativo y ordenar por total
        const significantServices = Array.from(serviceMap.entries())
            .filter(([_, dateMap]) => {
                const totalCost = Array.from(dateMap.values()).reduce((sum, cost) => sum + cost, 0);
                return totalCost; // Filtrar servicios con costo muy bajo
            })
            .sort((a, b) => {
                const totalA = Array.from(a[1].values()).reduce((sum, cost) => sum + cost, 0);
                const totalB = Array.from(b[1].values()).reduce((sum, cost) => sum + cost, 0);
                return totalB - totalA; // Ordenar de mayor a menor
            });

        // Paso 4: Crear series para ECharts (área apilada)
        const series = significantServices.map(([serviceName, dateMap], index) => {
            const serviceData = sortedDates.map(date => dateMap.get(date) || 0);

            const baseColor = getServiceColor(serviceName, index, significantServices.length);

            return {
                name: serviceName,
                type: 'line' as const,
                stack: 'Total',
                areaStyle: {
                    color: baseColor,
                    opacity: 0.7
                },
                lineStyle: {
                    width: 1,
                    color: baseColor.replace('0.8', '1')
                },
                data: serviceData,
                smooth: true, // Líneas suaves como en Power BI
                symbol: 'none', // Sin puntos en las líneas
                emphasis: {
                    focus: 'series'
                }
            };
        });

        return { dates: sortedDates, series, significantServices };
    };

    const calculateMetrics = (rawData: FacturacionData[]) => {
        if (!rawData || rawData.length === 0) return { total: 0, services: 0, regions: 0 };
        const total = rawData.reduce((sum, item) => sum + item.unblendedcost, 0);
        const services = new Set(rawData.map(item => item.SERVICE)).size;
        const regions = new Set(rawData.map(item => item.REGION)).size;

        return { total, services, regions };
    };

    const exportChart = () => {
        if (chartInstance.current) {
            const url = chartInstance.current.getDataURL({
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            const link = document.createElement('a');
            link.download = `tendencia-facturacion-${new Date().toISOString().split('T')[0]}.png`;
            link.href = url;
            link.click();
        }
    };

    const toUTCDate = (s: string) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    };
    const fmt = new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    });
    useEffect(() => {
        if (!data || !chartRef.current) return;

        const { dates, series } = processChartData(data);

        if (chartInstance.current) {
            chartInstance.current.dispose();
        }

        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

        // Función para formatear fechas adaptativa según el rango
        const formatDatesAdaptive = (dates: string[]) => {
            if (!Array.isArray(dates) || dates.length === 0) return [];

            const dateCount = dates.length;

            const startDate = toUTCDate(dates[0]);
            const endDate = toUTCDate(dates[dateCount - 1]);

            // Diferencia de días INCLUSIVA (1..n)
            const daysDiff = Math.floor((+endDate - +startDate) / 86_400_000) + 1;

            // Formateador fijo en UTC para evitar corrimientos
            // const fmt = new Intl.DateTimeFormat("es-ES", {
            //     day: "numeric",
            //     month: "short",
            //     timeZone: "UTC",
            // });

            // Tamaños de salto con resguardo para no dividir por 0
            const bigStep = Math.max(1, Math.ceil(dateCount / 12)); // >365
            const midStep = Math.max(1, Math.ceil(dateCount / 20)); // 31..365

            const labels = dates.map((s, i) => {
                const d = toUTCDate(s);

                if (daysDiff > 365) {
                    if (i === 0 || i === dateCount - 1 || i % bigStep === 0) return fmt.format(d);
                    return "";
                } else if (daysDiff > 30) {
                    if (i % midStep === 0) return fmt.format(d);
                    return "";
                } else {
                    return fmt.format(d);
                }
            });

            // Útil para depurar:
            console.log("Start:", startDate.toISOString(), "End:", endDate.toISOString(), "DaysDiff:", daysDiff);

            return labels;
        };
        const formattedDates = formatDatesAdaptive(dates);
        // Calcular colores dinámicos para mejor diferenciación visual
        const generateDistinctColors = (count) => {
            const colors = [];
            const saturation = 70;
            const lightness = 50;

            for (let i = 0; i < count; i++) {
                const hue = (i * 360 / count) % 360;
                colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
            }
            return colors;
        };

        // Asignar colores únicos a cada serie
        const distinctColors = generateDistinctColors(series.length);
        series.forEach((serie, index) => {
            serie.itemStyle = { color: distinctColors[index] };
            serie.lineStyle = { width: 2 };
            serie.symbol = 'circle';
            serie.symbolSize = 4;
            serie.emphasis = {
                focus: 'series',
                lineStyle: { width: 3 }
            };
        });

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line', // o 'cross'
                    snap: true
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: { fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';

                    const total = params.reduce((acc, p) => acc + (p.value || 0), 0);

                    const originalDate = toUTCDate(dates[params[0].dataIndex]);
                    // const dateStr = originalDate.toLocaleDateString('es-ES', {
                    //     weekday: 'short',
                    //     day: 'numeric',
                    //     month: 'short',
                    //     year: 'numeric'
                    // });

                    const dateStr = fmt.format(originalDate);

                    // Mostrar la serie con valor máximo en ese punto como “en foco”
                    const maxSerie = params.reduce((prev, curr) => {
                        return (curr.value || 0) > (prev.value || 0) ? curr : prev;
                    }, params[0]);

                    let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${dateStr}</div>`;

                    tooltip += `
            <div style="border-top: 1px solid #eee; margin-top: 5px; padding-top: 5px; font-weight: bold; font-size: 13px;">
                Total: $${total.toLocaleString()}
            </div>
        `;

                    return tooltip;
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                top: 10,
                left: 'center',
                textStyle: { fontSize: 11, color: '#666' },
                selectedMode: 'multiple',
                data: series.map(s => s.name) // <-- asegura que la leyenda siga el mismo orden de series
            },
            grid: {
                left: 60,
                right: 60,
                top: 50,       // suficiente margen para la leyenda horizontal
                bottom: 80,
                containLabel: true
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                    filterMode: 'filter'
                },
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 20,
                    handleStyle: {
                        color: '#5470c6'
                    },
                    dataBackground: {
                        areaStyle: {
                            color: 'rgba(84, 112, 198, 0.3)'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#5470c6'
                        }
                    },
                    selectedDataBackground: {
                        areaStyle: {
                            color: 'rgba(84, 112, 198, 0.5)'
                        },
                        lineStyle: {
                            color: '#5470c6'
                        }
                    }
                }
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: formattedDates,
                axisLine: {
                    lineStyle: { color: '#d0d0d0' }
                },
                axisTick: { show: false },
                axisLabel: {
                    fontSize: 10,
                    color: '#666',
                    rotate: 45,
                    margin: 8,
                    formatter: function (value) {
                        return value; // Ya está formateado
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f5f5f5',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'Facturación (USD)',
                nameTextStyle: {
                    color: '#666',
                    fontSize: 12,
                    padding: [0, 0, 10, 0]
                },
                nameGap: 25,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: function (value) {
                        if (value === 0) return '$0';
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                        return '$' + value.toLocaleString();
                    },
                    color: '#666',
                    fontSize: 10
                },
                splitLine: {
                    lineStyle: {
                        color: '#f5f5f5',
                        type: 'dashed'
                    }
                },
                min: function (value) {
                    return Math.max(0, value.min - (value.max - value.min) * 0.1);
                }
            },
            series: series.slice().reverse(),
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
                return idx * 20; // Animación escalonada
            }
        };

        chart.setOption(option);

        // Manejo de redimensionamiento con ResizeObserver

        // Cleanup del ResizeObserver anterior si existe
        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
        }

        // Configurar ResizeObserver para mejor detección de cambios de tamaño
        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (chart && !chart.isDisposed()) {
                    // Pequeño delay para evitar múltiples redimensionamientos
                    setTimeout(() => {
                        if (chart && !chart.isDisposed()) {
                            chart.resize();
                        }
                    }, 100);
                }
            }
        });

        resizeObserverRef.current.observe(chartRef.current);

        // Cleanup mejorado
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, [data]);

    if (isLoading) {
        return <LoaderComponent />
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );
    }

    const metrics = calculateMetrics(data);
    let selectedRegionsCount = 0;

    if (region === 'all_regions') {
        selectedRegionsCount = aws_regions.length - 1;
    } else if (region) {
        selectedRegionsCount = region.split(',').length;
    } else {
        selectedRegionsCount = 0;
    }
    console.log(data)
    return (
        <div className="w-full min-w-0 px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tendencia de Facturación</h1>
                        <p className="text-muted-foreground">
                            Análisis de costos por servicio AWS - Estilo Power BI
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={exportChart}
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado</p>
                                <p className="text-2xl font-bold text-green-600">
                                    $
                                    {metrics < 0.01 ? (
                                        metrics.total.toPrecision(2)
                                    ) : (
                                        metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })
                                    )}
                                    {/* {num.toPrecision(3)} */}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Período seleccionado
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                                <p className="text-2xl font-bold text-blue-600">{metrics.services}</p>
                                <p className="text-xs text-muted-foreground">
                                    Con costos registrados
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Regiones</p>
                                <p className="text-2xl font-bold text-purple-600">{metrics.regions}</p>
                                <p className="text-xs text-muted-foreground">
                                    Diferentes regiones con datos
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Distribución de Costos por Servicio
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Gráfico de área apilada que muestra la evolución temporal de los costos
                    </p>
                </CardHeader>
                <CardContent>
                    <div
                        ref={chartRef}
                        className="w-full"
                        style={{ height: '500px', minHeight: '500px' }}
                    />
                </CardContent>
            </Card>

            {/* Period Info */}
            <Card className='mt-5'>
                <CardHeader>
                    <CardTitle className="text-sm">Información del Período</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Desde:</span>
                            <p className="font-medium">{startDate.toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Hasta:</span>
                            <p className="font-medium">{endDate.toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">
                                {metrics.regions}
                            </p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Servicios:</span>
                            <p className="font-medium">
                                {metrics.services}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};