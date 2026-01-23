import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { UnusedElbV2Details } from '@/interfaces/vista-unused-resources/unusedElbV2Interfaces';
import { getUnusedElbV2Columns, GlobalMetricsSummary } from '@/components/aws/vista-funciones/unused-elbv2/table/UnusedElbV2Columns';
import { Activity } from 'lucide-react';

interface UnusedElbV2TableProps {
    data: UnusedElbV2Details[];
    globalMetrics?: GlobalMetricsSummary;
    dateFrom: string;
    dateTo: string;
}

export const UnusedElbV2Table = ({ data, globalMetrics, dateFrom, dateTo }: UnusedElbV2TableProps) => {

    const columns = createColumns(getUnusedElbV2Columns(dateFrom, dateTo, globalMetrics));

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="h-5 w-5 text-blue-500" />
                            Load Balancers Infrautilizados
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Listado detallado de recursos comparados con el promedio de uso del grupo.
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4">
                    <DataTableGrouping
                        columns={columns}
                        data={data}
                        filterColumn="elb_arn"
                        filterPlaceholder="Buscar por ARN..."
                        enableGrouping={false}
                        pageSizeItems={10}
                    />
                </div>
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-10">
                        No hay Load Balancers infrautilizados para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-3">
                    <div className="flex items-center justify-between">
                        {data && (
                            <div className="text-xs text-muted-foreground">
                                Mostrando {data.length} recursos encontrados
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}