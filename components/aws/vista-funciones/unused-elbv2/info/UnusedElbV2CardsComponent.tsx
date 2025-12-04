'use client'

import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Activity,
    LucideIcon,
    Server,
    Clock,
    CheckCircle2,
    Eye,
    Layers,
    Network,
    Zap,
    ArrowRightLeft,
    Waves,
    RefreshCw,
    FileText,
    Stethoscope,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnusedElbV2, UnusedElbV2Details } from '@/interfaces/vista-unused-resources/unusedElbV2Interfaces';

interface UnusedElbV2CardsComponentProps {
    data: UnusedElbV2[];
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    dateLabel?: string;
    onViewList?: () => void;
    isText?: boolean;
}

const formatMetric = (value: number) => {
    if (value === 0) return "0";
    const absValue = Math.abs(value);
    if (absValue >= 1) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }
    if (absValue < 0.000001) {
        return value.toExponential(2);
    }
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(value);
};

const getDnsFromHistory = (detail: UnusedElbV2Details) => {
    if (!detail.history || detail.history.length === 0) return 'Sin DNS';
    const sorted = [...detail.history].sort((a, b) =>
        new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
    );
    return sorted[0].DNSName;
};

const ResourceListDialog = ({ isOpen, onClose, title, resources }: { isOpen: boolean; onClose: () => void; title: string; resources: UnusedElbV2Details[] }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Server className="h-5 w-5 text-slate-500" />
                        {title}
                        <Badge variant="secondary" className="ml-2">{resources.length}</Badge>
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4 pt-4">
                    <div className="space-y-3">
                        {resources.map((res, index) => {
                            const name = getDnsFromHistory(res) || res.elb_arn || `ELB-${index}`;
                            return (
                                <div key={res.elb_arn || index} className="p-3 border rounded-md text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex justify-between items-center group">
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-medium truncate w-60" title={name}>{name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 flex gap-2 items-center">
                                            <Badge variant="outline" className="text-[9px] h-4 px-1">{res.elb_type}</Badge>
                                            <span>{res.region}</span>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Inactivo</Badge>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

const getVariantStyles = (variant: CardVariant) => {
    switch (variant) {
        case 'destructive': return { border: 'border-l-red-500', bgIcon: 'bg-red-100 dark:bg-red-900/30', textIcon: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 text-red-700 border-red-200' };
        case 'success': return { border: 'border-l-emerald-500', bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30', textIcon: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
        case 'warning': return { border: 'border-l-amber-500', bgIcon: 'bg-amber-100 dark:bg-amber-900/30', textIcon: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'info': return { border: 'border-l-indigo-500', bgIcon: 'bg-indigo-100 dark:bg-indigo-900/30', textIcon: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
        default: return { border: 'border-l-blue-500', bgIcon: 'bg-blue-100 dark:bg-blue-900/30', textIcon: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
};

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', actionLabel, dateLabel, onViewList, isText = false }: StatCardProps) => {
    const styles = getVariantStyles(variant);

    const valueClass = isText
        ? "text-lg font-semibold leading-tight line-clamp-3"
        : "text-3xl font-bold tracking-tight";

    return (
        <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${styles.border} flex flex-col justify-between group relative`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-2">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        {onViewList ? (
                            <div className='flex items-center gap-2'>
                                <h4 className={valueClass}>{value}</h4>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={(e) => { e.stopPropagation(); onViewList(); }} title="Ver lista">
                                    <Eye className="h-4 w-4 text-slate-500" />
                                </Button>
                            </div>
                        ) : (
                            <h4 className={valueClass}>{value}</h4>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${styles.bgIcon} transition-opacity duration-200 flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${styles.textIcon}`} />
                    </div>
                </div>
                {description && (
                    <div className="space-y-2 mb-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                        {actionLabel && <Badge variant="outline" className={`text-[10px] font-semibold ${styles.badge}`}>{actionLabel}</Badge>}
                    </div>
                )}
                {!description && actionLabel && (
                    <div className="mb-4">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${styles.badge}`}>{actionLabel}</Badge>
                    </div>
                )}

                {dateLabel && <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-muted-foreground font-medium"><Clock className="w-3 h-3" /><span>{dateLabel}</span></div>}
            </CardContent>
        </Card>
    );
};



export const UnusedElbV2CardsComponent = ({ data }: UnusedElbV2CardsComponentProps) => {
    const [listModalOpen, setListModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'application' | 'network'>('all');

    const mainDiagnosis = data && data.length > 0 ? data[0].diagnosis : null;
    const diagnosisStatus = mainDiagnosis?.status || 'Desconocido';
    const diagnosisReason = mainDiagnosis?.reason || 'Sin razón especificada';

    const statusVariant = diagnosisStatus === 'Recursos Inactivo' ? 'destructive' : diagnosisStatus === 'Tráfico Mínimo' || diagnosisStatus === 'Recursos Infrautilizados' ? 'warning' : 'default';

    const metrics = useMemo(() => {
        const acc = {
            totalElbs: 0,
            applicationCount: 0,
            networkCount: 0,
            avgRequests: 0,
            avgActiveConnections: 0,
            avgNewFlows: 0,
            avgActiveFlows: 0,
            avgLcus: 0,
            unusedList: [] as UnusedElbV2Details[],
            appElbList: [] as UnusedElbV2Details[],
            netElbList: [] as UnusedElbV2Details[]
        };

        if (!data || data.length === 0) return acc;

        let totalRequestsSum = 0;
        let totalActiveConnSum = 0;
        let totalNewFlowsSum = 0;
        let totalActiveFlowsSum = 0;
        let totalLcusSum = 0;
        let diagnosisCount = 0;

        data.forEach(report => {
            if (report.diagnosis?.metrics_summary) {
                totalRequestsSum += report.diagnosis.metrics_summary.avg_requests || 0;
                totalActiveConnSum += report.diagnosis.metrics_summary.avg_active_connections || 0;
                totalNewFlowsSum += report.diagnosis.metrics_summary.acg_new_flows || 0;
                totalActiveFlowsSum += report.diagnosis.metrics_summary.avg_active_flows || 0;
                totalLcusSum += report.diagnosis.metrics_summary.avg_consumed_lcus || 0;
                diagnosisCount++;
            }

            if (report.details && Array.isArray(report.details)) {
                acc.totalElbs += report.details.length;
                report.details.forEach(detail => {
                    acc.unusedList.push(detail);
                    const type = detail.elb_type ? detail.elb_type.toLowerCase() : '';
                    if (type.includes('application')) {
                        acc.applicationCount++;
                        acc.appElbList.push(detail);
                    } else if (type.includes('network')) {
                        acc.networkCount++;
                        acc.netElbList.push(detail);
                    }
                });
            }
        });

        if (diagnosisCount > 0) {
            acc.avgRequests = totalRequestsSum / diagnosisCount;
            acc.avgActiveConnections = totalActiveConnSum / diagnosisCount;
            acc.avgNewFlows = totalNewFlowsSum / diagnosisCount;
            acc.avgActiveFlows = totalActiveFlowsSum / diagnosisCount;
            acc.avgLcus = totalLcusSum / diagnosisCount;
        }
        return acc;
    }, [data]);

    const dateLabelText = useMemo(() => {
        if (!data || data.length === 0) return null;
        const today = new Date();
        return `Datos actualizados: ${today.toLocaleDateString()}`;
    }, [data]);

    const handleViewTotal = () => { setFilterType('all'); setListModalOpen(true); };
    const handleViewApp = () => { setFilterType('application'); setListModalOpen(true); };
    const handleViewNet = () => { setFilterType('network'); setListModalOpen(true); };

    const currentModalList = filterType === 'application' ? metrics.appElbList
        : filterType === 'network' ? metrics.netElbList
            : metrics.unusedList;

    const currentModalTitle = filterType === 'application' ? 'Application Loadbalancers'
        : filterType === 'network' ? 'Network Loadbalancers'
            : 'Total Loadbalancers Infrautilizados';

    if (metrics.totalElbs === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500/50" />
                    <p className="text-lg font-medium">Todo optimizado</p>
                    <p className="text-sm">No se detectaron Loadbalancers infrautilizados.</p>
                </CardContent>
            </Card>
        );
    }

    let diagnosisStatusDescription = '';

    switch (diagnosisStatus) {
        case 'Recursos inactivo':
            diagnosisStatusDescription = "Recursos habilitados en la nube que no registran tráfico, generando costo innecesario";
            break;
        case 'Tráfico Mínimo':
            diagnosisStatusDescription = "Recurso con actividad muy baja. Posible entorno de pruebas o remanente.";
            break;
        default:
            diagnosisStatusDescription = "Estado no clasificado.";
            break;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <StatCard
                    title="Estado del Diagnóstico"
                    description={diagnosisStatusDescription}
                    value={diagnosisStatus}
                    icon={Stethoscope}
                    variant={statusVariant}
                    actionLabel="Acción Inmediata"
                    isText={true}
                />
                <StatCard
                    title="Resumen de Análisis"
                    value={diagnosisReason}
                    description='Basado en métricas de CloudWatch y salud de Target Groups.'
                    icon={FileText}
                    variant="default"
                    actionLabel=""
                    isText={true}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Loadbalancers"
                    value={metrics.totalElbs}
                    description="Total de recursos infrautilizados detectados"
                    icon={Server}
                    variant="destructive"
                    actionLabel="Crítico"
                    dateLabel={dateLabelText || ''}
                    onViewList={handleViewTotal}
                />
                <StatCard
                    title="Application ELBs"
                    value={metrics.applicationCount}
                    description="Balanceadores HTTP/HTTPS (Capa 7)"
                    icon={Layers}
                    variant="info"
                    actionLabel="Revisar Requests"
                    dateLabel={dateLabelText || ''}
                    onViewList={handleViewApp}
                />
                <StatCard
                    title="Network ELBs"
                    value={metrics.networkCount}
                    description="Balanceadores TCP/UDP (Capa 4)"
                    icon={Network}
                    variant="info"
                    actionLabel="Revisar Flows"
                    dateLabel={dateLabelText || ''}
                    onViewList={handleViewNet}
                />
                <StatCard
                    title="Consumo LCU"
                    value={formatMetric(metrics.avgLcus)}
                    description="Determina el costo variable. Si es 0, solo pagas la tarifa base."
                    icon={Zap}
                    variant="warning"
                    actionLabel="Costo por Uso"
                    dateLabel="Carga de Trabajo"
                />
                <StatCard
                    title="Peticiones promedio"
                    value={formatMetric(metrics.avgRequests)}
                    description="Peticiones por segundo (ALB)"
                    icon={Activity}
                    variant="default"
                    actionLabel="Umbral: < 100"
                    dateLabel="CloudWatch Metric"
                />
                <StatCard
                    title="Conexiones Activas"
                    value={formatMetric(metrics.avgActiveConnections)}
                    description="Clientes conectados simultáneamente"
                    icon={ArrowRightLeft}
                    variant="default"
                    actionLabel="Sizing"
                    dateLabel="CloudWatch Metric"
                />
                <StatCard
                    title="Conexiones Nuevas"
                    value={formatMetric(metrics.avgNewFlows)}
                    description="Nuevos flujos TCP/UDP por minuto"
                    icon={Waves}
                    variant="default"
                    dateLabel="Tráfico Entrante"
                />
                <StatCard
                    title="Conexiones Concurrentes"
                    value={formatMetric(metrics.avgActiveFlows)}
                    description="Conexiones concurrentes (NLB)"
                    icon={RefreshCw}
                    variant="default"
                    actionLabel="Umbral: Promedio < 1"
                    dateLabel="Métrica Crítica NLB"
                />
            </div>

            <ResourceListDialog
                isOpen={listModalOpen}
                onClose={() => setListModalOpen(false)}
                title={currentModalTitle}
                resources={currentModalList}
            />
        </>
    );
};