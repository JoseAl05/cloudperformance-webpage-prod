'use client';

import { fetcher } from '@/lib/fetcher';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DollarSign, Globe, CalendarDays, Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/hooks/useSession';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import Image from 'next/image';

import type { BillingCloud, BillingPoint, BillingTrend } from '@/interfaces/billing';
import { billingUrl, monthOf, monthsRange } from '@/lib/billing';
import { toApiDate } from '@/lib/consumption';
import { CostMetricInfo } from '@/components/shared/billing/CostMetricInfo';
import { MultiTenantSelection, CloudAccount, CloudProvider } from '@/hooks/useMultiTenantSelection';
import { AppliedMultiCloudFilters } from './filters/MultiCloudFiltersComponent';

import { MultiCloudLineChartComponent } from './grafico/MultiCloudLineChartComponent';
import { MultiCloudServiceBarChartComponent } from './grafico/MultiCloudServiceBarChartComponent';
import { MultiCloudMonthlyServiceChartComponent } from './grafico/MultiCloudMonthlyServiceChartComponent';

interface GlobalBillingMultiTenantDashboardProps extends AppliedMultiCloudFilters {
    selectedClouds: CloudProvider[];
    selectedTenants: MultiTenantSelection;
    accountsList: {
        azure: CloudAccount[];
        aws: CloudAccount[];
        gcp: CloudAccount[];
    };
}

const pointsInMonths = (trend: BillingTrend | undefined, monthsKey: string): BillingPoint[] => {
    const points = trend?.points ?? [];
    if (!monthsKey) return points;
    const months = new Set(monthsKey.split(','));
    return points.filter(point => months.has(monthOf(point.date)));
};

export const GlobalBillingMultiTenantDashboard = ({
    startDate,
    endDate,
    dateMode = 'monthly',
    selectedMonths = [],
    azTagKey, azTagValue,
    awsTagKey, awsTagValue,
    gcpTagKey, gcpTagValue,
    selectedClouds,
    selectedTenants,
    accountsList
}: GlobalBillingMultiTenantDashboardProps) => {

    const { user, isLoading: isLoadingSession } = useSession();

    const getAccountIdParams = (cloud: CloudProvider): string => {
        const selectedIds = selectedTenants[cloud] || [];
        const accounts = accountsList[cloud] || [];
        return selectedIds
            .filter(id => accounts.some(acc => acc.id === id))
            .join(',');
    };

    const azureAccountIds = getAccountIdParams('azure');
    const awsAccountIds = getAccountIdParams('aws');
    const gcpAccountIds = getAccountIdParams('gcp');

    const range = monthsRange(selectedMonths);
    const dateParams = range
        ? { date_from: range.from, date_to: range.to }
        : {
            date_from: toApiDate(dateMode === 'monthly' ? new Date(startDate.getFullYear(), 0, 1) : startDate),
            date_to: toApiDate(endDate),
        };

    const tagParams = (key: string | null, value: string | null) => ({
        tag_key: key && key !== 'allKeys' ? key : undefined,
        tag_value: value && value !== 'allValues' ? value : undefined,
    });

    const trendUrl = (cloud: BillingCloud, enabled: boolean | undefined, accountIds: string, extra: Record<string, string | undefined>) =>
        enabled && selectedClouds.includes(cloud) && accountIds
            ? billingUrl(cloud, 'multitenant/trend', { ...dateParams, account_ids: accountIds, ...extra })
            : null;

    const azureUrl = trendUrl('azure', user?.is_azure, azureAccountIds, tagParams(azTagKey, azTagValue));
    const awsUrl = trendUrl('aws', user?.is_aws, awsAccountIds, { region: 'all_regions', ...tagParams(awsTagKey, awsTagValue) });
    const gcpUrl = trendUrl('gcp', user?.is_gcp, gcpAccountIds, tagParams(gcpTagKey, gcpTagValue));

    const { data: azureTrend, isLoading: isLoadingAzure } = useSWR<BillingTrend>(azureUrl, fetcher);
    const { data: awsTrend, isLoading: isLoadingAws } = useSWR<BillingTrend>(awsUrl, fetcher);
    const { data: gcpTrend, isLoading: isLoadingGcp } = useSWR<BillingTrend>(gcpUrl, fetcher);

    const monthsKey = selectedMonths.join(',');
    const azureData = useMemo(() => pointsInMonths(azureTrend, monthsKey), [azureTrend, monthsKey]);
    const awsData = useMemo(() => pointsInMonths(awsTrend, monthsKey), [awsTrend, monthsKey]);
    const gcpData = useMemo(() => pointsInMonths(gcpTrend, monthsKey), [gcpTrend, monthsKey]);

    const isLoadingData = isLoadingSession || isLoadingAzure || isLoadingAws || isLoadingGcp;

    const monthYearLabel = useMemo(() => {
        if (dateMode === 'monthly') {
            return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(startDate).toUpperCase();
        }
        const formatShort = new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric', timeZone: 'UTC' });
        return `${formatShort.format(startDate).toUpperCase()} - ${formatShort.format(endDate).toUpperCase()}`;
    }, [startDate, endDate, dateMode]);

    const yearLabel = dateMode === 'monthly' ? `AÑO ${startDate.getUTCFullYear()}` : 'PERIODO COMPLETO';

    const getTenantBreakdown = (data: BillingPoint[], provider: CloudProvider) => {
        const targetMonthStr = dateMode === 'monthly' ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` : null;
        const map = new Map<string, number>();

        data.forEach(point => {
            if (targetMonthStr && monthOf(point.date) !== targetMonthStr) return;
            const accountId = point.account || 'desconocido';
            map.set(accountId, (map.get(accountId) || 0) + point.cost);
        });

        return Array.from(map.entries()).map(([accountId, cost]) => {
            const account = accountsList[provider].find(acc => acc.id === accountId);
            return { alias: account?.alias || accountId, cost };
        }).sort((a, b) => b.cost - a.cost);
    };

    const kpiCardsData = useMemo(() => {
        if (isLoadingData) return [];
        const data = [];

        if (selectedClouds.includes('azure')) {
            const breakdown = getTenantBreakdown(azureData, 'azure');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'Azure', logo: '/azure.svg', costMetric: azureTrend?.cost_metric, gasto: total, breakdown, borderClass: 'border-l-blue-500', textClass: 'text-blue-600', iconClass: 'text-blue-500' });
        }
        if (selectedClouds.includes('aws')) {
            const breakdown = getTenantBreakdown(awsData, 'aws');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'AWS', logo: '/aws.svg', costMetric: awsTrend?.cost_metric, gasto: total, breakdown, borderClass: 'border-l-orange-500', textClass: 'text-orange-600', iconClass: 'text-orange-500' });
        }
        if (selectedClouds.includes('gcp')) {
            const breakdown = getTenantBreakdown(gcpData, 'gcp');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'GCP', logo: '/gcp.svg', costMetric: gcpTrend?.cost_metric, gasto: total, breakdown, borderClass: 'border-l-red-500', textClass: 'text-red-600', iconClass: 'text-red-500' });
        }
        return data;
    }, [azureData, awsData, gcpData, azureTrend, awsTrend, gcpTrend, isLoadingData, selectedClouds, accountsList, startDate, dateMode]);

    const globalTotals = useMemo(() => {
        const totalMes = kpiCardsData.reduce((sum, card) => sum + card.gasto, 0);

        const sum = (points: BillingPoint[]) => points.reduce((total, point) => total + point.cost, 0);

        let totalPeriodo = 0;
        if (selectedClouds.includes('azure')) totalPeriodo += sum(azureData);
        if (selectedClouds.includes('aws')) totalPeriodo += sum(awsData);
        if (selectedClouds.includes('gcp')) totalPeriodo += sum(gcpData);

        return { totalMes, totalPeriodo };
    }, [kpiCardsData, azureData, awsData, gcpData, selectedClouds]);

    if (isLoadingData) return <div className="py-12"><LoaderComponent size="large" /></div>;

    const gridCols = kpiCardsData.length === 1 ? 'md:grid-cols-1' : kpiCardsData.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

    return (
        <div className="w-full h-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-slate-500" />
                    Resumen Ejecutivo Consolidado
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        Total Global (Mes)
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            {monthYearLabel}
                                        </span>
                                    </p>
                                    <p className="text-2xl lg:text-3xl font-bold text-indigo-600 mt-1">
                                        $ {globalTotals.totalMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <Globe className="h-8 w-8 text-indigo-500 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        Total Global {dateMode === 'monthly' ? '(Año)' : '(Rango)'}
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            {yearLabel}
                                        </span>
                                    </p>
                                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600 mt-1">
                                        $ {globalTotals.totalPeriodo.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <CalendarDays className="h-8 w-8 text-emerald-500 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className={cn("grid gap-6 mt-4 w-full", gridCols)}>
                    {kpiCardsData.map((nube) => (
                        <Card key={nube.provider} className={cn("border-l-4 shadow-sm w-full transition-all duration-300 hover:shadow-md", nube.borderClass)}>
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <Image src={nube.logo} width={16} height={16} alt={nube.provider} />
                                                {nube.provider} Consolidado
                                                <CostMetricInfo metric={nube.costMetric} currency="USD" />
                                            </p>
                                            <p className={cn("text-2xl font-bold mt-1", nube.textClass)}>
                                                $ {nube.gasto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <DollarSign className={cn("h-8 w-8 opacity-40", nube.iconClass)} />
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Desglose por Cuenta</p>
                                        <div className="space-y-1.5">
                                            {nube.breakdown.map((tenant, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{tenant.alias}</span>
                                                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                                        ${tenant.cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-6 w-full">
                <Card className="w-full shadow-md">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg">Tendencia de Gasto Agregado</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <MultiCloudLineChartComponent
                            azureData={azureData} awsData={awsData} gcpData={gcpData}
                            selectedClouds={selectedClouds} isLoading={isLoadingData}
                            startDate={startDate} endDate={endDate} dateMode={dateMode} selectedMonths={selectedMonths}
                        />
                    </CardContent>
                </Card>

                <Card className="w-full shadow-md">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg">Distribución por Categoría (Suma de Tenants)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <MultiCloudMonthlyServiceChartComponent
                            azureData={azureData} awsData={awsData} gcpData={gcpData}
                            selectedClouds={selectedClouds} isLoading={isLoadingData}
                            startDate={startDate} endDate={endDate} dateMode={dateMode} selectedMonths={selectedMonths}
                        />
                    </CardContent>
                </Card>

                <Card className="w-full shadow-md">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg">Top Servicios Globales</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <MultiCloudServiceBarChartComponent
                            azureData={azureData} awsData={awsData} gcpData={gcpData}
                            selectedClouds={selectedClouds} isLoading={isLoadingData}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};