
import { FiltersComponent } from '@/components/general/FiltersComponent'
import { SavingPlansViewComponent } from '@/components/aws/vista-saving-plan/SavingPlansComponent'
import { HandCoins } from 'lucide-react';
 

export const MainViewSavingPlansComponent = () => {
    return(
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <HandCoins className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Dashboard AWS / Saving Plans
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Saving Plans
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FiltersComponent
                Component={SavingPlansViewComponent}
                dateFilter
            />
        </div>
    )
}