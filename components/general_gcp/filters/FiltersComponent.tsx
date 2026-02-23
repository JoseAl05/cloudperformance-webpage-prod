'use client'

import { useEffect, useMemo, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, XCircle, LayoutGrid, Globe, HardDrive, Tag, Database, Grid, ArrowUpDown, Activity, Network } from 'lucide-react'; // Agregamos Tag icon
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProjectsFilterComponent } from './ProjectsFilterComponent';
import { RegionsFilterComponent } from './RegionsFilterComponent';
import { ResourcesFilterComponent } from './ResourcesFilterComponent';
import { TagsFilterComponent } from './TagsFilterComponent';
import { DatabaseTypeFilterComponent } from './DatabaseTypeFilterComponent';
import { EstadoUsoFilterComponent } from './EstadoUsoFilterComponent';
import { EsquemaFilterComponent } from './EsquemaFilterComponent';
import { StorageClassFilterComponent } from './StorageClassFilterComponent';
import { ServiceFilterComponent } from './ServiceFilterComponent';
import { RecommenderCategoriesFilterComponent } from '@/components/general_gcp/filters/RecommenderCategoriesFilterComponent';
import { RecommenderPriorityFilterComponent } from '@/components/general_gcp/filters/RecommenderPriorityFilterComponent';


interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        projects: string;
        regions: string;
        resourceId?: string;
        // Nuevos params para el hijo
        tagKey?: string | null;
        tagValue?: string | null;
        databaseType?: string;
        service?: string;
        estadoUso?: string;
        esquema?: string;
    }) => React.JSX.Element;

    // Flags de activación
    dateFilter?: boolean;
    projectsFilter?: boolean;
    regionFilter?: boolean;
    resourceFilter?: boolean;
    isResourceMultiSelect?: boolean;
    tagsFilter?: boolean;
    databaseTypeFilter?: boolean;
    estadoUsoFilter?: boolean;
    showEsquemaFilter?: boolean;
    serviceFilter?: boolean;
    isServiceMultiSelect?: boolean;

    // Config extra
    resourceService?: string;
    tagCollection?: string; // NUEVO: Colección de Mongo para buscar tags (ej: gcp_compute_disks)
    tagColumn?: string;     // NUEVO: Nombre columna (default: labels)
    dbEngine?: string;
    storageClassFilter?: boolean;
    categoryFilter?: boolean;
    priorityFilter?: boolean;
    category?: string;
    priority?: string;
    isRecommenderCategoryMultiSelect?: boolean;
    isRecommenderPriorityMultiSelect?: boolean;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    projectsFilter = true,
    regionFilter = false,
    resourceFilter = false,
    tagsFilter = false, // Por defecto apagado
    resourceService = '',
    isResourceMultiSelect = false,
    tagCollection = '',  // Obligatorio si tagsFilter es true
    tagColumn = 'labels',
    databaseTypeFilter = false,
    estadoUsoFilter = false,
    esquemaFilter = false,
    dbEngine = '',
    storageClassFilter = false,
    serviceFilter = false,
    isServiceMultiSelect = false,
    categoryFilter = false,
    priorityFilter = false,
    category = '',
    priority = '',
    isRecommenderCategoryMultiSelect = false,
    isRecommenderPriorityMultiSelect = false
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
        const serviceParam = searchParams.get('service');

        // Nuevos params de URL
        const tagKeyParam = searchParams.get('tagKey');
        const tagValueParam = searchParams.get('tagValue');
        const dbTypeParam = searchParams.get('databaseType');
        const estadoUsoParam = searchParams.get('estado_uso');
        const esquemaParam = searchParams.get('esquema');
        const storageClassParam = searchParams.get('storageClass');
        const categoryParam = searchParams.get('category');
        const priorityParam = searchParams.get('priority');


        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate: startDate,
            endDate: endDate,
            projects: projectsParam || 'all_projects',
            regions: regionsParam || 'all_regions',
            resourceId: resourceParam || '',
            tagKey: tagKeyParam || 'allKeys',
            tagValue: tagValueParam || 'allValues',
            databaseType: dbTypeParam || 'all',
            estadoUso: estadoUsoParam || 'all',
            esquema: esquemaParam || 'all',
            storageClass: storageClassParam || 'all',
            service: serviceParam || 'all',
            category: categoryParam || '',
            priority: priorityParam || ''
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    // Estados temporales

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempProjects, setTempProjects] = useState<string>(filters.projects);
    const [tempRegions, setTempRegions] = useState<string>(filters.regions);
    const [tempResource, setTempResource] = useState<string>(filters.resourceId);

    // Estados temporales para Tags
    const [tempTagKey, setTempTagKey] = useState<string | null>(filters.tagKey);
    const [tempTagValue, setTempTagValue] = useState<string | null>(filters.tagValue);
    const [tempDatabaseType, setTempDatabaseType] = useState<string>(filters.databaseType || 'all');
    const [tempEstadoUso, setTempEstadoUso] = useState<string>(filters.estadoUso || 'all');
    const [tempEsquema, setTempEsquema] = useState<string>(filters.esquema || 'all');

    const [tempStorageClass, setTempStorageClass] = useState('all');
    const [tempService, setTempService] = useState<string>(filters.service || 'all');

    const [tempCategory, setTempCategory] = useState(filters.category);
    const [tempPriority, setTempPriority] = useState(filters.priority);



    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempProjects(newFilters.projects);
        setTempRegions(newFilters.regions);
        setTempResource(newFilters.resourceId);
        setTempTagKey(newFilters.tagKey);
        setTempTagValue(newFilters.tagValue);
        setTempDatabaseType(newFilters.databaseType || 'all');
        setTempEstadoUso(newFilters.estadoUso || 'all');
        setTempEsquema(filters.esquema || 'all');
        setTempService(newFilters.service || 'all');
        setTempStorageClass(newFilters.storageClass || 'all');
        setTempCategory(newFilters.category);
        setTempPriority(newFilters.priority);
    }, [searchParams]);


    const onChangeDate = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    const applyFilters = () => {
        const [start, end] = tempRange;
        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            projects: tempProjects,
            regions: tempRegions,
            resourceId: tempResource,
            tagKey: tempTagKey,
            tagValue: tempTagValue,
            databaseType: tempDatabaseType,
            estadoUso: tempEstadoUso,
            service: tempService,
            storageClass: tempStorageClass,
            category: tempCategory,
            priority: tempPriority
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());

        if (newFilters.projects) query.set('projects', newFilters.projects);
        if (newFilters.regions) query.set('regions', newFilters.regions);
        if (newFilters.resourceId) query.set('resourceId', newFilters.resourceId);
        

        // Guardar tags en URL si existen
        if (newFilters.tagKey) query.set('tagKey', newFilters.tagKey);
        if (newFilters.tagValue) query.set('tagValue', newFilters.tagValue);
        if (newFilters.databaseType && newFilters.databaseType !== 'all') {
            query.set('databaseType', newFilters.databaseType);
        }
        if (newFilters.estadoUso && newFilters.estadoUso !== 'all') {
            query.set('estado_uso', newFilters.estadoUso);
        }
        if (newFilters.esquema && newFilters.esquema !== 'all') {
        query.set('esquema', newFilters.esquema);
        }                
        if (storageClassFilter && tempStorageClass !== 'all') {
            query.set('storageClass', tempStorageClass);
        }

        if (newFilters.category) query.set('category', newFilters.category);
        if (newFilters.priority) query.set('priority', newFilters.priority);

        if (newFilters.service && newFilters.service !== 'all') {
            query.set('service', newFilters.service);
        }

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            projects: '',
            regions: '',
            resourceId: '',
            tagKey: null,
            tagValue: null,
            databaseType: 'all',
            estadoUso: 'all',
            esquema: 'all',
            storageClass: 'all',
            service: 'all',
            category: '',
            priority: ''
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempProjects('');
        setTempRegions('');
        setTempResource('');
        setTempTagKey(null);
        setTempTagValue(null);
        setTempDatabaseType('all');
        setTempEstadoUso('all');
        setTempEsquema('all');
        setTempStorageClass('all');
        setTempService('all');
        setTempCategory('');
        setTempPriority('');


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
                                    className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm'
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
                        {
                            categoryFilter && (
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                        <Grid className='h-4 w-4' /> Categorías
                                    </label>
                                    <RecommenderCategoriesFilterComponent
                                        category={tempCategory}
                                        setCategory={setTempCategory}
                                        isRecommenderCategoryMultiSelect={isRecommenderCategoryMultiSelect}
                                    />
                                </div>
                            )

                        }
                        {
                            priorityFilter && (
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                        <ArrowUpDown className='h-4 w-4' /> Prioridades
                                    </label>
                                    <RecommenderPriorityFilterComponent
                                        priority={tempPriority}
                                        setPriority={setTempPriority}
                                        isRecommenderPriorityMultiSelect={isRecommenderPriorityMultiSelect}
                                    />
                                </div>
                            )
                        }
                        {/* 4. TAGS (NUEVO) */}
                        {tagsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Tag className='h-4 w-4' /> Tags
                                </label>
                                <TagsFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    projects={tempProjects}
                                    regions={tempRegions}
                                    collection={tagCollection}
                                    tagColumnName={tagColumn}
                                    selectedKey={tempTagKey}
                                    setSelectedKey={setTempTagKey}
                                    selectedValue={tempTagValue}
                                    setSelectedValue={setTempTagValue}
                                />
                            </div>
                        )}
                        {/* 5. RECURSOS (Discos, etc) */}
                        {resourceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <HardDrive className='h-4 w-4' /> Recurso
                                </label>
                                <ResourcesFilterComponent
                                    resourceId={tempResource}
                                    setResourceId={setTempResource}
                                    service={resourceService}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    isResourceMultiSelect={isResourceMultiSelect}
                                    projects={tempProjects}
                                    regions={tempRegions}
                                    tagKey={tempTagKey}
                                    tagValue={tempTagValue}
                                />
                            </div>
                        )}
                        {/* 6. TIPO BD */}
                        {databaseTypeFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Database className='h-4 w-4' /> Tipo BD
                                </label>
                                <DatabaseTypeFilterComponent
                                    databaseType={tempDatabaseType}
                                    setDatabaseType={setTempDatabaseType}
                                />
                            </div>
                        )}
                        {/* 7. ESTADO DE USO (DNS) */}
                        {estadoUsoFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' /> Estado de Uso
                                </label>
                                <EstadoUsoFilterComponent
                                    estadoUso={tempEstadoUso}
                                    setEstadoUso={setTempEstadoUso}
                                />
                            </div>
                        )}
                        {/* 8. ESQUEMA DE BALANCEO */}
                        {esquemaFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    {/* Usa un ícono de Lucide como Network, GitMerge o Server */}
                                    <Network className='h-4 w-4' /> Esquema
                                </label>
                                <EsquemaFilterComponent
                                    value={tempEsquema}
                                    onChange={(e) => setTempEsquema(e.target.value)}
                                />
                            </div>
                        )}                                                
                        {/* 9. CLASE STORAGE */}
                        {storageClassFilter && (
                            <StorageClassFilterComponent
                                value={tempStorageClass}
                                onChange={setTempStorageClass}
                            />
                        )}

                        {/* 10. SERVICIOS GCP */}
                        {serviceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <HardDrive className='h-4 w-4' /> Servicio
                                </label>
                                <ServiceFilterComponent
                                    selectedService={tempService}
                                    setSelectedService={setTempService}
                                    isServiceMultiselect={isServiceMultiSelect}
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

                {/* Renderizamos el componente hijo pasando TODOS los filtros */}
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    projects={filters.projects}
                    regions={filters.regions}
                    resourceId={filters.resourceId}
                    tagKey={filters.tagKey}
                    tagValue={filters.tagValue}
                    databaseType={filters.databaseType}
                    estadoUso={filters.estadoUso}
                    dbEngine={dbEngine}
                    service={filters.service}
                    category={filters.category}
                    priority={filters.priority}
                />
            </Card>
        </div>
    );
};