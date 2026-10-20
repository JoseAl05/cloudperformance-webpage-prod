'use client'

import { Activity, Calendar, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { formatDateTime, formatValue } from '@/lib/consumption';
import { findSummary, getWorkingHoursMetric, SCHEDULE_LABELS, sortMetrics } from '@/lib/workingHours';
import type { WorkingHoursResource } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex justify-between gap-4 border-b last:border-b-0 pb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right break-all">{children}</span>
    </div>
);

const SummaryView = ({ resource, config }: { resource: WorkingHoursResource; config: WorkingHoursViewConfig }) => (
    <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
            <div className="rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 border-indigo-500 text-indigo-700 dark:text-indigo-300">
                <Clock className="h-5 w-5 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold">Recurso analizado</h4>
                    <p className="text-xs opacity-90 mt-1">
                        Comparación del uso en horario hábil (lunes a viernes, 08:00-18:00 de Santiago) y no hábil.
                    </p>
                </div>
            </div>
            <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" /> Metadatos
                </h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <MetaRow label="Nombre:">{resource.resource_name}</MetaRow>
                    <MetaRow label="ID:"><span className="font-mono text-xs">{resource.resource_id}</span></MetaRow>
                    <MetaRow label="Tipo:">{config.resourceTypeLabel}</MetaRow>
                    {resource.region && <MetaRow label="Región:">{resource.region}</MetaRow>}
                    <MetaRow label="Fecha sincronización:">{formatDateTime(resource.sync_time)}</MetaRow>
                </div>
            </div>
        </div>
    </ScrollArea>
);

const MetricsView = ({ resource, config }: { resource: WorkingHoursResource; config: WorkingHoursViewConfig }) => {
    const metrics = sortMetrics(resource.metrics.map((m) => m.metric));
    return (
        <ScrollArea className="flex-1">
            <div className="p-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Métricas
                </h4>
                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                            <TableRow>
                                <TableHead>Métrica</TableHead>
                                <TableHead className="text-center">{SCHEDULE_LABELS.business_hours} (prom.)</TableHead>
                                <TableHead className="text-center">{SCHEDULE_LABELS.non_business_hours} (prom.)</TableHead>
                                <TableHead className="text-center">Máx (H / NH)</TableHead>
                                <TableHead className="text-center">Mín (H / NH)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.map((metric) => {
                                const definition = getWorkingHoursMetric(metric, config.metricOverrides);
                                const fmt = (v: number | null | undefined) => formatValue(v, definition.format, definition.unit);
                                const business = findSummary(resource.metrics, metric, 'business_hours');
                                const nonBusiness = findSummary(resource.metrics, metric, 'non_business_hours');
                                return (
                                    <TableRow key={metric}>
                                        <TableCell className="font-medium text-xs" title={metric}>{definition.label}</TableCell>
                                        <TableCell className="text-center font-mono text-xs text-blue-700 dark:text-blue-400">{fmt(business?.avg_value)}</TableCell>
                                        <TableCell className="text-center font-mono text-xs text-purple-700 dark:text-purple-400">{fmt(nonBusiness?.avg_value)}</TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">{fmt(business?.max_value)} / {fmt(nonBusiness?.max_value)}</TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">{fmt(business?.min_value)} / {fmt(nonBusiness?.min_value)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ScrollArea>
    );
};

interface WorkingHoursDetailModalProps {
    resource: WorkingHoursResource;
    config: WorkingHoursViewConfig;
    isOpen: boolean;
    onClose: () => void;
}

export const WorkingHoursDetailModal = ({ resource, config, isOpen, onClose }: WorkingHoursDetailModalProps) => {
    const tabs: HistoryModalTab[] = [
        { value: 'info', label: 'Resumen', content: <SummaryView resource={resource} config={config} /> },
        { value: 'metricas', label: 'Detalle Métricas', content: <MetricsView resource={resource} config={config} /> },
    ];
    return (
        <HistoryModal
            isOpen={isOpen}
            onClose={onClose}
            title={resource.resource_name}
            region={resource.region ?? '—'}
            resourceType={config.resourceTypeLabel}
            tabs={tabs}
        />
    );
};
