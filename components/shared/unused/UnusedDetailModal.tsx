'use client'

import useSWR from 'swr';
import { Activity, Boxes, HardDrive, Link2, Network, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { fetcher } from '@/lib/fetcher';
import { formatCurrency } from '@/lib/format';
import { formatDateTime, formatValue } from '@/lib/consumption';
import { DIAGNOSIS, formatAttribute, getUnusedMetric } from '@/lib/unused';
import type { UnusedRelated, UnusedResource } from '@/interfaces/unused';
import type { UnusedViewConfig } from '@/components/shared/unused/types';

const yesNo = (value: boolean | null) => (value === null ? '—' : value ? 'Sí' : 'No');

const Section = ({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) => (
    <section>
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" /> {title}
        </h3>
        {children}
    </section>
);

const DiagnosisView = ({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig }) => {
    const diagnosis = DIAGNOSIS[resource.diagnosis.status];
    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`rounded-xl border p-5 ${diagnosis.className}`}>
                        <h4 className="text-base font-bold">Diagnóstico: {diagnosis.label}</h4>
                        <p className="text-sm mt-1">{resource.diagnosis.reason}</p>
                        <p className="text-xs mt-2 opacity-80">{config.diagnosisRule}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm dark:border-slate-800">
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                            <Wallet className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Costo del período</span>
                        </div>
                        {resource.potential_savings !== null && (
                            <p className="text-xs text-muted-foreground mb-2">
                                Ahorro mensual estimado si se elimina: <strong>{formatCurrency(resource.potential_savings, { currency: 'USD' })}</strong>
                            </p>
                        )}
                        {resource.cost !== null ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl font-bold tracking-tight">{formatCurrency(resource.cost, { currency: resource.currency })}</span>
                                {resource.cost_local !== null && resource.cost_local_currency && (
                                    <span className="text-xs text-muted-foreground">{formatCurrency(resource.cost_local, { currency: resource.cost_local_currency })}</span>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Sin costo del período en la API para este recurso.</p>
                        )}
                    </div>
                </div>
                {resource.metrics.length > 0 && (
                    <Section icon={Activity} title="Métricas del período">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resource.metrics.map((m) => {
                                const definition = getUnusedMetric(m.metric, config.metricOverrides);
                                const fmt = (v: number | null) => formatValue(v, definition.format, definition.unit);
                                return (
                                    <div key={m.metric} className="rounded-xl border bg-background p-4 dark:border-slate-800">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" title={m.metric}>{definition.label}</span>
                                        <p className="text-2xl font-bold tracking-tight mt-1">{fmt(m.avg_value)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {m.max_value !== null ? `Máx ${fmt(m.max_value)} · Mín ${fmt(m.min_value)}` : m.global_avg !== null ? `Promedio del grupo ${fmt(m.global_avg)}` : 'Promedio del período'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                )}
            </div>
        </ScrollArea>
    );
};

const ResourcesView = ({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig }) => {
    const { network_interfaces: interfaces, disks, attachments } = resource.details;
    const attributes = config.attributes ?? [];
    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <Section icon={HardDrive} title="Configuración">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm border rounded-xl p-4 dark:border-slate-800">
                        {[
                            ['ID', resource.resource_id],
                            ['Tipo', resource.resource_type],
                            ['Región', resource.region],
                            ['Proyecto / suscripción', resource.scope],
                            ['Estado', resource.status],
                            ['Última sincronización', formatDateTime(resource.sync_time)],
                        ].filter(([, v]) => v).map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 border-b last:border-b-0 pb-1">
                                <span className="text-muted-foreground">{label}</span>
                                <span className="font-medium text-right break-all">{value}</span>
                            </div>
                        ))}
                        {attributes.map((attr) => (
                            <div key={attr.key} className="flex justify-between gap-4 border-b last:border-b-0 pb-1">
                                <span className="text-muted-foreground">{attr.label}</span>
                                <span className="font-medium text-right break-all">{formatAttribute(resource.attributes[attr.key], attr.format, attr.unit)}</span>
                            </div>
                        ))}
                    </div>
                </Section>
                {disks.length > 0 && (
                    <Section icon={HardDrive} title="Discos">
                        <div className="border rounded-xl overflow-hidden dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Disco</TableHead>
                                        <TableHead>Dispositivo</TableHead>
                                        <TableHead>Tipo / estado</TableHead>
                                        <TableHead className="text-right">Tamaño</TableHead>
                                        <TableHead className="text-right">Se borra con el recurso</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disks.map((d, i) => (
                                        <TableRow key={d.id ?? i}>
                                            <TableCell className="font-mono text-xs break-all">
                                                {d.name ?? d.id ?? '—'} {d.boot && <Badge variant="secondary" className="ml-1 text-[10px]">Boot</Badge>}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{d.device ?? '—'}</TableCell>
                                            <TableCell className="text-xs">{[d.type, d.status].filter(Boolean).join(' · ') || '—'}</TableCell>
                                            <TableCell className="text-right text-xs">{d.size_gb !== null ? `${d.size_gb} GB` : '—'}</TableCell>
                                            <TableCell className="text-right text-xs">{yesNo(d.delete_on_termination)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Section>
                )}
                {attachments.length > 0 && (
                    <Section icon={Link2} title="Instancias asociadas">
                        <div className="border rounded-xl overflow-hidden dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Instancia</TableHead>
                                        <TableHead>Dispositivo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Asociado desde</TableHead>
                                        <TableHead className="text-right">Se borra con la instancia</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attachments.map((a, i) => (
                                        <TableRow key={`${a.instance_id}-${i}`}>
                                            <TableCell className="font-mono text-xs">{a.instance_id ?? '—'}</TableCell>
                                            <TableCell className="font-mono text-xs">{a.device ?? '—'}</TableCell>
                                            <TableCell className="text-xs">{a.state ?? '—'}</TableCell>
                                            <TableCell className="text-xs">{formatDateTime(a.attach_time)}</TableCell>
                                            <TableCell className="text-right text-xs">{yesNo(a.delete_on_termination)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Section>
                )}
                {interfaces.length > 0 && (
                    <Section icon={Network} title="Red">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {interfaces.map((ni, i) => (
                                <div key={ni.id ?? i} className="border rounded-xl p-4 bg-card dark:border-slate-800 space-y-1 text-xs">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-bold text-sm font-mono break-all">{ni.name ?? ni.id}</span>
                                        {ni.status && <Badge variant="outline">{ni.status}</Badge>}
                                    </div>
                                    {[
                                        ['Tipo', ni.type],
                                        ['Red', ni.network],
                                        ['Subred', ni.subnet],
                                        ['IP privada', ni.private_ip],
                                        ['IP pública', ni.public_ip],
                                        ['Grupos de seguridad', ni.security_groups.join(', ')],
                                    ].filter(([, v]) => v).map(([label, value]) => (
                                        <div key={label} className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">{label}</span>
                                            <span className="font-mono text-right break-all">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
            </div>
        </ScrollArea>
    );
};

const RelatedTables = ({ items }: { items: UnusedRelated[] }) => {
    const groups = new Map<string, UnusedRelated[]>();
    items.forEach((item) => {
        const key = item.group ?? 'Relacionados';
        groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return (
        <>
            {[...groups.entries()].map(([group, rows]) => (
                <Section key={group} icon={Boxes} title={`${group} (${rows.length})`}>
                    <div className="border rounded-xl overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Nombre / ID</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Detalle</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((item, i) => (
                                    <TableRow key={`${item.id}-${i}`}>
                                        <TableCell className="text-xs"><Badge variant="outline">{item.type}</Badge></TableCell>
                                        <TableCell className="font-mono text-xs break-all">{item.name ?? item.id}</TableCell>
                                        <TableCell className="text-xs">{item.status ?? '—'}</TableCell>
                                        <TableCell className="text-xs break-all">{item.detail ?? '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Section>
            ))}
        </>
    );
};

const RelatedView = ({ resource, associatedUrl }: { resource: UnusedResource; associatedUrl?: string }) => {
    const associated = useSWR<UnusedRelated[]>(associatedUrl ?? null, fetcher, { revalidateOnFocus: false });
    const items = [...resource.details.related, ...(associated.data ?? [])];
    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <DataStateComponent
                    isLoading={associated.isLoading}
                    error={associated.error}
                    isEmpty={items.length === 0}
                    emptyTitle="Sin recursos asociados"
                    emptyDescription="No encontramos recursos asociados en el período."
                >
                    <RelatedTables items={items} />
                </DataStateComponent>
            </div>
        </ScrollArea>
    );
};

const HistoryView = ({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig }) => (
    <ScrollArea className="flex-1 h-full">
        <div className="p-6">
            {resource.history.length === 0 && <p className="text-sm text-muted-foreground">Sin historial en el período.</p>}
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 py-2">
                {resource.history.map((h, i) => (
                    <div key={`${h.sync_time}-${i}`} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background ${i === 0 ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-slate-300 dark:bg-slate-700'}`} />
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-sm font-semibold">{formatDateTime(h.sync_time)}</span>
                            {i === 0 && <Badge variant="secondary">Último estado</Badge>}
                            {h.status && <Badge variant="outline">{h.status}</Badge>}
                            {h.resource_type && <span className="text-xs text-muted-foreground">{h.resource_type}</span>}
                        </div>
                        {(Object.keys(h.metrics).length > 0 || Object.keys(h.attributes).length > 0) && (
                            <div className="rounded-xl border bg-card p-4 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 dark:border-slate-800">
                                {Object.entries(h.metrics).map(([metric, value]) => {
                                    const definition = getUnusedMetric(metric, config.metricOverrides);
                                    return (
                                        <div key={metric} className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground" title={metric}>{definition.label}</span>
                                            <span className="text-sm font-medium font-mono">{formatValue(value, definition.format, definition.unit)}</span>
                                        </div>
                                    );
                                })}
                                {Object.entries(h.attributes).map(([key, value]) => {
                                    const attr = (config.attributes ?? []).find((a) => a.key === key);
                                    return (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{attr?.label ?? key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-medium font-mono">{formatAttribute(value, attr?.format, attr?.unit)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </ScrollArea>
);

interface UnusedDetailModalProps {
    resource: UnusedResource;
    config: UnusedViewConfig;
    associatedUrl?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const UnusedDetailModal = ({ resource, config, associatedUrl, isOpen, onClose }: UnusedDetailModalProps) => {
    const tabs: HistoryModalTab[] = [
        { value: 'analysis', label: 'Diagnóstico', content: <DiagnosisView resource={resource} config={config} /> },
        { value: 'resources', label: 'Recursos', content: <ResourcesView resource={resource} config={config} /> },
        ...(resource.details.related.length > 0 || associatedUrl
            ? [{ value: 'related', label: 'Asociados', content: <RelatedView resource={resource} associatedUrl={associatedUrl} /> }]
            : []),
        { value: 'history', label: 'Historial', content: <HistoryView resource={resource} config={config} /> },
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
