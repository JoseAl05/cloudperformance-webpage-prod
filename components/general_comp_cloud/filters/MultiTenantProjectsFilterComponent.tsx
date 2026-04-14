'use client'

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
import { FilterSkeleton } from '@/components/general_comp_cloud/FilterSkeletonComponent'

interface MultiTenantProjectsFilterComponentProps {
    projectsMap: Record<string, string>;
    setProjectsMap: Dispatch<SetStateAction<Record<string, string>>>;
    startDate: Date;
    endDate: Date;
    payload: ReqPayload;
}

interface ProjectItem {
    id_project: string;
    project_name: string;
}

const fetcherPost = async ([url, payload]: [string, unknown]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
};

export const MultiTenantProjectsFilterComponent = ({
    projectsMap,
    setProjectsMap,
    startDate,
    endDate,
    payload
}: MultiTenantProjectsFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/comparison-cloud/bridge/intracloud/gcp/projects/all_projects_ids?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

    const { data, error, isLoading } = useSWR(
        payload ? [url, payload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const tenantDataMap = useMemo(() => {
        if (!data || !payload.tenants) return {};
        const map: Record<string, ProjectItem[]> = {};
        payload.tenants.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, payload]);

    const handleUpdate = (tenantId: string, val: string) => {
        setProjectsMap(prev => ({ ...prev, [tenantId]: val }));
    };

    useEffect(() => {
        if (isLoading || !data) return;
        setProjectsMap(prev => {
            const next = { ...prev };
            payload.tenants.forEach(id => {
                if (!next[id]) next[id] = 'all';
            });
            return next;
        });
    }, [data, isLoading, payload.tenants, setProjectsMap]);

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error</div>
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  rounded-md border border-dashed">
            {payload.tenants.map((tenantId, index) => {
                const subs = tenantDataMap[tenantId] || [];
                const currentValue = projectsMap[tenantId] || 'all';
                const label = `Proyectos Tenant ${index + 1}`;

                return (
                    <TenantCombobox
                        key={tenantId}
                        label={label}
                        projects={subs}
                        selectedValue={currentValue}
                        onToggle={(val) => handleUpdate(tenantId, val)}
                    />
                );
            })}
        </div>
    )
}

const TenantCombobox = ({
    label,
    projects,
    selectedValue,
    onToggle
}: {
    label: string,
    projects: ProjectItem[],
    selectedValue: string,
    onToggle: (id: string) => void
}) => {
    const [open, setOpen] = useState(false);

    const isAllGlobal = selectedValue === 'all' || !selectedValue;
    const selectedIds = isAllGlobal ? [] : selectedValue.split(',').filter(Boolean);
    const availableIds = projects.map(p => p.id_project);

    const selectedCount = isAllGlobal
        ? availableIds.length
        : availableIds.filter(id => selectedIds.includes(id)).length;

    const isAllSelected = isAllGlobal || (selectedCount === availableIds.length && availableIds.length > 0);

    const getDisplayText = () => {
        if (projects.length === 0) return "Sin datos";
        if (isAllSelected) return "Todas";
        if (selectedCount === 1) {
            const found = projects.find(p => selectedIds.includes(p.id_project));
            return found?.project_name || "1 Seleccionada";
        }
        return `${selectedCount} seleccionadas`;
    };

    const handleSelect = (val: string) => {
        if (val === 'all_option') {
            if (isAllSelected) onToggle('');
            else onToggle('all');
            return;
        }

        let newSelection = [...selectedIds];
        if (isAllSelected) {
            newSelection = [val];
        } else {
            if (newSelection.includes(val)) {
                newSelection = newSelection.filter(v => v !== val);
            } else {
                newSelection.push(val);
            }
        }

        if (newSelection.length === availableIds.length || newSelection.length === 0) {
            onToggle('all');
        } else {
            onToggle(newSelection.join(','));
        }
    };

    return (
        <div className="space-y-1">
            <label className='text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 truncate block' title={label}>
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white text-xs h-8 px-2"
                        disabled={projects.length === 0}
                    >
                        <span className="truncate text-left max-w-[90%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar..." className="h-8 text-xs" />
                        <CommandEmpty>No encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem
                                value="all_option"
                                onSelect={() => handleSelect('all_option')}
                                className="font-semibold text-xs"
                            >
                                <Check className={cn('mr-2 h-3 w-3', isAllSelected ? 'opacity-100' : 'opacity-0')} />
                                Todos
                            </CommandItem>
                            {projects.map((project) => {
                                const isSelected = isAllSelected || selectedIds.includes(project.id_project);
                                return (
                                    <CommandItem
                                        key={project.id_project}
                                        value={project.project_name} // Usamos nombre para búsqueda visual
                                        onSelect={() => handleSelect(project.id_project)} // ID para lógica
                                        className="text-xs"
                                    >
                                        <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        <span className="truncate">{project.project_name}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};