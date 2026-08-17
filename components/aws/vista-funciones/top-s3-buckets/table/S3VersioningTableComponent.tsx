'use client'

import { useMemo, useState } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ShieldCheck, ShieldOff, ShieldAlert, History } from 'lucide-react';
import { S3VersioningItem, S3VersioningRow, S3VersioningChangeRow } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces';
import { getS3VersioningChangesColumns, getS3VersioningColumns } from '@/components/aws/vista-funciones/top-s3-buckets/table/S3VersioningColumns';

interface S3VersioningTableComponentProps {
    data: S3VersioningItem[];
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
    if (value === 'Enabled') return 'Habilitado';
    if (value === 'Suspended') return 'Suspendido';
    return 'No configurado';
};

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-600"></span>
            <span><strong>Habilitado:</strong> el bucket conserva versiones anteriores de cada objeto.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-600"></span>
            <span><strong>Suspendido:</strong> las versiones existentes se mantienen, las nuevas no se versionan.</span>
        </div>
    </div>
);

export const S3VersioningTableComponent = ({ data }: S3VersioningTableComponentProps) => {
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

    const processedData = useMemo<S3VersioningRow[]>(() => {
        return safeData
            .filter(row => row.sync_time === activeSync)
            .map(row => ({
                ...row,
                status_label: statusLabel(row.status),
                mfa_delete_label: statusLabel(row.mfa_delete)
            }))
            .sort((a, b) => a.resource.localeCompare(b.resource));
    }, [safeData, activeSync]);

    const summary = useMemo(() => {
        const enabled = processedData.filter(row => row.status === 'Enabled').length;
        const suspended = processedData.filter(row => row.status === 'Suspended').length;
        const mfaEnabled = processedData.filter(row => row.mfa_delete === 'Enabled').length;
        return { enabled, suspended, mfaEnabled, total: processedData.length };
    }, [processedData]);

    const changesData = useMemo<S3VersioningChangeRow[]>(() => {
        const byResource = new Map<string, S3VersioningItem[]>();
        safeData.forEach(row => {
            const list = byResource.get(row.resource) ?? [];
            list.push(row);
            byResource.set(row.resource, list);
        });

        const detected: S3VersioningChangeRow[] = [];
        byResource.forEach((list, resource) => {
            const ordered = [...list].sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime());
            ordered.forEach((row, index) => {
                if (index === 0) return;
                const previous = ordered[index - 1];
                const previousState = `${statusLabel(previous.status)} / MFA ${statusLabel(previous.mfa_delete)}`;
                const currentState = `${statusLabel(row.status)} / MFA ${statusLabel(row.mfa_delete)}`;
                if (previousState === currentState) return;
                detected.push({
                    resource,
                    sync_time: row.sync_time,
                    sync_time_label: formatSyncTime(row.sync_time),
                    previous_state: previousState,
                    current_state: currentState
                });
            });
        });

        return detected.sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());
    }, [safeData]);

    const columns = createColumns(getS3VersioningColumns());
    const changesColumns = createColumns(getS3VersioningChangesColumns());

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Versionamiento de S3 Buckets
                                </CardTitle>
                                <CardDescription className="dark:text-slate-400">
                                    Estado de versionamiento y MFA Delete por bucket en la sincronización seleccionada.
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
                                <p className="text-xs font-medium text-muted-foreground">Versionamiento Habilitado</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                    {summary.enabled.toLocaleString('es-CL')} / {summary.total.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <ShieldCheck className="h-7 w-7 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Versionamiento Suspendido</p>
                                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                                    {summary.suspended.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <ShieldOff className="h-7 w-7 text-amber-500" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">MFA Delete Habilitado</p>
                                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                    {summary.mfaEnabled.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <ShieldAlert className="h-7 w-7 text-indigo-500" />
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
                                Historial de Versionamiento
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Cambios de configuración detectados entre sincronizaciones del rango consultado.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <DataTableGrouping
                        columns={changesColumns}
                        data={changesData}
                        filterColumn="resource"
                        filterPlaceholder="Filtrar por Bucket..."
                        pageSizeItems={10}
                    />
                </CardContent>
            </Card>
        </div>
    );
};