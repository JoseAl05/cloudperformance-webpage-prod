'use client'
import { useCallback, useEffect, useRef } from 'react';
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceViewUsageCreditsComponentProps {
    data: unknown,
    lastCpuCreditBalanceEc2: number,
    lastCpuCreditUsageEc2: number,
    percentageCreditsUsageEc2: number,
    creditsEfficiencyEc2: string
}

export const Ec2ResourceViewUsageCreditsComponent = ({ data, lastCpuCreditBalanceEc2, lastCpuCreditUsageEc2, percentageCreditsUsageEc2, creditsEfficiencyEc2 }: ResourceViewUsageCreditsComponentProps) => {
    // Chart para Credits Metrics
    const chartRefCpuCredits = useRef<HTMLDivElement>(null);
    const chartCpuCreditsInstance = useRef<echarts.ECharts | null>(null);
    // Resize Observer
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    // Métricas de Uso de Créditos
    const creditsUsageData = data ? data.metrics_data.filter(item => item.MetricLabel === "Uso de Créditos CPU (Promedio)") : [];
    creditsUsageData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsUsageMetric = creditsUsageData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    // Métricas de Créditos Disponibles
    const creditsBalanceData = data ? data.metrics_data.filter(item => item.MetricLabel === "Créditos de CPU Disponibles (Promedio)") : [];
    creditsBalanceData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsBalanceMetric = creditsBalanceData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    const getEfficiencyStatus = (percentage: number) => {
        // Convert percentage to decimal for comparison (e.g., 50% -> 0.50)
        const porcentaje = percentage / 100

        if (isNaN(porcentaje) || porcentaje === null || porcentaje === undefined) {
            return {
                message: "❔ Créditos no disponibles",
                color: "gray",
                bgGradient: "from-gray-50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/10",
                textColor: "text-gray-600 dark:text-gray-400",
                dotColor: "bg-gray-500",
            }
        }

        if (porcentaje <= 0.01) {
            return {
                message: "🟦 La instancia presenta un nivel de actividad prácticamente nulo",
                color: "blue",
                bgGradient: "from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
                textColor: "text-blue-600 dark:text-blue-400",
                dotColor: "bg-blue-500",
            }
        }

        if (porcentaje <= 0.1) {
            return {
                message: "🟨 La instancia muestra un nivel de utilización muy bajo",
                color: "yellow",
                bgGradient: "from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10",
                textColor: "text-yellow-600 dark:text-yellow-400",
                dotColor: "bg-yellow-500",
            }
        }

        if (porcentaje <= 0.5) {
            return {
                message: "🟩 La instancia opera con una carga moderada y estable",
                color: "green",
                bgGradient: "from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
                textColor: "text-green-600 dark:text-green-400",
                dotColor: "bg-green-500",
            }
        }

        if (porcentaje <= 0.9) {
            return {
                message: "🟧 La instancia está siendo utilizada de forma considerable",
                color: "orange",
                bgGradient: "from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10",
                textColor: "text-orange-600 dark:text-orange-400",
                dotColor: "bg-orange-500",
            }
        }

        return {
            message: "🟥 La instancia registra una alta carga de trabajo y posible sobreutilización",
            color: "red",
            bgGradient: "from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10",
            textColor: "text-red-600 dark:text-red-400",
            dotColor: "bg-red-500",
        }
    }

    const efficiencyStatus = getEfficiencyStatus(percentageCreditsUsageEc2)
    const handleResize = useCallback(() => {
        if (chartCpuCreditsInstance.current) {
            chartCpuCreditsInstance.current.resize();
        }
    }, []);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            title: {
                text: 'Consumo y Balance de Créditos',
                left: 'center',
                textStyle: {
                    color: isDarkMode ? '#ffff' : '#000',
                }
            },
            dataZoom: {
                type: 'slider',     // tipo slider
                xAxisIndex: 0,      // aplica al eje X
                bottom: 20,         // distancia desde la parte inferior del contenedor
                height: 20,         // altura del slider
                handleSize: '100%', // tamaño del manejador
                start: 0,           // posición inicial
                end: 100            // posición final
            },
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    const date = new Date(params[0].value[0]).toUTCString();
                    let result = `${date}<br/>`;
                    params.forEach(p => {
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Uso de Créditos', 'Créditos Disponibles'],
                orient: 'vertical',  // vertical para que se apile
                right: 10,            // distancia desde el borde derecho
                top: 'middle'         // centrada verticalmente
            },
            grid: {
                left: 50,
                right: 180, // deja espacio para la leyenda
                top: 50,
                bottom: 60,
                containLabel: true // asegura que los labels no se corten
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true
            },
            series: [
                {
                    name: 'Uso de Créditos',
                    type: 'line',
                    data: creditsUsageMetric,
                    smooth: true,
                    areaStyle: { color: 'rgba(54, 162, 235, 0.3)' },
                    lineStyle: { color: '#36A2EB' },
                    itemStyle: {
                        color: '#36A2EB',        // color del punto
                        borderColor: '#ffffff',  // borde del punto
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
                {
                    name: 'Créditos Disponibles',
                    type: 'line',
                    data: creditsBalanceMetric,
                    smooth: true,
                    areaStyle: { color: 'rgba(235, 0, 0, 0.3)' },
                    lineStyle: { color: '#e60000' },
                    itemStyle: {
                        color: '#e60000',        // color del punto
                        borderColor: '#ffffff',  // borde del punto
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
            ],
            animation: true,
        };
        if (!chartRefCpuCredits.current) return

        if (chartRefCpuCredits.current) {
            chartCpuCreditsInstance.current = echarts.init(chartRefCpuCredits.current);
            chartCpuCreditsInstance.current.setOption(optionsCpuCreditsMetrics);
        }

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRefCpuCredits.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartCpuCreditsInstance.current?.dispose();
        };
    }, [data, handleResize])

    return (
        <div className='flex flex-col justify-between items-center w-full space-y-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Créditos Disponibles
                        </CardTitle>
                        <p className="text-xs text-muted-foreground/70">Actual</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                                {lastCpuCreditBalanceEc2}
                            </span>
                            <span className="text-sm text-muted-foreground">créditos</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Créditos Usados
                        </CardTitle>
                        <p className="text-xs text-muted-foreground/70">Actual</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                                {lastCpuCreditUsageEc2.toFixed(4)}
                            </span>
                            <span className="text-sm text-muted-foreground">créditos</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Porcentaje de Uso
                        </CardTitle>
                        <p className="text-xs text-muted-foreground/70">Créditos</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                                {percentageCreditsUsageEc2}
                            </span>
                            <span className="text-sm text-muted-foreground">%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br ${efficiencyStatus.bgGradient}`}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Eficiencia
                        </CardTitle>
                        <p className="text-xs text-muted-foreground/70">Estado de la Instancia</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-start space-x-3">
                            <div
                                className={`w-3 h-3 rounded-full ${efficiencyStatus.dotColor} animate-pulse mt-1 flex-shrink-0`}
                            ></div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${efficiencyStatus.textColor} leading-relaxed`}>
                                    {efficiencyStatus.message}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                            Basado en {percentageCreditsUsageEc2.toFixed(1)}% de uso
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div
                ref={chartRefCpuCredits}
                className='w-full h-[60vh] min-h-[400px] max-h-[600px]'
            />
        </div>
    )
}