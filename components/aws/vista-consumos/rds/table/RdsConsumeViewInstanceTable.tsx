import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import { RdsConsumeViewInstanceColumns } from '@/components/aws/vista-consumos/rds/table/RdsConsumeViewInstanceColumns';

interface RdsConsumeViewInstanceTableProps {
    data: {
        data?: RdsConsumeViewInstance[];
        length?: number;
    } | RdsConsumeViewInstance[] | null | undefined,
    startDate: Date,
    endDate: Date,
    instance: string,
    enableGrouping?: boolean
}

export const RdsConsumeViewInstanceTable = ({
    data,
    startDate,
    endDate,
    instance,
    enableGrouping = false
}: RdsConsumeViewInstanceTableProps) => {
    const instanceColumns = createColumns(RdsConsumeViewInstanceColumns);

    let tableData: RdsConsumeViewInstance[] = [];
    let totalRecords = 0;

    if (Array.isArray(data)) {
        tableData = data;
        totalRecords = data.length;
    } else if (data && typeof data === 'object') {
        tableData = data.data || [];
        totalRecords = data.length || tableData.length;
    }

    if (!data) {
        return (
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                ☁️ Historial de Instancias
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Eficiencias de las instancias
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-muted-foreground">Cargando datos...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const isEmpty = tableData.length === 0;

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            ☁️ Historial de Instancias
                            {enableGrouping && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    (Agrupado por instancia)
                                </span>
                            )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Eficiencias de las instancias
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={instanceColumns}
                    data={tableData}
                    filterColumn='resource'
                    filterPlaceholder='Buscar Instancia...'
                    enableGrouping={enableGrouping}
                    groupByColumn='resource'
                />
                {isEmpty && (
                    <div className="mt-6 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay registros para mostrar.</p>
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {tableData.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                                Mostrando {totalRecords} registros
                                {enableGrouping && (
                                    <span className="ml-2">
                                        • {new Set(tableData.map(item => item.resource)).size} instancias únicas
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                            Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}