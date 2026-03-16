'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedEc2CardsComponent } from '@/components/aws/vista-funciones/unused-ec2/info/UnusedEc2CardsComponent';
import { UnusedEc2TableComponent } from '@/components/aws/vista-funciones/unused-ec2/table/UnusedEc2TableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { UnusedEc2CardsMetricSummary, UnusedEc2TableData } from '@/interfaces/vista-unused-resources/unusedEc2InstanceInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedEksComponentProps {
    startDate: Date;
    endDate: Date;
    instance: string;
    region: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const UnusedEksComponent = ({ startDate, endDate, region, instance }: UnusedEksComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allUnusedEc2Table = useSWR(
        instance ? `/api/aws/bridge/unused/ec2/eks/get_ec2_table_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instance_id=${instance}` : null,
        fetcher
    )
    const allUnusedEc2Cards = useSWR(
        instance ? `/api/aws/bridge/unused/ec2/eks/cards_metrics_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&instance_id=${instance}` : null,
        fetcher
    )

    const unusedEc2TableData: UnusedEc2TableData[] | null =
        isNonEmptyArray<UnusedEc2TableData>(allUnusedEc2Table.data) ? allUnusedEc2Table.data : null;

    const unusedEc2CardsData: UnusedEc2CardsMetricSummary[] | null =
        isNonEmptyArray<UnusedEc2CardsMetricSummary>(allUnusedEc2Cards.data) ? allUnusedEc2Cards.data : null;

    const hasUnusedData = !!unusedEc2TableData || !!unusedEc2CardsData;

    const anyLoading =
        allUnusedEc2Table.isLoading ||
        allUnusedEc2Cards.isLoading


    const anyError =
        !!allUnusedEc2Table.error ||
        !!allUnusedEc2Cards.error

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningúna instancia.</div>
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

    if (!hasUnusedData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos instancias EC2 infrautilizadas en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    const instanceCount = unusedEc2TableData?.length;
    const totalUsdUnusedInstances = unusedEc2TableData.reduce((acc, curr) => acc + curr.billing.total_cost_usd, 0)

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedEc2CardsComponent
                        data={unusedEc2CardsData}
                        instanceCount={instanceCount}
                        totalUsdUnusedInstances={totalUsdUnusedInstances}
                    />
                </div>

                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Instances de EKS Infrautilizadas</h1>
                </div>
                <UnusedEc2TableComponent
                    data={unusedEc2TableData}
                />
            </div>
        </>
    )
}