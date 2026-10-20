'use client'

import type { ReactNode } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Filter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const INPUT_CLASS =
    'w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent';

interface DateRangeControl {
    value: [Date | null, Date | null];
    onChange: (range: [Date | null, Date | null]) => void;
    label?: string;
}

interface MonthYearControl {
    value: Date | null;
    onChange: (date: Date | null) => void;
    label?: string;
}

interface BaseFiltersComponentProps {
    dateRange?: DateRangeControl;
    monthYear?: MonthYearControl;
    children?: ReactNode;
    onApply: () => void;
    onClear: () => void;
    view: ReactNode;
}

export const FilterField = ({ icon, label, className, children }: { icon?: ReactNode; label: ReactNode; className?: string; children: ReactNode }) => (
    <div className={className ?? 'space-y-2'}>
        <label className='text-sm font-medium text-foreground flex items-center gap-2'>
            {icon}
            {label}
        </label>
        {children}
    </div>
);

export const BaseFiltersComponent = ({ dateRange, monthYear, children, onApply, onClear, view }: BaseFiltersComponentProps) => (
    <div className='space-y-6'>
        <Card className="w-full min-w-0 overflow-hidden">
            <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {dateRange && (
                        <FilterField icon={<Calendar className='h-4 w-4' />} label={dateRange.label ?? 'Período'}>
                            <DatePicker
                                selected={dateRange.value[0]}
                                onChange={(range: [Date | null, Date | null]) => dateRange.onChange(range)}
                                startDate={dateRange.value[0]}
                                endDate={dateRange.value[1]}
                                selectsRange
                                className={INPUT_CLASS}
                            />
                        </FilterField>
                    )}
                    {monthYear && (
                        <FilterField icon={<Calendar className='h-4 w-4' />} label={monthYear.label ?? 'Mes y Año'}>
                            <DatePicker
                                selected={monthYear.value}
                                onChange={(date: Date | null) => monthYear.onChange(date)}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Selecciona mes y año"
                                className={INPUT_CLASS}
                            />
                        </FilterField>
                    )}
                    {children}
                </div>

                <div className='flex items-center gap-4'>
                    <Button onClick={onApply} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white'>
                        <Filter className="h-4 w-4" />
                        Aplicar Filtros
                    </Button>
                    <Button onClick={onClear} className='flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white'>
                        <XCircle className="h-4 w-4" />
                        Limpiar Filtros
                    </Button>
                </div>
            </CardContent>

            {view}
        </Card>
    </div>
);
