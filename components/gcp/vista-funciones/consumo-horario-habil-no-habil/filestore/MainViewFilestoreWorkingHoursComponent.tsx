'use client'

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent'
import { PieChart } from 'lucide-react'
import { FilestoreWorkingNonWorkingHoursComponent } from './FsWorkingNonWorkingHoursComponent'

export const MainViewFilestoreWorkingHoursComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center dark:bg-emerald-900/30'>
                                <PieChart className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Filestore - Análisis de Horarios
                                </h1>
                                <p className='text-muted-foreground'>
                                    Análisis uso de Filestore en horario hábil y no hábil
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={FilestoreWorkingNonWorkingHoursComponent}
                    dateFilter
                    projectsFilter
                    regionFilter
                    resourceFilter
                    isResourceMultiSelect
                    resourceService='filestore'
                    tagsFilter
                    tagCollection="gcp_filestore_instances"
                    tagColumn="labels"
                    localService="Cloud Filestore" 
                />
            </div>
        </div>
    )
}