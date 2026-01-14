'use client'

import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, XCircle, LayoutGrid } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProjectsFilterComponent } from './ProjectsFilterComponent'; 

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        projects: string; 
    }) => React.JSX.Element;
    dateFilter?: boolean;
    projectFilter?: boolean; 
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    projectFilter = true, 
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const projectsParam = searchParams.get('projects'); 

        let startDate = startDateParam ? new Date(startDateParam) : yesterday;
        let endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate,
            endDate,
            projects: projectsParam || '', 
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempProjects, setTempProjects] = useState<string>(filters.projects);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempProjects(newFilters.projects);
    }, [searchParams]);

    const onChangeDate = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const applyFilters = () => {
        let [start, end] = tempRange;

        if (!start || !end) return; 

        const newFilters = {
            startDate: start,
            endDate: end,
            projects: tempProjects,
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        
        if (newFilters.projects) {
            query.set('projects', newFilters.projects);
        } else {
            query.delete('projects');
        }

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            projects: '',
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempProjects('');

        router.push(window.location.pathname);
    };

    return (
        <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
                <CardContent className='space-y-6 pt-6'> {/* Agregué pt-6 para espaciado superior */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        
                        {/* Filtro de Fechas */}
                        {dateFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    Período
                                </label>
                                <DatePicker
                                    selected={tempRange[0]}
                                    onChange={onChangeDate}
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    selectsRange
                                    className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                                />
                            </div>
                        )}

                        {/* Filtro de Proyectos GCP */}
                        {projectFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <LayoutGrid className='h-4 w-4' />
                                    Proyectos
                                </label>
                                <ProjectsFilterComponent 
                                    projects={tempProjects}
                                    setProjects={setTempProjects}
                                />
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-4'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white'>
                            <Filter className="h-4 w-4" />
                            Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} className='flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white'>
                            <XCircle className="h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                    </div>
                </CardContent>

                {/* Pasamos los filtros aplicados (no los temporales) al componente hijo */}
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate!} // El ! es porque inicializamos endDate siempre, pero valida según tu lógica
                    projects={filters.projects}
                />
            </Card>
        </div>
    );
};