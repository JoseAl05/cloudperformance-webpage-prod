'use client'

import { ElbV2ConsumeSingleChartComponent } from './ElbV2ConsumeSingleChartComponent';
import { LoadbalancerV2Metrics } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { formatMetric } from '@/lib/metricUtils';
import { AlertTriangle, BarChart3, Info, Network, Zap } from 'lucide-react';
import { useMemo } from 'react';

interface ElbV2ConsumeChartsComponentProps {
    data: LoadbalancerV2Metrics[];
}

// ... (CHART_GROUPS se mantiene igual) ...
const CHART_GROUPS = [
    {
        id: 'traffic',
        title: 'Tráfico y Volumen',
        icon: BarChart3,
        description: 'Métricas de volumen de peticiones y datos procesados.',
        metrics: [
            'RequestCount Average',
            'NewFlowCount Average',
            'ProcessedBytes Average'
        ]
    },
    {
        id: 'connections',
        title: 'Conexiones y Flujos',
        icon: Network,
        description: 'Estado de las conexiones activas y nuevos enlaces.',
        metrics: [
            'ActiveConnectionCount Average',
            'ActiveFlowCount Average',
            'NewConnectionCount Average'
        ]
    },
    {
        id: 'capacity',
        title: 'Capacidad y Costo',
        icon: Zap,
        description: 'Consumo de unidades de capacidad (LCU) y evaluaciones.',
        metrics: [
            'ConsumedLCUs Average',
            'RuleEvaluations Average'
        ]
    },
    {
        id: 'errors',
        title: 'Salud y Errores',
        icon: AlertTriangle,
        description: 'Indicadores de fallos en targets o red.',
        metrics: [
            'HTTPCode_Target_5XX_Count Average',
            'TCP_Client_Reset_Count Average'
        ]
    }
];

export const ElbV2ConsumeChartsComponent = ({ data }: ElbV2ConsumeChartsComponentProps) => {

    const metricsMap = useMemo(() => {
        const groups = new Map<string, [string, string | number][]>();

        data.forEach((item) => {
            if (!groups.has(item.metric_name)) {
                groups.set(item.metric_name, []);
            }

            const value = (item.metric_name === 'ProcessedBytes Average')
                ? bytesToMB(item.avg_value)
                : formatMetric(item.avg_value);

            groups.get(item.metric_name)?.push([item.timestamp, value]);
        });

        return groups;
    }, [data]);

    if (metricsMap.size === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 border-dashed">
                <BarChart3 className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <div className="text-center text-muted-foreground font-medium">No hay métricas disponibles para visualizar.</div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            <div className="flex items-center gap-2 px-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Las marcas de tiempo de los gráficos están sincronizadas en formato <strong>UTC</strong>.
                </p>
            </div>

            {CHART_GROUPS.map((group) => {
                const groupMetrics = group.metrics.filter(m => metricsMap.has(m) && metricsMap.get(m)!.length > 0);

                if (groupMetrics.length === 0) return null;

                const GroupIcon = group.icon;
                const isOddCount = groupMetrics.length % 2 !== 0;

                return (
                    <div key={group.id} className="space-y-4 animate-in fade-in-50 duration-500">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="p-2 bg-secondary rounded-full">
                                <GroupIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                                <p className="text-xs text-muted-foreground">{group.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {groupMetrics.map((metricName, index) => {
                                // LÓGICA DE CORRECCIÓN DE ESPACIOS
                                // Si hay un número impar de gráficos y es el último elemento, expandir a 2 columnas
                                const isLastItem = index === groupMetrics.length - 1;
                                const spanClass = (isOddCount && isLastItem) ? "xl:col-span-2" : "";

                                return (
                                    <ElbV2ConsumeSingleChartComponent
                                        key={metricName}
                                        metricName={metricName}
                                        dataPoints={metricsMap.get(metricName)!}
                                        className={spanClass} // Pasamos la clase aquí
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}