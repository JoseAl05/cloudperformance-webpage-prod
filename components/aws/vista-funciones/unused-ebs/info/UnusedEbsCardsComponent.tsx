'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, HardDrive, Clock, BookOpen, BookUp, ArrowDownToLine, ArrowUpFromLine, Timer, Layers, Zap } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { UnusedEbsCardsMetricSummary } from '@/interfaces/vista-unused-resources/unusedEbsResourcesInterfaces';

interface UnusedEbsCardsComponentProps {
    data: UnusedEbsCardsMetricSummary[] | null;
    volumeCount: number;
    totalUsdUnusedVolumes: number;
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

export const UnusedEbsCardsComponent = ({ data, volumeCount, totalUsdUnusedVolumes }: UnusedEbsCardsComponentProps) => {

    const metrics = useMemo(() => {
        if (!data) return {
            volumeIdleTime: { avg: 0, peak: 0 },
            volumeWriteBytes: { avg: 0, peak: 0 },
            volumeReadOps: { avg: 0, peak: 0 },
            volumeWriteOps: { avg: 0, peak: 0 },
            volumeReadBytes: { avg: 0, peak: 0 },
            burstBalance: { avg: 0, peak: 0 },
            volumeQueueLength: { avg: 0, peak: 0 },
        };

        const volumeIdleTime = data.find((m) => m.metric_name.includes("VolumeIdleTime"));
        const volumeWriteBytes = data.find((m) => m.metric_name.includes("VolumeWriteBytes"));
        const volumeReadOps = data.find((m) => m.metric_name.includes("VolumeReadOps"));
        const volumeWriteOps = data.find((m) => m.metric_name.includes("VolumeWriteOps"));
        const volumeReadBytes = data.find((m) => m.metric_name.includes("VolumeReadBytes"));
        const burstBalance = data.find((m) => m.metric_name.includes("BurstBalance"));
        const volumeQueueLength = data.find((m) => m.metric_name.includes("VolumeQueueLength"));

        return {
            volumeIdleTime: { avg: volumeIdleTime?.value || 0, peak: volumeIdleTime?.peak_value || 0 },
            volumeWriteBytes: { avg: volumeWriteBytes?.value || 0, peak: volumeWriteBytes?.peak_value || 0 },
            volumeReadOps: { avg: volumeReadOps?.value || 0, peak: volumeReadOps?.peak_value || 0 },
            volumeWriteOps: { avg: volumeWriteOps?.value || 0, peak: volumeWriteOps?.peak_value || 0 },
            volumeReadBytes: { avg: volumeReadBytes?.value || 0, peak: volumeReadBytes?.peak_value || 0 },
            burstBalance: { avg: burstBalance?.value || 0, peak: burstBalance?.peak_value || 0 },
            volumeQueueLength: { avg: volumeQueueLength?.value || 0, peak: volumeQueueLength?.peak_value || 0 },
        };
    }, [data]);

    return (
        <div className='flex flex-col gap-4'>
            <StatCard
                title="Total costo volúmenes no utilizados"
                value={`$ ${totalUsdUnusedVolumes.toFixed(2)}`}
                unit=""
                description="Gasto total generado por volúmenes EBS no utilizados en el periodo seleccionado. (USD)"
                icon={DollarSign}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Volúmenes No Utilizados"
                    value={volumeCount}
                    unit="Recursos"
                    description="Total de volúmenes EBS detectados como no utilizados."
                    icon={HardDrive}
                />
                <StatCard
                    title="Volume Idle Time Promedio"
                    value={metrics.volumeIdleTime.avg}
                    peakValue={metrics.volumeIdleTime.peak}
                    unit="Segundos"
                    description="Tiempo promedio de inactividad de los volúmenes en el periodo."
                    icon={Clock}
                />
                <StatCard
                    title="Volume Read Ops Promedio"
                    value={metrics.volumeReadOps.avg}
                    peakValue={metrics.volumeReadOps.peak}
                    unit="OPS"
                    description="Promedio de operaciones de lectura en el periodo."
                    icon={BookOpen}
                />
                <StatCard
                    title="Volume Write Ops Promedio"
                    value={metrics.volumeWriteOps.avg}
                    peakValue={metrics.volumeWriteOps.peak}
                    unit="OPS"
                    description="Promedio de operaciones de escritura en el periodo."
                    icon={BookUp}
                />
                <StatCard
                    title="Volume Read Bytes Promedio"
                    value={bytesToMB(metrics.volumeReadBytes.avg)}
                    peakValue={bytesToMB(metrics.volumeReadBytes.peak)}
                    unit="MB"
                    description="Bytes de lectura promedio procesados por los volúmenes."
                    icon={ArrowDownToLine}
                />
                <StatCard
                    title="Volume Write Bytes Promedio"
                    value={bytesToMB(metrics.volumeWriteBytes.avg)}
                    peakValue={bytesToMB(metrics.volumeWriteBytes.peak)}
                    unit="MB"
                    description="Bytes de escritura promedio procesados por los volúmenes."
                    icon={ArrowUpFromLine}
                />
                <StatCard
                    title="Burst Balance Promedio"
                    value={metrics.burstBalance.avg}
                    peakValue={metrics.burstBalance.peak}
                    unit="%"
                    description="Promedio del porcentaje de reserva de rendimiento disponible."
                    icon={Zap}
                />
                <StatCard
                    title="Volume Queue Length Promedio"
                    value={metrics.volumeQueueLength.avg}
                    peakValue={metrics.volumeQueueLength.peak}
                    unit=""
                    description="Promedio de operaciones en cola pendientes de completar."
                    icon={Layers}
                />
            </div>
        </div>
    );
};