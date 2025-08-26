'use client'

import { useEffect, useRef, useCallback, useState } from 'react';
import useSWR from 'swr';
import * as echarts from "echarts"
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

    const exportToCSV = () => {
        const headers = ['Nombre Evento', 'Recurso', 'Tipo Recurso', 'Fecha Evento', 'Fuente', 'Usuario', 'Estado', 'Región'];
        const data = ec2Events.data ? ec2Events.data : [];
        const csvData = [
            headers,
            ...data.map(event => [
                event.EventName,
                event.Resources_ResourceName,
                event.Resources_ResourceType,
                event.EventTime,
                event.EventSource,
                event.Username
            ])
        ];

        const csvContent = csvData.map(row =>
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `eventos-ec2-${instance}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const exportToExcel = () => {
        const headers = ['Nombre Evento', 'Fecha Evento', 'Fuente', 'Usuario'];
        const data = ec2Events.data ? ec2Events.data : [];
        const htmlContent = `
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .completed { color: #16a34a; }
                    .failed { color: #dc2626; }
                    .in-progress { color: #2563eb; }
                </style>
            </head>
            <body>
                <h2>📊 Eventos EC2 - Instancia ${instance}</h2>
                <p>Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</p>
                <p>Total de eventos: ${data.length}</p>
                <table>
                    <thead>
                        <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.map(evento =>
            `<tr>
                                <td>${evento.EventName}</td>
                                <td>${new Date(evento.EventTime).toLocaleString()}</td>
                                <td>${evento.EventSource}</td>
                                <td>${evento.Username}</td>
                            </tr>`
        ).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `eventos-ec2-${instance}-${new Date().toISOString().split('T')[0]}.xlsx`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const lastCpuCreditBalanceEc2 = ec2Metrics.data ? ec2Metrics.data.calculated_summary ? ec2Metrics.data.calculated_summary.Last_CPU_Credit_Balance_EC2 : 0 : 0
    const lastCpuCreditUsageEc2 = ec2Metrics.data ? ec2Metrics.data.calculated_summary ? ec2Metrics.data.calculated_summary.Last_CPU_Credit_Usage_EC2 : 0 : 0
    const percentageCreditsUsageEc2 = ec2Metrics.data ? ec2Metrics.data.calculated_summary ? ec2Metrics.data.calculated_summary.Porcentaje_Uso_Créditos_CPU_EC2 : 0 : 0
    const creditsEfficiencyEc2 = ec2Metrics.data ? ec2Metrics.data.calculated_summary ? ec2Metrics.data.calculated_summary.Eficiencia_Creditos_CPU_EC2_Instancia : "" : ""
    return (
        <>
            {/* <TestComponent /> */}
            <div className="mx-5 px-0 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-1">
                        <div className="space-y-6">
                            <Ec2ResourceViewInfoComponent
                                data={ec2Info.data}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='flex flex-col gap-5 pt-20'>
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
                    lastCpuCreditBalanceEc2={lastCpuCreditBalanceEc2}
                    lastCpuCreditUsageEc2={lastCpuCreditUsageEc2}
                    percentageCreditsUsageEc2={percentageCreditsUsageEc2}
                    creditsEfficiencyEc2={creditsEfficiencyEc2}
                />
                <Ec2ResourceViewUsageNetworkComponent
                    data={ec2Metrics.data}
                />
            </div>
            <div className="flex items-center gap-3 mb-8">
                <Clock className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Eventos de la Instancia</h1>
            </div>
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                ☁️ Historial de Eventos
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Actividad reciente de la instancia {instance}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={eventsColumns}
                        data={ec2Events.data ? ec2Events.data : []}
                    />
                    <div className="border-t bg-muted/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            {
                                ec2Events.data && (
                                    <div className="text-sm text-muted-foreground">

                                        Mostrando {ec2Events.data.length} eventos
                                    </div>
                                )
                            }
                            <div className="text-sm text-muted-foreground">
                                Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div> */}
        </>
    )
}