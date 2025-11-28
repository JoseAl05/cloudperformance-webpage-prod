'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { StorageVariation, StorageVariationsRangesMetrics } from '@/interfaces/vista-variacion-storage/variationStorageInterfaces';
import { AlertCircle, ChartBar, Info } from 'lucide-react';
import { StorageVariationCardsComponent } from '@/components/azure/vista-funciones/variacion-storage/info/StorageVariationCardsComponent';
import { StorageVariationCapacitiesComponent } from '@/components/azure/vista-funciones/variacion-storage/graficos/StorageVariationCapacitiesComponent';
import useSWR from 'swr';

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

interface StorageVariationComponentProps {
    selectedStrgAccount: string;
    subscription: string;
    region: string;
    year: number | null;
    month: number | null;
}

export const StorageVariationComponent = ({ selectedStrgAccount, subscription, region, year, month }: StorageVariationComponentProps) => {
    const allStorageVariations = useSWR(
        selectedStrgAccount ? `/api/azure/bridge/azure/storage/storage-variations?year=${year}&month=${month}&location=${region}&subscription_id=${subscription}&strg_account_id=${selectedStrgAccount}` : null,
        fetcher
    )

    const anyLoading =
        allStorageVariations.isLoading

    const anyError =
        !!allStorageVariations.error

    const strgVariationData: StorageVariation[] | null =
        isNonEmptyArray<StorageVariation>(allStorageVariations.data) ? allStorageVariations.data : null;

    const hasStrgVariationData = !!strgVariationData && strgVariationData.length > 0;
    const hasSelectedStrgAccount = !!selectedStrgAccount && selectedStrgAccount.length > 0;

    if (!hasSelectedStrgAccount) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Storage Account no seleccionado"
                    description="Seleccione un Storage Account.."
                    tone="info"
                />
            </div>
        )
    }

    if (anyLoading) {
        return <LoaderComponent />
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
    const noneHasData = !hasStrgVariationData;
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

    const mergedBlobMetrics: StorageVariationsRangesMetrics[] = [];
    const mergedTableMetrics: StorageVariationsRangesMetrics[] = [];
    const mergedQueueMetrics: StorageVariationsRangesMetrics[] = [];
    const mergedFileMetrics: StorageVariationsRangesMetrics[] = [];
    const mergedStrgMetrics: StorageVariationsRangesMetrics[] = [];

    strgVariationData.map(strg => (
        mergedBlobMetrics.push(
            ...strg.blob_service.actual_range.metrics ?? [],
            ...strg.blob_service.prev_range.metrics ?? []
        ),
        mergedTableMetrics.push(
            ...strg.table_service.actual_range.metrics ?? [],
            ...strg.table_service.prev_range.metrics ?? []
        ),
        mergedQueueMetrics.push(
            ...strg.queue_service.actual_range.metrics ?? [],
            ...strg.queue_service.prev_range.metrics ?? []
        ),
        mergedFileMetrics.push(
            ...strg.file_service.actual_range.metrics ?? [],
            ...strg.file_service.prev_range.metrics ?? []
        ),
        mergedStrgMetrics.push(
            ...strg.storage_account.actual_range.metrics ?? [],
            ...strg.storage_account.prev_range.metrics ?? []
        )
    ));

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <StorageVariationCardsComponent
                    strgVariationData={strgVariationData}
                />
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                </div>
                <StorageVariationCapacitiesComponent
                    blob={mergedBlobMetrics}
                    table={mergedTableMetrics}
                    queue={mergedQueueMetrics}
                    file={mergedFileMetrics}
                    storage={mergedStrgMetrics}
                    unitLabel="GB"
                    height={460}
                    title="Capacidad (GB) por Servicio vs Storage Account"
                />
            </div>
        </div>
    )
}