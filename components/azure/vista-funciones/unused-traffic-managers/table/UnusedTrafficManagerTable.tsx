import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { UnusedTm } from '@/interfaces/vista-unused-resources/unusedTmInterfaces';
import { UnusedTrafficManagerColumns } from '@/components/azure/vista-funciones/unused-traffic-managers/table/UnusedTrafficManagerColumns';

interface UnusedTrafficManagerTableProps {
    data: UnusedTm[];
}

export const UnusedTrafficManagerTable = ({ data }: UnusedTrafficManagerTableProps) => {

    // No aplanamos aquí porque queremos mantener el objeto 'appGw' completo
    // con su array 'metrics' y 'details' para pasarlo al Modal.
    // DataTableGrouping manejará la paginación de estos objetos raíz.

    const tmColumns = createColumns(UnusedTrafficManagerColumns);

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-blue-500" />
                            Listado de Oportunidades
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={tmColumns}
                    data={data}
                    filterColumn="name"
                    filterPlaceholder="Buscar perfil traffic manager por nombre..."
                    enableGrouping={false}
                    pageSizeItems={10}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay Traffic Managers para mostrar.
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