'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, AlertTriangle, CheckCircle2, DollarSign, Activity } from 'lucide-react';
import { WorkingNonWorkingHoursUsageSummaryByResource, WorkingNonWorkingHoursUsageSummaryByResourceMetrics } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { formatGeneric, formatBytes } from '@/lib/bytesToMbs';
import { formatMetricName, getMetricFormat } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns';


const getVal = (metrics: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[], name: string, schedule: string) => {
    return metrics.find(m => m.metric_name === name && m.schedule_type === schedule)?.avg_value || 0;
};

const getMax = (metrics: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[], name: string, schedule: string) => {
    return metrics.find(m => m.metric_name === name && m.schedule_type === schedule)?.max_value || 0;
};

export const WorkingNonWorkingInfoView = ({ data }: { data: WorkingNonWorkingHoursUsageSummaryByResource }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className="rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 border-indigo-500 text-indigo-700">
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Recurso Analizado</h4>
                        <p className="text-xs opacity-90 mt-1">
                            Análisis integral de patrones de uso temporal para detección de anomalías.
                        </p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Metadatos
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span className="font-bold">{data.resource_name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-xs">{data.resource_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fecha Sincronización:</span>
                            <span className="font-medium">{new Date(data.sync_time).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const WorkingNonWorkingMetricsView = ({ data }: { data: WorkingNonWorkingHoursUsageSummaryByResource }) => {

    const uniqueMetricNames = Array.from(new Set(data.metric_data.map(m => m.metric_name)));

    const groupedMetrics = uniqueMetricNames.reduce((acc, metricName) => {
        const prefix = metricName.split('_')[0].toUpperCase();
        if (!acc[prefix]) acc[prefix] = [];
        acc[prefix].push(metricName);
        return acc;
    }, {} as Record<string, string[]>);

    const RenderRow = ({ label, metricKey, type }: { label: string, metricKey: string, type: 'percent' | 'bytes' | 'number' }) => {
        const wAvg = getVal(data.metric_data, metricKey, 'business_hours');
        const nwAvg = getVal(data.metric_data, metricKey, 'non_business_hours');
        const wMax = getMax(data.metric_data, metricKey, 'business_hours');
        const nwMax = getMax(data.metric_data, metricKey, 'non_business_hours');

        const fmt = (v: number) => {
            if (type === 'percent') return `${v.toFixed(1)}%`;
            if (type === 'bytes') return formatBytes(v);
            return formatGeneric(v);
        };

        return (
            <TableRow>
                <TableCell className="font-medium text-xs">{label}</TableCell>
                <TableCell className="text-center font-mono text-xs text-blue-700">{fmt(wAvg)}</TableCell>
                <TableCell className="text-center font-mono text-xs text-purple-700">{fmt(nwAvg)}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{fmt(wMax)} / {fmt(nwMax)}</TableCell>
            </TableRow>
        );
    };

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                {Object.entries(groupedMetrics).map(([group, metrics]) => (
                    <div key={group}>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4" /> {group} Metrics
                        </h4>
                        <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead>Métrica</TableHead>
                                        <TableHead className="text-center">Hábil</TableHead>
                                        <TableHead className="text-center">No Hábil</TableHead>
                                        <TableHead className="text-center">Max (H/NH)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metrics.map(metric => (
                                        <RenderRow
                                            key={metric}
                                            label={formatMetricName(metric)}
                                            metricKey={metric}
                                            type={getMetricFormat(metric)}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

export const WorkingNonWorkingAnalysisView = ({ data }: { data: WorkingNonWorkingHoursUsageSummaryByResource }) => {

    const analyzeResource = () => {
        const cpuW = getVal(data.metric_data, 'cpu_utilization', 'business_hours');
        const cpuNW = getVal(data.metric_data, 'cpu_utilization', 'non_business_hours');

        const isZombie = cpuW < 5 && cpuNW < 5;
        const isSaverCandidate = cpuW > 10 && cpuNW < 2;

        if (isZombie) return { title: "Posible Zombie", desc: "Recurso sin uso significativo.", icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" };
        if (isSaverCandidate) return { title: "Candidato Ahorro", desc: "Inactivo fuera de horario.", icon: DollarSign, color: "text-green-600 bg-green-50 border-green-200" };

        return { title: "Estándar", desc: "Comportamiento normal.", icon: CheckCircle2, color: "text-slate-600 bg-slate-50 border-slate-200" };
    };

    const analysis = analyzeResource();

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className={`border rounded-lg p-4 flex gap-4 ${analysis.color}`}>
                    <div className="p-2 bg-white/50 rounded-full h-fit"><analysis.icon className="h-6 w-6" /></div>
                    <div><h4 className="font-bold text-sm">{analysis.title}</h4><p className="text-sm mt-1">{analysis.desc}</p></div>
                </div>
            </div>
        </ScrollArea>
    );
};