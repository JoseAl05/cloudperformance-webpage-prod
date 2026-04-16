'use client'
import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Info, TrendingDown, Table2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { TendenciaFacturacionLineChartComponent } from '@/components/gcp/vista-facturacion/tendencia-facturacion/grafico/TendenciaFacturacionLineChartComponent';
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
import { SelectCurrencyComponent } from '@/components/gcp/vista-facturacion/tendencia-facturacion/SelectCurrencyComponent';

import { HistoricalBillingTable, RespuestaHistoricoConsumo } from './table/HistoricalBillingTable'; 

interface TendenciaFacturacionComponentProps {
    startDate: Date;
    endDate: Date;
    regions: string;
    projects?: string[];
    service: string;
    tagKey?: string;
    tagValue?: string;
}

export interface FacturacionData {
    service: string;
    usage_start_time: string;
    sync_time: string;
    cost_gross_clp: number;
    cost_gross_usd: number;
    cost_net_clp: number;
    cost_net_usd: number;
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

export function parseScientific(num: string): string {
    if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
        return num;
    }

    const numberSign = Math.sign(Number(num));
    num = Math.abs(Number(num)).toString();

    const [coefficient, exponent] = num.toLowerCase().split("e");
    let zeros = Math.abs(Number(exponent));
    const exponentSign = Math.sign(Number(exponent));
    const [integer, decimals] = (coefficient.indexOf(".") != -1 ? coefficient : `${coefficient}.`).split(".");

    if (exponentSign === -1) {
        zeros -= integer.length;
        num =
            zeros < 0
                ? integer.slice(0, zeros) + "." + integer.slice(zeros) + decimals
                : "0." + "0".repeat(zeros) + integer + decimals;
    } else {
        if (decimals) zeros -= decimals.length;
        num =
            zeros < 0
                ? integer + decimals.slice(0, zeros) + "." + decimals.slice(zeros)
                : integer + decimals + "0".repeat(zeros);
    }

    return numberSign < 0 ? "-" + num : num;
}

export const TendenciaFacturacionComponent = ({ startDate, endDate, projects, regions, service, tagKey, tagValue }: TendenciaFacturacionComponentProps) => {
    const [topN, setTopN] = useState<string>("all");
    const [currency, setCurrency] = useState<string>("original");
    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    const baseUrl = `/api/gcp/bridge/gcp/facturacion/tendencia_facturacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&region=${regions}&service_name=${service}`; 
    let apiUrlOriginal = baseUrl;

    if (tagKey && tagKey !== 'allKeys') {
        apiUrlOriginal += `&nombre_tag=${encodeURIComponent(tagKey)}`;

        if (tagValue && tagValue !== 'allValues') {
            apiUrlOriginal += `&valor_tag=${encodeURIComponent(tagValue)}`;
        }
    }

    const apiUrlHistorico = `/api/gcp/bridge/gcp/facturacion/historico-consumo?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&region=${regions}&service_name=${service}`;

    const { data: dataOriginal, error: errorOriginal, isLoading: isLoadingOriginal } = useSWR<FacturacionData[]>(apiUrlOriginal, fetcher);
    const { data: dataHistorico, error: errorHistorico, isLoading: isLoadingHistorico } = useSWR<RespuestaHistoricoConsumo>(apiUrlHistorico, fetcher);

    const filteredData = useMemo(() => {
        if (!dataOriginal) return [];
        if (topN === 'all') return dataOriginal;

        const serviceTotals = new Map<string, number>();

        dataOriginal.forEach(item => {
            const current = serviceTotals.get(item.service) || 0;
            if (currency === "original") {
                serviceTotals.set(item.service, current + item.cost_net_clp);
            } else if (currency === "usd") {
                serviceTotals.set(item.service, current + item.cost_net_usd);
            }
        });

        const topServicesNames = Array.from(serviceTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, Number(topN))
            .map(entry => entry[0]);

        return dataOriginal.filter(item => topServicesNames.includes(item.service));
    }, [dataOriginal, topN, currency]);

    const calculateMetrics = (processedData: FacturacionData[]) => {
        if (!processedData?.length) return { total: 0, servicesList: [] };

        let total = 0;
        if (currency === "original") {
            total = processedData.reduce((sum, item) => sum + item.cost_net_clp, 0);
        } else if (currency === "usd") {
            total = processedData.reduce((sum, item) => sum + item.cost_net_usd, 0);
        }

        const servicesList = Array.from(new Set(processedData.map((i) => i.service))).sort();

        return { total, servicesList };
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

    const DetailPopover = ({ title, items, icon: Icon }: { title: string, items: string[], icon: unknown }) => (
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
                                <li key={index} className="px-2 py-1 rounded hover:bg-muted/50 truncate" title={item}>
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

    const billingValue = (value: number) => {
        let finalValue = '';
        const absValue = Math.abs(value);

        if (absValue < 0.01 && absValue > 0) {
            finalValue = value.toPrecision(2);
        } else {
            if (currency === "original") {
                finalValue = value.toPrecision(2)
            } else if (currency === "usd") {
                finalValue = value.toPrecision(2)
            }
        }
        return parseScientific(finalValue)
    }

    const isNegative = metrics.total < 0;

    const finOpsTitle = isNegative ? "Costo Neto (Saldo a Favor)" : "Costo Neto (Cargo)";

    const finOpsSnippet = isNegative
        ? "Suma acumulada de los costos netos. El valor es negativo porque los créditos superan al uso."
        : "Suma acumulada de los costos netos. Representa el consumo efectivo tras aplicar descuentos.";

    const cardBorderColor = isNegative ? "border-l-blue-500" : "border-l-green-500";
    const amountColor = isNegative ? "text-blue-600" : "text-green-600";
    const IconComponent = isNegative ? TrendingDown : DollarSign;
    const iconColor = isNegative ? "text-blue-500" : "text-green-500";

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tendencia de Facturación</h1>
                        <p className="text-muted-foreground">Análisis de costos por servicio GCP</p>
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
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        Divisa
                    </span>
                    <SelectCurrencyComponent
                        currency={currency}
                        setCurrency={setCurrency}
                        payload={{}}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                <Card className={`border-l-4 ${cardBorderColor} shadow-sm hover:shadow-md transition-shadow`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado</p>
                                <p className={`text-2xl font-bold ${amountColor}`}>
                                    $ {billingValue(metrics.total)}
                                </p>

                                <div className="mt-2 p-2 bg-muted/40 rounded text-xs text-muted-foreground border border-muted">
                                    <span className="font-semibold block mb-0.5">
                                        {finOpsTitle}
                                    </span>
                                    {finOpsSnippet}
                                </div>

                                <p className="text-[10px] text-muted-foreground mt-1">
                                    En los servicios visibles ({currency})
                                </p>
                            </div>
                            <IconComponent className={`h-8 w-8 ${iconColor} opacity-80`} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {metrics.servicesList.length}
                                    </p>
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
                        currency={currency}
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
                            <span className="text-muted-foreground">Servicios:</span>
                            <p className="font-medium">{metrics.servicesList.length}</p>
                        </div>
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
                        Desglose mes a mes del consumo de servicios GCP (USD) con variaciones frente al período anterior.
                    </p>
                </CardHeader>
                <CardContent>
                    {errorHistorico ? (
                        <div className="text-red-500 text-sm">Error al cargar la tabla histórica.</div>
                    ) : (
                        <HistoricalBillingTable 
                            data={dataHistorico ?? null} 
                            isLoading={isLoadingHistorico}
                            cloudProvider="GCP" 
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};