'use client'

import { AlertTriangle, Calendar, CheckCircle2, Database, DollarSign, Tag, TrendingDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { ConsumptionCharts } from '@/components/shared/consumption/ConsumptionCharts';
import { formatCurrency } from '@/lib/format';
import { formatDateTime, formatValue, getPathValue, getResourceValue } from '@/lib/consumption';
import type { ConsumptionCloud, ConsumptionResource, MetricPoint } from '@/interfaces/consumption';
import type { ConsumptionViewConfig, FieldDef } from '@/components/shared/consumption/types';

const SCOPE_LABEL: Record<ConsumptionCloud, string> = { aws: 'Cuenta', azure: 'Suscripción', gcp: 'Proyecto' };

export const renderField = (value: unknown, field: Pick<FieldDef, 'format' | 'unit'>): string => {
    if (value === null || value === undefined || value === '') return '—';
    if (field.format === 'date') return formatDateTime(String(value));
    if (!field.format || field.format === 'text') return typeof value === 'object' ? JSON.stringify(value) : String(value);
    return formatValue(Number(value), field.format, field.unit);
};

const InfoTab = ({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig }) => {
    const running = /running|ready|active|available/i.test(resource.status ?? '');
    const firstMetric = config.tableColumns[0];
    const fields: FieldDef[] = [
        { label: 'ID', path: 'resource_id' },
        { label: 'Nombre', path: 'resource_name' },
        { label: 'Tipo', path: 'resource_type' },
        { label: 'Región', path: 'region' },
        { label: SCOPE_LABEL[config.cloud], path: 'scope' },
        ...config.generalFields,
        { label: 'Última sincronización', path: 'sync_time', format: 'date' },
    ];
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                {resource.status && (
                    <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${running
                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                        : 'border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>
                        <Database className="h-5 w-5 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold">Estado: {resource.status}</h4>
                            <p className="text-xs opacity-90 mt-1">{running ? 'Recurso activo y disponible' : 'Recurso detenido o en transición'}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Tipo</span>
                        <p className="text-lg font-bold truncate" title={resource.resource_type ?? ''}>{resource.resource_type ?? '—'}</p>
                    </div>
                    {firstMetric && (
                        <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                            <span className="text-xs font-bold uppercase text-muted-foreground">{firstMetric.label}</span>
                            <p className="text-2xl font-bold">{renderField(getResourceValue(resource, firstMetric.path), firstMetric)}</p>
                        </div>
                    )}
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Costo del período</span>
                        <p className="text-2xl font-bold">{resource.cost !== null ? formatCurrency(resource.cost, { currency: resource.currency ?? 'USD' }) : '—'}</p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> Información General</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {fields.map((field) => (
                            <div key={field.label}>
                                <span className="text-muted-foreground">{field.label}:</span>
                                <p className="font-medium text-xs break-all">{renderField(getResourceValue(resource, field.path), field)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

const MetricsTab = ({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig }) => {
    const history = [...resource.history].reverse();
    const historyColumns = config.historyColumns ?? [];
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.metricGroups.map((group) => (
                        <div key={group.title} className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-3">{group.title}</h5>
                            <div className="space-y-2 text-sm">
                                {group.rows.map((row) => (
                                    <div key={row.label} className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">{row.label}:</span>
                                        <span className="font-bold">{renderField(getResourceValue(resource, row.path), row)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {history.length > 1 && historyColumns.length > 0 && (
                    <div className="border dark:border-slate-800 rounded-lg p-4">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" /> Historial ({history.length} registros)
                        </h5>
                        <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead>Sync Time</TableHead>
                                        {historyColumns.map((col) => <TableHead key={col.label}>{col.label}</TableHead>)}
                                        <TableHead>Costo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((snapshot, idx) => (
                                        <TableRow key={snapshot.sync_time ?? idx}>
                                            <TableCell className="font-mono text-xs">{formatDateTime(snapshot.sync_time)}</TableCell>
                                            {historyColumns.map((col) => (
                                                <TableCell key={col.label} className="text-xs">
                                                    {renderField(getPathValue(snapshot, col.path), col)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-xs font-medium">{snapshot.cost !== null ? formatCurrency(snapshot.cost) : '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

const SeriesTab = ({ resource }: { resource: ConsumptionResource }) => {
    const points: MetricPoint[] = Object.entries(resource.series).flatMap(([metric, values]) =>
        values.map((v) => ({
            timestamp: v.timestamp, metric, avg_value: v.value, max_value: null, min_value: null,
            samples: null, region: null, scope: null,
        }))
    );
    return (
        <ScrollArea className="flex-1">
            <div className="p-6"><ConsumptionCharts data={points} /></div>
        </ScrollArea>
    );
};

const TagsTab = ({ resource }: { resource: ConsumptionResource }) => {
    const tags = Object.entries(resource.tags);
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2"><Tag className="h-4 w-4 text-slate-500" /> Tags ({tags.length})</h4>
                {tags.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow><TableHead>Key</TableHead><TableHead>Value</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-mono text-xs font-semibold">{key}</TableCell>
                                        <TableCell><Badge variant="secondary">{value}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Este recurso no tiene tags configurados.</p>
                )}
            </div>
        </ScrollArea>
    );
};

const RecommendationTab = ({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig }) => {
    const rec = resource.is_idle
        ? { title: 'Recurso Idle', text: config.recommendations.idle, icon: AlertTriangle, color: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200' }
        : resource.is_underutilized
            ? { title: 'Recurso Infrautilizado', text: config.recommendations.underutilized, icon: TrendingDown, color: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' }
            : { title: 'Recurso Óptimo', text: 'Opera dentro de parámetros normales de eficiencia. Sin recomendaciones activas.', icon: CheckCircle2, color: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200' };
    return (
        <ScrollArea className="flex-1">
            <div className="p-6">
                <div className={`border-l-4 p-4 rounded-lg ${rec.color}`}>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><rec.icon className="h-5 w-5" /> {rec.title}</h4>
                    <p className="text-sm opacity-90">{rec.text}</p>
                </div>
            </div>
        </ScrollArea>
    );
};

interface ConsumptionDetailModalProps {
    resource: ConsumptionResource;
    config: ConsumptionViewConfig;
    isOpen: boolean;
    onClose: () => void;
}

export const ConsumptionDetailModal = ({ resource, config, isOpen, onClose }: ConsumptionDetailModalProps) => {
    const tabs: HistoryModalTab[] = [
        { value: 'info', label: 'Información', content: <InfoTab resource={resource} config={config} /> },
        { value: 'metricas', label: 'Métricas', content: <MetricsTab resource={resource} config={config} /> },
        ...(Object.keys(resource.series).length > 0
            ? [{ value: 'series', label: 'Series', content: <SeriesTab resource={resource} /> }]
            : []),
        { value: 'tags', label: 'Tags', content: <TagsTab resource={resource} /> },
        { value: 'recomendacion', label: 'Recomendación', content: <RecommendationTab resource={resource} config={config} /> },
    ];
    return (
        <HistoryModal
            isOpen={isOpen}
            onClose={onClose}
            title={resource.resource_id}
            subTitle={resource.resource_name}
            region={resource.region ?? '—'}
            resourceType={config.resourceTypeLabel}
            tabs={tabs}
        />
    );
};
