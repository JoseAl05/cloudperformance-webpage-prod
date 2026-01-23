import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EbsUnusedViewColumns } from '@/components/aws/vista-funciones/unused-ebs/table/EbsUnusedViewColumns';
import { UnusedEbsVolumeInfo } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';

interface EbsUnusedViewTableComponentProps {
    data: UnusedEbsVolumeInfo[] | null,
    startDate: Date,
    endDate: Date,
    ebs: string
}

export const EbsUnusedViewTableComponent = ({ data, startDate, endDate, ebs }: EbsUnusedViewTableComponentProps) => {
    const unusedEbsColumns = createColumns(EbsUnusedViewColumns);
    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            ☁️ Detalle Volúmenes EBS no utilizados
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={unusedEbsColumns}
                    data={data ?? []}
                    filterColumn='ebs_name'
                    filterPlaceholder='Buscar volúmen...'
                    enableGrouping
                    groupByColumn='ebs_name'
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay volumenes disponibles para mostrar.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}