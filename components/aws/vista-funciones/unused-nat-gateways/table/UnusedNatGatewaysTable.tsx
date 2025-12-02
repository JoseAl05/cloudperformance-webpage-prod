import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { getUnusedNatGwColumns } from '@/components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysColumns';
import { Network } from 'lucide-react';

interface UnusedNatGatewaysTableProps {
    data: UnusedNatGateways[];
    dateFrom: string;
    dateTo: string;
}

export const UnusedNatGatewaysTable = ({ data, dateFrom, dateTo }: UnusedNatGatewaysTableProps) => {

    const columns = createColumns(getUnusedNatGwColumns(dateFrom, dateTo));

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-blue-500" />
                            Nat Gateways
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={data}
                    filterColumn="nat_gw_id"
                    filterPlaceholder="Buscar por ID..."
                    enableGrouping={false}
                    pageSizeItems={10}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay NAT Gateways infrautilizados para mostrar.
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