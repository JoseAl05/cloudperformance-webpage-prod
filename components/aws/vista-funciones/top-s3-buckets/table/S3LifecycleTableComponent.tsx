'use client'

import { useMemo, useState } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Recycle, ListChecks, Snowflake, History } from 'lucide-react';
import { S3LifecycleItem, S3LifecycleRow, S3LifecycleHistoryRow, S3LifecycleTransition } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces';
import { getS3LifecycleColumns, getS3LifecycleHistoryColumns } from '@/components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleColumns';

interface S3LifecycleTableComponentProps {
    data: S3LifecycleItem[];
}

const fmtSync = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
});

const formatSyncTime = (value: string): string => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : fmtSync.format(parsed);
};

const statusLabel = (value: string | null): string => {
    if (value === 'Enabled') return 'Habilitada';
    if (value === 'Disabled') return 'Deshabilitada';
    return 'No definida';
};

const describeTransitions = (transitions: S3LifecycleTransition[] | undefined, noncurrent: boolean): string => {
    if (!Array.isArray(transitions) || transitions.length === 0) return '-';
    return transitions
        .map(transition => {
            const days = noncurrent ? transition?.noncurrent_days : transition?.days;
            const storageClass = transition?.storage_class ?? 'N/D';
            return typeof days === 'number' ? `${days}d → ${storageClass}` : `→ ${storageClass}`;
        })
        .join(', ');
};

const describeExpiration = (row: S3LifecycleItem): string => {
    const parts: string[] = [];
    if (typeof row.expiration_days === 'number') parts.push(`${row.expiration_days}d`);
    if (row.expired_object_delete_marker === true) parts.push('Marcadores vencidos');
    return parts.length > 0 ? parts.join(' · ') : '-';
};

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-600"></span>
            <span><strong>Transiciones:</strong> días transcurridos antes de mover el objeto a otra clase de almacenamiento.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-600"></span>
            <span><strong>Expiración:</strong> días transcurridos antes de eliminar el objeto o sus versiones no vigentes.</span>
        </div>
    </div>
);

export const S3LifecycleTableComponent = ({ data }: S3LifecycleTableComponentProps) => {
    const [selectedSync, setSelectedSync] = useState<string>('');

    const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const syncTimes = useMemo(() => {
        const unique = new Set<string>();
        safeData.forEach(row => {
            if (typeof row.sync_time === 'string' && row.sync_time !== '') unique.add(row.sync_time);
        });
        return Array.from(unique).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }, [safeData]);

    const activeSync = selectedSync && syncTimes.includes(selectedSync) ? selectedSync : syncTimes[0] ?? '';

    const processedData = useMemo<S3LifecycleRow[]>(() => {
        return safeData
            .filter(row => row.sync_time === activeSync)
            .map(row => ({
                ...row,
                status_label: statusLabel(row.status),
                prefix_label: row.prefix ? row.prefix : '-',
                transitions_label: describeTransitions(row.transitions, false),
                noncurrent_transitions_label: describeTransitions(row.noncurrent_transitions, true),
                expiration_label: describeExpiration(row),
                noncurrent_expiration_label: typeof row.noncurrent_expiration_days === 'number' ? `${row.noncurrent_expiration_days}d` : '-',
                abort_multipart_label: typeof row.abort_multipart_days === 'number' ? `${row.abort_multipart_days}d` : '-'
            }))
            .sort((a, b) => {
                const byResource = a.resource.localeCompare(b.resource);
                return byResource !== 0 ? byResource : a.rule_id.localeCompare(b.rule_id);
            });
    }, [safeData, activeSync]);

    const summary = useMemo(() => {
        const buckets = new Set(processedData.map(row => row.resource));
        const enabled = processedData.filter(row => row.status === 'Enabled').length;
        const withTransitions = new Set(
            processedData
                .filter(row => row.transitions.length > 0 || row.noncurrent_transitions.length > 0)
                .map(row => row.resource)
        );
        return {
            buckets: buckets.size,
            rules: processedData.length,
            enabled,
            withTransitions: withTransitions.size
        };
    }, [processedData]);

    const historyData = useMemo<S3LifecycleHistoryRow[]>(() => {
        return syncTimes.map(syncTime => {
            const rows = safeData.filter(row => row.sync_time === syncTime);
            return {
                sync_time: syncTime,
                sync_time_label: formatSyncTime(syncTime),
                buckets: new Set(rows.map(row => row.resource)).size,
                rules: rows.length,
                enabled: rows.filter(row => row.status === 'Enabled').length
            };
        });
    }, [safeData, syncTimes]);

    const columns = createColumns(getS3LifecycleColumns());
    const historyColumns = createColumns(getS3LifecycleHistoryColumns());

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                                <Recycle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Reglas de Ciclo de Vida
                                </CardTitle>
                                <CardDescription className="dark:text-slate-400">
                                    Transiciones, expiraciones y limpieza de cargas multiparte por bucket.
                                </CardDescription>
                            </div>
                        </div>
                        {syncTimes.length > 0 && (
                            <Select value={activeSync} onValueChange={setSelectedSync}>
                                <SelectTrigger className="w-64 shrink-0">
                                    <SelectValue placeholder="Sincronización" />
                                </SelectTrigger>
                                <SelectContent>
                                    {syncTimes.map(syncTime => (
                                        <SelectItem key={syncTime} value={syncTime}>
                                            {formatSyncTime(syncTime)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <TableLegend />
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Buckets con Reglas</p>
                                <p className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                                    {summary.buckets.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <Recycle className="h-7 w-7 text-teal-500" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Reglas Habilitadas</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                    {summary.enabled.toLocaleString('es-CL')} / {summary.rules.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <ListChecks className="h-7 w-7 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Buckets con Transiciones</p>
                                <p className="text-xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                                    {summary.withTransitions.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <Snowflake className="h-7 w-7 text-sky-500" />
                        </div>
                    </div>

                    <DataTableGrouping
                        columns={columns}
                        data={processedData}
                        filterColumn="resource"
                        filterPlaceholder="Filtrar por Bucket..."
                        pageSizeItems={10}
                    />
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                            <History className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Historial de Ciclo de Vida
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Cobertura de reglas por sincronización dentro del rango consultado.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <DataTableGrouping
                        columns={historyColumns}
                        data={historyData}
                        filterColumn="sync_time_label"
                        filterPlaceholder="Filtrar por Sincronización..."
                        pageSizeItems={10}
                    />
                </CardContent>
            </Card>
        </div>
    );
};