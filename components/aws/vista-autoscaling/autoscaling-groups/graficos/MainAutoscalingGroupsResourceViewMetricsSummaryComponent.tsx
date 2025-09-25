'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Users, Clock, Globe } from 'lucide-react';

interface AutoscalingGroupData {
    sync_time: { $date: string };
    region: string;
    AutoScalingGroupName: string;
    CreatedTime: { $date: string };
    LaunchTemplate_LaunchTemplateId: string | null;
    LaunchTemplate_LaunchTemplateName: string | null;
    LaunchTemplate_Version: string | null;
    MinSize: number;
    MaxSize: number;
    Tags_Key: string[];
    Tags_Value: string[];
    Capacidad_Total_ASG: number;
    Launch_Template_Info_Formatted: string | null;
    Size_Range_Formatted: string;
    Total_Tags_ASG: number;
}

interface MainAutoscalingGroupsResourceViewMetricsSummaryProps {
    data: AutoscalingGroupData[] | null;
}

export const MainAutoscalingGroupsResourceViewMetricsSummaryComponent = ({
    data,
}: MainAutoscalingGroupsResourceViewMetricsSummaryProps) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className='text-center text-gray-500 py-6'>
                No hay métricas disponibles para mostrar.
            </div>
        );
    }

    const latestData = data[0]; // Tomar el primer elemento sin sorting complicado
    const today = new Date().toLocaleDateString();
    
    // Formatear la fecha de creación de forma bonita
    const createdDate = new Date(latestData.CreatedTime.$date);
    const formattedCreatedDate = createdDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedCreatedTime = createdDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Card className='border-l-blue-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group'>
                    <CardContent className='p-4 flex flex-col h-full'>
                        <div className='flex items-center justify-between'>
                            <div className='p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 group-hover:scale-110'>
                                <Clock className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                            </div>
                            <p className='text-xs text-muted-foreground font-medium'>{today}</p>
                        </div>
                        <h3 className='text-sm font-medium text-muted-foreground mt-2'>Fecha de Creación</h3>
                        <div className='mt-auto'>
                            <p className='text-lg font-bold text-foreground tracking-tight'>
                                {formattedCreatedDate}
                            </p>
                            <p className='text-sm text-muted-foreground mt-1'>
                                a las {formattedCreatedTime}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className='border-l-green-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group'>
                    <CardContent className='p-4 flex flex-col h-full'>
                        <div className='flex items-center justify-between'>
                            <div className='p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 group-hover:scale-110'>
                                <Activity className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                            </div>
                            <p className='text-xs text-muted-foreground font-medium'>{today}</p>
                        </div>
                        <h3 className='text-sm font-medium text-muted-foreground mt-2'>Días Funcionamiento</h3>
                        <div className='mt-auto'>
                            <p className='text-xl font-bold text-foreground tracking-tight'>
                                {Math.floor((new Date().getTime() - new Date(latestData.CreatedTime.$date).getTime()) / (1000 * 60 * 60 * 24))} días
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};