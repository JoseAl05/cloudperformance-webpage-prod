'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Cpu, Network, DollarSign, Computer, ShieldAlert, Zap } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { UnusedEc2CardsMetricSummary } from '@/interfaces/vista-unused-resources/unusedEc2InstanceInterfaces';

interface UnusedEc2CardsComponentProps {
    data: UnusedEc2CardsMetricSummary[] | null;
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

export const UnusedEc2CardsComponent = ({ data, instanceCount, totalUsdUnusedInstances }: UnusedEc2CardsComponentProps) => {

    const metrics = useMemo(() => {
        if (!data) return {
            cpu: { avg: 0, peak: 0 },
            statusCheckFailed: { avg: 0, peak: 0 },
            cpuCreditUsage: { avg: 0, peak: 0 },
            cpuCreditBalance: { avg: 0, peak: 0 },
            netIn: { avg: 0, peak: 0 },
            netOut: { avg: 0, peak: 0 }
        };

        const cpuMetric = data.find((m) => m.metric_name.includes("CPUUtilization"));
        const statusCheckFailed = data.find((m) => m.metric_name.includes("StatusCheckFailed"));
        const cpuCreditUsage = data.find((m) => m.metric_name.includes("CPUCreditUsage"));
        const cpuCreditBalance = data.find((m) => m.metric_name.includes("CPUCreditBalance"));
        const netIn = data.find((m) => m.metric_name.includes("NetworkIn"));
        const netOut = data.find((m) => m.metric_name.includes("NetworkOut"));

        return {
            cpu: { avg: cpuMetric?.value || 0, peak: cpuMetric?.peak_value || 0 },
            statusCheckFailed: { avg: statusCheckFailed?.value || 0, peak: statusCheckFailed?.peak_value || 0 },
            cpuCreditUsage: { avg: cpuCreditUsage?.value || 0, peak: cpuCreditUsage?.peak_value || 0 },
            cpuCreditBalance: { avg: cpuCreditBalance?.value || 0, peak: cpuCreditBalance?.peak_value || 0 },
            netIn: { avg: netIn?.value || 0, peak: netIn?.peak_value || 0 },
            netOut: { avg: netOut?.value || 0, peak: netOut?.peak_value || 0 }
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
                    title="Status Check Failed"
                    value={metrics.statusCheckFailed.avg}
                    peakValue={metrics.statusCheckFailed.peak}
                    unit=""
                    description="Promedio de verificaciones de estado fallidas en el periodo."
                    icon={ShieldAlert}
                />
                <StatCard
                    title="CPU Credit Usage Promedio"
                    value={metrics.cpuCreditUsage.avg}
                    peakValue={metrics.cpuCreditUsage.peak}
                    unit="Créditos"
                    description="Uso promedio de créditos de CPU en el periodo."
                    icon={Zap}
                />
                <StatCard
                    title="CPU Credit Balance Promedio"
                    value={metrics.cpuCreditBalance.avg}
                    peakValue={metrics.cpuCreditBalance.peak}
                    unit="Créditos"
                    description="Balance promedio de créditos de CPU acumulados."
                    icon={Zap}
                />
                <StatCard
                    title="Network In Promedio"
                    value={bytesToMB(metrics.netIn.avg)}
                    peakValue={bytesToMB(metrics.netIn.peak)}
                    unit="MB/s"
                    description="Tráfico de red entrante promedio procesado."
                    icon={Network}
                />
                <StatCard
                    title="Network Out Promedio"
                    value={bytesToMB(metrics.netOut.avg)}
                    peakValue={bytesToMB(metrics.netOut.peak)}
                    unit="MB/s"
                    description="Tráfico de red saliente promedio procesado."
                    icon={Network}
                />
            </div>
        </div>
    );
};