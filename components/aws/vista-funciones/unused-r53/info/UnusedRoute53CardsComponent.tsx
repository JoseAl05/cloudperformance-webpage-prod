'use client'

import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UnusedRoute53 } from '@/interfaces/vista-unused-resources/unusedRoutes53Interfaces';
import {
    Globe,
    LucideIcon,
    DollarSign,
    Clock,
    CheckCircle2,
    Eye,
    AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UnusedRoute53CardsComponentProps {
    data: UnusedRoute53[];
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    dateLabel?: string;
    onViewList?: () => void;
}

const ResourceListDialog = ({
    isOpen,
    onClose,
    title,
    resources
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    resources: UnusedRoute53[]
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Globe className="h-5 w-5 text-slate-500" />
                        {title}
                        <Badge variant="secondary" className="ml-2">{resources.length}</Badge>
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4 pt-4">
                    <div className="space-y-3">
                        {resources.map((res) => (
                            <div key={res.hz_id} className="p-3 border rounded-md text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex justify-between items-center group">
                                <div className="overflow-hidden">
                                    <div className="text-xs font-semibold truncate" title={res.rs_name}>
                                        {res.rs_name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-mono mt-1 truncate">
                                        {res.hz_id}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">
                                        ${res.potential_savings}/mes
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

const getVariantStyles = (variant: CardVariant) => {
    switch (variant) {
        case 'destructive':
            return {
                border: 'border-l-red-500',
                bgIcon: 'bg-red-100 dark:bg-red-900/30',
                textIcon: 'text-red-600 dark:text-red-400',
                badge: 'bg-red-100 text-red-700 border-red-200'
            };
        case 'success':
            return {
                border: 'border-l-emerald-500',
                bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30',
                textIcon: 'text-emerald-600 dark:text-emerald-400',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
            };
        case 'warning':
            return {
                border: 'border-l-amber-500',
                bgIcon: 'bg-amber-100 dark:bg-amber-900/30',
                textIcon: 'text-amber-600 dark:text-amber-400',
                badge: 'bg-amber-100 text-amber-700 border-amber-200'
            };
        default:
            return {
                border: 'border-l-blue-500',
                bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
                textIcon: 'text-blue-600 dark:text-blue-400',
                badge: 'bg-blue-100 text-blue-700 border-blue-200'
            };
    }
};

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', actionLabel, dateLabel, onViewList }: StatCardProps) => {
    const styles = getVariantStyles(variant);

    return (
        <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${styles.border} flex flex-col justify-between group relative`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        {
                            onViewList ? (
                                <div className='flex items-center gap-2'>
                                    <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                        onClick={(e) => { e.stopPropagation(); onViewList(); }}
                                        title="Ver lista de recursos"
                                    >
                                        <Eye className="h-4 w-4 text-slate-500" />
                                    </Button>
                                </div>
                            ) : (
                                <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
                            )
                        }
                    </div>
                    <div className={`p-3 rounded-xl ${styles.bgIcon} transition-opacity duration-200`}>
                        <Icon className={`w-6 h-6 ${styles.textIcon}`} />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                    {actionLabel && (
                        <Badge variant="outline" className={`text-[10px] font-semibold ${styles.badge}`}>
                            {actionLabel}
                        </Badge>
                    )}
                </div>
                {dateLabel && (
                    <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{dateLabel}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const UnusedRoute53CardsComponent = ({ data }: UnusedRoute53CardsComponentProps) => {
    const [listModalOpen, setListModalOpen] = useState(false);
    const [listType, setListType] = useState<'total' | 'savings' | null>(null);

    const metrics = useMemo(() => {
        const acc = {
            totalZones: data?.length || 0,
            totalSavings: 0,
            unusedZones: 0,
            unusedList: [] as UnusedRoute53[]
        };

        if (!data || data.length === 0) return acc;

        data.forEach(zone => {
            acc.totalSavings += zone.potential_savings || 0;

            const sortedHistory = [...zone.history].sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());
            const latestSnapshot = sortedHistory[0];

            if (latestSnapshot && latestSnapshot.details.length <= 2) {
                acc.unusedZones++;
            }
        });

        return acc;
    }, [data]);

    const dateLabelText = useMemo(() => {
        if (!data || data.length === 0) return null;
        const latestTimestamp = data.reduce((maxTime, item) => {
            const itemLatestTime = item.history?.reduce((hMax, hist) => {
                const t = new Date(hist.sync_time).getTime();
                return t > hMax ? t : hMax;
            }, 0) || 0;
            return itemLatestTime > maxTime ? itemLatestTime : maxTime;
        }, 0);

        if (latestTimestamp === 0) return null;
        const latestSyncTime = new Date(latestTimestamp);
        const today = new Date();
        const isToday = latestSyncTime.getDate() === today.getDate() &&
            latestSyncTime.getMonth() === today.getMonth() &&
            latestSyncTime.getFullYear() === today.getFullYear();
        return isToday ? 'Datos Actualizados: Hoy' : `Datos a fecha de: ${latestSyncTime.toLocaleDateString()}`;
    }, [data]);

    const handleViewTotal = () => {
        setListType('total');
        setListModalOpen(true);
    };

    const modalData = data;
    const modalTitle = 'Total Hosted Zones Infrautilizadas';

    if (metrics.totalZones === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500/50" />
                    <p className="text-lg font-medium">Todo optimizado</p>
                    <p className="text-sm">No se detectaron Hosted Zones infrautilizadas.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Hosted Zones Sin Uso"
                        value={metrics.totalZones}
                        description="Zonas DNS detectadas con baja o nula actividad de registros."
                        icon={Globe}
                        variant="default"
                        dateLabel={dateLabelText || undefined}
                        onViewList={handleViewTotal}
                    />

                    <StatCard
                        title="Ahorro Mensual Estimado"
                        value={`$${metrics.totalSavings.toFixed(2)}`}
                        description="Costo proyectado que se eliminaría al limpiar estos recursos."
                        icon={DollarSign}
                        variant="success"
                        actionLabel="AHORRO DIRECTO"
                        dateLabel={dateLabelText || undefined}
                    />

                    <StatCard
                        title="Zonas Infrautilizadas"
                        value={metrics.unusedZones}
                        description="Zonas que contienen únicamente registros NS y SOA (Vacías)."
                        icon={AlertTriangle}
                        variant="warning"
                        actionLabel={metrics.unusedZones > 0 ? "LIMPIEZA RECOMENDADA" : "SIN HOSTED ZONES INFRAUTILIZADOS"}
                        dateLabel={dateLabelText || undefined}
                    />
                </div>
            </div>

            <ResourceListDialog
                isOpen={listModalOpen}
                onClose={() => setListModalOpen(false)}
                title={modalTitle}
                resources={modalData || []}
            />
        </>
    );
};