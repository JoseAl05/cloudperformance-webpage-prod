import { createColumns } from '@/components/general/data-table/columns';
import { DataTable } from '@/components/general/data-table/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { awsEventColumns } from './Ec2EventsColumns';

interface Ec2EventsTableComponentProps {
    data: unknown,
    startDate: Date,
    endDate: Date,
    instance: string
}

export const Ec2EventsTableComponent = ({ data, startDate, endDate, instance }: Ec2EventsTableComponentProps) => {
    const eventsColumns = createColumns(awsEventColumns);
    console.log(data.data);
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
                <DataTable
                    columns={eventsColumns}
                    data={data.data}
                />
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