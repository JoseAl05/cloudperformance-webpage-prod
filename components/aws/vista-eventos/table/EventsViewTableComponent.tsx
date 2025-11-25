import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import type {
    EventsApiResponse,
    AllEvents,
    EventGroup,
    AWSEvents as ApiDoc,
    EventsResources
} from '@/interfaces/vista-eventos/eventsViewInterfaces';
import { EventsViewColumns } from '@/components/aws/vista-eventos/table/EventsViewColumns';

export type FlatEventRow = ApiDoc & {
    EventName: string;
    ResourceTypes?: string;
    ResourceNames?: string;
    ResourceCount?: number;
};



interface EventsViewTableComponentProps {
    data: EventsApiResponse | FlatEventRow[] | null;
    startDate: Date,
    endDate: Date,
    eventType: string
}

const mapApiToFlatRows = (api: EventsApiResponse | null | undefined): FlatEventRow[] => {
    if (!Array.isArray(api)) return [];

    const rows: FlatEventRow[] = [];

    for (const batch of api as AllEvents[]) {
        for (const ev of (batch?.events ?? []) as EventGroup[]) {
            const name = ev?.event_name ?? '—';
            for (const d of (ev?.docs ?? []) as ApiDoc[]) {
                const res: EventsResources[] = d?.Resources ?? [];
                const resourceTypes = res.map(r => r?.ResourceType ?? '').filter(Boolean);
                const resourceNames = res.map(r => r?.ResourceName ?? '').filter(Boolean);

                rows.push({
                    ...d,
                    EventName: name,
                    ResourceTypes: resourceTypes.join(', '),
                    ResourceNames: resourceNames.join(', '),
                    ResourceCount: res.length,
                });
            }
        }
    }
    return rows;
}

export const EventsViewTableComponent = ({ data, startDate, endDate, eventType }: EventsViewTableComponentProps) => {
    const looksFlat =
        Array.isArray(data) &&
        data.length > 0 &&
        typeof (data as unknown)[0]?.EventName === 'string';

    const tableData: FlatEventRow[] = looksFlat
        ? (data as FlatEventRow[])
        : mapApiToFlatRows(data as EventsApiResponse | null);

    const eventsColumns = createColumns(EventsViewColumns);
    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            ☁️ Detalle recursos desplegados por Eventos de AWS
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={eventsColumns}
                    data={tableData ?? []}
                    filterColumn='EventName'
                    filterPlaceholder='Buscar evento...'
                    enableGrouping
                    groupByColumn='EventName'
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay eventos para mostrar.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}