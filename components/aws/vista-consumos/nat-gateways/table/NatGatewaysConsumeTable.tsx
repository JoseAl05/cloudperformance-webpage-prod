'use client'

import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { getNatGatewaysConsumeColumns } from '@/components/aws/vista-consumos/nat-gateways/table/NatGatewaysConsumeColumns';
import { NatGatewaysMetricsSummary } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { useMemo } from 'react';

interface NatGatewaysConsumeTableProps {
    data: NatGatewaysMetricsSummary[];
}

export const NatGatewaysConsumeTable = ({ data }: NatGatewaysConsumeTableProps) => {

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
                bytesOut: getVal('BytesOutToDestination Average'),
                bytesIn: getVal('BytesInFromSource Average'),
                connections: getVal('ActiveConnectionCount Average'),
                errors: getVal('ErrorPortAllocation Average')
            };
        });
    }, [data]);

    const globalTotals = useMemo(() => {
        return processedData.reduce((acc, row) => {
            return {
                totalBytesOut: acc.totalBytesOut + row.bytesOut,
                totalBytesIn: acc.totalBytesIn + row.bytesIn,
                totalConnections: acc.totalConnections + row.connections,
                totalErrorsPort: acc.totalErrorsPort + row.errors
            };
        }, {
            totalBytesOut: 0,
            totalBytesIn: 0,
            totalConnections: 0,
            totalErrorsPort: 0
        });
    }, [processedData]);

    const columns = useMemo(() => {
        return createColumns(getNatGatewaysConsumeColumns({
            totalBytesOut: globalTotals.totalBytesOut,
            totalBytesIn: globalTotals.totalBytesIn,
            totalConnections: globalTotals.totalConnections,
            totalErrorsPort: globalTotals.totalErrorsPort
        }));
    }, [globalTotals]);


    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-blue-500" />
                            Listado de Nat Gateways
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="resource"
                    filterPlaceholder="Buscar nat gateway por nombre..."
                    enableGrouping={false}
                    pageSizeItems={10}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay Nat Gateways para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {data && (
                            <div className="text-sm text-muted-foreground">
                                Mostrando {data.length} recursos encontrados
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}