'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { UnusedVmExtensions } from '@/interfaces/vista-unused-resources/unusedVmExtensionsInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';
import { UnusedVmExtensionsByType } from './grafico/UnusedVmExtensionsByType';
import { UnusedVmExtensionsTable } from './table/UnusedVmExtensionsTable';

interface UnusedVmExtensionsComponentProps {
    startDate: Date;
    endDate: Date;
    subscription: string;
    region: string;
    selectedVm: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const isNullish = (v: unknown) => v === null || v === undefined;

export const UnusedVmExtensionsComponent = ({ startDate, endDate, subscription, region, selectedVm }: UnusedVmExtensionsComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        selectedVm ? `/api/azure/bridge/azure/vms/extensions?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription=${subscription}&resource=${selectedVm}` : null,
        fetcher
    );

    const anyLoading =
        isLoading

    const anyError =
        !!error

    const extensionsData: UnusedVmExtensions[] | null =
        isNonEmptyArray<UnusedVmExtensions>(data) ? data : null;

    const hasExtensionsData = !!extensionsData && extensionsData.length > 0;
    const hasSelectedVm = !!selectedVm && selectedVm.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }
    console.log(selectedVm);
    if (!hasSelectedVm) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="VM no seleccionada"
                    description="Seleccione una VM..."
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
    const noneHasData = !hasExtensionsData;
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
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">

            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-5">
                    <Info className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Tipo de Extensiones</h1>
                </div>
                <div className='grid grid-cols-1 gap-5 lg:grid-cols-1'>
                    <UnusedVmExtensionsByType
                        data={extensionsData}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle historico de Extensiones no utilizadas</h1>
                </div>
                <UnusedVmExtensionsTable
                    data={extensionsData}
                />
            </div>
        </div>
    )
}