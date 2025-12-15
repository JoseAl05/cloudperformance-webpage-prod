// 'use client'

// import { createColumns } from '@/components/general_aws/data-table/columns';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
// import { Server } from 'lucide-react';
// import { LoadbalancerV2MetricsSummary } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
// import { getElbV2ConsumeColumns } from '@/components/aws/vista-consumos/elbv2/table/ElbV2ConsumeColumns';
// import { useMemo } from 'react';

// interface ElbV2ConsumeTableProps {
//     data: LoadbalancerV2MetricsSummary[];
// }

// export const ElbV2ConsumeTable = ({ data }: ElbV2ConsumeTableProps) => {

//     const globalTotals = useMemo(() => {
//         const acc = {
//             totalConsumedLCUs: 0,
//             totalProcessedBytes: 0,
//             totalRequestCount: 0,
//             totalNewFlowCount: 0,
//             totalActiveConnectionCount: 0,
//             totalTarget5xx: 0,
//             totalTcpReset: 0
//         };

//         if (!data || !Array.isArray(data)) return acc;

//         data.forEach(resource => {
//             resource.metrics.forEach(m => {
//                 const name = m.metric_name.toLowerCase();
//                 const val = m.value || 0;

//                 if (name.includes('consumedlcus average')) acc.totalConsumedLCUs += val;
//                 else if (name.includes('processedbytes average')) acc.totalProcessedBytes += val;
//                 else if (name.includes('requestcount average')) acc.totalRequestCount += val;
//                 else if (name.includes('newflowcount average')) acc.totalNewFlowCount += val;
//                 else if (name.includes('activeconnectioncount average')) acc.totalActiveConnectionCount += val;
//                 else if (name.includes('httpcode_target_5xx_count average')) acc.totalTarget5xx += val;
//                 else if (name.includes('tcp_client_reset_count average')) acc.totalTcpReset += val;
//             });
//         });

//         return acc;
//     }, [data]);

//     const processedData = useMemo(() => {
//         if (!data) return [];

//         return data.map(item => {
//             const metrics = item.metrics || [];
//             const getVal = (primary: string, secondary?: string) => {
//                 let m = metrics.find(x => x.metric_name.includes(primary));
//                 if (!m && secondary) m = metrics.find(x => x.metric_name.includes(secondary));
//                 return m?.value || 0;
//             };
//             return {
//                 ...item,
//                 lcu_metric: getVal('ConsumedLCUs Average'),
//                 bytes_metric: getVal('ProcessedBytes Average'),
//                 traffic_metric: getVal('RequestCount Average', 'NewFlowCount Average'),
//                 conn_metric: getVal('ActiveConnectionCount Average'),
//                 error_metric: getVal('HTTPCode_Target_5XX_Count Average'),
//                 tcp_client_reset_metric: getVal('TCP_Client_Reset_Count Average')
//             };
//         });
//     }, [data]);

//     const columns = useMemo(() => {
//         return createColumns(getElbV2ConsumeColumns(globalTotals));
//     }, [globalTotals]);

//     console.log(processedData);

//     return (
//         <Card>
//             <CardHeader className="border-b">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                         <CardTitle className="flex items-center gap-2">
//                             <Server className="h-5 w-5 text-blue-500" />
//                             Listado de Loadbalancers
//                         </CardTitle>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <DataTableGrouping
//                     columns={columns}
//                     data={processedData}
//                     filterColumn="resource"
//                     filterPlaceholder="Buscar loadbalancer por ARN..."
//                     enableGrouping={false}
//                     pageSizeItems={10}
//                 />
//                 {(!data || !Array.isArray(data) || data.length === 0) && (
//                     <div className="text-center text-gray-500 py-6">
//                         No hay Loadbalancers para mostrar.
//                     </div>
//                 )}
//                 <div className="border-t bg-muted/50 px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         {data && (
//                             <div className="text-sm text-muted-foreground">
//                                 Mostrando {data.length} recursos encontrados
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

'use client'

import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { LoadbalancerV2MetricsSummary } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { getElbV2ConsumeColumns } from '@/components/aws/vista-consumos/elbv2/table/ElbV2ConsumeColumns';
import { useMemo } from 'react';
import { get } from 'http';

interface ElbV2ConsumeTableProps {
    data: LoadbalancerV2MetricsSummary[];
}

export const ElbV2ConsumeTable = ({ data }: ElbV2ConsumeTableProps) => {

    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data.map(item => {
            const metrics = item.metrics || [];

            const getVal = (primary: string, secondary?: string) => {
                let m = metrics.find(x => x.metric_name.includes(primary));
                if (!m && secondary) m = metrics.find(x => x.metric_name.includes(secondary));
                return m?.value || 0;
            };

            return {
                ...item,
                lcu_metric: getVal('ConsumedLCUs Average'),
                bytes_metric: getVal('ProcessedBytes Average'),
                traffic_metric: getVal('RequestCount Average') || getVal('NewFlowCount Average'),
                conn_metric: getVal('ActiveConnectionCount Average'),
                error_metric: getVal('HTTPCode_Target_5XX_Count Average'),
                tcp_resets_metric: getVal('TCP_Client_Reset_Count Average')
            };
        });
    }, [data]);


    const globalTotals = useMemo(() => {
        return processedData.reduce((acc, row) => {
            return {
                totalConsumedLCUs: acc.totalConsumedLCUs + row.lcu_metric,
                totalProcessedBytes: acc.totalProcessedBytes + row.bytes_metric,
                totalRequestCount: acc.totalRequestCount + row.traffic_metric,
                totalNewFlowCount: 0,
                totalActiveConnectionCount: acc.totalActiveConnectionCount + row.conn_metric,
                totalTarget5xx: acc.totalTarget5xx + row.error_metric,
                totalTcpReset: acc.totalTcpReset + row.tcp_resets_metric
            };
        }, {
            totalConsumedLCUs: 0,
            totalProcessedBytes: 0,
            totalRequestCount: 0,
            totalNewFlowCount: 0,
            totalActiveConnectionCount: 0,
            totalTarget5xx: 0,
            totalTcpReset: 0
        });
    }, [processedData]);

    const columns = useMemo(() => {
        return createColumns(getElbV2ConsumeColumns({
            totalConsumedLCUs: globalTotals.totalConsumedLCUs,
            totalProcessedBytes: globalTotals.totalProcessedBytes,
            totalRequestCount: globalTotals.totalRequestCount,
            totalNewFlowCount: 0,
            totalActiveConnectionCount: globalTotals.totalActiveConnectionCount,
            totalTarget5xx: globalTotals.totalTarget5xx,
            totalTcpReset: 0
        }));
    }, [globalTotals]);


    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-blue-500" />
                            Listado de Loadbalancers
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="resource"
                    filterPlaceholder="Buscar loadbalancer por ARN..."
                    enableGrouping={false}
                    pageSizeItems={10} // OJO: Si tienes más de 10 items, los errores ocultos suman al total global.
                />
                {(!processedData || processedData.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay Loadbalancers para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {processedData && (
                            <div className="text-sm text-muted-foreground">
                                Mostrando {processedData.length} recursos encontrados
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}