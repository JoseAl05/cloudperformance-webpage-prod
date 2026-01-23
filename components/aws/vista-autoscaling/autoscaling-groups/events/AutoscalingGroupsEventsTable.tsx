import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { autoscalingGroupEventColumns } from '@/components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsColumns';
import { Calendar, Settings, AlertCircle } from 'lucide-react';
import { DataTableSingle } from '@/components/data-table/data-table-single';

interface AutoscalingGroupsEventsTableComponentProps {
    data?: unknown;
    startDate: Date;
    endDate: Date;
    autoscalingGroup: string;
    isLoading?: boolean;
}

export const AutoscalingGroupsEventsTableComponent = ({
    data,
    startDate,
    endDate,
    autoscalingGroup,
    isLoading = false
}: AutoscalingGroupsEventsTableComponentProps) => {
    const eventsColumns = autoscalingGroupEventColumns;
    
    // Ahora la API devuelve directamente un array, no un objeto con basic_events
    const tableData = Array.isArray(data) ? data : [];
    const eventCount = tableData.length;

    return (
        <Card>
            <CardHeader className='border-b'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <Settings className='h-5 w-5 text-orange-600' />
                            Historial de Eventos Autoscaling Group
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Actividad reciente del grupo <code className='bg-muted px-1 py-0.5 rounded text-xs'>{autoscalingGroup}</code>
                        </p>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4' />
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500'></div>
                        <span className='ml-3'>Cargando eventos del Autoscaling Group...</span>
                    </div>
                ) : eventCount === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <AlertCircle className='h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='text-lg font-semibold mb-2'>Sin eventos en el período</h3>
                        <p className='text-gray-500 mb-4 max-w-md'>
                            No se encontraron eventos para el grupo <strong>{autoscalingGroup}</strong> en el rango de fechas seleccionado.
                        </p>
                        <div className='text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg'>
                            💡 Tip: Prueba expandar el rango de fechas o verifica que el grupo tenga actividad
                        </div>
                    </div>
                ) : (
                    <DataTableSingle
                        columns={eventsColumns}
                        data={tableData}
                        filterColumn='EventName'
                        filterPlaceholder='Buscar Evento...'
                    />
                )}

                <div className='border-t bg-muted/50 px-6 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm text-muted-foreground flex items-center gap-2'>
                            <Settings className='h-4 w-4' />
                            {isLoading ? (
                                'Cargando eventos...'
                            ) : (
                                <>
                                    Mostrando <strong>{eventCount}</strong> eventos
                                    {eventCount === 0 && ' '}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}