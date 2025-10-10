import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AverageByLocation, AverageByLocationData } from '@/interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces'
import { cn } from '@/lib/utils';
import { BarChart2, Boxes, CalendarClock, ChartBar, MapPin } from 'lucide-react';

interface AverageByLocationCardsComponentProps {
    data: AverageByLocation[];
}

export const AverageByLocationCardsComponent = ({ data }: AverageByLocationCardsComponentProps) => {

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Promedios por localización</CardTitle>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                    No hay datos para mostrar.
                </CardContent>
            </Card>
        );
    }
    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='text-base font-semibold'>Información General</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <div className={cn('grid gap-2', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')}>
                    {data.map((loc) => {
                        const averages = loc.averages ?? [];
                        const totalSamples = averages.reduce((sum, m) => sum + (m.count ?? 0), 0);
                        const rangeAverages = averages.length;
                        const uniqueResources = new Set<string>();
                        for (const m of averages) {
                            const res = (m as AverageByLocationData)?.resources;
                            if (Array.isArray(res)) {
                                res.forEach((r) => uniqueResources.add(r));
                            }
                        }
                        const resourceCount = uniqueResources.size;
                        return (
                            <div
                                key={loc.location}
                                className={cn(
                                    'flex items-center justify-between rounded-md border p-3',
                                    'bg-slate-100/40',
                                    'dark:bg-slate-900/40'
                                )}
                                title={`${loc.location}: ${totalSamples} (${rangeAverages})`}
                            >
                                <div className='flex flex-col gap-5'>
                                    <div className='flex items-center gap-2 min-w-0'>
                                        <MapPin className='h-4 w-4 shrink-0 text-blue-500' />
                                        <span className='text-xl font-medium'>{loc.location}</span>
                                    </div>
                                    <div className='flex items-center gap-2 min-w-0'>
                                        <Boxes className='h-4 w-4 shrink-0 text-blue-500' />
                                        <span className=''>Total recursos analizados</span>
                                    </div>
                                    <div className='text-sm tabular-nums text-center border-2 p-2'>
                                        <span className='text-foreground font-semibold'>{resourceCount}</span>
                                    </div>
                                    <div className='flex items-center gap-2 min-w-0'>
                                        <ChartBar className='h-4 w-4 shrink-0 text-blue-500' />
                                        <span className=''>Cantidad de métricas analizadas</span>
                                    </div>
                                    <div className='text-sm tabular-nums text-center border-2 p-2'>
                                        <span className='text-foreground font-semibold'>{rangeAverages}</span>
                                    </div>
                                    <div className='flex items-center gap-2 min-w-0'>
                                        <CalendarClock className='h-4 w-4 shrink-0 text-blue-500' />
                                        <span className=''>Total Marcas de Tiempo analizadas</span>
                                    </div>
                                    <div className='text-sm tabular-nums text-center border-2 p-2'>
                                        <span className='text-foreground font-semibold'>{totalSamples}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}