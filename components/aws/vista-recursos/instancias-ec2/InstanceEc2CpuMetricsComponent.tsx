'use client'

import { useEffect, useRef, useCallback, useState } from 'react';
import useSWR from 'swr';
import * as echarts from 'echarts'
import { Ec2ResourceViewUsageCpuComponent } from './graficos/Ec2ResourceViewUsageCpuComponent';
import { Ec2ResourceViewUsageCreditsComponent } from './graficos/Ec2ResourceViewUsageCreditsComponent';
import { Ec2ResourceViewUsageNetworkComponent } from './graficos/Ec2ResourceViewUsageNetworkComponent';
import { Ec2ResourceViewInfoComponent } from './info/Ec2ResourceViewInfoComponent';
import { Calendar1, Clock, FileSpreadsheet, Search, Server } from 'lucide-react';
import { DataTable } from '@/components/general/data-table/data-table';
import { createColumns } from '@/components/general/data-table/columns';
import { awsEventColumns } from './events/Ec2EventsColumns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TestComponent } from './graficos/TestComponent';
import { MainEc2ResourceViewMetricsSummaryComponent } from './graficos/MainEc2ResourceViewMetricsSummaryComponent';

interface InstanceEc2CpuMetricsComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

export const InstanceEc2CpuMetricsComponent = ({ startDate, endDate, instance }: InstanceEc2CpuMetricsComponentProps) => {

    const [searchTerm, setSearchTerm] = useState('');
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const ec2Metrics = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    )

    const ec2Info = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_id=${instance}` : null,
        fetcher
    )

    const ec2Events = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2-events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    )

    if (ec2Metrics.isLoading) return <div>Cargando...</div>
    if (ec2Metrics.error) return <div>Error al cargar datos</div>
    if (ec2Info.isLoading) return <div>Cargando...</div>
    if (ec2Info.error) return <div>Error al cargar datos</div>
    if (ec2Events.isLoading) return <div>Cargando...</div>
    if (ec2Events.error) return <div>Error al cargar datos</div>

    const eventsColumns = createColumns(awsEventColumns);
    if (!instance) {
        return (
            <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className='text-center text-gray-500 text-lg font-medium'>
                    No se ha seleccionado ninguna instancia.
                </div>
            </div>
        );
    }
    const metricsData = ec2Metrics.data;
    const infoData = ec2Info.data;

    if (!metricsData || !metricsData.metrics_data || metricsData.metrics_data.length === 0) {
        return (
            <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className='text-center text-gray-500 text-lg font-medium'>
                    No hay métricas disponibles para esta instancia en el rango seleccionado.
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <TestComponent /> */}
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    {/* Panel izquierdo */}
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <Ec2ResourceViewInfoComponent data={infoData} />
                    </div>

                    {/* Área principal */}
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} />
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <Ec2ResourceViewUsageCreditsComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageCpuComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageNetworkComponent
                        data={metricsData}
                    />
                </div>
            </div>
        </>
    )
}