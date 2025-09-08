import { createColumns } from '@/components/general/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { awsEventColumns } from './Ec2EventsColumns';
import { DataTableSingle } from '@/components/general/data-table/data-table-single';

interface Ec2EventsTableComponentProps {
    data: unknown,
    startDate: Date,
    endDate: Date,
    instance: string
}

export const Ec2EventsTableComponent = ({ data, startDate, endDate, instance }: Ec2EventsTableComponentProps) => {
    const eventsColumns = createColumns(awsEventColumns);
    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            ☁️ Historial de Eventos
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Actividad reciente de la instancia {instance}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableSingle
                    columns={eventsColumns}
                    data={Array.isArray(data?.data) ? data.data : []}
                    filterColumn='EventName'
                    filterPlaceholder='Buscar Evento...'
                />
                {(!data || !Array.isArray(data.data) || data.data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay eventos disponibles para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {
                            data && (
                                <div className="text-sm text-muted-foreground">

                                    Mostrando {data.length} eventos
                                </div>
                            )
                        }
                        <div className="text-sm text-muted-foreground">
                            Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}