'use client'

import { NatGatewaysConsumeSingleChartComponent } from '@/components/aws/vista-consumos/nat-gateways/graficos/NatGatewaysConsumeSingleChartComponent';
import { NatGatewayMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

interface NatGatewaysConsumeChartsComponentProps {
    data: NatGatewayMetrics[];
}

const ALLOWED_METRICS = new Set([
    'ActiveConnectionCount Maximum',
    'BytesOutToDestination Maximum',
    'BytesInFromSource Maximum',
    'ErrorPortAllocation Maximum'
]);

export const NatGatewaysConsumeChartsComponent = ({ data }: NatGatewaysConsumeChartsComponentProps) => {
    const groupedMetrics = useMemo(() => {
        const groups = new Map<string, [string, string][]>();

        data.forEach((item: NatGatewayMetrics) => {
            if (ALLOWED_METRICS.has(item.metric_name)) {
                if (!groups.has(item.metric_name)) {
                    groups.set(item.metric_name, []);
                }

                const value = (item.metric_name === 'BytesOutToDestination Maximum' || item.metric_name === 'BytesInFromSource Maximum')
                    ? bytesToMB(item.avg_value)
                    : item.avg_value.toFixed(2);

                groups.get(item.metric_name)?.push([item.timestamp, value]);
            }
        });
        return groups;
    }, [data]);

    if (groupedMetrics.size === 0) {
        return <div className="text-center text-gray-500 py-6">No hay métricas disponibles para visualizar.</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Info className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-muted-foreground">
                    Las marcas de tiempo están en formato <strong>UTC</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {Array.from(groupedMetrics.entries()).map(([metricName, dataPoints]) => (
                    <NatGatewaysConsumeSingleChartComponent
                        key={metricName}
                        metricName={metricName}
                        dataPoints={dataPoints}
                    />
                ))}
            </div>
        </div>
    );
}
