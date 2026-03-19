'use client'

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent'
import { TagsAnalysisComponent } from './TaggedResourcesComponent' 
import { Tags } from 'lucide-react'

export const MainViewTagsComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm'>
                                <Tags className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
                                    Mantenedor de Etiquetas (Tags)
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Gestión de inventario y asignación de etiquetas locales para visibilidad FinOps.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={TagsAnalysisComponent}
                    dateFilters={true}
                    projectsFilter={true}
                    // serviceFilter
                    //isServiceMultiSelect
                />
            </div>
        </div>
    )
}