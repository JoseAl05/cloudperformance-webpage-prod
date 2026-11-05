'use client'

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { DollarSign, Info, MapPin, Table2, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetcher } from '@/lib/fetcher';
import { formatCurrency } from '@/lib/format';
import { billingUrl } from '@/lib/billing';
import type { QueryParams } from '@/lib/consumption';
import type { BillingCloud, BillingHistory, BillingTrend } from '@/interfaces/billing';
import { BillingTrendChart } from './BillingTrendChart';
import { BillingHistoryTable } from './BillingHistoryTable';
import { CostMetricInfo } from './CostMetricInfo';

const CLOUD_LABEL: Record<BillingCloud, string> = { aws: 'AWS', azure: 'Azure', gcp: 'GCP' };

interface BillingTrendViewProps {
    cloud: BillingCloud;
    startDate: Date;
    endDate: Date;
    params: QueryParams;
    showHeader?: boolean;
    servicesLabel?: string;
    regionsLabel?: string;
}

const DetailPopover = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon }) => (
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
                        {items.map((item) => (
                            <li key={item} className="px-2 py-1 rounded hover:bg-muted/50 truncate" title={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground p-2">No hay datos visibles.</p>
                )}
            </div>
        </PopoverContent>
    </Popover>
);

export const BillingTrendView = ({
    cloud,
    startDate,
    endDate,
    params,
    showHeader = true,
    servicesLabel = 'Servicios',
    regionsLabel = 'Regiones',
}: BillingTrendViewProps) => {
    const [topN, setTopN] = useState<string>('all');
    const cloudLabel = CLOUD_LABEL[cloud];

    const trend = useSWR<BillingTrend>(billingUrl(cloud, 'trend', params), fetcher);
    const history = useSWR<BillingHistory>(billingUrl(cloud, 'history', params), fetcher);

    const visiblePoints = useMemo(() => {
        const points = trend.data?.points ?? [];
        if (topN === 'all') return points;

        const totals = new Map<string, number>();
        points.forEach((p) => totals.set(p.service, (totals.get(p.service) || 0) + p.cost));
        const top = new Set(Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, Number(topN)).map(([s]) => s));
        return points.filter((p) => top.has(p.service));
    }, [trend.data, topN]);

    const metrics = useMemo(() => ({
        total: visiblePoints.reduce((sum, p) => sum + p.cost, 0),
        services: Array.from(new Set(visiblePoints.map((p) => p.service))).sort(),
        regions: Array.from(new Set(visiblePoints.map((p) => p.region).filter((r): r is string => !!r))).sort(),
    }), [visiblePoints]);

    if (trend.isLoading) return <LoaderComponent size="large" />;

    if (trend.error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );

    if (!trend.data || trend.data.points.length === 0)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );

    const { cost_metric: costMetric, currency } = trend.data;
    const hasRegions = metrics.regions.length > 0;
    const isNegative = metrics.total < 0;
    const TotalIcon = isNegative ? TrendingDown : DollarSign;

    const topSelector = (
        <div className="flex items-center gap-3 p-2 rounded-lg border shadow-sm">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Top {servicesLabel}:</span>
            <Select value={topN} onValueChange={setTopN}>
                <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Top N" />
                </SelectTrigger>
                <SelectContent>
                    {['5', '8', '10', '15', '20'].map((n) => <SelectItem key={n} value={n}>Top {n}</SelectItem>)}
                    <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className={`flex flex-col md:flex-row md:items-center gap-4 ${showHeader ? 'justify-between' : 'justify-end'}`}>
                {showHeader && (
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Tendencia de Facturación</h1>
                            <p className="text-muted-foreground">Análisis de costos por servicio {cloudLabel}</p>
                        </div>
                    </div>
                )}
                {topSelector}
            </div>

            <div className={`grid grid-cols-1 gap-6 py-5 ${hasRegions ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                <Card className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${isNegative ? 'border-l-blue-500' : 'border-l-green-500'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                    Costo Acumulado <CostMetricInfo metric={costMetric} currency={currency} />
                                </p>
                                <p className={`text-2xl font-bold ${isNegative ? 'text-blue-600' : 'text-green-600'}`}>
                                    {formatCurrency(metrics.total, { currency })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isNegative
                                        ? 'Saldo a favor: los créditos superan al uso'
                                        : topN === 'all' ? 'Período seleccionado' : `En los Top ${topN} ${servicesLabel.toLowerCase()}`}
                                </p>
                            </div>
                            <TotalIcon className={`h-8 w-8 opacity-80 ${isNegative ? 'text-blue-500' : 'text-green-500'}`} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{servicesLabel}</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-purple-600">{metrics.services.length}</p>
                                    <DetailPopover title={`${servicesLabel} mostrados`} items={metrics.services} icon={TrendingUp} />
                                </div>
                                <p className="text-xs text-muted-foreground">Con costos registrados</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                {hasRegions && (
                    <Card className="border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{regionsLabel}</p>
                                    <div className="flex items-center">
                                        <p className="text-2xl font-bold text-cyan-600">{metrics.regions.length}</p>
                                        <DetailPopover title={`${regionsLabel} involucradas`} items={metrics.regions} icon={MapPin} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{regionsLabel} con costos</p>
                                </div>
                                <MapPin className="h-8 w-8 text-cyan-500 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Distribución de Costos por Servicio
                        <CostMetricInfo metric={costMetric} currency={currency} />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Evolución diaria de los {topN === 'all' ? servicesLabel.toLowerCase() : `Top ${topN} ${servicesLabel.toLowerCase()} más costosos`}
                    </p>
                </CardHeader>
                <CardContent>
                    <BillingTrendChart data={visiblePoints} currency={currency} />
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
                        {hasRegions && (
                            <div>
                                <span className="text-muted-foreground">{regionsLabel}:</span>
                                <p className="font-medium">{metrics.regions.length}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground">{servicesLabel}:</span>
                            <p className="font-medium">{metrics.services.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-5 shadow-lg border-emerald-500/20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Table2 className="h-5 w-5 text-emerald-600" />
                        Análisis Histórico y Desviaciones
                        <CostMetricInfo metric={history.data?.cost_metric ?? costMetric} currency={history.data?.currency ?? currency} />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Desglose mes a mes del consumo de servicios {cloudLabel} con variaciones frente al período anterior.
                    </p>
                </CardHeader>
                <CardContent>
                    {history.error ? (
                        <div className="text-red-500 text-sm">Error al cargar la tabla histórica.</div>
                    ) : (
                        <BillingHistoryTable data={history.data ?? null} isLoading={history.isLoading} cloudLabel={cloudLabel} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
