import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { autoscalingGroupInstanceColumns } from '@/components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsInstancesColumns';
import { Calendar, AlertCircle, Users } from 'lucide-react';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';

interface AutoscalingGroupsResourceViewInstanciasComponentProps {
    data?: unknown;
    startDate: Date;
    endDate: Date;
    autoscalingGroup: string;
    isLoading?: boolean;
}

export const AutoscalingGroupsResourceViewInstanciasComponent = ({
    data,
    startDate,
    endDate,
    autoscalingGroup,
    isLoading = false
}: AutoscalingGroupsResourceViewInstanciasComponentProps) => {
    const instanceColumns = createColumns(autoscalingGroupInstanceColumns);
    const tableData = data || [];
    const instanceCount = Array.isArray(tableData) ? tableData.length : 0;


    return (
        <Card>
            <CardHeader className='border-b'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <Users className='h-5 w-5 text-orange-600' />
                            Instancias Autoscaling Group
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Historial de instancias del grupo <code className='bg-muted px-1 py-0.5 rounded text-xs'>{autoscalingGroup}</code>
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
                        <span className='ml-3'>Cargando instancias del Autoscaling Group...</span>
                    </div>
                ) : instanceCount === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <AlertCircle className='h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='text-lg font-semibold mb-2'>Sin instancias en el período</h3>
                        <p className='text-gray-500 mb-4 max-w-md'>
                            No se encontraron instancias para el grupo <strong>{autoscalingGroup}</strong> en el rango de fechas seleccionado.
                        </p>
                        <div className='text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg'>
                            💡 Tip: Prueba expandir el rango de fechas o verifica que el grupo tenga instancias activas
                        </div>
                    </div>
                ) : (
                    <DataTableGrouping
                        columns={instanceColumns}
                        data={tableData}
                        filterColumn='InstanceId'
                        filterPlaceholder='Buscar Instancia...'
                        groupByColumn='InstanceId'
                        enableGrouping={true}
                    />
                )}

                <div className='border-t bg-muted/50 px-6 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm text-muted-foreground flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            {isLoading ? (
                                'Cargando instancias...'
                            ) : (
                                <>
                                    Mostrando <strong>{instanceCount}</strong> instancias
                                    {instanceCount === 0 && ' '}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}