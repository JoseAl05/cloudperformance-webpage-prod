import { createColumns } from '@/components/general/data-table/columns';
import { UnusedVm } from '@/interfaces/vista-unused-resources/unusedVmInterfaces'
import { UnusedVmColumns } from '@/components/azure/vista-funciones/unused-resources/vm/table/UnusedVmColumns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general/data-table/data-table-grouping';
import { UnusedVmss } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { UnusedVmssColumns } from './UnusedVmssColumns';

interface UnusedVmssTableProps {
    data: UnusedVmss[];
}

export const UnusedVmssTable = ({ data }: UnusedVmssTableProps) => {

    const flattenedData: UnusedVmss[] =
        data?.flatMap((item) => ({
            ...item,
            sync_time: new Date(item.sync_time).toLocaleString('es-CL')
        })
        ) ?? []

    const unusedVmssColumns = createColumns(UnusedVmssColumns)

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Historial de VMSS Infrautilizadas
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={unusedVmssColumns}
                    data={flattenedData}
                    filterColumn="vm_name"
                    filterPlaceholder="Buscar VMSS…"
                    enableGrouping={true}
                    groupByColumn="sync_time"
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay VMSS para mostrar.
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