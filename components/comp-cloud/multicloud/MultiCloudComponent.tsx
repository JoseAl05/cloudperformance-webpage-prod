'use client';

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

import { CloudBillingItem } from '@/lib/CloudBillingItem'; 
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

const fetcher = (url: string) => fetch(url, { 
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' } 
}).then(res => res.json());

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

    const getDbParams = (cloud: CloudProvider): string => {
        const selectedIds = selectedTenants[cloud] || [];
        const accounts = accountsList[cloud] || [];
        return selectedIds
            .map(id => accounts.find(acc => acc.id === id)?.db)
            .filter((db): db is string => !!db)
            .join(',');
    };

    const azureDbs = getDbParams('azure');
    const awsDbs = getDbParams('aws');
    const gcpDbs = getDbParams('gcp');

    const buildDateParams = () => {
        const params = new URLSearchParams();
        if (dateMode === 'multi-month' && selectedMonths.length > 0) {
            params.append('selected_months', selectedMonths.join(','));
        } else if (dateMode === 'monthly') {
            const startOfYear = new Date(startDate.getFullYear(), 0, 1);
            params.append('date_from', startOfYear.toISOString().split('.')[0]);
            params.append('date_to', endDate.toISOString().split('.')[0]);
        } else {
            params.append('date_from', startDate.toISOString().split('.')[0]);
            params.append('date_to', endDate.toISOString().split('.')[0]);
        }
        return params.toString();
    };

    const buildTagParams = (key: string | null, value: string | null) => {
        let p = '';
        if (key && key !== 'allKeys') p += `&tag_key=${encodeURIComponent(key)}`;
        if (value && value !== 'allValues') p += `&tag_value=${encodeURIComponent(value)}`;
        return p;
    };

    const baseDateParams = buildDateParams();

    const azureUrl = (user?.is_azure && selectedClouds.includes('azure') && azureDbs) 
        ? `/api/azure/bridge/azure/facturacion/multitenant/pago-por-uso?${baseDateParams}&dbs=${azureDbs}${buildTagParams(azTagKey, azTagValue)}` : null;
    
    const awsUrl = (user?.is_aws && selectedClouds.includes('aws') && awsDbs) 
        ? `/api/aws/bridge/facturacion/multitenant/tendencia-facturacion?${baseDateParams}&region=all&dbs=${awsDbs}${buildTagParams(awsTagKey, awsTagValue)}` : null;
    
    const gcpUrl = (user?.is_gcp && selectedClouds.includes('gcp') && gcpDbs) 
        ? `/api/gcp/bridge/gcp/facturacion/multitenant/tendencia_facturacion?${baseDateParams}&dbs=${gcpDbs}${buildTagParams(gcpTagKey, gcpTagValue)}` : null;

    const { data: azureData, isLoading: isLoadingAzure } = useSWR(azureUrl, fetcher);
    const { data: awsData, isLoading: isLoadingAws } = useSWR(awsUrl, fetcher);
    const { data: gcpData, isLoading: isLoadingGcp } = useSWR(gcpUrl, fetcher);

    const isLoadingData = isLoadingSession || isLoadingAzure || isLoadingAws || isLoadingGcp;

    const monthYearLabel = useMemo(() => {
        if (dateMode === 'monthly') {
            return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(startDate).toUpperCase();
        }
        const formatShort = new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric', timeZone: 'UTC' });
        return `${formatShort.format(startDate).toUpperCase()} - ${formatShort.format(endDate).toUpperCase()}`;
    }, [startDate, endDate, dateMode]);

    const yearLabel = dateMode === 'monthly' ? `AÑO ${startDate.getUTCFullYear()}` : 'PERIODO COMPLETO';

    const getTenantBreakdown = (data: CloudBillingItem[], provider: CloudProvider, costField: keyof CloudBillingItem) => {
        if (!Array.isArray(data)) return [];
        
        const targetMonthStr = dateMode === 'monthly' ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` : null;
        const map = new Map<string, number>();

        data.forEach(item => {
            const dbName = item.source_db as string || 'desconocido';
            const cost = Number(item[costField]) || 0;

            if (dateMode === 'monthly' && targetMonthStr) {
                const dateVal = item.date || item.start_date || item.usage_date || item.usage_start_time || item.day;
                let itemMonth = '';
                if (typeof dateVal === 'string') {
                    if (dateVal.includes('/')) {
                        const parts = dateVal.split(' ')[0].split('/');
                        itemMonth = `${parts[2]}-${String(parts[1]).padStart(2, '0')}`;
                    } else {
                        itemMonth = dateVal.split('T')[0].substring(0, 7);
                    }
                } else if (dateVal) {
                    itemMonth = new Date(dateVal as number | Date).toISOString().substring(0, 7);
                }
                if (itemMonth !== targetMonthStr) return;
            }
            map.set(dbName, (map.get(dbName) || 0) + cost);
        });

        return Array.from(map.entries()).map(([db, cost]) => {
            const account = accountsList[provider].find(acc => acc.db === db);
            return { alias: account?.alias || db, cost };
        }).sort((a, b) => b.cost - a.cost);
    };

    const kpiCardsData = useMemo(() => {
        if (isLoadingData) return [];
        const data = [];
        
        if (selectedClouds.includes('azure')) {
            const breakdown = getTenantBreakdown(azureData || [], 'azure', 'cost_in_usd');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'Azure', logo: '/azure.svg', gasto: total, breakdown, borderClass: 'border-l-blue-500', textClass: 'text-blue-600', iconClass: 'text-blue-500' });
        }
        if (selectedClouds.includes('aws')) {
            const breakdown = getTenantBreakdown(awsData || [], 'aws', 'unblendedcost');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'AWS', logo: '/aws.svg', gasto: total, breakdown, borderClass: 'border-l-orange-500', textClass: 'text-orange-600', iconClass: 'text-orange-500' });
        }
        if (selectedClouds.includes('gcp')) {
            const breakdown = getTenantBreakdown(gcpData || [], 'gcp', 'cost_net_usd');
            const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
            data.push({ provider: 'GCP', logo: '/gcp.svg', gasto: total, breakdown, borderClass: 'border-l-red-500', textClass: 'text-red-600', iconClass: 'text-red-500' });
        }
        return data;
    }, [azureData, awsData, gcpData, isLoadingData, selectedClouds, accountsList, startDate, dateMode]);

    const globalTotals = useMemo(() => {
        const totalMes = kpiCardsData.reduce((sum, card) => sum + card.gasto, 0);
        
        const sumRaw = (arr: CloudBillingItem[], field: keyof CloudBillingItem) => 
            Array.isArray(arr) ? arr.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) : 0;

        let totalPeriodo = 0;
        if (selectedClouds.includes('azure')) totalPeriodo += sumRaw(azureData || [], 'cost_in_usd');
        if (selectedClouds.includes('aws')) totalPeriodo += sumRaw(awsData || [], 'unblendedcost');
        if (selectedClouds.includes('gcp')) totalPeriodo += sumRaw(gcpData || [], 'cost_net_usd');

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
                            azureData={azureData || []} awsData={awsData || []} gcpData={gcpData || []}
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
                            azureData={azureData || []} awsData={awsData || []} gcpData={gcpData || []}
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
                            azureData={azureData || []} awsData={awsData || []} gcpData={gcpData || []}
                            selectedClouds={selectedClouds} isLoading={isLoadingData}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};