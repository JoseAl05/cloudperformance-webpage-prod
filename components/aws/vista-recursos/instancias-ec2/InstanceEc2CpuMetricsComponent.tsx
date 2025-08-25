'use client'

import { useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import * as echarts from "echarts"
import { Ec2ResourceViewUsageCpuComponent } from './graficos/Ec2ResourceViewUsageCpuComponent';
import { Ec2ResourceViewUsageCreditsComponent } from './graficos/Ec2ResourceViewUsageCreditsComponent';
import { Ec2ResourceViewUsageNetworkComponent } from './graficos/Ec2ResourceViewUsageNetworkComponent';
import { Ec2ResourceViewInfoComponent } from './info/Ec2ResourceViewInfoComponent';
import { Server } from 'lucide-react';

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
    // const ec2Metrics = useSWR(
    //     instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
    //     fetcher
    // )

    // const ec2Info = useSWR(
    //     instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_id=${instance}` : null,
    //     fetcher
    // )
    const ec2Metrics = useSWR(
        instance ? `/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    )

    const ec2Info = useSWR(
        instance ? `/vm/instancias-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_id=${instance}` : null,
        fetcher
    )

    if (ec2Metrics.isLoading) return <div>Cargando...</div>
    if (ec2Metrics.error) return <div>Error al cargar datos</div>
    if (ec2Info.isLoading) return <div>Cargando...</div>
    if (ec2Info.error) return <div>Error al cargar datos</div>

    return (
        <div className='flex flex-col gap-5 pt-20'>
            <div className="flex items-center gap-3 mb-8">
                <Server className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Registro Instancia</h1>
            </div>
            <Ec2ResourceViewInfoComponent
                data={ec2Info.data}
            />
            <h1 className='text-3xl font-bold'>Métricas</h1>
            <div className='flex flex-col items-center gap-10'>
                <Ec2ResourceViewUsageCpuComponent
                    data={ec2Metrics.data}
                />
                <Ec2ResourceViewUsageCreditsComponent
                    data={ec2Metrics.data}
                />
                <Ec2ResourceViewUsageNetworkComponent
                    data={ec2Metrics.data}
                />
            </div>
        </div>
    )
}