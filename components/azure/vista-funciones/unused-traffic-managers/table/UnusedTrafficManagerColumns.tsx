'use client'

import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { UnusedTm } from '@/interfaces/vista-unused-resources/unusedTmInterfaces';
import { UnusedTrafficManagerInsightModal } from '@/components/azure/vista-funciones/unused-traffic-managers/info/UnusedTrafficManagerInsightModal';
import Link from 'next/link';

const DetailsCell = ({ tm }: { tm: UnusedTm }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 cursor-pointer hover:bg-accent text-blue-600"
                onClick={() => setOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Análisis
            </Button>

            <UnusedTrafficManagerInsightModal
                tm={tm}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

const QueryParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const resourceGroupParam = searchParams.get('resourceGroup');
    const tagKeyParam = searchParams.get('tagKey');
    const tagValueParam = searchParams.get('tagValue');
    const unusedTmParam = searchParams.get('unused_tm');



    return {
        startDateParam: startDateParam || '',
        endDateParam: endDateParam || '',
        resourceGroup: resourceGroupParam || '',
        tagKey: tagKeyParam || '',
        tagValue: tagValueParam || '',
        unusedTm: unusedTmParam || ''
    }
}

export const UnusedTrafficManagerColumns: DynamicColumn<UnusedTm>[] = [
    {
        header: "Nombre Traffic Manager",
        accessorKey: "name",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;
            const startDate = QueryParams().startDateParam;
            const endDate = QueryParams().endDateParam;
            const resourceGroup = QueryParams().resourceGroup;
            const tagKey = QueryParams().tagKey;
            const tagValue = QueryParams().tagValue;

            const resourceId = row.original.resource_id;

            return (
                <div className="flex flex-col">
                    <Link
                        href={{
                            pathname: '/azure/recursos-traffic-manager',
                            query: {
                                startDate: startDate,
                                endDate: endDate,
                                resourceGroup: resourceGroup,
                                tagKey: tagKey,
                                tagValue: tagValue,
                                tm_profile: resourceId
                            }
                        }}
                        className='cursor-pointer'
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span className="font-medium">
                            {name}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground">

                            <span className="truncate max-w-[200px]" title={resourceId}>
                                {resourceId}
                            </span>
                        </div>
                    </Link>
                </div>
            )
        }
    },
    {
        header: "Ubicación",
        accessorKey: "location",
        cell: (info) => (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                {info.getValue() as string}
            </div>
        )
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <DetailsCell tm={row.original} />,
        size: 140
    }
];