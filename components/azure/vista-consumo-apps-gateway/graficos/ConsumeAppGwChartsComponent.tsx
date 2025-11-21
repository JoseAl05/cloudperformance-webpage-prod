'use client'

import { ConsumeAppGwSingleChartComponent } from '@/components/azure/vista-consumo-apps-gateway/graficos/ConsumeAppGwSingleChartComponent';
import { ConsumeViewAppGwApiResponse, ConsumeViewAppGwMetrics } from '@/interfaces/vista-consumos/appGwConsumeViewInterface'
import { bytesToMB } from '@/lib/bytesToMbs';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

interface ConsumeAppGwChartsComponentProps {
    data: ConsumeViewAppGwApiResponse[];
}

const ALLOWED_METRICS = new Set([
    'Bytes Received',
    'Bytes Sent',
    'Capacity Units',
    'Compute Units',
    'Cpu Utilization',
    'Current Connections',
    'Fixed Billable Capacity Units',
    'Total Requests'
]);

export const ConsumeAppGwChartsComponent = ({ data }: ConsumeAppGwChartsComponentProps) => {

    const groupedMetrics = useMemo(() => {
        const groups = new Map<string, [string, string][]>();
        const consolidatedMetrics = data?.[0]?.metrics || [];

        consolidatedMetrics.forEach((item: ConsumeViewAppGwMetrics) => {
            if (ALLOWED_METRICS.has(item.metric_name)) {
                if (!groups.has(item.metric_name)) {
                    groups.set(item.metric_name, []);
                }

                const value = (item.metric_name === 'Bytes Received' || item.metric_name === 'Bytes Sent')
                    ? bytesToMB(item.metric_value)
                    : item.metric_value.toFixed(2);

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
                    <ConsumeAppGwSingleChartComponent
                        key={metricName}
                        metricName={metricName}
                        dataPoints={dataPoints}
                    />
                ))}
            </div>
        </div>
    );
}