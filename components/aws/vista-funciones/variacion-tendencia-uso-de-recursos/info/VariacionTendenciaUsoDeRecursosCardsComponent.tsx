'use client'

import { Card, CardContent } from '@/components/ui/card';
import { RangeBlock } from '@/interfaces/vista-variacion-tendencia-uso-de-recursos/variacionTendenciaUsoDeRecursosViewInterface';
import { bytesToGB } from '@/lib/bytesToMbs';
import { CalendarClock, CalendarDays, TrendingDown, TrendingUp, TrendingUpDown } from 'lucide-react';

interface VariacionTendenciaUsoDeRecursosCardsComponentProps {
    prev_range?: RangeBlock;
    unit: 'créditos' | '%' | 'Bytes' | 'Objetos' | 'segundos' | 'Ops E/S' | 'Conexiones' | 'IOPS' | '';
    chartyAxisLabel?: string;
    metric?: string;
    actual_range?: RangeBlock;
    variation_percent?: number;
}

const isFiniteNumber = (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v);

const formatNumber = (v: unknown, digits = 2): string => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n.toFixed(digits) : 'Sin datos';
};

const isBytesMetric = (metric?: string): boolean => {
    if (!metric) return false;
    const bytesMetrics = new Set([
        'BucketSizeBytes Average',
        'BucketSizeBytes Maximum',
        'BucketSizeBytes Minimum',
        'NetworkIn Average',
        'NetworkIn Maximum',
        'NetworkIn Minimum',
        'NetworkOut Average',
        'NetworkOut Maximum',
        'NetworkOut Minimum',
    ]);
    return bytesMetrics.has(metric);
};

const getMetricDisplayValue = (
    range?: RangeBlock,
    metric?: string
): string => {
    if (!range || range.average == null) return 'Sin datos';
    if (isBytesMetric(metric)) {
        const n = Number(range.average);
        return Number.isFinite(n) ? bytesToGB(n) : 'Sin datos';
    }
    return formatNumber(range.average, 2);
};

const withUnits = (
    value: string,
    unit: VariacionTendenciaUsoDeRecursosCardsComponentProps['unit'],
    axisLabel?: string
): string => {
    if (value === 'Sin datos') return value;
    return [value, unit, axisLabel].filter(Boolean).join(' ');
};

export const VariacionTendenciaUsoDeRecursosCardsComponent = ({
    prev_range,
    unit,
    chartyAxisLabel,
    metric,
    actual_range,
    variation_percent,
}: VariacionTendenciaUsoDeRecursosCardsComponentProps) => {
    const prevDisplay = getMetricDisplayValue(prev_range, metric);
    const actualDisplay = getMetricDisplayValue(actual_range, metric);

    const variationIsNumber =
        typeof variation_percent === 'number' && Number.isFinite(variation_percent);

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='border-l-4 border-l-indigo-500 shadow-lg rounded-2xl'>
                <CardContent className='p-6 flex justify-between items-center'>
                    <div>
                        <p className='text-sm font-medium text-muted-foreground'>Mes anterior</p>
                        <p className='text-2xl font-bold text-indigo-600'>
                            {withUnits(prevDisplay, unit, chartyAxisLabel)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            {prev_range?.month} {prev_range?.year}
                        </p>
                    </div>
                    <CalendarClock className='h-8 w-8 text-indigo-500' />
                </CardContent>
            </Card>
            <Card className='border-l-4 border-l-green-500 shadow-lg rounded-2xl'>
                <CardContent className='p-6 flex justify-between items-center'>
                    <div>
                        <p className='text-sm font-medium text-muted-foreground'>Mes actual</p>
                        <p className='text-2xl font-bold text-green-600'>
                            {withUnits(actualDisplay, unit, chartyAxisLabel)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            {actual_range?.month} {actual_range?.year}
                        </p>
                    </div>
                    <CalendarDays className='h-8 w-8 text-green-500' />
                </CardContent>
            </Card>
            <Card className='border-l-4 border-l-blue-500 shadow-lg rounded-2xl'>
                <CardContent className='p-6 flex justify-between items-center'>
                    <div>
                        <p className='text-sm font-medium text-muted-foreground'>Variación</p>
                        <p className='text-2xl font-bold text-blue-600'>
                            {variationIsNumber ? `${variation_percent!.toFixed(2)} %` : 'Sin datos'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            {prev_range?.month} {prev_range?.year} VS {actual_range?.month} {actual_range?.year}
                        </p>
                    </div>
                    {variationIsNumber ? (
                        variation_percent! > 0 ? (
                            <TrendingUp className='h-8 w-8 text-red-500' />
                        ) : variation_percent! < 0 ? (
                            <TrendingDown className='h-8 w-8 text-green-500' />
                        ) : (
                            <TrendingUpDown className='h-8 w-8 text-blue-500' />
                        )
                    ) : (
                        <TrendingUpDown className='h-8 w-8 text-gray-500' />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
