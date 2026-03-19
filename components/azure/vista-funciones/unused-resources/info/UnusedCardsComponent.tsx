"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, MemoryStick, HardDrive, Computer, Router, DollarSign } from "lucide-react";
import { UnusedVm, UnusedVmInterfaceDataIpConfig } from '@/interfaces/vista-unused-resources/unusedVmInterfaces';
import { UnusedVmss } from '@/interfaces/vista-unused-resources/unusedVmssInterface';

interface UnusedCardsComponentProps {
    data: UnusedVm[] | UnusedVmss[];
    type: 'vm' | 'vmss';
}

const groupVms = (data: UnusedVm[]) => {
    const groupByVmId = new Map<string, UnusedVm>();
    for (const vm of data) {
        const prev = groupByVmId.get(vm.vm_id);
        if (!prev || new Date(vm.sync_time) > new Date(prev.sync_time)) {
            groupByVmId.set(vm.vm_id, vm);
        }
    }
    return groupByVmId;
};

const sumLatestDisksGb = (
    disk_details?: Array<{
        sync_time: string;
        disks?: Array<{ id?: string; name?: string; disk_size_gb?: number }>;
    }>
): number => {
    if (!disk_details || disk_details.length === 0) return 0;

    const latest = disk_details.reduce((acc, cur) =>
        new Date(cur.sync_time) > new Date(acc.sync_time) ? cur : acc
    );

    const seen = new Set<string>();
    let total = 0;

    for (const d of latest.disks ?? []) {
        if (!d) continue;
        const size = typeof d.disk_size_gb === "number" ? d.disk_size_gb : 0;
        const key = d.id ?? d.name ?? "";
        if (key) {
            if (seen.has(key)) continue;
            seen.add(key);
        }
        total += size;
    }
    return total;
}

const sumLatestPublicIps = (
    interface_details?: Array<{
        sync_time: string;
        interfaces?: Array<{ id?: string; name?: string; ip_configurations?: UnusedVmInterfaceDataIpConfig[] }>;
    }>
): number => {
    if (!interface_details || interface_details.length === 0) return 0;

    const latest = interface_details.reduce((acc, cur) =>
        new Date(cur.sync_time) > new Date(acc.sync_time) ? cur : acc
    );

    const seen = new Set<string>();
    let total = 0;

    for (const d of latest.interfaces ?? []) {
        if (!d) continue;
        let publicIpCount = 0;
        for (const ips of d.ip_configurations ?? []) {
            if (!ips) continue;
            if (ips.public_ip_address) {
                publicIpCount++
            }
        }
        const key = d.id ?? d.name ?? "";
        if (key) {
            if (seen.has(key)) continue;
            seen.add(key);
        }
        total += publicIpCount;
    }
    return total;
}

export const UnusedCardsComponent: React.FC<UnusedCardsComponentProps> = ({
    data,
    type
}) => {

    const groupedData = useMemo(() => groupVms(data), [data]);
    const sortedData = (data ? [...data] : [])
        .sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());

    const latestData = sortedData[0]?.sync_time;
    const referenceDate = latestData ? new Date(latestData) : new Date();
    const today = new Date();
    const isToday = referenceDate.getDate() === today.getDate()
        && referenceDate.getMonth() === today.getMonth()
        && referenceDate.getFullYear() === today.getFullYear();
    const dateLabel = referenceDate.toLocaleDateString();

    const { totalVMs, totalCPU, totalMem, totalDiskGb, totalPublicIps } = useMemo(() => {
        let totalCPU = 0;
        let totalMem = 0;
        let totalDiskGb = 0;
        let totalPublicIps = 0;

        for (const vm of groupedData.values()) {
            totalCPU += vm.cpu_total ?? 0;
            totalMem += vm.memory_total ?? 0;
            totalDiskGb += sumLatestDisksGb(vm.disk_details);
            totalPublicIps += sumLatestPublicIps(vm.interface_details);
        }

        return {
            totalVMs: groupedData.size,
            totalCPU,
            totalMem,
            totalDiskGb,
            totalPublicIps
        };
    }, [groupedData]);

    // --- NUEVO: métricas FinOps calculadas desde series ---
    const finopsMetrics = useMemo(() => {
        let cpuValues: number[] = [];
        let cpuMaxValues: number[] = [];
        let cpuMinValues: number[] = [];
        let memValues: number[] = [];
        let memMaxValues: number[] = [];
        let memMinValues: number[] = [];
        let costoTotal = 0;

        for (const vm of groupedData.values()) {
            // Costo estimado por VM
            costoTotal += vm.costo_estimado_usd ?? 0;

            // Iterar series para CPU y Memoria
            for (const s of vm.series ?? []) {
                if (s.name === 'Percentage CPU') {
                    cpuValues.push(s.metric_value);
                    if (s.metric_value_maximum != null) cpuMaxValues.push(s.metric_value_maximum);
                    if (s.metric_value_minimum != null) cpuMinValues.push(s.metric_value_minimum);
                }
                if (s.name === 'Available Memory') {
                    const BYTES_TO_GB = 1_073_741_824;
                    memValues.push(s.metric_value / BYTES_TO_GB);
                    if (s.metric_value_maximum != null) memMaxValues.push(s.metric_value_maximum / BYTES_TO_GB);
                    if (s.metric_value_minimum != null) memMinValues.push(s.metric_value_minimum / BYTES_TO_GB);
                }
            }
        }

        const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        const max = (arr: number[]) => arr.length ? Math.max(...arr) : 0;
        const min = (arr: number[]) => arr.length ? Math.min(...arr) : 0;

        return {
            cpuPromedio: avg(cpuValues),
            cpuMax: max(cpuMaxValues),
            cpuMin: min(cpuMinValues),
            memPromedio: avg(memValues),
            memMax: max(memMaxValues),
            memMin: min(memMinValues),
            costoTotal,
        };
    }, [groupedData]);

    const totalCardTitle = type === 'vm' ? 'Cantidad VMs Infrautilizadas' : type === 'vmss' ? 'Cantidad VMSS Infrautilizadas' : '';
    const diskTitle = type === 'vm' ? 'Cantidad Disco' : type === 'vmss' ? 'Cantidad Disco del Sistema Operativo' : '';

    const totalVmCard = [
        {
            title: totalCardTitle,
            value: totalVMs ? totalVMs : 'Sin Datos',
            icon: Computer,
            borderColor: 'border-l-blue-500',
            subtitle: (isToday ? 'Actual' : dateLabel),
            valueStyle: 'text-3xl font-bold text-foreground tracking-tight'
        }
    ]
    const vmComponentsCard = [
        {
            title: 'Cantidad CPUs',
            value: totalCPU ? `${totalCPU} vCores` : 'Sin Datos',
            icon: Cpu,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-semibold text-foreground tracking-tight'
        },
        {
            title: 'Cantidad Memoria',
            value: totalMem ? `${totalMem} GB` : 'Sin Datos',
            icon: MemoryStick,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-semibold text-foreground tracking-tight'
        },
        {
            title: diskTitle,
            value: totalDiskGb ? `${totalDiskGb} GB` : 'Sin Datos',
            icon: HardDrive,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-semibold text-foreground tracking-tight'
        },
        {
            title: 'Cantidad Ips Públicas',
            value: totalPublicIps ? `${totalPublicIps} Ips Públicas` : 'Sin Datos',
            icon: Router,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-semibold text-foreground tracking-tight'
        },
    ];

    // --- NUEVO: tarjetas FinOps ---
    return (
        <div className="space-y-4">
            {/* Fila 1 — total VMs (sin cambios) */}
            <div className='grid grid-cols-1 gap-4'>
                {
                    totalVmCard.map((vm, index) => {
                        const IconComponent = vm.icon;
                        return (
                            <Card key={index} className={`${vm.borderColor} border-l-4 group`}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">{vm.subtitle}</p>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mt-2">{vm.title}</h3>
                                    <div className="mt-auto">
                                        {
                                            vm.value && (
                                                <>
                                                    <p className={vm.valueStyle}>
                                                        {typeof (vm as unknown).format === 'function' ? (vm as unknown).format(vm.value) : vm.value}
                                                    </p>
                                                </>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>

            {/* Fila 2 — inventario (sin cambios) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {
                    vmComponentsCard.map((vm, index) => {
                        const IconComponent = vm.icon;
                        return (
                            <Card key={index} className={`${vm.borderColor} border-l-4 group`}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">{vm.subtitle}</p>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mt-2">{vm.title}</h3>
                                    <div className="mt-auto">
                                        {
                                            vm.value && (
                                                <>
                                                    <p className={vm.valueStyle}>
                                                        {typeof (vm as unknown).format === 'function' ? (vm as unknown).format(vm.value) : vm.value}
                                                    </p>
                                                </>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>

            {/* Fila 3 — NUEVA: tarjetas FinOps consolidadas (promedio + max/min) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* CPU */}
                <Card className="border-l-4 border-l-orange-500 group">
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 transition-colors duration-200 group-hover:scale-110">
                                <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mt-2">CPU Promedio Global</h3>
                        <div className="mt-auto">
                            <p className="text-xl font-semibold text-orange-600 dark:text-orange-400 tracking-tight">
                                {finopsMetrics.cpuPromedio.toFixed(2)} %
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Máx: {finopsMetrics.cpuMax.toFixed(2)}% · Mín: {finopsMetrics.cpuMin.toFixed(2)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Memoria */}
                <Card className="border-l-4 border-l-purple-500 group">
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 transition-colors duration-200 group-hover:scale-110">
                                <MemoryStick className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mt-2">Memoria Promedio Global</h3>
                        <div className="mt-auto">
                            <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 tracking-tight">
                                {finopsMetrics.memPromedio.toFixed(2)} GB
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Máx: {finopsMetrics.memMax.toFixed(2)} GB · Mín: {finopsMetrics.memMin.toFixed(2)} GB
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Costo Estimado */}
                <Card className="border-l-4 border-l-green-500 group">
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20 transition-colors duration-200 group-hover:scale-110">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mt-2">Costo Estimado Total</h3>
                        <div className="mt-auto">
                            <p className="text-xl font-semibold text-green-600 dark:text-green-400 tracking-tight">
                                $ {finopsMetrics.costoTotal.toFixed(4)} USD
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Costo estimado de VMs infrautilizadas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};