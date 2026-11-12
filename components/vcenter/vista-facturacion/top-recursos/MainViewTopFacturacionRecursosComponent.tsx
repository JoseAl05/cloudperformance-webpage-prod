import { CircleDollarSign } from 'lucide-react';
import { FiltersComponent } from '@/components/general_vcenter/filters/FiltersComponent';
import { TopFacturacionRecursosComponent } from './TopFacturacionRecursosComponent';

export const MainViewTopFacturacionRecursosComponent = () => (
    <div className='w-full min-w-0 space-y-4'>
        <div className='mb-8'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                        <CircleDollarSign className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                            Top Facturación por Recursos
                        </h1>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Ranking de costos de prefacturación por recurso vCenter
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className='w-full min-w-0'>
            <FiltersComponent
                cloud='vcenter'
                Component={TopFacturacionRecursosComponent}
                dateFilter
                billingTypeFilter
                businessUnitFilter
            />
        </div>
    </div>
);
