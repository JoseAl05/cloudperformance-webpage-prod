import { Card, CardContent } from '@/components/ui/card';
import { UnusedEbs } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces';
import { HardDrive } from 'lucide-react';
import { useMemo } from 'react';

interface EbsUnusedViewInfoCardsComponentProps {
    ebsData: UnusedEbs[] | null;
}

export const countUniqueVolumesByName = (rows: UnusedEbs[]): number => {
    const ebsNames = new Set<string>();

    for (const row of rows ?? []) {
        for (const vol of row.ebs_info ?? []) {
            const key = vol.ebs_name?.trim().toLowerCase();
            if (key) ebsNames.add(key);
        }
    }

    return ebsNames.size;
}

export const EbsUnusedViewInfoCardsComponent = ({ ebsData }: EbsUnusedViewInfoCardsComponentProps) => {

    const noInfo = !ebsData || ebsData.length === 0;
    const uniqueEbsCount = useMemo(() => countUniqueVolumesByName(ebsData), [ebsData]);
    if (noInfo) {
        return <div className="text-center text-gray-500 py-6">No hay información para mostrar.</div>;
    }

    const sortedInfo = (ebsData ? [...ebsData] : [])
        .sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());

    const latestEbsInfoSync = sortedInfo[0]?.sync_time;

    const referenceDate = latestEbsInfoSync ? new Date(latestEbsInfoSync) : new Date();
    const today = new Date();
    const isToday = referenceDate.getDate() === today.getDate()
        && referenceDate.getMonth() === today.getMonth()
        && referenceDate.getFullYear() === today.getFullYear();
    const dateLabel = referenceDate.toLocaleDateString();

    const ebsCardData = [
        {
            title: 'Cantidad volúmenes no utilizados',
            value: !noInfo ? `${uniqueEbsCount}` : 'Sin Datos',
            icon: HardDrive,
            borderColor: !noInfo ? 'border-l-red-500' : 'border-l-green-500',
            subtitle: (isToday ? 'Actual' : dateLabel),
            valueStyle: 'text-3xl font-bold text-foreground tracking-tight'
        }
    ];
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {
                    ebsCardData.map((ebs, index) => {
                        const IconComponent = ebs.icon;
                        return (
                            <Card key={index} className={`${ebs.borderColor} border-l-4 group`}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                                            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">{ebs.subtitle}</p>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mt-2">{ebs.title}</h3>
                                    <div className="mt-auto">
                                        <p className={ebs.valueStyle}>
                                            {ebs.value}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}