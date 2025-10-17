'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { AllStorageCapacity } from '@/interfaces/vista-blob-vs-storage/allStorageCapacityInterfaces';
import useSWR from 'swr';
import { BlobVsStorageCardsComponent } from './info/BlobVsStorageCardsComponent';
import { StorageVsGeneralCapacity } from '@/interfaces/vista-blob-vs-storage/strgVsGeneralInterfaces';
import { ChartBar, Info } from 'lucide-react';
import { BlobVsStorageGeneralCapacityComponent } from './graficos/BlobVsStorageGeneralCapacityComponent';

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

interface BlobVsStorageGeneralComponentProps {
    selectedStrgAccount: string;
    region: string;
    subscription: string;
    startDate: Date;
    endDate: Date;

}

export const BlobVsStorageGeneralComponent = ({ selectedStrgAccount, region, subscription, startDate, endDate }: BlobVsStorageGeneralComponentProps) => {
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const allStorageCapacity = useSWR(
        selectedStrgAccount ? `/api/azure/bridge/azure/storage/storage-capacity-sum?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscription}&strg_account_id=${selectedStrgAccount}` : null,
        fetcher
    )

    const strgVsGeneral = useSWR(
        selectedStrgAccount ? `/api/azure/bridge/azure/storage/service-storage-vs-total-storage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscription}&strg_acc_id=${selectedStrgAccount}` : null,
        fetcher
    )

    const anyLoading =
        allStorageCapacity.isLoading ||
        strgVsGeneral.isLoading

    const anyError =
        !!allStorageCapacity.error ||
        !!strgVsGeneral.error

    const strgCapacityData: AllStorageCapacity[] | null =
        isNonEmptyArray<AllStorageCapacity>(allStorageCapacity.data) ? allStorageCapacity.data : null;
    const strgVsGeneralData: StorageVsGeneralCapacity[] | null =
        isNonEmptyArray<StorageVsGeneralCapacity>(strgVsGeneral.data) ? strgVsGeneral.data : null;

    const hasStrgCapacityData = !!strgCapacityData && strgCapacityData.length > 0;
    const hasStrgVsGeneralData = !!strgVsGeneralData && strgVsGeneralData.length > 0;
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
    const noneHasData = !hasStrgCapacityData && hasStrgVsGeneralData;
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
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <BlobVsStorageCardsComponent strgCapacityData={strgCapacityData} />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                    </div>
                    <BlobVsStorageGeneralCapacityComponent
                        data={strgVsGeneralData}
                    />
                    {/* {
                        hasMetricsData && (
                            <>
                                <Ec2ResourceViewUsageCreditsComponent
                                    data={metricsData}
                                />
                                <Ec2ResourceViewUsageCpuComponent
                                    data={metricsData}
                                />
                                <Ec2ResourceViewUsageNetworkComponent
                                    data={metricsData}
                                />
                            </>
                        )
                    } */}
                </div>
                {/* <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Volúmenes no utilizados</h1>
                </div> */}
            </div>
        </>
    )
}