'use client';

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent';
import { FilestoreSinUsoComponent } from './FilestoreSinUsoComponent';
import { HardDrive } from 'lucide-react'; 

export const MainViewFilestoreSinUsoComponent = () => {
    return (
        <>
            <div className='mb-8 px-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            {/* Contenedor del ícono estilizado */}
                            <div className='h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                                <HardDrive className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                            </div>
                            
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
                                    Filestore Sin Uso
                                </h1>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                    Instancias GCP Filestore sin actividad real basado en IOPS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FiltersComponent
                Component={FilestoreSinUsoComponent}
                dateFilter
                projectsFilter
                regionFilter
                filestoreTierFilter
                tagsFilter
                tagCollection="gcp_filestore_instances"
                tagColumn="labels"
            />
        </>
    );
};