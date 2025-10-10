"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Cpu, MemoryStick, HardDrive, Network, Dot, Info, Computer, Router } from "lucide-react";
import { format } from "date-fns";
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

    console.log(sortedData);
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
    return (
        <div className="space-y-4">
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
        </div>
    );
};