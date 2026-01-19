'use client'
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'


interface ProjectsFilterComponentProps {
    projects: string
    setProjects: Dispatch<SetStateAction<string>>
}

interface ApiGcpProject {
    project_id: string
    project_name: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const ProjectsFilterComponent = ({
    projects,
    setProjects,
}: ProjectsFilterComponentProps) => {
    const [open, setOpen] = useState(false)

    const url = `/api/gcp/bridge/gcp/general/all-gcp-projects-ids`

    const { data, error, isLoading } = useSWR<ApiGcpProject[]>(url, fetcher)

    const projectList = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []

        return data.map((p) => ({
            id: p.project_id,
            name: p.project_name || p.project_id,
        }))
    }, [data])

    const hasData = projectList.length > 0

    useEffect(() => {
        if (isLoading || !data) return

        if (!hasData) {
            if (projects) setProjects('')
            return
        }

        if (hasData && !projects) {
            setProjects('all_projects')
        }
    }, [data, isLoading, hasData, projects, setProjects])

    const selectedIds = useMemo(
        () => (projects ? projects.split(',').filter(Boolean) : []),
        [projects]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const p of projectList) map.set(p.id, p.name)
        return map
    }, [projectList])

    if (isLoading) return <LoaderComponent size="small" />
    if (error) return <div>Error al cargar proyectos</div>

    const getDisplayText = () => {
        if (!hasData) return 'Sin proyectos disponibles'

        if (selectedIds.includes('all_projects') || (!projects && hasData)) return 'Todos los Proyectos'

        if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
        return `${selectedIds.length} proyectos seleccionados`
    }

    const handleProjectToggle = (projectIdOrAll: string) => {
        let currentProjects = [...selectedIds]

        if (projectIdOrAll === 'all_projects') {
            currentProjects = ['all_projects']
        } else {
            currentProjects = currentProjects.filter((s) => s !== 'all_projects')

            if (currentProjects.includes(projectIdOrAll)) {
                currentProjects = currentProjects.filter((s) => s !== projectIdOrAll)
            } else {
                currentProjects.push(projectIdOrAll)
            }
        }
        setProjects(currentProjects.length ? currentProjects.join(',') : '')
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                    disabled={!hasData}
                >
                    <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar proyecto..." />
                    <CommandEmpty>
                        {!hasData ? 'No hay proyectos disponibles.' : 'No se encontró proyecto.'}
                    </CommandEmpty>

                    {hasData && (
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem
                                value="all_projects"
                                onSelect={() => handleProjectToggle('all_projects')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all_projects') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Proyectos
                            </CommandItem>

                            {projectList.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleProjectToggle(id)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            (selectedIds.includes(id) && !selectedIds.includes('all_projects')) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className="truncate">{name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}