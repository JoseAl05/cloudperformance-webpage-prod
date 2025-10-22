import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConsumeViewRdsPgCpuMetrics, ConsumeViewRdsPgDbConnectionsMetrics, RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import { ChevronDown, ChevronUp, Cpu, Database, List, Minus, MonitorX, Zap } from 'lucide-react';
import { RdsConsumeViewStoppedInstancesHistoricComponent } from '@/components/aws/vista-consumos/rds/info/RdsConsumeViewStoppedInstancesHistoricComponent';

interface RdsInfoConsumeViewCardsComponentProps {
    infoData: RdsConsumeViewInstance[] | null;
    cpuData: ConsumeViewRdsPgCpuMetrics[] | null;
    dbConnectionsData: ConsumeViewRdsPgDbConnectionsMetrics[] | null;
    creditsGlobalEfficiencyData: unknown;
}

const CPU_LOW_THRESHOLD = 20;
const CPU_HIGH_THRESHOLD = 80;

const getUsageStatus = (type: 'cpu', value: number) => {
    if (type === 'cpu') {
        if (value < CPU_LOW_THRESHOLD) {
            return { message: 'Bajo uso de CPU', icon: ChevronDown, style: 'text-xs text-red-600 font-bold pt-2', border: 'border-l-red-500' };
        } else if (value > CPU_HIGH_THRESHOLD) {
            return { message: 'Alto uso de CPU', icon: ChevronUp, style: 'text-xs text-green-600 font-bold pt-2', border: 'border-l-green-500' };
        }
        return { message: 'Uso de CPU normal', icon: Minus, style: 'text-xs text-gray-500 font-bold pt-2', border: 'border-l-yellow-500' };
    }
    return null;
};

const getCreditsEfficiencyBorder = (efficiency: string) => {
    switch (efficiency) {
        case 'Sin Datos': return 'border-l-gray-500';
        case 'Infrautilización General': return 'border-l-red-500';
        case 'Uso Bajo en General': return 'border-l-yellow-500';
        case 'Uso Razonable': return 'border-l-green-500';
        case 'Uso Alto': return 'border-l-blue-500';
        case 'Posible Sobrecarga': return 'border-l-purple-500';
        default: return 'border-l-gray-500';
    }
};

export const RdsInfoConsumeViewCardsComponent = ({ infoData, cpuData, dbConnectionsData, creditsGlobalEfficiencyData }: RdsInfoConsumeViewCardsComponentProps) => {
    const noInfo = !infoData || infoData.length === 0;
    const noCpu = !cpuData || cpuData.length === 0;

    if (noInfo) {
        return <div className="text-center text-gray-500 py-6">No hay información para mostrar.</div>;
    }
    const sortedMetrics = (cpuData ? [...cpuData] : [])
        .sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());

    const latestCpuSync = sortedMetrics[0]?.sync_time;
    const latestInfoSync = (() => {
        const latestByInstance = new Map<string, Ec2ConsumneViewInstance>();
        (infoData || []).forEach(inst => {
            const existing = latestByInstance.get(inst.resource);
            const currentTime = new Date(inst.db_sync_time).getTime();
            if (!existing || currentTime > new Date(existing.db_sync_time).getTime()) {
                latestByInstance.set(inst.resource, inst);
            }
        });
        const latest = Array.from(latestByInstance.values())
            .sort((a, b) => new Date(b.db_sync_time).getTime() - new Date(a.db_sync_time).getTime())[0];
        return latest?.db_sync_time;
    })();

    const referenceDate = latestCpuSync ? new Date(latestCpuSync) : (latestInfoSync ? new Date(latestInfoSync) : new Date());
    const today = new Date();
    const isToday = referenceDate.getDate() === today.getDate()
        && referenceDate.getMonth() === today.getMonth()
        && referenceDate.getFullYear() === today.getFullYear();
    const dateLabel = referenceDate.toLocaleDateString();

    const averageCpu = sortedMetrics.length > 0
        ? sortedMetrics.reduce((sum, m) => sum + (m.average_cpu_metric_value ?? 0), 0) / sortedMetrics.length
        : 0;

    const cpuStatus = !noCpu ? getUsageStatus('cpu', averageCpu) : null;

    const averageCredits = (() => {
        const uniqueInstancesMap = new Map<string, Ec2ConsumneViewInstance>();
        (infoData || []).forEach(inst => {
            if (!uniqueInstancesMap.has(inst.resource)) uniqueInstancesMap.set(inst.resource, inst);
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
        if (percent === 0) return { message: 'Sin datos de créditos', icon: Minus, style: 'text-xs text-gray-400 font-bold pt-2', border: 'border-l-gray-500' };
        if (percent < 50) return { message: 'Créditos disponibles bajos', icon: ChevronDown, style: 'text-xs text-green-600 font-bold pt-2', border: 'border-l-red-500' };
        if (percent < 80) return { message: 'Créditos disponibles moderados', icon: Minus, style: 'text-xs text-gray-500 font-bold pt-2', border: 'border-l-yellow-500' };
        return { message: 'Créditos disponibles altos', icon: ChevronUp, style: 'text-xs text-green-600 font-bold pt-2', border: 'border-l-green-500' };
    };

    const getUsageStatusCredits = (percent: number) => {
        if (percent === 0) return { message: 'Sin créditos disponibles', icon: Minus, style: 'text-xs text-gray-400 font-bold pt-2', border: 'border-l-gray-500' };
        if (percent > 50) return { message: 'Uso alto de créditos', icon: ChevronUp, style: 'text-xs text-green-600 font-bold pt-2', border: 'border-l-green-500' };
        if (percent > 20) return { message: 'Uso moderado de créditos', icon: Minus, style: 'text-xs text-gray-500 font-bold pt-2', border: 'border-l-yellow-500' };
        return { message: 'Uso bajo de créditos', icon: ChevronDown, style: 'text-xs text-red-600 font-bold pt-2', border: 'border-l-red-500' };
    };

    const balanceStatus = getBalanceStatus(balancePercent);
    const usageStatus = getUsageStatusCredits(usagePercent);

    const uniqueInstances = new Set((infoData || []).map(inst => inst.resource)).size;

    const instanceStatusMap = new Map<string, string>();
    (infoData || []).forEach(inst => instanceStatusMap.set(inst.resource, inst.resource_status || ''));

    const countRunningInstances = (infoData || []).filter(inst => (inst.resource_status || '').toLowerCase() === 'available').length;
    const countStoppedInstances = (infoData || []).filter(inst => (inst.resource_status || '').toLowerCase() === 'stopped').length;
    const stoppedInstances = (infoData || []).filter(inst => (inst.resource_status || '').toLowerCase() === 'stopped');
    const hasStopped = stoppedInstances.length > 0;

    const latestByInstance = new Map<string, Ec2ConsumneViewInstance>();
    (infoData || []).forEach(inst => {
        const existing = latestByInstance.get(inst.resource);
        const currentTime = new Date(inst.db_sync_time).getTime();
        if (!existing || currentTime > new Date(existing.db_sync_time).getTime()) {
            latestByInstance.set(inst.resource, inst);
        }
    });

    const efficiencyValue = (creditsGlobalEfficiencyData as unknown)?.global_efficiency ?? 'Sin Datos';

    const instanceData = [
        {
            title: 'Promedio Uso de CPU',
            value: !noCpu ? `${averageCpu.toFixed(2)} %` : 'Sin Datos',
            icon: Cpu,
            borderColor: cpuStatus?.border ?? 'border-l-gray-500',
            subtitle: (isToday ? 'Actual' : dateLabel),
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: !noCpu ? cpuStatus?.message : undefined,
            usageIcon: !noCpu ? cpuStatus?.icon : undefined,
            usageStyle: !noCpu ? cpuStatus?.style : undefined,
        },
        {
            title: 'Cantidad de Instancias',
            value: uniqueInstances,
            icon: Database,
            borderColor: 'border-l-cyan-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight'
        },
        // {
        //     title: 'Cantidad de Instancias Encendidas',
        //     value: countRunningInstances,
        //     icon: MonitorCheck,
        //     borderColor: 'border-l-green-500',
        //     subtitle: isToday ? 'Actual' : dateLabel,
        //     valueStyle: 'text-xl font-bold text-foreground tracking-tight'
        // },
        {
            title: 'Historial de Instancias Apagadas',
            // value: countStoppedInstances,
            icon: MonitorX,
            borderColor: 'border-l-red-500',
            subtitle: isToday ? 'Actual' : dateLabel,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            dialog: !!stoppedInstances.length,
            dialogLabel: 'Ver instancias "stopped"',
            dialogTitle: 'Instancias stopped en periodo seleccionado.',
            dialogContentComponent: <RdsConsumeViewStoppedInstancesHistoricComponent instanceInfo={stoppedInstances} />
        }
    ];

    const globalCreditsEfficiency = [
        {
            title: 'Eficiencia de créditos',
            value: efficiencyValue,
            icon: Zap,
            borderColor: getCreditsEfficiencyBorder(efficiencyValue),
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
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {globalCreditsEfficiency.map((eff, index) => {
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
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                    {
                                        instance.value && (
                                            <>
                                                <p className={instance.valueStyle}>
                                                    {typeof (instance as unknown).format === 'function' ? (instance as unknown).format(instance.value) : instance.value}
                                                </p>
                                                {instance.usage && (
                                                    <span className={instance.usageStyle}>
                                                        {UsageIconComponent && <UsageIconComponent className="h-4 w-4 inline-block mr-1" />}
                                                        {instance.usage}
                                                    </span>
                                                )}
                                            </>
                                        )
                                    }
                                    {instance.title === 'Historial de Instancias Apagadas' && (
                                        hasStopped ? (
                                            <Dialog className="gap-2 justify-center">
                                                <DialogTrigger className="flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110">
                                                    <List className="h-4 w-4 text-blue-500" />
                                                    {instance.dialogLabel ?? 'Ver instancias "stopped"'}
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] sm:max-w-4xl">
                                                    <DialogHeader>
                                                        <DialogTitle>{instance.dialogTitle ?? 'Instancias stopped en periodo seleccionado.'}</DialogTitle>
                                                        <DialogDescription>Información histórica</DialogDescription>
                                                    </DialogHeader>
                                                    <RdsConsumeViewStoppedInstancesHistoricComponent instanceInfo={stoppedInstances} />
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-medium">
                                                No se encontraron instancias apagadas en el periodo seleccionado.
                                            </p>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}