'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping'; // Asumiendo que existe
import { TrafficManagerDataHistory } from '@/interfaces/vista-traffic-manager/trafficManagerInterfaces';
import { RecursosTrafficManagerColumns } from '@/components/azure/vista-recursos-tm/table/RecursosTrafficManagerColumns';

interface RecursosTrafficManagerTableProps {
    historyData: TrafficManagerDataHistory[];
}

export const RecursosTrafficManagerTable = ({ historyData }: RecursosTrafficManagerTableProps) => {
    // Ordenar historial por fecha descendente (más reciente primero)
    const sortedData = [...historyData].sort((a, b) =>
        new Date(b._cq_sync_time).getTime() - new Date(a._cq_sync_time).getTime()
    );

    return (
        <Card>
            <CardHeader className="border-b">
                {/* <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Historial de Cambios y Estado
                </CardTitle> */}
            </CardHeader>
            <CardContent className="pt-6">
                <DataTableGrouping
                    columns={RecursosTrafficManagerColumns}
                    data={sortedData}
                    // Desactivamos agrupamiento complejo para esta vista simple
                    enableGrouping={false}
                    pageSizeItems={5}
                />
            </CardContent>
        </Card>
    )
}