'use client'

import { Card, CardContent } from '@/components/ui/card';
import { ConsumeViewAppGwApiResponse } from '@/interfaces/vista-consumos/appGwConsumeViewInterface';
import {
    Wallet,
    Network,
    TrendingDown,
    AlertTriangle,
    Layers
} from 'lucide-react';
import { useMemo } from 'react';

interface ConsumoAppGwCardsComponentProps {
    data: ConsumeViewAppGwApiResponse[];
}

export const ConsumoAppGwCardsComponent = ({ data }: ConsumoAppGwCardsComponentProps) => {

    const kpis = useMemo(() => {
        if (!data || data.length === 0 || !data[0].metrics) return null;

        const consolidatedMetrics = data[0].metrics;

        const getValues = (name: string) =>
            consolidatedMetrics.filter(m => m.metric_name === name).map(m => m.metric_value);

        const avg = (vals: number[]) => vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        const sum = (vals: number[]) => vals.length ? vals.reduce((a, b) => a + b, 0) : 0;

        const fixedVals = getValues("Fixed Billable Capacity Units");
        const usedVals = getValues("Capacity Units");
        const reqsVals = getValues("Total Requests");
        const connVals = getValues("Current Connections");
        // Promedio temporal de la capacidad FIJA TOTAL
        const globalAvgFixed = avg(fixedVals);
        // Promedio temporal de la capacidad USADA TOTAL
        const globalAvgUsed = avg(usedVals);
        // Promedio temporal de conexiones concurrentes TOTALES
        const globalAvgConns = avg(connVals);
        // Suma total de peticiones en todo el periodo
        const globalTotalReqs = sum(reqsVals);

        const wastedCapacity = Math.max(0, globalAvgFixed - globalAvgUsed);
        const efficiencyPercentage = globalAvgFixed > 0 ? (globalAvgUsed / globalAvgFixed) * 100 : 0;

        return {
            avgFixed: globalAvgFixed,
            avgUsed: globalAvgUsed,
            wastedCapacity,
            efficiencyPercentage,
            totalReqs: globalTotalReqs,
            avgConns: globalAvgConns
        };
    }, [data]);

    if (!kpis) return <div className="p-4 text-muted-foreground">No hay datos para mostrar.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Costo Fijo No Utilizado</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {kpis.wastedCapacity.toFixed(2)} CU
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Capacidad promedio pagada pero no usada (Consolidado)
                            </p>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-full">
                            <Wallet className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className={`border-l-4 shadow-sm ${kpis.efficiencyPercentage < 50 ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Eficiencia Global</p>
                            <p className={`text-2xl font-bold ${kpis.efficiencyPercentage < 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {kpis.efficiencyPercentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Utilización promedio de recursos seleccionados
                            </p>
                        </div>
                        <div className={`p-2 rounded-full ${kpis.efficiencyPercentage < 50 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                            <TrendingDown className={`h-8 w-8 ${kpis.efficiencyPercentage < 50 ? 'text-red-600' : 'text-emerald-600'}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tráfico Total Procesado</p>
                            <p className="text-2xl font-bold text-foreground">
                                {kpis.totalReqs.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Suma de peticiones totales en el periodo de recursos seleccionados
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full">
                            {kpis.totalReqs < 100
                                ? <AlertTriangle className="h-8 w-8 text-blue-600" />
                                : <Layers className="h-8 w-8 text-blue-600" />
                            }
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Conexiones Concurrentes</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {kpis.avgConns.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Suma de conexiones de recursos seleccionados
                            </p>
                        </div>
                        <div className="p-2 bg-indigo-100 rounded-full">
                            <Network className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};