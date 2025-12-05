'use client'

import { NatGatewaysConsumeSingleChartComponent } from '@/components/aws/vista-consumos/nat-gateways/graficos/NatGatewaysConsumeSingleChartComponent';
import { NatGatewayMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { formatMetric } from '@/lib/metricUtils';
import { Activity, AlertTriangle, BarChart3, Info } from 'lucide-react';
import { useMemo } from 'react';

interface NatGatewaysConsumeChartsComponentProps {
    data: NatGatewayMetrics[];
}

const CHART_GROUPS = [
    {
        id: 'volume',
        title: 'Volumen de Datos',
        icon: BarChart3,
        description: 'Métricas de transferencia entrante y saliente.',
        metrics: [
            'BytesOutToDestination Average',
            'BytesInFromSource Average'
        ]
    },
    {
        id: 'connections',
        title: 'Conexiones y Estado',
        icon: Activity,
        description: 'Concurrencia y estado de salud.',
        metrics: [
            'ActiveConnectionCount Average',
            'ErrorPortAllocation Average'
        ]
    }
];

export const NatGatewaysConsumeChartsComponent = ({ data }: NatGatewaysConsumeChartsComponentProps) => {

    const metricsMap = useMemo(() => {
        const groups = new Map<string, [string, string | number][]>();

        data.forEach((item) => {
            if (!groups.has(item.metric_name)) {
                groups.set(item.metric_name, []);
            }

            const value = (item.metric_name.includes('Bytes'))
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
                            {groupMetrics.map((metricName) => {
                                return (
                                    <NatGatewaysConsumeSingleChartComponent
                                        key={metricName}
                                        metricName={metricName}
                                        dataPoints={metricsMap.get(metricName)!}
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