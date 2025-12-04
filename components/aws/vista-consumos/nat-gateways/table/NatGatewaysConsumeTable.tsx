import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { NatGatewaysConsumeColumns } from '@/components/aws/vista-consumos/nat-gateways/table/NatGatewaysConsumeColumns';
import { NatGatewaysMetricsSummary } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';

interface NatGatewaysConsumeTableProps {
    data: NatGatewaysMetricsSummary[];
}

export const NatGatewaysConsumeTable = ({ data }: NatGatewaysConsumeTableProps) => {

    const natGwColumns = createColumns(NatGatewaysConsumeColumns);

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
                    columns={natGwColumns}
                    data={data}
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