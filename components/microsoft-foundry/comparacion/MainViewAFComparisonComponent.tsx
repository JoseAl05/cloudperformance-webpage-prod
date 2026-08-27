'use client'
import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { AzureFoundryComparisonComponent } from '@/components/microsoft-foundry/comparacion/AFComparisonComponent'
import { ChartLine } from 'lucide-react'

export const MainViewComparisonComponent = () => {

    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <ChartLine className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Comparacion Microsoft Foundry
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzureFoundryComparisonComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService='azure-foundry-accounts'
                />
            </div>
        </div>
    )
}