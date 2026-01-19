'use client'

import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, XCircle, LayoutGrid, Globe, HardDrive } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProjectsFilterComponent } from './ProjectsFilterComponent'; 
import { RegionsFilterComponent } from './RegionsFilterComponent';
import { ResourcesFilterComponent } from './ResourcesFilterComponent';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        projects: string;
        regions: string;
        resourceId?: string;
    }) => React.JSX.Element;
    
    // Flags de activación
    dateFilter?: boolean;
    projectsFilter?: boolean; // Nota: cambié projectFilter a projectsFilter para consistencia plural
    regionFilter?: boolean;
    resourceFilter?: boolean;
    
    // Config extra
    resourceService?: 'disks' | 'instances' | 'addresses';
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    projectsFilter = true,
    regionFilter = false,
    resourceFilter = false,
    resourceService = 'disks'
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const projectsParam = searchParams.get('projects');
        const regionsParam = searchParams.get('regions');
        const resourceParam = searchParams.get('resourceId');

        return {
            startDate: startDateParam ? new Date(startDateParam) : yesterday,
            endDate: endDateParam ? new Date(endDateParam) : new Date(),
            projects: projectsParam || '',
            regions: regionsParam || '',
            resourceId: resourceParam || ''
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    
    // Estados temporales (lo que selecciona el usuario antes de dar click a "Aplicar")
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempProjects, setTempProjects] = useState<string>(filters.projects);
    const [tempRegions, setTempRegions] = useState<string>(filters.regions);
    const [tempResource, setTempResource] = useState<string>(filters.resourceId);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempProjects(newFilters.projects);
        setTempRegions(newFilters.regions);
        setTempResource(newFilters.resourceId);
    }, [searchParams]);

    const onChangeDate = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const applyFilters = () => {
        let [start, end] = tempRange;
        if (!start || !end) return; 

        const newFilters = {
            startDate: start,
            endDate: end,
            projects: tempProjects,
            regions: tempRegions,
            resourceId: tempResource
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        
        if (newFilters.projects) query.set('projects', newFilters.projects);
        if (newFilters.regions) query.set('regions', newFilters.regions);
        if (newFilters.resourceId) query.set('resourceId', newFilters.resourceId);

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            projects: '',
            regions: '',
            resourceId: ''
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempProjects('');
        setTempRegions('');
        setTempResource('');

        router.push(window.location.pathname);
    };

    return (
        <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
                <CardContent className='space-y-6 pt-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        
                        {/* 1. FECHA */}
                        {dateFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' /> Período
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

                        {/* 2. PROYECTOS */}
                        {projectsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <LayoutGrid className='h-4 w-4' /> Proyectos
                                </label>
                                <ProjectsFilterComponent 
                                    projects={tempProjects}
                                    setProjects={setTempProjects}
                                />
                            </div>
                        )}

                        {/* 3. REGIONES */}
                        {regionFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Globe className='h-4 w-4' /> Regiones
                                </label>
                                <RegionsFilterComponent 
                                    regions={tempRegions}
                                    setRegions={setTempRegions}
                                />
                            </div>
                        )}

                         {/* 4. RECURSOS (Discos, etc) */}
                         {resourceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <HardDrive className='h-4 w-4' /> Recurso
                                </label>
                                <ResourcesFilterComponent 
                                    resourceId={tempResource}
                                    setResourceId={setTempResource}
                                    service={resourceService}
                                    projects={tempProjects} // Cascada
                                    regions={tempRegions}   // Cascada
                                />
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-4'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white'>
                            <Filter className="h-4 w-4" /> Aplicar
                        </Button>
                        <Button onClick={clearFilters} className='flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white'>
                            <XCircle className="h-4 w-4" /> Limpiar
                        </Button>
                    </div>
                </CardContent>

                {/* Renderizamos el componente hijo con los props filtrados */}
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate!}
                    projects={filters.projects}
                    regions={filters.regions}
                    resourceId={filters.resourceId}
                />
            </Card>
        </div>
    );
};