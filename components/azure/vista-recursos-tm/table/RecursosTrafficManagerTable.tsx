'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { TrafficManagerDataHistory } from '@/interfaces/vista-traffic-manager/trafficManagerInterfaces';
import { RecursosTrafficManagerColumns } from '@/components/azure/vista-recursos-tm/table/RecursosTrafficManagerColumns';

interface RecursosTrafficManagerTableProps {
    historyData: TrafficManagerDataHistory[];
}

export const RecursosTrafficManagerTable = ({ historyData }: RecursosTrafficManagerTableProps) => {
    const sortedData = [...historyData].sort((a, b) =>
        new Date(b._cq_sync_time).getTime() - new Date(a._cq_sync_time).getTime()
    );

    return (
        <Card>
            <CardHeader className="border-b">
            </CardHeader>
            <CardContent className="pt-6">
                <DataTableGrouping
                    columns={RecursosTrafficManagerColumns}
                    data={sortedData}
                    enableGrouping={false}
                    pageSizeItems={5}
                />
            </CardContent>
        </Card>
    )
}