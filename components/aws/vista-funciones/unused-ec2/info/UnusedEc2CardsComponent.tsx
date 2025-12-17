'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, TrendingUp, Cpu, Network } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { UnusedEc2CardsData } from '@/interfaces/vista-unused-resources/unusedEc2InstanceInterfaces';

interface UnusedEc2CardsProps {
    data: UnusedEc2CardsData[];
    instanceCount: number;
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
                        <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-amber-600 font-medium bg-amber-50 p-1 rounded">
                            <TrendingUp className="w-3 h-3" />
                            <span>Peak en periodo: {peakValue} {unit}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export const UnusedEc2CardsComponent = ({ data, instanceCount }: UnusedEc2CardsProps) => {

    const metrics = useMemo(() => {
        if (!data) return { cpu: { avg: 0, peak: 0 }, net: { avg: 0, peak: 0 } };

        const cpuMetric = data.find((m) => m.metric_name.includes("CPUUtilization"));
        const netIn = data.find((m) => m.metric_name.includes("NetworkIn"));
        const netOut = data.find((m) => m.metric_name.includes("NetworkOut"));

        // Sumamos In+Out para una visión simplificada
        const netAvg = (netIn?.value || 0) + (netOut?.value || 0);
        const netPeak = (netIn?.peak_value || 0) + (netOut?.peak_value || 0);

        return {
            cpu: { avg: cpuMetric?.value || 0, peak: cpuMetric?.peak_value || 0 },
            net: { avg: netAvg, peak: netPeak }
        };
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Instancias Infrautilizadas"
                value={instanceCount}
                unit="Recursos"
                description="Total de instancias detectadas como Idle."
                icon={Server}
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
                title="I/O Red Promedio"
                value={bytesToMB(metrics.net.avg)}
                peakValue={bytesToMB(metrics.net.peak)}
                unit="MB"
                description="Tráfico promedio (In + Out) procesado."
                icon={Network}
            />
        </div>
    );
};