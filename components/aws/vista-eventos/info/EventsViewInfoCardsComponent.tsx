import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Boxes, ChevronDown, ChevronUp, Computer, Cpu, Database, HardDrive, Inbox, List, ListChecks, Minus, MonitorCheck, MonitorX, Network, Server, Table2, Zap } from 'lucide-react';
import { Ec2ConsumeViewAttachedDiskHistoricComponent } from '@/components/aws/vista-eventos/info/Ec2ConsumeViewAttachedDiskHistoricComponent';
import { Ec2ConsumeViewStoppedInstancesHistoricComponent } from '@/components/aws/vista-eventos/info/Ec2ConsumeViewStoppedInstancesHistoricComponent';
import { Ec2ConsumeViewInUseInterfacesHistoricComponent } from '@/components/aws/vista-eventos/info/Ec2ConsumeViewInUseInterfacesHistoricComponent';
import { Ec2ConsumneViewInstance } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
import { EventsApiResponse } from '@/interfaces/vista-eventos/eventsViewInterfaces';

interface EventsViewInfoCardsComponentProps {
    infoData: EventsApiResponse | null;
}

const ICONS = {
    CreateNetworkInterface: Network,
    CreateTable: Table2,
    CreateDatabase: Database,
    CreateQueue: ListChecks,
    CreateBucket: Inbox,
    CreateAutoScalingGroup: Boxes,
    RunInstances: Server,
} as const;

const BORDERS = {
    CreateNetworkInterface: 'border-sky-500',
    CreateTable: 'border-emerald-500',
    CreateDatabase: 'border-amber-500',
    CreateQueue: 'border-purple-500',
    CreateBucket: 'border-blue-500',
    CreateAutoScalingGroup: 'border-rose-500',
    RunInstances: 'border-zinc-500',
} as const;

export const EventsViewInfoCardsComponent = ({ infoData }: EventsViewInfoCardsComponentProps) => {
    const noInfo = !infoData || infoData.length === 0;

    if (noInfo) {
        return <div className="text-center text-gray-500 py-6">No hay información para mostrar.</div>;
    }

    // Total global de eventos (suma de docs)
    const eventsData = infoData.map(inf => inf.events);
    let countEvents = 0;
    eventsData.forEach(event => {
        event.forEach(evData => {
            countEvents += evData.docs.length;
        });
    });

    // 1) NUEVO: contar total de docs por event_name en todo el periodo
    const countByEventName = (data: EventsApiResponse) => {
        return data
            .flatMap(r => r.events ?? [])
            .reduce<Record<string, number>>((acc, ev) => {
                const docsCount = Array.isArray(ev.docs) ? ev.docs.length : 0;
                acc[ev.event_name] = (acc[ev.event_name] ?? 0) + docsCount;
                return acc;
            }, {});
    };

    // 2) Usar el conteo anterior para construir las cards
    const buildEventCountCards = (
        data: EventsApiResponse,
        config?: {
            icons?: Partial<Record<string, React.ReactNode | string>>;
            borders?: Partial<Record<string, string>>;
            order?: string[];
            includeZero?: boolean;
            valueStyle?: string;
        }
    ) => {
        const counts = countByEventName(data);

        const keys = config?.order ?? Object.keys(counts).sort();
        return keys
            .filter(k => (config?.includeZero ? true : (counts[k] ?? 0) > 0))
            .map(k => ({
                title: `Cantidad de eventos de tipo ${k}`,
                subtitle: `Cantidad de eventos de tipo ${k} en el periodo seleccionado`,
                value: counts[k] ?? 0,
                icon: config?.icons?.[k] ?? null,
                borderColor: config?.borders?.[k] ?? '',
                valueStyle:
                    config?.valueStyle ??
                    'text-xl text-center font-bold text-foreground tracking-tight',
            }));
    };

    const cardsPerEventCount = buildEventCountCards(infoData, {
        icons: ICONS,
        borders: BORDERS,
        order: Object.keys(ICONS),
    }); // ahora muestra totales de eventos (docs) por tipo

    const eventsGeneralData = [
        {
            title: 'Cantidad de Eventos',
            subtitle: 'Cantidad de eventos en el periodo seleccionado',
            value: countEvents,
            icon: Cpu,
            borderColor: 'border-l-blue-500',
            valueStyle: 'text-3xl text-center font-bold text-foreground tracking-tight',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {eventsGeneralData.map((ev, index) => {
                    const IconComponent = ev.icon;
                    return (
                        <Card key={index} className={`${ev.borderColor} border-l-4 group`}>
                            <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                        <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-md font-medium text-muted-foreground mt-2">{ev.title}</h3>
                                <div className="mt-auto">
                                    {ev.value && <p className={ev.valueStyle}>{ev.value}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cardsPerEventCount.map((events, index) => {
                    const IconComponent = events.icon as React.ElementType;
                    return (
                        <Card key={index} className={`${events.borderColor} border-l-4 group`}>
                            <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                        {IconComponent && <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                    </div>
                                </div>
                                <h3 className="text-md font-medium text-muted-foreground mt-2">{events.title}</h3>
                                <div className="mt-auto">
                                    {events.value && (
                                        <p className={events.valueStyle}>
                                            {typeof (events as unknown as { format?: (n: number) => string }).format === 'function'
                                                ? (events as unknown as { format: (n: number) => string }).format(events.value as number)
                                                : events.value}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{/* ...otros bloques opcionales... */}</div>
        </div>
    );
};
