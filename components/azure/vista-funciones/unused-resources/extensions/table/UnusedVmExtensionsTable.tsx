import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { UnusedVmss } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { UnusedVmExtensions } from '@/interfaces/vista-unused-resources/unusedVmExtensionsInterfaces';
import { UnusedVmExtensionsColumns } from '@/components/azure/vista-funciones/unused-resources/extensions/table/UnusedVmExtensionsColumns';

interface UnusedVmExtensionsTableProps {
    data: UnusedVmExtensions[];
}

export const UnusedVmExtensionsTable = ({ data }: UnusedVmExtensionsTableProps) => {

    const flattenedData: UnusedVmss[] =
        data?.flatMap((item) => ({
            ...item,
            _cq_sync_time: new Date(item._cq_sync_time).toLocaleString('es-CL')
        })
        ) ?? []

    const unusedVmExtensionsColumns = createColumns(UnusedVmExtensionsColumns)

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Detalle historico de Extensiones no utilziadas
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={unusedVmExtensionsColumns}
                    data={flattenedData}
                    filterColumn="vm_name"
                    filterPlaceholder="Buscar VM…"
                    enableGrouping={true}
                    groupByColumn="_cq_sync_time"
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay extensiones para mostrar.
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