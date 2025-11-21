'use client'

import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { TrendingUp, Activity, Info, AlertCircle } from 'lucide-react';
import { DeploymentsDetailsTableComponent } from '@/components/azure/vista-deployments/table/DeploymentsTableComponent';
import useSWR from 'swr';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { DeploymentsChartComponent } from '@/components/azure/vista-deployments/grafico/DeploymentsChartComponent';

interface DeploymentsProps {
    startDate: Date;
    endDate: Date;
    selectedOperation: string;
    selectedResourceGroup: string;
}

interface DeploymentData {
    date: string;
    unique_deployments: number;
}


const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const DeploymentsComponent = ({ startDate, endDate, selectedOperation,selectedResourceGroup }: DeploymentsProps) => {

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    const deployments = useSWR(
        selectedOperation ? `/api/azure/bridge/azure/deployments/deployments?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_groups=${selectedResourceGroup}&operation_name=${selectedOperation}` : null,
        fetcher,
    );

    const deploymentsDetails = useSWR(
        selectedOperation ? `/api/azure/bridge/azure/deployments/deployments-detalles?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource_groups=${selectedResourceGroup}&operation_name=${selectedOperation}` : null,
        fetcher
    );


    const anyLoading =
        deployments.isLoading ||
        deploymentsDetails.isLoading

    const anyError =
        !!deployments.error ||
        !!deploymentsDetails.error

    const deploymentsData: unknown[] | null =
        !isNullish<unknown[]>(deployments.data) ? deployments.data : null;

    const deploymentsDetailsData: unknown[] | null =
        !isNullish<unknown[]>(deploymentsDetails.data) ? deploymentsDetails.data : null;

    const hasDeploymentsData = !!deploymentsData && deploymentsData.length > 0;
    const hasDeploymentsDetailsData = !!deploymentsDetailsData && deploymentsDetailsData.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!selectedOperation) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna Operacion.</div>
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

    const noneHasData =
        !hasDeploymentsData && !hasDeploymentsDetailsData

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <h2 className="text-xl font-semibold">Evolución de Deployments</h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Gráfico de línea que muestra la cantidad de deployments únicos por fecha
                    </p>
                </div>
                <DeploymentsChartComponent
                    data={deploymentsData}
                    title='Cantidad de deployments'
                />
            </div>
            <div className="mt-8">
                <DeploymentsDetailsTableComponent
                    data={deploymentsDetailsData}
                />
            </div>
        </div>
    );
}