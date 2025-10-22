'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { useSearchParams } from 'next/navigation';
import { SpotVsRegularVmInstances } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}

export const SpotVsRegularVmColumns: DynamicColumn<SpotVsRegularVmInstances>[] = [
    {
        header: "Fecha Observación",
        accessorKey: "sync_time",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="text-sm text-muted-foreground font-mono">
                    {value}
                </div>
            );
        }
    },
    {
        header: "Nombre VM",
        accessorKey: "vm_name",
        cell: (info) => {
            const value = info.getValue() as string;
            const startDate = DateParams().startDateParam;
            const endDate = DateParams().endDateParam
            return (
                <div className="font-medium">
                    <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                        {value}
                    </Badge>
                    {/* <Link
                        href={{ pathname: '/aws/recursos/instancias-ec2', query: { instance: value, startDate: startDate, endDate: endDate } }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                            {value}
                        </Badge>
                    </Link> */}
                </div>
            );
        }
    },
    {
        header: "Localización",
        accessorKey: "location",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        accessorKey: "priority",
        header: "Tipo VM",
        cell: (info) => {
            const value = info.getValue() as string;
            const isRegular = value === "Regular";
            const isSpot = value === "Spot";

            return (
                <>
                    {isRegular && (
                        <Badge variant="warning" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                            {value}
                        </Badge>
                    )}
                    {isSpot && (
                        <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                            {value}
                        </Badge>
                    )}
                </>
            );
        },
    }
]