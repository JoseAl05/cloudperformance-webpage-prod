'use client'

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent'
import { ReservationsAnalysisComponent } from '@/components/gcp/vista-reservas/ReservationsComponent'
import { Server } from 'lucide-react'

export const MainViewReservationsComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center shadow-sm'>
                                <Server className='h-6 w-6 text-indigo-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
                                    Reservas de Capacidad
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Monitoreo de inactividad, eficiencia y costos por hardware reservado en Google Cloud.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={ReservationsAnalysisComponent}
                    dateFilters={true}
                    projectsFilter={true}
                />
            </div>
        </div>
    )
}