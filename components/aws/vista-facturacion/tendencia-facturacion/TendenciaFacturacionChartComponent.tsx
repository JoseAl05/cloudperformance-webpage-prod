'use client'
import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Info, Tag, LucideIcon, Table2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { TendenciaFacturacionLineChartComponent } from '@/components/aws/vista-facturacion/tendencia-facturacion/grafico/TendenciaFacturacionLineChartComponent';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

import { HistoricalBillingTable, RespuestaHistoricoConsumo } from './table/HistoricalBillingTable'; 

interface TendenciaFacturacionProps {
    startDate: Date;
    endDate: Date;
    services?: string;
    region?: string;
    selectedKey?: string,
    selectedValue?: string,
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

export const TendenciaFacturacionChartComponent = ({ startDate, endDate, services, region, selectedKey, selectedValue }: TendenciaFacturacionProps) => {
    const [topN, setTopN] = useState<string>("all");

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    // let apiUrlOriginal = `/api/aws/bridge/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&service=${services}`;
    // if (selectedKey && selectedValue) {
    //     apiUrlOriginal += `&tag_key=${encodeURIComponent(selectedKey)}&tag_value=${encodeURIComponent(selectedValue)}`;
    // }

    // const apiUrlHistorico = `/api/aws/bridge/facturacion/historico-consumo?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&service=${services}`;
    
    let apiUrlOriginal = `/api/aws/bridge/facturacion/tendencia-facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&service=${services}`;
    let apiUrlHistorico = `/api/aws/bridge/facturacion/historico-consumo?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&service=${services}`;

    if (selectedKey) {
        const safeValue = selectedValue ? encodeURIComponent(selectedValue) : "";
        const tagParams = `&tag_key=${encodeURIComponent(selectedKey)}&tag_value=${safeValue}`;
        
        apiUrlOriginal += tagParams;
        apiUrlHistorico += tagParams;
    }   

    const { data: dataOriginal, error: errorOriginal, isLoading: isLoadingOriginal } = useSWR<FacturacionData[]>(apiUrlOriginal, fetcher);
    const { data: dataHistorico, error: errorHistorico, isLoading: isLoadingHistorico } = useSWR<RespuestaHistoricoConsumo>(apiUrlHistorico, fetcher);

    const filteredData = useMemo(() => {
        if (!dataOriginal) return [];
        if (topN === 'all') return dataOriginal;

        const serviceTotals = new Map<string, number>();
        dataOriginal.forEach(item => {
            const current = serviceTotals.get(item.SERVICE) || 0;
            serviceTotals.set(item.SERVICE, current + item.unblendedcost);
        });

        const topServicesNames = Array.from(serviceTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, Number(topN))
            .map(entry => entry[0]);

        return dataOriginal.filter(item => topServicesNames.includes(item.SERVICE));
    }, [dataOriginal, topN]);

    const calculateMetrics = (processedData: FacturacionData[]) => {
        if (!processedData?.length) return { total: 0, servicesList: [], regionsList: [] };

        const total = processedData.reduce((sum, item) => sum + item.unblendedcost, 0);
        const servicesList = Array.from(new Set(processedData.map((i) => i.SERVICE))).sort();
        const regionsList = Array.from(new Set(processedData.map((i) => i.REGION))).sort();

        return { total, servicesList, regionsList };
    };

    if (isLoadingOriginal || isLoadingHistorico) return <LoaderComponent />;

    if (errorOriginal)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );

    if (!dataOriginal)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );

    const metrics = calculateMetrics(filteredData);

    const DetailPopover = ({ title, items, icon: Icon }: { title: string, items: string[], icon: LucideIcon }) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='ghost' className="ml-2 p-1 rounded-full cursor-pointer hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus:outline-none">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Ver detalles de {title}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
                <div className="p-3 border-b bg-muted/30">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {title} ({items.length})
                    </h4>
                </div>
                <div className="max-h-[250px] overflow-y-auto p-2">
                    {items.length > 0 ? (
                        <ul className="text-sm space-y-1">
                            {items.map((item, index) => (
                                <li 
                                    key={`${item}-${index}`} 
                                    className="px-2 py-1 rounded hover:bg-muted/50 truncate" 
                                    title={item}
                                    
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground p-2">No hay datos visibles.</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );

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
                <div className="flex items-center gap-3 p-2 rounded-lg border shadow-sm">
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
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado</p>
                                <p className="text-2xl font-bold text-green-600">
                                    $ {metrics.total < 0.01 ? metrics.total.toPrecision(2) : metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">En los servicios visibles</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-blue-600">{metrics.servicesList.length}</p>
                                    <DetailPopover
                                        title="Servicios Mostrados"
                                        items={metrics.servicesList}
                                        icon={TrendingUp}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Servicios mostrados</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Regiones</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-purple-600">{metrics.regionsList.length}</p>
                                    <DetailPopover
                                        title="Regiones Involucradas"
                                        items={metrics.regionsList}
                                        icon={Calendar}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Regiones involucradas</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
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
                            <p className="font-medium">{metrics.regionsList.length}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Servicios:</span>
                            <p className="font-medium">{metrics.servicesList.length}</p>
                        </div>
                        
                        {/* {selectedKey && selectedValue && (
                            <div className="col-span-2 md:col-span-4 mt-2 pt-4 border-t border-border">
                                <span className="text-muted-foreground flex items-center gap-1 mb-1">
                                    <Tag className="h-3 w-3" /> Filtro por Etiqueta (Tag):
                                </span>
                                <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md font-medium text-xs">
                                    <span className="opacity-70">{selectedKey}</span>
                                    <span className="font-bold">=</span>
                                    <span>{selectedValue}</span>
                                </div>
                            </div>
                        )} */}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-5 shadow-lg border-emerald-500/20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Table2 className="h-5 w-5 text-emerald-600" />
                        Análisis Histórico y Desviaciones
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Desglose mes a mes del consumo de servicios AWS con variaciones frente al período anterior.
                    </p>
                </CardHeader>
                <CardContent>
                    {errorHistorico ? (
                        <div className="text-red-500 text-sm">Error al cargar la tabla histórica.</div>
                    ) : (
                        <HistoricalBillingTable 
                            data={dataHistorico ?? null} 
                            isLoading={isLoadingHistorico} 
                            cloudProvider="AWS"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};