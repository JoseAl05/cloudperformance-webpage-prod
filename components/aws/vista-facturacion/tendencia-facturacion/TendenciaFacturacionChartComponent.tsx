'use client'

import { useRef, useEffect, useState } from 'react';
import useSWR from 'swr';
import * as echarts from 'echarts';
import { TrendingUp, DollarSign, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
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
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const generateUniqueColors = (count: number) => {
    const colors: string[] = [];
    const saturation = 70;
    const lightness = 65;
    const goldenAngle = 137.5;

    for (let i = 0; i < count; i++) {
        const hue = (i * goldenAngle) % 360;
        colors.push(`hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, 0.8)`);
    }
    return colors;
};

const serviceColorCache = new Map<string, string>();

const getServiceColor = (serviceName: string, serviceIndex: number, totalServices: number) => {
    if (serviceColorCache.has(serviceName)) return serviceColorCache.get(serviceName)!;

    if (serviceColorCache.size === 0) {
        const colors = generateUniqueColors(Math.max(totalServices, 50));
        const color = colors[serviceIndex % colors.length];
        serviceColorCache.set(serviceName, color);
        return color;
    }

    const usedColors = Array.from(serviceColorCache.values());
    const allColors = generateUniqueColors(usedColors.length + 20);

    for (const color of allColors) {
        if (!usedColors.includes(color)) {
            serviceColorCache.set(serviceName, color);
            return color;
        }
    }

    const hue = (serviceName.charCodeAt(0) + serviceName.length * 137.5) % 360;
    const fallback = `hsla(${Math.round(hue)}, 70%, 65%, 0.8)`;
    serviceColorCache.set(serviceName, fallback);
    return fallback;
};

const toUTCDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region }: TendenciaFacturacionProps) => {
    const [topN, setTopN] = useState<number | "all">(8);

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];
    const serviceParam = services ? `services=${services}` : '';
    const apiUrl = `/api/bridge/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&${serviceParam}&region=${region}`;

    const { data, error, isLoading } = useSWR<FacturacionData[]>(apiUrl, fetcher);

    const processChartData = (rawData: FacturacionData[]) => {
        if (!rawData?.length) return { dates: [] as string[], series: [] as unknown[], significantServices: [] as unknown[] };

        const serviceMap = new Map<string, Map<string, number>>();
        const allDates = new Set<string>();

        rawData.forEach((item) => {
            const service = item.SERVICE;
            const date = new Date(item.start_date).toISOString().slice(0, 10);
            const cost = item.unblendedcost;

            allDates.add(date);
            if (!serviceMap.has(service)) serviceMap.set(service, new Map());
            const currentCost = serviceMap.get(service)!.get(date) || 0;
            serviceMap.get(service)!.set(date, currentCost + cost);
        });

        const sortedDates = Array.from(allDates).sort();

        const significantServices = Array.from(serviceMap.entries())
            .filter(([_, dateMap]) => Array.from(dateMap.values()).reduce((sum, v) => sum + v, 0))
            .sort((a, b) => {
                const totalA = Array.from(a[1].values()).reduce((sum, v) => sum + v, 0);
                const totalB = Array.from(b[1].values()).reduce((sum, v) => sum + v, 0);
                return totalB - totalA;
            });

        const series = significantServices.map(([serviceName, dateMap], index) => {
            const serviceData = sortedDates.map((d) => dateMap.get(d) || 0);
            const baseColor = getServiceColor(serviceName, index, significantServices.length);

            return {
                name: serviceName,
                type: 'line' as const,
                stack: 'Total',
                areaStyle: { color: baseColor, opacity: 0.7 },
                lineStyle: { width: 1, color: baseColor.replace('0.8', '1') },
                data: serviceData,
                smooth: true,
                symbol: 'none',
                emphasis: { focus: 'series' },
            };
        });

        return { dates: sortedDates, series, significantServices };
    };

    const calculateMetrics = (rawData: FacturacionData[]) => {
        if (!rawData?.length) return { total: 0, services: 0, regions: 0 };
        const total = rawData.reduce((sum, item) => sum + item.unblendedcost, 0);
        const services = new Set(rawData.map((i) => i.SERVICE)).size;
        const regions = new Set(rawData.map((i) => i.REGION)).size;
        return { total, services, regions };
    };

    const exportChart = () => {
        if (!chartInstance.current) return;
        const url = chartInstance.current.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
        const link = document.createElement('a');
        link.download = `tendencia-facturacion-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
    };

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
        if (!data || !chartRef.current) return;

        const { dates, series } = processChartData(data);

        if (chartInstance.current) chartInstance.current.dispose();
        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

        const formattedDates = formatDatesAdaptive(dates);

        const generateDistinctColors = (count: number) => {
            const colors: string[] = [];
            const saturation = 70;
            const lightness = 50;
            for (let i = 0; i < count; i++) {
                const hue = (i * 360) / count;
                colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
            }
            return colors;
        };

        const distinctColors = generateDistinctColors(series.length);
        (series as unknown[]).forEach((serie: unknown, index: number) => {
            serie.itemStyle = { color: distinctColors[index] };
            serie.lineStyle = { width: 2 };
            serie.symbol = 'circle';
            serie.symbolSize = 4;
            serie.emphasis = { focus: 'series', lineStyle: { width: 3 } };
        });
        const currentTopN = topN === 'all' ? Number.POSITIVE_INFINITY : Number(topN);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'line', snap: true },
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderColor: '#ddd',
                borderWidth: 1,
                enterable: true,
                confine:true,
                textStyle: { fontSize: 12, color: '#111' },
                extraCssText: 'max-width:360px; white-space:normal; box-shadow:0 4px 12px rgba(0,0,0,.08); border-radius:10px; padding:10px 12px;',
                formatter: (params: unknown[]) => {
                    if (!params?.length) return '';

                    const originalDate = toUTCDate(dates[params[0].dataIndex]);
                    const dateStr = fmt.format(originalDate);

                    const items = params
                        .map((p: unknown) => ({
                            name: p.seriesName,
                            value: Number(p.value || 0),
                            marker: p.marker,
                        }))
                        .filter((i: unknown) => i.value > 0);

                    if (!items.length) {
                        return `<div style="font-weight:600;margin-bottom:6px">${dateStr}</div>
                                <div style="font-weight:600">Total: $0</div>`;
                    }

                    items.sort((a: unknown, b: unknown) => b.value - a.value);
                    const total = items.reduce((s: number, i: unknown) => s + i.value, 0);

                    const top = items.slice(0, currentTopN);
                    const rest = items.slice(currentTopN);
                    const restSum = rest.reduce((s: number, i: unknown) => s + i.value, 0);

                    const money = (n: number) =>
                        n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(2) + 'M'
                            : n >= 1_000 ? '$' + (n / 1_000).toFixed(0) + 'K'
                                : '$' + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                    let html = `<div style="font-weight:600;margin-bottom:8px">${dateStr}</div>`;

                    html += `<div style="max-height:280px; overflow:auto; padding-right:4px;">`;

                    html += top.map((i: unknown) => {
                        const pct = total > 0 ? (i.value / total) * 100 : 0;
                        return `
                        <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;line-height:1.25;margin:3px 0">
                          <div style="display:flex;align-items:center;gap:6px;min-width:0">
                            ${i.marker}
                            <span style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${i.name}</span>
                          </div>
                          <div style="font-variant-numeric: tabular-nums;">
                            <span>${money(i.value)}</span>
                            <span style="color:#666"> · ${pct.toFixed(1)}%</span>
                          </div>
                        </div>`;
                    }).join('');

                    if (rest.length) {
                        const pct = total > 0 ? (restSum / total) * 100 : 0;
                        html += `
                        <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;line-height:1.25;margin-top:6px;border-top:1px dashed #eee;padding-top:6px">
                          <div style="color:#444">+${rest.length} más</div>
                          <div style="font-variant-numeric: tabular-nums;">
                            <span>${money(restSum)}</span>
                            <span style="color:#666"> · ${pct.toFixed(1)}%</span>
                          </div>
                        </div>`;
                    }

                    html += `</div>`;

                    html += `
                    <div style="border-top:1px solid #eee;margin-top:8px;padding-top:6px;font-weight:700">
                      Total: ${money(total)}
                    </div>`;

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
                data: (series as unknown[]).map((s) => s.name),
            },
            grid: { left: 60, right: 60, top: 50, bottom: 80, containLabel: true },
            dataZoom: [
                { type: 'inside', start: 0, end: 100, filterMode: 'filter' },
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 20,
                    handleStyle: { color: '#5470c6' },
                    dataBackground: { areaStyle: { color: 'rgba(84, 112, 198, 0.3)' }, lineStyle: { opacity: 0.8, color: '#5470c6' } },
                    selectedDataBackground: { areaStyle: { color: 'rgba(84, 112, 198, 0.5)' }, lineStyle: { color: '#5470c6' } },
                },
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: formattedDates,
                axisLine: { lineStyle: { color: '#d0d0d0' } },
                axisTick: { show: false },
                axisLabel: { fontSize: 10, color: '#666', rotate: 45, margin: 8, formatter: (v: string) => v },
                splitLine: { show: true, lineStyle: { color: '#f5f5f5', type: 'dashed' } },
            },
            yAxis: {
                type: 'value',
                name: 'Facturación (USD)',
                nameTextStyle: { color: '#666', fontSize: 12, padding: [0, 0, 10, 0] },
                nameGap: 25,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: (value: number) => {
                        if (value === 0) return '$0';
                        if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
                        if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
                        return '$' + value.toLocaleString();
                    },
                    color: '#666',
                    fontSize: 10,
                },
                splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
                min: (v: unknown) => Math.max(0, v.min - (v.max - v.min) * 0.1),
            },
            series: (series as unknown[]).slice().reverse(),
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            animationDelay: (idx: number) => idx * 20,
        } as echarts.EChartsOption;

        chart.setOption(option);

        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        resizeObserverRef.current = new ResizeObserver(() => {
            if (chart && !chart.isDisposed()) setTimeout(() => chart.resize(), 100);
        });
        resizeObserverRef.current.observe(chartRef.current!);

        return () => {
            if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, [data, topN]);

    if (isLoading) return <LoaderComponent />;

    if (error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );

    if (!data || !Array.isArray(data) || !data.length)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );

    const metrics = calculateMetrics(data);

    let selectedRegionsCount = 0;
    if (region === 'all_regions') selectedRegionsCount = aws_regions.length - 1;
    else if (region) selectedRegionsCount = region.split(',').length;
    else selectedRegionsCount = 0;

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tendencia de Facturación</h1>
                        <p className="text-muted-foreground">Análisis de costos por servicio AWS - Estilo Power BI</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={exportChart}>
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado</p>
                                <p className="text-2xl font-bold text-green-600">
                                    $ {metrics < 0.01 ? metrics.total.toPrecision(2) : metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">Período seleccionado</p>
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
                                <p className="text-xs text-muted-foreground">Con costos registrados</p>
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
                                <p className="text-xs text-muted-foreground">Diferentes regiones con datos</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Distribución de Costos por Servicio
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Gráfico de área apilada que muestra la evolución temporal de los costos
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Tooltip Top:</span>
                            <Select
                                value={topN === 'all' ? 'all' : String(topN)}
                                onValueChange={(val) => setTopN(val === 'all' ? 'all' : parseInt(val, 10))}
                            >
                                <SelectTrigger className="h-8 w-[90px]">
                                    <SelectValue placeholder="Top N" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="all">Todos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div ref={chartRef} className="w-full" style={{ height: '500px', minHeight: '500px' }} />
                </CardContent>
            </Card>

            <Card className="mt-5">
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
                            <p className="font-medium">{metrics.regions}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Servicios:</span>
                            <p className="font-medium">{metrics.services}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

