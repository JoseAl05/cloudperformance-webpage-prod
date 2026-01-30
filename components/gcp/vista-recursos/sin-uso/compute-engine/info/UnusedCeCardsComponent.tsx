'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, TrendingUp, Cpu, Network, DollarSign, Computer, HardDrive } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { UnusedCeCardsMetricSummary } from '@/interfaces/vista-unused-resources/unusedComputeEngineInterfaces';

interface UnusedCeCardsComponentProps {
    data: UnusedCeCardsMetricSummary[];
    instanceCount: number;
    totalUsdUnusedInstances: number;
}

const StatCard = ({ title, value, unit, peakValue, icon: Icon, description }: unknown) => {
    return (
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">
                            {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
                        </h4>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{description}</p>
                    {peakValue !== undefined && (
                        <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-amber-600 font-medium p-1 rounded">
                            <TrendingUp className="w-3 h-3" />
                            <span>Peak en periodo: {peakValue} {unit}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export const UnusedCeCardsComponent = ({ data, instanceCount, totalUsdUnusedInstances }: UnusedCeCardsComponentProps) => {

    const metrics = useMemo(() => {
        if (!data) return {
            cpu: { avg: 0, peak: 0 },
            netPps: { avg: 0, peak: 0 },
            netThroughput: { avg: 0, peak: 0 },
            diskIops: { avg: 0, peak: 0 },
            diskThroughput: { avg: 0, peak: 0 }
        };

        const cpuMetric = data.find((m) => m.metric_name.includes("cpu_utilization"));
        const netEgressPps = data.find((m) => m.metric_name.includes("network_egress_pps"));
        const netIngressPps = data.find((m) => m.metric_name.includes("network_ingress_pps"));
        const netEgressThroughput = data.find((m) => m.metric_name.includes("network_egress_throughput"));
        const netIngressThroughput = data.find((m) => m.metric_name.includes("network_ingress_throughput"));
        const diskReadIops = data.find((m) => m.metric_name.includes("disk_read_iops"));
        const diskWriteIops = data.find((m) => m.metric_name.includes("disk_write_iops"));
        const diskReadThroughput = data.find((m) => m.metric_name.includes("disk_read_throughput"));
        const diskWriteThroughput = data.find((m) => m.metric_name.includes("disk_write_throughput"));


        const netAvgPps = (netEgressPps?.value || 0) + (netIngressPps?.value || 0);
        const netPeakPps = (netEgressPps?.peak_value || 0) + (netIngressPps?.peak_value || 0);

        const netAvgThroughput = (netEgressThroughput?.value || 0) + (netIngressThroughput?.value || 0);
        const netPeakThroughput = (netEgressThroughput?.peak_value || 0) + (netIngressThroughput?.peak_value || 0);

        const diskAvgIops = (diskReadIops?.value || 0) + (diskWriteIops?.value || 0);
        const diskPeakIops = (diskReadIops?.peak_value || 0) + (diskWriteIops?.peak_value || 0);

        const diskAvgThroughput = (diskReadThroughput?.value || 0) + (diskWriteThroughput?.value || 0);
        const diskPeakThroughput = (diskReadThroughput?.peak_value || 0) + (diskWriteThroughput?.peak_value || 0);


        return {
            cpu: { avg: cpuMetric?.value || 0, peak: cpuMetric?.peak_value || 0 },
            netPps: { avg: netAvgPps, peak: netPeakPps },
            netThroughput: { avg: netAvgThroughput, peak: netPeakThroughput },
            diskIops: { avg: diskAvgIops, peak: diskPeakIops },
            diskThroughput: { avg: diskAvgThroughput, peak: diskPeakThroughput }
        };
    }, [data]);

    return (
        <div className='flex flex-col gap-4'>
            <StatCard
                title="Total costo instancias infrautilizadas"
                value={`$ ${totalUsdUnusedInstances.toFixed(2)}`}
                unit=""
                description="Gasto total generado por instancias infrautilizadas en el periodo seleccionado. (USD)"
                icon={DollarSign}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Instancias Infrautilizadas"
                    value={instanceCount}
                    unit="Recursos"
                    description="Total de instancias detectadas con uso de CPU < 10%."
                    icon={Computer}
                />
                <StatCard
                    title="CPU Promedio Global"
                    value={metrics.cpu.avg}
                    peakValue={metrics.cpu.peak}
                    unit="%"
                    description="Uso promedio de CPU de todas las instancias en el rango."
                    icon={Cpu}
                />
                <StatCard
                    title="I/O Promedio de paquetes de red"
                    value={metrics.netPps.avg.toFixed(2)}
                    peakValue={metrics.netPps.peak.toFixed(2)}
                    unit="Paquetes"
                    description="Tráfico de paquetes promedio (In + Out) procesado."
                    icon={Network}
                />
                <StatCard
                    title="I/O Promedio de MB/s de red"
                    value={bytesToMB(metrics.netThroughput.avg)}
                    peakValue={bytesToMB(metrics.netThroughput.peak)}
                    unit="MB/s"
                    description="Rendimiento de red promedio (In + Out) procesado."
                    icon={Network}
                />
                <StatCard
                    title="I/O Promedio de IOPS de disco"
                    value={metrics.diskIops.avg.toFixed(2)}
                    peakValue={metrics.diskIops.peak.toFixed(2)}
                    unit="IOPS"
                    description="Tráfico de IOPS promedio (In + Out) procesado."
                    icon={HardDrive}
                />
                <StatCard
                    title="I/O Promedio de MB/s de disco"
                    value={bytesToMB(metrics.diskThroughput.avg)}
                    peakValue={bytesToMB(metrics.diskThroughput.peak)}
                    unit="MB/s"
                    description="Rendimiento de disco promedio (In + Out) procesado."
                    icon={HardDrive}
                />
            </div>
        </div>
    );
};