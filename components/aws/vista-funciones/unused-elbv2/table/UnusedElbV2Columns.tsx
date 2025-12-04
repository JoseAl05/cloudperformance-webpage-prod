'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { UnusedElbV2Details } from '@/interfaces/vista-unused-resources/unusedElbV2Interfaces';
import { AsociatedElbV2Resources } from '@/interfaces/vista-unused-resources/asociatedElbV2ResourcesInterfaces';
import { UnusedElbV2InsightModal } from '@/components/aws/vista-funciones/unused-elbv2/info/UnusedElbV2InsightModal';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatMetric } from '@/lib/metricUtils';

export interface GlobalMetricsSummary {
    avg_requests: number;
    avg_active_connections: number;
    avg_new_flows: number;
    avg_active_flows: number;
    avg_consumed_lcus: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DetailsCell = ({ elb, dateParams, globalMetrics }: { elb: UnusedElbV2Details, dateParams: { from: string, to: string }, globalMetrics: GlobalMetricsSummary | undefined }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: asociatedData, isLoading } = useSWR<AsociatedElbV2Resources[]>(
        isOpen ? `/api/aws/bridge/loadbalancersv2/get_associated_resources?elb_arn=${elb.elb_arn}&date_from=${dateParams.from}&date_to=${dateParams.to}` : null,
        fetcher
    );

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 cursor-pointer hover:bg-accent text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Análisis
            </Button>

            <UnusedElbV2InsightModal
                elbData={elb}
                asociatedResources={asociatedData}
                globalMetrics={globalMetrics}
                isLoading={isLoading}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    return {
        startDateParam: searchParams.get('startDate'),
        endDateParam: searchParams.get('endDate'),
        keyParam: searchParams.get('selectedKey'),
        valueParam: searchParams.get('selectedValue'),
        regionParam: searchParams.get('region')
    }
}

const MetricCell = ({ value, globalValue, label, unit }: { value: number, globalValue: number, label: string, unit?: string }) => {
    // Si el valor local es mayor al global, la barra se llena al 100% (usando value como max)
    // Si es menor, se usa globalValue como max.
    const maxVal = globalValue > 0 ? (value > globalValue ? value : globalValue) : (value > 0 ? value : 1);

    // Si supera el promedio, pintamos naranja, si no, azul.
    const isAboveAvg = value > globalValue;
    const progressColorClass = isAboveAvg
        ? '[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500'
        : '[&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500';

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-medium text-foreground">
                    {formatMetric(value)} <span className="text-[10px] text-muted-foreground">{unit}</span>
                </span>
                <span className="text-[10px] text-muted-foreground" title={`Global Avg: ${formatMetric(globalValue)}`}>
                    Avg: {formatMetric(globalValue)}
                </span>
            </div>

            <progress
                value={value}
                max={maxVal}
                className={`w-full h-1.5 rounded-full overflow-hidden appearance-none bg-secondary/50 [&::-webkit-progress-bar]:bg-secondary/50 [&::-webkit-progress-bar]:rounded-full ${progressColorClass}`}
            />

            <span className="text-[10px] text-muted-foreground/70 text-right uppercase tracking-tighter">
                {label}
            </span>
        </div>
    )
}

export const getUnusedElbV2Columns = (
    dateFrom: string,
    dateTo: string,
    globalMetrics?: GlobalMetricsSummary
): DynamicColumn<UnusedElbV2Details>[] => [
        {
            header: "Nombre / ID",
            accessorKey: "elb_arn",
            cell: (info) => {
                const val = info.getValue() as string;
                const params = GetParameters();
                const parts = val.split(':').pop()?.split("/") || [];
                const shortName = parts.length >= 4 ? `${parts[2]} ${parts[3]}` : val;

                return (
                    <div className="flex flex-col max-w-[200px]">
                        <Link
                            href={{ pathname: '/aws/consumos/loadbalancers', query: { startDate: params.startDateParam, endDate: params.endDateParam, unusedElbV2: val, region: params.regionParam, selectedKey: params.keyParam, selectedValue: params.valueParam } }}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <div className="font-medium text-blue-500 hover:text-blue-500/80 truncate" title={val}>
                                {shortName}
                            </div>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-4 px-1">{info.row.original.region}</Badge>
                            <Badge variant="secondary" className="text-[10px] h-4 px-1 capitalize">{info.row.original.elb_type}</Badge>
                        </div>
                    </div>
                );
            },
            size: 220
        },
        {
            header: "Tráfico (Avg)",
            id: "traffic_metric",
            cell: ({ row }) => {
                // USAMOS EL PROMEDIO DEL RANGO (metrics_summary en raíz), NO EL HISTÓRICO
                const resourceMetrics = row.original.metrics_summary;

                if (!resourceMetrics || !globalMetrics) return <span className="text-muted-foreground text-xs">-</span>;

                const isNlb = row.original.elb_type === 'network';

                const localVal = (isNlb ? resourceMetrics.new_flows_avg : resourceMetrics.request_count_avg) ?? 0;
                const globalVal = (isNlb ? globalMetrics.avg_new_flows : globalMetrics.avg_requests) ?? 0;
                const label = isNlb ? 'Flows/h' : 'Reqs/h';

                return <MetricCell value={localVal} globalValue={globalVal} label={label} />;
            },
            size: 140
        },
        {
            header: "Conexiones (Avg)",
            id: "connections_metric",
            cell: ({ row }) => {
                const resourceMetrics = row.original.metrics_summary;

                if (!resourceMetrics || !globalMetrics) return <span className="text-muted-foreground text-xs">-</span>;

                const isNlb = row.original.elb_type === 'network';

                const localVal = (isNlb ? resourceMetrics.active_flows_avg : resourceMetrics.active_connections_avg) ?? 0;
                const globalVal = (isNlb ? globalMetrics.avg_active_flows : globalMetrics.avg_active_connections) ?? 0;
                const label = isNlb ? 'Act Flows' : 'Act Conns';

                return <MetricCell value={localVal} globalValue={globalVal} label={label} />;
            },
            size: 140
        },
        {
            header: "LCUs (Avg)",
            id: "lcus_metric",
            cell: ({ row }) => {
                const resourceMetrics = row.original.metrics_summary;

                if (!resourceMetrics || !globalMetrics) return <span className="text-muted-foreground text-xs">-</span>;

                const localVal = resourceMetrics.consumed_lcus_avg ?? 0;
                const globalVal = globalMetrics.avg_consumed_lcus ?? 0;

                return <MetricCell value={localVal} globalValue={globalVal} label="Units" />;
            },
            size: 140
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => (
                <DetailsCell
                    elb={row.original}
                    dateParams={{ from: dateFrom, to: dateTo }}
                    globalMetrics={globalMetrics}
                />
            ),
            size: 100
        }
    ];