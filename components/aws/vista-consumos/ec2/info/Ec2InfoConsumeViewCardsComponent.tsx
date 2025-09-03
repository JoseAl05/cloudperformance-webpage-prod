import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, Computer, Cpu, HardDrive, List, Minus, MonitorCheck, MonitorX, Network, Zap } from 'lucide-react';
import { Ec2ConsumeViewAttachedDiskHistoricComponent } from './Ec2ConsumeViewAttachedDiskHistoricComponent';
import { Ec2ConsumeViewStoppedInstancesHistoricComponent } from './Ec2ConsumeViewStoppedInstancesHistoricComponent';
import { Ec2ConsumeViewInUseInterfacesHistoricComponent } from './Ec2ConsumeViewInUseInterfacesHistoricComponent';

interface Ec2InfoConsumeViewCardsComponentProps {
    infoData: Ec2ConsumneViewInstance[] | null;
    cpuData: ConsumeViewEc2CpuMetrics[] | null;
    creditsGlobalEfficiencyData: unknown
}

const CPU_LOW_THRESHOLD = 20;
const CPU_HIGH_THRESHOLD = 80;

const getUsageStatus = (type: 'cpu', value: number) => {
    if (type === 'cpu') {
        if (value < CPU_LOW_THRESHOLD) {
            return {
                message: 'Bajo uso de CPU',
                icon: ChevronDown,
                style: 'text-xs text-red-600 font-bold pt-2',
                border: 'border-l-red-500'
            };
        } else if (value > CPU_HIGH_THRESHOLD) {
            return {
                message: 'Alto uso de CPU',
                icon: ChevronUp,
                style: 'text-xs text-green-600 font-bold pt-2',
                border: 'border-l-green-500'
            };
        }
        return {
            message: 'Uso de CPU normal',
            icon: Minus,
            style: 'text-xs text-gray-500 font-bold pt-2',
            border: 'border-l-yellow-500'
        };
    }
    return null;
};

const getCreditsEfficiencyBorder = (efficiency: string) => {
    switch (efficiency) {
        case 'Sin Datos':
            return 'border-l-gray-500';
        case 'Infrautilización General':
            return 'border-l-red-500';
        case 'Uso Bajo en General':
            return 'border-l-yellow-500';
        case 'Uso Razonable':
            return 'border-l-green-500';
        case 'Uso Alto':
            return 'border-l-blue-500';
        case 'Posible Sobrecarga':
            return 'border-l-purple-500';
        default:
            return 'border-l-gray-500';
    }
};

export const Ec2InfoConsumeViewCardsComponent = ({ infoData, cpuData, creditsGlobalEfficiencyData }: Ec2InfoConsumeViewCardsComponentProps) => {
    const sortedMetrics = [...cpuData].sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());
    const today = new Date();
    const latestMetric = sortedMetrics[0];
    const referenceDate = new Date(latestMetric.sync_time);
    const isToday =
        referenceDate.getDate() === today.getDate() &&
        referenceDate.getMonth() === today.getMonth() &&
        referenceDate.getFullYear() === today.getFullYear();
    const dateLabel = referenceDate.toLocaleDateString();

    const averageCpu = sortedMetrics.length > 0 ? sortedMetrics.reduce((sum, m) => sum + m.average_cpu_metric_value, 0) / sortedMetrics.length : 0;
    const cpuStatus = getUsageStatus('cpu', averageCpu);

    const averageCredits = (() => {
        if (!infoData || infoData.length === 0) return { balance: 0, usage: 0 };

        const uniqueInstancesMap = new Map<string, Ec2ConsumneViewInstance>();
        infoData.forEach(inst => {
            if (!uniqueInstancesMap.has(inst.resource)) {
                uniqueInstancesMap.set(inst.resource, inst);
            }
        });

        const uniqueInstances = Array.from(uniqueInstancesMap.values());

        const totalBalance = uniqueInstances.reduce((sum, inst) => sum + (inst.last_cpu_credits_balance || 0), 0);
        const totalUsage = uniqueInstances.reduce((sum, inst) => sum + (inst.last_cpu_credits_usage || 0), 0);

        return {
            balance: uniqueInstances.length ? totalBalance / uniqueInstances.length : 0,
            usage: uniqueInstances.length ? totalUsage / uniqueInstances.length : 0
        };
    })();
    const totalCredits = averageCredits.balance + averageCredits.usage;
    const balancePercent = totalCredits > 0 ? (averageCredits.balance / totalCredits) * 100 : 0;
    const usagePercent = totalCredits > 0 ? (averageCredits.usage / totalCredits) * 100 : 0;

    const getBalanceStatus = (percent: number) => {
        if (percent < 50) {
            return {
                message: 'Créditos disponibles bajos',
                icon: ChevronDown,
                style: 'text-xs text-green-600 font-bold pt-2',
                border: 'border-l-red-500'
            };
        } else if (percent < 80) {
            return {
                message: 'Créditos disponibles moderados',
                icon: Minus,
                style: 'text-xs text-gray-500 font-bold pt-2',
                border: 'border-l-yellow-500'
            };
        }
        return {
            message: 'Créditos disponibles altos',
            icon: ChevronUp,
            style: 'text-xs text-green-600 font-bold pt-2',
            border: 'border-l-green-500'
        };
    };

    const getUsageStatusCredits = (percent: number) => {
        if (percent > 50) {
            return {
                message: 'Uso alto de créditos',
                icon: ChevronUp,
                style: 'text-xs text-green-600 font-bold pt-2',
                border: 'border-l-green-500'
            };
        } else if (percent > 20) {
            return {
                message: 'Uso moderado de créditos',
                icon: Minus,
                style: 'text-xs text-gray-500 font-bold pt-2',
                border: 'border-l-yellow-500'
            };
        }
        return {
            message: 'Uso bajo de créditos',
            icon: ChevronDown,
            style: 'text-xs text-red-600 font-bold pt-2',
            border: 'border-l-red-500'
        };
    };

    const balanceStatus = getBalanceStatus(balancePercent);
    const usageStatus = getUsageStatusCredits(usagePercent);

    const uniqueInstances = infoData ? new Set(infoData.map(inst => inst.resource)).size : 0;

    const instanceStatusMap = new Map<string, string>();
    if (infoData) {
        infoData.forEach(inst => {
            instanceStatusMap.set(inst.resource, inst.resource_status);
        });
    }

    const countRunningInstances = Array.from(instanceStatusMap.values()).filter(status => status.toLowerCase() === 'running').length;
    const countStoppedInstances = Array.from(instanceStatusMap.values()).filter(status => status.toLowerCase() === 'stopped').length;
    const stoppedInstances = Array.from(infoData.values()).filter(inst => inst.resource_status.toLowerCase() === 'stopped');

    const totalAttachedDisks = (() => {
        if (!infoData || infoData.length === 0) return 0;
        const latestInstances = new Map<string, Ec2ConsumneViewInstance>();

        infoData.forEach(inst => {
            const existing = latestInstances.get(inst.resource);
            const currentTime = new Date(inst.instance_sync_time).getTime();

            if (!existing || currentTime > new Date(existing.instance_sync_time).getTime()) {
                latestInstances.set(inst.resource, inst);
            }
        });
        return Array.from(latestInstances.values()).reduce(
            (sum, inst) => sum + (inst.devices_attached_count || 0),
            0
        );
    })();

    const totalInterfacesInUse = (() => {
        if (!infoData || infoData.length === 0) return 0;
        const latestInstances = new Map<string, Ec2ConsumneViewInstance>();

        infoData.forEach(inst => {
            const existing = latestInstances.get(inst.resource);
            const currentTime = new Date(inst.instance_sync_time).getTime();

            if (!existing || currentTime > new Date(existing.instance_sync_time).getTime()) {
                latestInstances.set(inst.resource, inst);
            }
        });
        return Array.from(latestInstances.values()).reduce(
            (sum, inst) => sum + (inst.interfaces_inuse_count || 0),
            0
        );
    })();

    const instanceData = [
        {
            title: 'Promedio Uso de CPU',
            value: `${averageCpu.toFixed(2)} %`,
            icon: Cpu,
            borderColor: cpuStatus?.border || 'border-l-blue-500', // aquí usamos el borde dinámico
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: cpuStatus?.message,
            usageIcon: cpuStatus?.icon,
            usageStyle: cpuStatus?.style,
        },
        {
            title: 'Cantidad de Instancias',
            value: uniqueInstances,
            icon: Computer,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight'
        },
        {
            title: 'Cantidad de Instancias Encendidas',
            value: countRunningInstances,
            icon: MonitorCheck,
            borderColor: 'border-l-green-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight'
        },
        {
            title: 'Cantidad de Instancias Apagadas',
            value: countStoppedInstances,
            icon: MonitorX,
            borderColor: 'border-l-red-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            dialog: true,
            dialogLabel: 'Ver instancias "stopped"',
            dialogTitle: 'Instancias stopped en periodo seleccionado.',
            dialogContentComponent: <Ec2ConsumeViewStoppedInstancesHistoricComponent
                instanceInfo={stoppedInstances ? stoppedInstances : []}
            />
        }
    ];
    const globalCreditsEfficiencyData = [
        {
            title: 'Eficiencia de créditos',
            value: creditsGlobalEfficiencyData ? creditsGlobalEfficiencyData.global_efficiency : "",
            icon: Zap,
            borderColor: creditsGlobalEfficiencyData
                ? getCreditsEfficiencyBorder(creditsGlobalEfficiencyData.global_efficiency)
                : 'border-l-gray-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-4xl text-center font-bold text-foreground tracking-tight'
        },
    ];

    const creditsCardsData = [
        {
            title: 'Promedio Créditos Disponibles',
            value: `${averageCredits.balance.toFixed(2)}`,
            icon: Zap,
            borderColor: balanceStatus.border,
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: balanceStatus.message,
            usageIcon: balanceStatus.icon,
            usageStyle: balanceStatus.style
        },
        {
            title: 'Promedio Créditos Usados',
            value: `${averageCredits.usage.toFixed(2)}`,
            icon: Zap,
            borderColor: usageStatus.border,
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: usageStatus.message,
            usageIcon: usageStatus.icon,
            usageStyle: usageStatus.style
        }
    ];

    const instanceComponentsData = [
        {
            title: 'Cantidad de discos Attachados',
            value: totalAttachedDisks,
            icon: HardDrive,
            borderColor: 'border-l-orange-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            dialog: true,
            dialogLabel: 'Ver discos attachados',
            dialogTitle: 'Discos attachados en periodo seleccionado.',
            dialogContentComponent: <Ec2ConsumeViewAttachedDiskHistoricComponent
                instanceInfo={infoData ? infoData : []}
            />
        },
        {
            title: 'Cantidad de interfaces en uso',
            value: totalInterfacesInUse,
            icon: Network,
            borderColor: 'border-l-orange-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            dialog: true,
            dialogLabel: 'Ver interfaces en uso',
            dialogTitle: 'Interfaces en uso en periodo seleccionado.',
            dialogContentComponent: <Ec2ConsumeViewInUseInterfacesHistoricComponent
                instanceInfo={infoData ? infoData : []}
            />
        },
    ];
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {
                    globalCreditsEfficiencyData.map((eff, index) => {
                        const IconComponent = eff.icon;
                        return (
                            <Card key={index} className={`${eff.borderColor} border-l-4 group`}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">{eff.subtitle}</p>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mt-2">{eff.title}</h3>
                                    <div className="mt-auto">
                                        <p className={eff.valueStyle}>{eff.value}</p>
                                        {
                                            eff.dialog && (
                                                <Dialog
                                                    key={index}
                                                    className='gap-2 justify-center'
                                                >
                                                    <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                        <List className={`h-4 w-4 text-blue-500`} />
                                                        {eff.dialogLabel}
                                                    </DialogTrigger>
                                                    <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                        <DialogHeader>
                                                            <DialogTitle>{eff.dialogTitle}</DialogTitle>
                                                            <DialogDescription>Información historica</DialogDescription>
                                                        </DialogHeader>
                                                        {eff.dialogContentComponent}
                                                    </DialogContent>
                                                </Dialog>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                }
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
                {creditsCardsData.map((credit, index) => {
                    const IconComponent = credit.icon;
                    const UsageIconComponent = credit.usageIcon || null;
                    return (
                        <Card key={index} className={`${credit.borderColor} border-l-4 group`}>
                            <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                        <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{credit.subtitle}</p>
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground mt-2">{credit.title}</h3>
                                <div className="mt-auto">
                                    <p className={credit.valueStyle}>{credit.value}</p>
                                    {credit.usage && (
                                        <span className={credit.usageStyle}>
                                            {UsageIconComponent && <UsageIconComponent className="h-4 w-4 inline-block mr-1" />}
                                            {credit.usage}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
                {instanceData.map((instance, index) => {
                    const IconComponent = instance.icon;
                    const UsageIconComponent = instance.usageIcon || null;
                    return (
                        <Card key={index} className={`${instance.borderColor} border-l-4 group`}>
                            <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                        <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{instance.subtitle}</p>
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground mt-2">{instance.title}</h3>
                                <div className="mt-auto">
                                    <p className={instance.valueStyle}>{typeof instance.format === 'function' ? instance.format(instance.value) : instance.value}</p>
                                    {instance.usage && (
                                        <span className={instance.usageStyle}>
                                            {UsageIconComponent && <UsageIconComponent className="h-4 w-4 inline-block mr-1" />}
                                            {instance.usage}
                                        </span>
                                    )}
                                    {
                                        instance.dialog && (
                                            <Dialog
                                                key={index}
                                                className='gap-2 justify-center'
                                            >
                                                <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                    <List className={`h-4 w-4 text-blue-500`} />
                                                    {instance.dialogLabel}
                                                </DialogTrigger>
                                                <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                    <DialogHeader>
                                                        <DialogTitle>{instance.dialogTitle}</DialogTitle>
                                                        <DialogDescription>Información historica</DialogDescription>
                                                    </DialogHeader>
                                                    {instance.dialogContentComponent}
                                                </DialogContent>
                                            </Dialog>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
                {
                    instanceComponentsData.map((instanceComponent, index) => {
                        const IconComponent = instanceComponent.icon;
                        return (
                            <Card key={index} className={`${instanceComponent.borderColor} border-l-4 group`}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">{instanceComponent.subtitle}</p>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mt-2">{instanceComponent.title}</h3>
                                    <div className="mt-auto">
                                        <p className={instanceComponent.valueStyle}>{typeof instanceComponent.format === 'function' ? instanceComponent.format(instanceComponent.value) : instanceComponent.value}</p>
                                        {instanceComponent.usage && (
                                            <span className={instanceComponent.usageStyle}>
                                                {instanceComponent.usage}
                                            </span>
                                        )}
                                        {
                                            instanceComponent.dialog && (
                                                <Dialog
                                                    key={index}
                                                    className='gap-2 justify-center'
                                                >
                                                    <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                        <List className={`h-4 w-4 text-blue-500`} />
                                                        {instanceComponent.dialogLabel}
                                                    </DialogTrigger>
                                                    <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                        <DialogHeader>
                                                            <DialogTitle>{instanceComponent.dialogTitle}</DialogTitle>
                                                            <DialogDescription>Información historica</DialogDescription>
                                                        </DialogHeader>
                                                        {instanceComponent.dialogContentComponent}
                                                    </DialogContent>
                                                </Dialog>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                }
            </div>
        </div>
    )
}