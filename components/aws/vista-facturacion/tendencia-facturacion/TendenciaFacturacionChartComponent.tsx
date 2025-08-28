'use client'

import { useRef, useEffect } from 'react';
import useSWR from 'swr';
import * as echarts from 'echarts';
import { TrendingUp, DollarSign, Download, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TendenciaFacturacionProps {
    startDate: Date;
    endDate: Date;
    services?: string;
    region?: string;
}

interface FacturacionData {
    SERVICE: string;
    end_date: string;
    unblendedcost: number;
    REGION_Formatted: string;
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

// Colores más suaves similar a Power BI
const serviceColors = {
    'Amazon Elastic Compute Cloud': 'rgba(255, 107, 107, 0.8)',
    'Amazon Elastic Container Service': 'rgba(78, 205, 196, 0.8)',
    'Amazon Elastic File System': 'rgba(69, 183, 209, 0.8)',
    'Amazon Relational Database Service': 'rgba(150, 206, 180, 0.8)',
    'Amazon Simple Notification Service': 'rgba(255, 234, 167, 0.8)',
    'Amazon Simple Queue Service': 'rgba(221, 160, 221, 0.8)',
    'Amazon Simple Storage Service': 'rgba(152, 216, 200, 0.8)',
    'Amazon Virtual Private Cloud': 'rgba(247, 220, 111, 0.8)',
    'AmazonCloudWatch': 'rgba(187, 143, 206, 0.8)',
    'AWS Cost Explorer': 'rgba(133, 193, 233, 0.8)',
    'AWS Support (Developer)': 'rgba(248, 196, 113, 0.8)',
    'EC2 - Other': 'rgba(130, 224, 170, 0.8)',
    'Tax': 'rgba(241, 148, 138, 0.8)',
    'AWS CloudFormation': 'rgba(174, 214, 241, 0.8)',
    'AWS CloudTrail': 'rgba(169, 223, 191, 0.8)',
    'AWS Config': 'rgba(249, 231, 159, 0.8)',
    'AWS Key Management Service': 'rgba(255, 182, 193, 0.8)',
    'AWS Data Pipeline': 'rgba(144, 238, 144, 0.8)',
    'AWS Glue': 'rgba(221, 221, 221, 0.8)'
};

// Función para generar colores aleatorios suaves
const generateSoftColor = (index: number) => {
    const hue = (index * 137.508) % 360; // Golden angle approximation
    return `hsla(${hue}, 65%, 70%, 0.8)`;
};

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region }: TendenciaFacturacionProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&services=${services}&region=${region}`;
    console.log(apiUrl)
    // if (services && services.length > 0) {
    //     const servicesParam = services.map(s => encodeURIComponent(s)).join(',');
    //     apiUrl += `&services=${servicesParam}`;
    // }

    const { data, error, isLoading } = useSWR<FacturacionData[]>(apiUrl, fetcher);

    const processChartData = (rawData: FacturacionData[]) => {
        if (!rawData || rawData.length === 0) return { dates: [], series: [] };

        // Paso 1: Agregar costos por servicio y fecha
        const serviceMap = new Map<string, Map<string, number>>();
        const allDates = new Set<string>();

        rawData.forEach(item => {
            const service = item.SERVICE;
            const date = item.end_date;
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
                return totalCost > 0.01; // Filtrar servicios con costo muy bajo
            })
            .sort((a, b) => {
                const totalA = Array.from(a[1].values()).reduce((sum, cost) => sum + cost, 0);
                const totalB = Array.from(b[1].values()).reduce((sum, cost) => sum + cost, 0);
                return totalB - totalA; // Ordenar de mayor a menor
            });

        // Paso 4: Crear series para ECharts (área apilada)
        const series = significantServices.map(([serviceName, dateMap], index) => {
            const serviceData = sortedDates.map(date => dateMap.get(date) || 0);

            const baseColor = serviceColors[serviceName as keyof typeof serviceColors] || generateSoftColor(index);

            return {
                name: serviceName,
                type: 'line' as const,
                stack: 'total',
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
        const regions = new Set(rawData.map(item => item.REGION_Formatted)).size;

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

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const { dates, series } = processChartData(data);

        if (chartInstance.current) {
            chartInstance.current.dispose();
        }

        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

        // Formatear fechas para mostrar
        const formattedDates = dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
            });
        });

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function (params: unknown) {
                    if (!params || params.length === 0) return '';

                    let total = 0;
                    let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;

                    // Ordenar por valor descendente para mostrar los más grandes primero
                    const sortedParams = [...params].sort((a, b) => b.value - a.value);

                    sortedParams.forEach((param: unknown) => {
                        if (param.value > 0) {
                            tooltip += `<div style="margin: 2px 0;">
                                ${param.marker} 
                                <span style="display: inline-block; width: 200px;">${param.seriesName}</span>
                                <span style="font-weight: bold;">$${param.value.toFixed(2)}</span>
                            </div>`;
                            total += param.value;
                        }
                    });

                    tooltip += `<div style="border-top: 1px solid #ccc; margin-top: 5px; padding-top: 5px; font-weight: bold;">
                        Total: $${total.toFixed(2)}
                    </div>`;
                    return tooltip;
                }
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 20,
                top: 20,
                bottom: 20,
                width: 250,
                textStyle: {
                    fontSize: 12
                },
                pageIconColor: '#2f4554',
                pageIconInactiveColor: '#aaa',
                pageIconSize: 15,
                pageTextStyle: {
                    color: '#333'
                }
            },
            grid: {
                left: '3%',
                right: '280px',
                bottom: '10%',
                top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: formattedDates,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 11,
                    color: '#666',
                    rotate: 0
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'Facturación (USD)',
                nameTextStyle: {
                    color: '#666',
                    fontSize: 12
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value: number) {
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        }
                        return '$' + value.toFixed(0);
                    },
                    color: '#666',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            series: series,
            animation: true,
            animationDuration: 1500,
            animationEasing: 'cubicOut'
        };

        chart.setOption(option);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3">Cargando tendencia de facturación...</span>
            </div>
        );
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
            <div className="text-gray-500 p-8 text-center bg-gray-50 rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );
    }

    const metrics = calculateMetrics(data);

    return (
        <div className="space-y-6">
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
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Total</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ${metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
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
                                    Diferentes regiones
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
            <Card>
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
                            <p className="font-medium">Todas las regiones</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <p className="font-medium">Gráfico de área apilada</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};