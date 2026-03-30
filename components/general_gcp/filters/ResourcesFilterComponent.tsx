// 'use client'
// import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
// import { Check, ChevronsUpDown } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import useSWR from 'swr'
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

// interface ResourcesFilterComponentProps {
//     service: string,
//     resourceId: string,
//     setResourceId: Dispatch<SetStateAction<string>>,
//     startDate: Date,
//     endDate: Date,
//     projects: string,
//     regions: string;
//     isResourceMultiSelect: boolean
// }

// interface ResourceItem {
//     resource_id: string;
//     resource_name: string;
// }

// const fetcherGet = (url: string) =>
//     fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
//         .then(r => r.json());

// export const ResourcesFilterComponent = ({
//     service, resourceId, setResourceId, startDate, endDate, projects, regions, isResourceMultiSelect
// }: ResourcesFilterComponentProps) => {
//     const [open, setOpen] = useState(false);

//     let url = ''
//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     switch (service) {
//         case 'disks':
//             url = regions ? `/api/gcp/bridge/gcp/recursos_sin_uso/all_persistent_disks?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//             break;
//         case 'instances':
//             url = regions ? `/api/gcp/bridge/gcp/instancias_compute_engine/all_compute_engine_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//             break;
//         case 'unused-instances':
//             url = regions ? `/api/gcp/bridge/gcp/recursos_sin_uso/all_unused_compute_engines?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//             break;
//         // case 'unused-instance_groups':
//         //     url = regions ? `/api/gcp/bridge/gcp/recursos_sin_uso/all_unused_instances_instance_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//         //     break;
//         case 'instance_groups':
//             url = regions ? `/api/gcp/bridge/gcp/instance_groups/all_instance_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//             break;
//         case 'clusters-gke':
//             url = regions ? `/api/gcp/bridge/gcp/gke_clusters/all_gke_clusters?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
//             break;
//         case 'postgres':
//             url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=postgres` : '';
//             break;
//         case 'mysql':
//             url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=mysql` : '';
//             break;
//         case 'sqlserver':
//             url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=sqlserver` : '';
//             break
//         default:
//             url = '';
//     }

//     const { data, error, isLoading } = useSWR(
//         regions ? url : null,
//         fetcherGet,
//         { revalidateOnFocus: false, shouldRetryOnError: false }
//     );

//     const allResources = useMemo(() => {
//         if (!Array.isArray(data)) return [] as ResourceItem[]
//         if (data.length === 0) return []
//         if (typeof data[0] === 'string') {
//             return (data as string[]).map((resource_id) => ({ resource_id, resource_name: resource_id }))
//         }
//         return (data as ResourceItem[]).map((r) => ({
//             resource_id: r.resource_id,
//             resource_name: r.resource_name || r.resource_id,
//         }))
//     }, [data]);

//     const allIdsString = useMemo(() => {
//         return allResources.map(r => r.resource_id).join(',');
//     }, [allResources]);

//     const hasData = allResources.length > 0;

//     useEffect(() => {
//         if (isLoading || !data) return

//         if (!hasData) {
//             if (resourceId) setResourceId('')
//             return
//         }

//         if (hasData && !resourceId) {
//             // setResourceId('all')
//             setResourceId(allIdsString);
//         }
//     }, [data, isLoading, hasData, resourceId, setResourceId, allIdsString]);

//     const selectedIds = useMemo(
//         () => (resourceId ? resourceId.split(',').filter(Boolean) : []),
//         [resourceId]
//     )

//     const idToName = useMemo(() => {
//         const map = new Map<string, string>()
//         for (const r of allResources) map.set(r.resource_id, r.resource_name)
//         return map
//     }, [allResources])

//     if (isLoading) return <LoaderComponent size='small' />
//     if (error) return <div>Error al cargar recursos</div>

//     const getDisplayText = () => {
//         if (!hasData) return 'Sin recursos disponibles'
//         // if (selectedIds.includes('all')) return 'Todos los Recursos'
//         if (selectedIds.length === allResources.length && allResources.length > 0) return 'Todos los Recursos'
//         if (!resourceId && hasData) return 'Selecciona un recurso...'
//         if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? `${selectedIds[0]} - ${idToName.get(selectedIds[0])}`
//         return `${selectedIds.length} recursos seleccionados`
//     }

//     const handleResourceToggle = (resourceValue: string) => {
//         if (resourceValue === 'all') {
//             const areAllSelected = selectedIds.length === allResources.length;
//             setResourceId(areAllSelected ? '' : allIdsString);
//             return;
//         }

//         let newSelected = [...selectedIds];

//         if (newSelected.includes(resourceValue)) {
//             newSelected = newSelected.filter((s) => s !== resourceValue);
//         } else {
//             newSelected.push(resourceValue);
//         }

//         setResourceId(newSelected.join(','));
//     };

//     // const handleResourceToggle = (resourceValue: string) => {
//     //     let selectedResources = [...selectedIds]
//     //     if (resourceValue === 'all') {
//     //         selectedResources = ['all']
//     //     } else {
//     //         selectedResources = selectedResources.filter((s) => s !== 'all')
//     //         if (selectedResources.includes(resourceValue)) {
//     //             selectedResources = selectedResources.filter((s) => s !== resourceValue)
//     //         } else {
//     //             selectedResources.push(resourceValue)
//     //         }
//     //     }
//     //     setResourceId(selectedResources.length ? selectedResources.join(',') : '')
//     // };

//     return !isResourceMultiSelect ? (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant='outline'
//                     role='combobox'
//                     aria-expanded={open}
//                     className='w-full justify-between bg-transparent'
//                     disabled={!hasData}
//                 >
//                     <span className="truncate text-left max-w-[85%]">
//                         {getDisplayText()}
//                     </span>
//                     <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className='w-full p-0'>
//                 <Command>
//                     <CommandInput placeholder='Buscar recurso...' />
//                     <CommandList>
//                         <CommandEmpty>{!hasData ? 'No hay recursos disponibles.' : 'No se encontró recurso.'}</CommandEmpty>
//                         {hasData && (
//                             <CommandGroup className='max-h-[250px] overflow-y-auto'>
//                                 {allResources.map((i) => (
//                                     <CommandItem
//                                         key={i.resource_id}
//                                         value={i.resource_id}
//                                         onSelect={() => {
//                                             setResourceId(i.resource_id);
//                                             setOpen(false);
//                                         }}
//                                     >
//                                         <Check className={cn('mr-2 h-4 w-4', resourceId === i.resource_id ? 'opacity-100' : 'opacity-0')} />
//                                         {i.resource_name}
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         )}
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     ) : (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant='outline'
//                     role='combobox'
//                     aria-expanded={open}
//                     className='w-full justify-between bg-transparent'
//                     disabled={!hasData}
//                 >
//                     <span className="truncate text-left max-w-[85%]">
//                         {getDisplayText()}
//                     </span>
//                     <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className='w-full p-0'>
//                 <Command>
//                     <CommandInput placeholder='Buscar recurso...' />
//                     <CommandList>
//                         <CommandEmpty>{!hasData ? 'No hay recursos disponibles.' : 'No se encontró recurso.'}</CommandEmpty>
//                         {hasData && (
//                             <CommandGroup className='max-h-[200px] overflow-y-auto'>
//                                 <CommandItem value='all' onSelect={() => handleResourceToggle('all')}>
//                                     <Check className={cn('mr-2 h-4 w-4', selectedIds.length === allResources.length ? 'opacity-100' : 'opacity-0')} />
//                                     Todos los Recursos
//                                 </CommandItem>
//                                 {allResources.map((i) => (
//                                     <CommandItem
//                                         key={i.resource_id}
//                                         value={i.resource_id}
//                                         onSelect={() => handleResourceToggle(i.resource_id)}
//                                     >
//                                         <Check className={cn('mr-2 h-4 w-4', selectedIds.includes(i.resource_id) ? 'opacity-100' : 'opacity-0')} />
//                                         {i.resource_id} - {i.resource_name}
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         )}
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// };

'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator // Importante para la UX
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

// --- Tipos ---
interface ResourcesFilterComponentProps {
    service: string;
    resourceId: string;
    setResourceId: Dispatch<SetStateAction<string>>;
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    tagKey: string;
    tagValue: string;
    isResourceMultiSelect: boolean;
}

interface ResourceItem {
    resource_id: string;
    resource_name: string;
}

// --- Helpers ---
const fetcherGet = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

// Función auxiliar para limpiar el switch gigante del componente principal
const getUrlForService = (service: string, params: { startDate: string, endDate: string, projects: string, regions: string, tagKey: string, tagValue: string }) => {
    const { startDate, endDate, projects, regions } = params;
    if (!regions) return null; // Si no hay región, no hacemos fetch (comportamiento original)

    const baseParams = `date_from=${startDate}&date_to=${endDate}&project_id=${projects}&location=${regions}`;
    const baseUrl = '/api/gcp/bridge/gcp';

    switch (service) {
        case 'disks': return `${baseUrl}/recursos_sin_uso/all_persistent_disks?${baseParams}`;
        case 'instances': return `${baseUrl}/instancias_compute_engine/all_compute_engine_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'unused-instances': return `${baseUrl}/recursos_sin_uso/all_unused_compute_engines?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'instance_groups': return `${baseUrl}/instance_groups/all_instance_groups?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'filestore': return `${baseUrl}/instancias_filestore/all_filestore?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'clusters-gke': return `${baseUrl}/gke_clusters/all_gke_clusters?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'postgres': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=postgres`;
        case 'mysql': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=mysql`;
        case 'sqlserver': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=sqlserver`;
        default: return null;
    }
}

export const ResourcesFilterComponent = ({
    service, resourceId, setResourceId, startDate, endDate, projects, regions,tagKey, tagValue, isResourceMultiSelect
}: ResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    // 1. Preparación de parámetros para URL
    const dateParams = useMemo(() => ({
        startDate: startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '',
        endDate: endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '',
        projects,
        regions,
        tagKey,
        tagValue
    }), [startDate, endDate, projects, regions, tagKey, tagValue]);

    const url = useMemo(() => getUrlForService(service, dateParams), [service, dateParams]);

    // 2. Data Fetching
    const { data, error, isLoading } = useSWR(url, fetcherGet, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    // 3. Procesamiento de recursos
    const allResources = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [] as ResourceItem[];

        // Manejo si la API devuelve array de strings o de objetos
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ resource_id: id, resource_name: id }));
        }
        return (data as ResourceItem[]).map((r) => ({
            resource_id: r.resource_id,
            resource_name: r.resource_name || r.resource_id,
        }));
    }, [data]);

    // IDs seleccionados convertidos a Array para facilitar manipulación
    const selectedIds = useMemo(() =>
        resourceId ? resourceId.split(',').filter(Boolean) : [],
        [resourceId]);

    const allIdsString = useMemo(() => allResources.map(r => r.resource_id).join(','), [allResources]);
    const hasData = allResources.length > 0;

    // Booleanos de estado de selección
    const isAllSelected = hasData && selectedIds.length === allResources.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allResources.length;

    // 4. Mapa para mostrar nombres bonitos en el botón
    const idToName = useMemo(() => {
        const map = new Map<string, string>();
        allResources.forEach(r => map.set(r.resource_id, r.resource_name));
        return map;
    }, [allResources]);

    // 5. Efecto de carga inicial (Corregido para no pisar la acción de limpiar del usuario)
    useEffect(() => {
        if (isLoading || !hasData) return;

        // Solo forzamos la selección de 'todos' si NO hay nada seleccionado Y
        // acabamos de cargar datos nuevos (cambio de región o servicio).
        // Usamos allIdsString como dependencia clave para detectar cambio de contexto.
        if (resourceId === '') {
            setResourceId(allIdsString);
        }
    }, [allIdsString, hasData, isLoading, setResourceId]);
    // NOTA: Quitamos 'resourceId' de dependencias para evitar loop infinito al deseleccionar manual.

    // 6. Handlers de Selección
    const handleToggleAll = () => {
        if (isAllSelected) {
            // Si todo está seleccionado, desmarcamos todo
            setResourceId('');
        } else {
            // Si hay 0 o algunos seleccionados, marcamos todo
            setResourceId(allIdsString);
        }
    };

    const handleToggleOne = (currentId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(currentId)) {
            newSelected.delete(currentId);
        } else {
            newSelected.add(currentId);
        }
        setResourceId(Array.from(newSelected).join(','));
    };

    // 7. Texto del botón
    const getDisplayText = () => {
        if (isLoading) return 'Cargando...';
        if (!hasData) return 'Sin recursos';

        if (isAllSelected) return 'Todos los Recursos';
        if (selectedIds.length === 0) return 'Seleccionar recursos...';

        if (selectedIds.length === 1) {
            const id = selectedIds[0];
            const name = idToName.get(id) || id;
            // Si el nombre es igual al ID, solo mostramos uno
            return name === id ? name : `${id} - ${name}`;
        }

        return `${selectedIds.length} recursos seleccionados`;
    };

    if (error) return <div className="text-red-500 text-sm">Error al cargar</div>;

    // Renderizado condicional del contenido del Popover
    const MultiSelectContent = () => (
        <CommandGroup className='max-h-[250px] overflow-y-auto'>
            {/* Opción Maestra: Seleccionar Todo */}
            <CommandItem
                value="all-resources-toggle" // Valor único que no choque con IDs reales
                onSelect={handleToggleAll}
                className="font-medium cursor-pointer"
            >
                <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isAllSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                )}>
                    <Check className={cn("h-4 w-4")} />
                </div>
                <span>{isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>

                {/* Opcional: Mostrar conteo parcial */}
                {isIndeterminate && (
                    <span className="ml-auto text-xs text-muted-foreground">
                        {selectedIds.length} / {allResources.length}
                    </span>
                )}
            </CommandItem>

            <CommandSeparator className="my-1" />

            {/* Lista de Items */}
            {allResources.map((item) => {
                const isSelected = selectedIds.includes(item.resource_id);
                return (
                    <CommandItem
                        key={item.resource_id}
                        value={`${item.resource_id} ${item.resource_name}`} // Truco para buscar por ID o Nombre
                        onSelect={() => handleToggleOne(item.resource_id)}
                    >
                        <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                        )}>
                            <Check className={cn("h-4 w-4")} />
                        </div>
                        <span className="truncate">
                            {item.resource_name}
                        </span>
                    </CommandItem>
                );
            })}
        </CommandGroup>
    );

    const SingleSelectContent = () => (
        <CommandGroup className='max-h-[250px] overflow-y-auto'>
            {allResources.map((item) => (
                <CommandItem
                    key={item.resource_id}
                    value={`${item.resource_id} ${item.resource_name}`}
                    onSelect={() => {
                        setResourceId(item.resource_id);
                        setOpen(false);
                    }}
                >
                    <Check className={cn('mr-2 h-4 w-4', resourceId === item.resource_id ? 'opacity-100' : 'opacity-0')} />
                    {item.resource_name}
                </CommandItem>
            ))}
        </CommandGroup>
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent hover:bg-accent'
                    disabled={!hasData || isLoading}
                >
                    {isLoading ? (
                        <LoaderComponent size='small' />
                    ) : (
                        <>
                            <span className="truncate text-left max-w-[90%]">
                                {getDisplayText()}
                            </span>
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align="start">
                <Command>
                    <CommandInput placeholder='Buscar recurso...' />
                    <CommandList>
                        <CommandEmpty>No se encontró recurso.</CommandEmpty>
                        {hasData && (
                            isResourceMultiSelect ? <MultiSelectContent /> : <SingleSelectContent />
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};