'use client'

import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { UnusedRoute53 } from '@/interfaces/vista-unused-resources/unusedRoutes53Interfaces';
import { getUnusedRoute53Columns } from '@/components/aws/vista-funciones/unused-r53/table/UnusedRoute53Columns';
import { Globe } from 'lucide-react';

interface UnusedRoute53TableProps {
    data: UnusedRoute53[];
}

export const UnusedRoute53Table = ({ data }: UnusedRoute53TableProps) => {

    const columns = createColumns(getUnusedRoute53Columns());

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            Route 53 Hosted Zones
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={data}
                    filterColumn="rs_name"
                    filterPlaceholder="Buscar por dominio..."
                    enableGrouping={false}
                    pageSizeItems={10}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay zonas infrautilizadas para mostrar.
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