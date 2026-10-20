'use client'

import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetcher } from '@/lib/fetcher';
import { formatCurrency } from '@/lib/format';
import { billingUrl } from '@/lib/billing';
import { toApiDate, type QueryParams } from '@/lib/consumption';
import type { BillingCloud, BillingTop } from '@/interfaces/billing';
import { CostMetricInfo } from './CostMetricInfo';
import { TopBillingChart } from './TopBillingChart';
import { TopBillingTable } from './TopBillingTable';
import type { TopBillingDimension } from './billingConfigs';

interface TopBillingViewProps {
    cloud: BillingCloud;
    startDate: Date;
    endDate: Date;
    dimensions: TopBillingDimension[];
    params?: QueryParams;
}

export const TopBillingView = ({ cloud, startDate, endDate, dimensions, params }: TopBillingViewProps) => {
    const [dimensionValue, setDimensionValue] = useState(dimensions[0].value);
    const [selected, setSelected] = useState<string | null>(null);
    const [topLimit, setTopLimit] = useState<number | 'all'>(10);
    const dimension = dimensions.find((d) => d.value === dimensionValue) ?? dimensions[0];

    const { data, error, isLoading } = useSWR<BillingTop>(
        billingUrl(cloud, 'top', { date_from: toApiDate(startDate), date_to: toApiDate(endDate), dimension: dimension.value, ...params }),
        fetcher,
        { revalidateOnFocus: false }
    );

    const kpis = useMemo(() => {
        const totals = new Map<string, number>();
        (data?.items ?? []).forEach((item) => totals.set(item.value || 'N/D', (totals.get(item.value || 'N/D') ?? 0) + item.cost));
        const values = Array.from(totals, ([value, cost]) => ({ value, cost }));
        const positive = values.filter((v) => v.cost > 0);
        return {
            total: values.reduce((sum, v) => sum + v.cost, 0),
            max: positive.reduce<{ value: string; cost: number } | null>((m, v) => (!m || v.cost > m.cost ? v : m), null),
            min: positive.reduce<{ value: string; cost: number } | null>((m, v) => (!m || v.cost < m.cost ? v : m), null),
        };
    }, [data]);

    const changeDimension = useCallback((value: string) => {
        setDimensionValue(value);
        setSelected(null);
    }, []);

    if (isLoading) return <LoaderComponent size="large" />;
    if (error || !data) return <p className="p-4 text-red-500">Error cargando los datos de facturación.</p>;

    const currency = data.currency;
    const period = `${toApiDate(startDate).slice(0, 10)} — ${toApiDate(endDate).slice(0, 10)}`;
    const label = dimension.label;

    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3 shadow-lg rounded-2xl">
                    <CardHeader className="border-b">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {dimension.icon} Facturación por {label}
                                    <CostMetricInfo metric={data.cost_metric} currency={currency} />
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Costo total de cada {label.toLowerCase()} desglosado por servicio. Haz clic en una barra para ver el detalle.
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                                {dimensions.length > 1 && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Agrupar por</label>
                                        <Select value={dimension.value} onValueChange={changeDimension}>
                                            <SelectTrigger className="w-full md:w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dimensions.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Mostrar Top</label>
                                    <Select value={topLimit.toString()} onValueChange={(v) => setTopLimit(v === 'all' ? 'all' : Number(v))}>
                                        <SelectTrigger className="w-full md:w-36">
                                            <SelectValue placeholder="Mostrar Top" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="all">Ver todo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="relative h-[600px]">
                        <TopBillingChart
                            items={data.items}
                            selected={selected}
                            onSelect={setSelected}
                            topLimit={topLimit}
                            currency={currency}
                            uiTuning={dimension.uiTuning}
                        />
                    </CardContent>

                    <div className="border-t bg-muted/50 px-6 py-3">
                        <div className="flex justify-end text-sm text-muted-foreground">Período: {period}</div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        Costo Total ({currency}) <CostMetricInfo metric={data.cost_metric} currency={currency} />
                                    </p>
                                    <p className="text-2xl font-bold text-indigo-600">{formatCurrency(kpis.total, { currency })}</p>
                                    <p className="text-xs text-muted-foreground">Total facturado acumulado</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>

                    {kpis.max && (
                        <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-muted-foreground">{label} con mayor costo de facturación</p>
                                        <p className="text-2xl font-bold text-red-600 truncate" title={kpis.max.value}>{kpis.max.value}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(kpis.max.cost, { currency })}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 shrink-0 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {kpis.min && (
                        <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-muted-foreground">{label} con menor costo de facturación</p>
                                        <p className="text-2xl font-bold text-green-600 truncate" title={kpis.min.value}>{kpis.min.value}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(kpis.min.cost, { currency })}</p>
                                    </div>
                                    <TrendingDown className="h-8 w-8 shrink-0 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <TopBillingTable items={data.items} label={label} currency={currency} period={period} />
        </div>
    );
};
