'use client'

import { useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import * as echarts from "echarts"
import { ResourceViewUsageCpuComponent } from './graficos/ResourceViewUsageCpuComponent';
import { ResourceViewUsageCreditsComponent } from './graficos/ResourceViewUsageCreditsComponent';
import { ResourceViewUsageNetworkComponent } from './graficos/ResourceViewUsageNetworkComponent';

interface InstanceEc2CpuMetricsComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const InstanceEc2CpuMetricsComponent = ({ startDate, endDate, instance }: InstanceEc2CpuMetricsComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}`,
        fetcher
    )

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>

    return (
        <div className='pt-20'>
            <h1 className='text-xl font-bold'>Métricas</h1>
            <div className='flex flex-col items-center gap-10'>
                <ResourceViewUsageCpuComponent
                    data={data}
                />
                <ResourceViewUsageCreditsComponent
                    data={data}
                />
                <ResourceViewUsageNetworkComponent
                    data={data}
                />
            </div>
            {/* <div className='flex justify-center items-center gap-5'>
                <div
                    ref={chartRefCpuMetrics}
                    className='w-full h-[50vh]'
                />
                <div
                    ref={chartRefCpuCredits}
                    className='w-full h-[50vh]'
                />
            </div>
            <div>
                <div
                    ref={chartRefNetwork}
                    className='w-full h-[50vh]'
                />
            </div> */}
        </div>
    )
}