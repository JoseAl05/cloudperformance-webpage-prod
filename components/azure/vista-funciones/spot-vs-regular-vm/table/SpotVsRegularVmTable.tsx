import { createColumns } from '@/components/general/data-table/columns';
import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces'
import { SpotVsRegularVmColumns } from '@/components/azure/vista-funciones/spot-vs-regular-vm/table/SpotVsRegularVmColumns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general/data-table/data-table-grouping';

interface SpotVsRegularVmTableProps {
    data: SpotVsRegularVm[];
}

export const SpotVsRegularVmTable = ({ data }: SpotVsRegularVmTableProps) => {

    const flattenedData =
        data?.flatMap((item) =>
            item.instancias.map((instancia) => ({
                sync_time: new Date(item.sync_time).toLocaleString('es-CL'),
                vm_name: instancia.vm_name,
                location: instancia.location,
                priority: instancia.priority
            }))
        ) ?? []

    const spotVsRegularVmColumns = createColumns(SpotVsRegularVmColumns);

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Historial Spot vs Máquinas Virtuales
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Instancias agrupadas por fecha de observación
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <DataTableGrouping
                    columns={spotVsRegularVmColumns}
                    data={flattenedData}
                    filterColumn="vm_name"
                    filterPlaceholder="Buscar VM…"
                    enableGrouping={true}
                    groupByColumn="sync_time"
                />

                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {flattenedData && (
                            <div className="text-sm text-muted-foreground">
                                Mostrando {flattenedData.length} vms
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}