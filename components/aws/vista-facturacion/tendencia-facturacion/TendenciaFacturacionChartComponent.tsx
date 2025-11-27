'use client'
import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aws_regions } from '@/lib/aws_regions';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { TendenciaFacturacionLineChartComponent } from '@/components/aws/vista-facturacion/tendencia-facturacion/grafico/TendenciaFacturacionLineChartComponent';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

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

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region }: TendenciaFacturacionProps) => {
    const [topN, setTopN] = useState<string>("8");

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    const params = new URLSearchParams();
    params.set('date_from', startDateFormatted);
    params.set('date_to', endDateFormatted);
    if (services) params.set('services', services);
    if (region) params.set('region', region);

    const apiUrl = `/api/aws/bridge/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&services=${services}`;

    const { data, error, isLoading } = useSWR<FacturacionData[]>(apiUrl, fetcher);

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (topN === 'all') return data;

        const serviceTotals = new Map<string, number>();
        data.forEach(item => {
            const current = serviceTotals.get(item.SERVICE) || 0;
            serviceTotals.set(item.SERVICE, current + item.unblendedcost);
        });


        const topServicesNames = Array.from(serviceTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, Number(topN))
            .map(entry => entry[0]);

        return data.filter(item => topServicesNames.includes(item.SERVICE));
    }, [data, topN]);


    const calculateMetrics = (processedData: FacturacionData[]) => {
        if (!processedData?.length) return { total: 0, services: 0, regions: 0 };
        const total = processedData.reduce((sum, item) => sum + item.unblendedcost, 0);
        const servicesCount = new Set(processedData.map((i) => i.SERVICE)).size;
        const regionsCount = new Set(processedData.map((i) => i.REGION)).size;
        return { total, services: servicesCount, regions: regionsCount };
    };

    if (isLoading) return <LoaderComponent />;

    if (error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );

    if (!data)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );
    const metrics = calculateMetrics(filteredData);

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tendencia de Facturación</h1>
                        <p className="text-muted-foreground">Análisis de costos por servicio AWS</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        Top Servicios:
                    </span>
                    <Select
                        value={topN}
                        onValueChange={(val) => setTopN(val)}
                    >
                        <SelectTrigger className="h-9 w-[130px]">
                            <SelectValue placeholder="Top N" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">Top 5</SelectItem>
                            <SelectItem value="8">Top 8</SelectItem>
                            <SelectItem value="10">Top 10</SelectItem>
                            <SelectItem value="15">Top 15</SelectItem>
                            <SelectItem value="20">Top 20</SelectItem>
                            <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado (Filtrado)</p>
                                <p className="text-2xl font-bold text-green-600">
                                    $ {metrics.total < 0.01 ? metrics.total.toPrecision(2) : metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">En los servicios visibles</p>
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
                                <p className="text-xs text-muted-foreground">Servicios mostrados</p>
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
                                <p className="text-xs text-muted-foreground">Regiones involucradas</p>
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
                                Evolución temporal de los {topN === 'all' ? 'servicios' : `Top ${topN} servicios más costosos`}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <TendenciaFacturacionLineChartComponent
                        data={filteredData}
                    />
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