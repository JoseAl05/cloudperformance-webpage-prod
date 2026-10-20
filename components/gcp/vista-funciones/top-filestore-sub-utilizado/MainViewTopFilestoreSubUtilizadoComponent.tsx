'use client';

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent';
import { TopFilestoreSubUtilizadoComponent } from './TopFilestoreSubUtilizadoComponent';
import { TrendingDown } from 'lucide-react';

export const MainViewTopFilestoreSubUtilizadoComponent = () => {
    return (
        <>
            <div className='mb-8 px-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center'>
                                <TrendingDown className='h-6 w-6 text-amber-600 dark:text-amber-400' />
                            </div>
                            
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
                                    Top Filestore Sub-Utilizados
                                </h1>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                    Instancias GCP Filestore con mayor desperdicio de capacidad y oportunidades de ahorro
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FiltersComponent
                Component={TopFilestoreSubUtilizadoComponent}
                dateFilter
                projectsFilter
                regionFilter
                filestoreTierFilter
                tagsFilter
                tagResourceType="filestore_instances"
            />
        </>
    );
};