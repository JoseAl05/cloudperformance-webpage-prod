'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import useSWR from 'swr';
import { UnusedCardsComponent } from '@/components/azure/vista-funciones/unused-resources/info/UnusedCardsComponent';
import { UnusedCpuMetricsComponent } from '@/components/azure/vista-funciones/unused-resources/grafico/UnusedCpuMetricsComponent';
import { UnusedMemoryMetricsComponent } from '@/components/azure/vista-funciones/unused-resources/grafico/UnusedMemoryMetricsComponent';
import { bytesToGB } from '@/lib/bytesToMbs';
import { UnusedDiskIopsMetricsComponent } from '@/components/azure/vista-funciones/unused-resources/grafico/UnusedDiskIopsMetricsComponent';
import { UnusedCreditsRemainingMetricsComponent } from '@/components/azure/vista-funciones/unused-resources/grafico/UnusedCreditsRemainingMetricsComponent';
import { UnusedTable } from '@/components/azure/vista-funciones/unused-resources/vm/table/UnusedVmTable';
import { UnusedVmss } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { UnusedVmssTable } from './table/UnusedVmssTable';

interface UnusedVmssComponentProps {
    startDate: Date;
    endDate: Date;
    subscription: string;
    region: string;
    selectedUnusedVmss: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const isNullish = (v: unknown) => v === null || v === undefined;

const dedupeByTimestamp = (series: UnusedVmSeries[], metric_name: string | string[]): UnusedVmSeries[] => {
    const multipleMetrics = Array.isArray(metric_name)
        ? new Set(metric_name)
        : new Set([metric_name]);
    const filtered = (series ?? []).filter(
        s => multipleMetrics.has(s.name) && typeof s.metric_value === 'number' && !!s.timestamp
    );

    const acc = new Map<string, { sum: number; count: number }>();
    for (const s of filtered) {
        const ts = new Date(s.timestamp).toISOString();
        const key = `${s.name}__${ts}`;
        const metric = acc.get(key) ?? { sum: 0, count: 0 };
        metric.sum += s.metric_value as number;
        metric.count += 1;
        acc.set(key, metric);
    }

    const out: UnusedVmSeries[] = [];
    for (const [key, { sum, count }] of acc) {
        const [name, timestamp] = key.split('__');
        out.push({
            name,
            timestamp,
            metric_value: sum / count,
        } as UnusedVmSeries);
    }

    out.sort(
        (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() ||
            a.name.localeCompare(b.name),
    );
    return out;
};

export const UnusedVmssComponent = ({ startDate, endDate, subscription, region, selectedUnusedVmss }: UnusedVmssComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        selectedUnusedVmss ? `/api/azure/bridge/azure/vms/unused_vmss?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription=${subscription}&resource=${selectedUnusedVmss}` : null,
        fetcher
    );

    const anyLoading =
        isLoading

    const anyError =
        !!error

    const unusedVmssData: UnusedVmss[] | null =
        isNonEmptyArray<UnusedVmss>(data) ? data : null;

    const hasUnusedVmssData = !!unusedVmssData && unusedVmssData.length > 0;
    const hasSelectedUnusedVmss = !!selectedUnusedVmss && selectedUnusedVmss.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!hasSelectedUnusedVmss) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="VMSS no seleccionada"
                    description="Seleccione una VMSS..."
                    tone="info"
                />
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }
    const noneHasData = !hasUnusedVmssData;
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los volúmen/es en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const mergedCpuMetrics: UnusedVmssSeries[] = [];
    const mergedAvailableMemoryMetrics: UnusedVmssSeries[] = [];
    const mergedDiskIopsMetrics: UnusedVmssSeries[] = [];
    const mergedCredits: UnusedVmssSeries[] = [];

    unusedVmssData.forEach(vmss => {
        mergedCpuMetrics.push(...vmss.series.filter(s => s.name === 'Percentage CPU'));
        mergedAvailableMemoryMetrics.push(
            ...vmss.series
                .filter(s => s.name === 'Available Memory')
                .map(s => ({
                    ...s,
                    metric_value: parseFloat(bytesToGB(s.metric_value as number)),
                }))
        );
        mergedDiskIopsMetrics.push(...vmss.series.filter(s => s.name === 'Disks IOPS'));
        mergedCredits.push(...vmss.series.filter(s => s.name === 'CPU Credits Remaining' || s.name === 'CPU Credits Consumed'));
    });
    const dedupedCpuMetrics = dedupeByTimestamp(mergedCpuMetrics, 'Percentage CPU');
    const dedupedAvailableMemoryMetrics = dedupeByTimestamp(mergedAvailableMemoryMetrics, 'Available Memory');
    const dedupedDiskIopsMetrics = dedupeByTimestamp(mergedDiskIopsMetrics, 'Disks IOPS');
    const dedupedCpuCreditsMetrics = dedupeByTimestamp(mergedCredits, ['CPU Credits Remaining', 'CPU Credits Consumed']);
    console.log(unusedVmssData);
    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <UnusedCardsComponent
                    data={unusedVmssData}
                    type='vmss'
                />
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas VMSS</h1>
                </div>
                <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                    <UnusedCpuMetricsComponent
                        data={dedupedCpuMetrics}
                    />
                    <UnusedMemoryMetricsComponent
                        data={dedupedAvailableMemoryMetrics}
                    />
                    <UnusedDiskIopsMetricsComponent
                        data={dedupedDiskIopsMetrics}
                    />
                    <UnusedCreditsRemainingMetricsComponent
                        data={dedupedCpuCreditsMetrics}
                    />
                    {/* <UnusedVmCreditsConsumedMetricsComponent
                        data={dedupedCpuCreditsConsumedMetrics}
                    /> */}
                </div>
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle VMSS Infrautilizadas</h1>
                </div>
                <UnusedVmssTable
                    data={unusedVmssData}
                />
            </div>
        </div>
    )
}