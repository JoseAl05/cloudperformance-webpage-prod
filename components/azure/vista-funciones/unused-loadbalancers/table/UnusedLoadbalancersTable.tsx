import { createColumns } from '@/components/general/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general/data-table/data-table-grouping';
import { UnusedLb } from '@/interfaces/vista-unused-resources/unusedLbInterfaces';
import { UnusedLoadbalancersColumns } from '@/components/azure/vista-funciones/unused-loadbalancers/table/UnusedLoadbalancersColumns';

interface UnusedLoadbalancersTableProps {
    data: UnusedLb[];
}

export const UnusedLoadbalancersTable = ({ data }: UnusedLoadbalancersTableProps) => {

    const flattenedData: UnusedLb[] =
        data?.flatMap((item) => ({
            ...item,
            sync_time: new Date(item.sync_time).toLocaleString('es-CL')
        })
        ) ?? []

    const unusedLbColumns = createColumns(UnusedLoadbalancersColumns)

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Historial de Loadbalancers Infrautilizados
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={unusedLbColumns}
                    data={flattenedData}
                    filterColumn="name"
                    filterPlaceholder="Buscar loadbalancer…"
                    enableGrouping={false}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay loadbalancers para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {
                            data && (
                                <div className="text-sm text-muted-foreground">

                                    Mostrando {data.length} items
                                </div>
                            )
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}