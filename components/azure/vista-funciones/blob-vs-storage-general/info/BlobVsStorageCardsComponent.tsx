'use client'

import { Card, CardContent } from '@/components/ui/card';
import { AllStorageCapacity } from '@/interfaces/vista-blob-vs-storage/allStorageCapacityInterfaces'
import { bytesToGB } from '@/lib/bytesToMbs';
import { Cylinder, Database, File, MessageSquare, Table } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

interface BlobVsStorageCardsComponentProps {
    strgCapacityData: AllStorageCapacity[] | null;
}

const SERVICE_LABELS: Record<string, string> = {
    'File Capacity': 'File Service',
    'Queue Capacity': 'Queue Service',
    'Table Capacity': 'Table Service',
    'Blob Capacity': 'Blob Service',
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
    'File Capacity': File,
    'Queue Capacity': MessageSquare,
    'Table Capacity': Table,
    'Blob Capacity': Cylinder,
};

const SERVICE_BORDERS: Record<string, string> = {
    'File Capacity': 'border-l-green-500',
    'Queue Capacity': 'border-l-red-500',
    'Table Capacity': 'border-l-purple-500',
    'Blob Capacity': 'border-l-blue-500',
};

const formatPct = (n: number) => `${Number.isFinite(n) ? n.toFixed(1) : '0.0'}%`;

export const BlobVsStorageCardsComponent = ({ strgCapacityData }: BlobVsStorageCardsComponentProps) => {
    const data = Array.isArray(strgCapacityData) ? strgCapacityData : [];

    const storageUsedItem = data.find(d => d.metric_name === 'Used Capacity');
    const usedCapacity = storageUsedItem?.total_capacity ?? 0;

    const serviceKeys = ['File Capacity', 'Queue Capacity', 'Table Capacity', 'Blob Capacity'] as const;
    const services = data.filter(d => serviceKeys.includes(d.metric_name as unknown));

    const totalServices = services.reduce((acc, s) => acc + (s.total_capacity ?? 0), 0);

    const serviceCards = services.map(s => {
        const vsSA = usedCapacity > 0 ? (s.total_capacity / usedCapacity) * 100 : 0;
        const Icon = SERVICE_ICONS[s.metric_name] ?? Cylinder;
        const border = SERVICE_BORDERS[s.metric_name] ?? 'border-l-blue-500';
        const label = SERVICE_LABELS[s.metric_name] ?? s.metric_name;

        return {
            key: s.metric_name,
            label,
            valueGB: bytesToGB(s.total_capacity ?? 0),
            vsSA,
            Icon,
            border
        };
    });

    return (
        <div className='space-y-4'>
            <div>
                <Card className='border-l-4 border-l-amber-500 group'>
                    <CardContent className='p-5 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <div className='p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 transition-transform duration-200 group-hover:scale-105'>
                                <Database className='h-6 w-6 text-amber-600 dark:text-amber-400' />
                            </div>
                        </div>
                        <h3 className='text-sm font-medium text-muted-foreground'>
                            Capacidad Utilizada Storage Account
                        </h3>
                        <p className='text-4xl font-extrabold tracking-tight'>
                            {bytesToGB(usedCapacity)} GB
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            Base de comparación para los servicios File, Queue, Table y Blob.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
                {serviceCards.map(s => (
                    <Card key={s.key} className={`${s.border} border-l-4 group`}>
                        <CardContent className='p-4 flex flex-col h-full'>
                            <div className='flex items-center justify-between'>
                                <div className='p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-transform duration-200 group-hover:scale-110'>
                                    <s.Icon className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                                </div>
                            </div>

                            <h3 className='text-sm font-medium text-muted-foreground mt-2'>
                                {`Capacidad Utilizada ${s.label}`}
                            </h3>

                            <div className='mt-1'>
                                <p className='text-3xl font-bold text-foreground tracking-tight'>
                                    {s.valueGB} GB
                                </p>
                                <p className='text-xs text-muted-foreground mt-1'>
                                    {formatPct(s.vsSA)} del Storage Account
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
