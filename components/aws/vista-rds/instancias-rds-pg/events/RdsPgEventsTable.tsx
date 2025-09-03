import { createColumns } from '@/components/general/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rdsPgEventColumns } from './RdsPgEventsColumns';
import { Calendar, Database, AlertCircle, Indent } from 'lucide-react';
import { json } from 'stream/consumers';
import { DataTableSingle } from '@/components/general/data-table/data-table-single';

interface RdsPgEventsTableComponentProps {
    data?: unknown;
    startDate: Date;
    endDate: Date;
    instance: string;
    isLoading?: boolean;
}

export const RdsPgEventsTableComponent = ({
    data,
    startDate,
    endDate,
    instance,
    isLoading = false
}: RdsPgEventsTableComponentProps) => {
    const eventsColumns = createColumns(rdsPgEventColumns);
    const tableData = data || [];
    const eventCount = Array.isArray(tableData) ? tableData.length : 0;
    return (
        <Card>
            <CardHeader className='border-b'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <Database className='h-5 w-5 text-purple-600' />
                            Historial de Eventos RDS
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Actividad reciente de la instancia <code className='bg-muted px-1 py-0.5 rounded text-xs'>{instance}</code>
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
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
                        <span className='ml-3'>Cargando eventos de RDS...</span>
                    </div>
                ) : eventCount === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <AlertCircle className='h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='text-lg font-semibold mb-2'>Sin eventos en el perí­odo</h3>
                        <p className='text-gray-500 mb-4 max-w-md'>
                            No se encontraron eventos para la instancia <strong>{instance}</strong> en el rango de fechas seleccionado.
                        </p>
                        <div className='text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg'>
                            💡 Tip: Prueba expandir el rango de fechas o verifica que la instancia tenga actividad
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
                            <Database className='h-4 w-4' />
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