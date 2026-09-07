'use client'

import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent';
import { Database } from 'lucide-react';
import { AzurePostgresResourceComponent } from './AzurePostgresResourceComponent';

export const MainViewRecursosPostgresComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                                <Database className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Detalles de Base de Datos (PostgreSQL)
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzurePostgresResourceComponent}
                    dateFilter
                    subscriptionIdFilter
                    regionFilter
                    resourceGroupFilter
                    resourceGroupCollection="custom_db_metrics_logs"
                    resourceGroupSubscriptionField="resource_id"
                    instancesFilterV2
                    instancesV2Collection="azure_postgresqlflexibleservers_servers"
                    instancesV2SubscriptionField="id"
                    instancesV2InstanceField="name"                    
                    isResourceMultiSelect={false}
                />
            </div>
        </div>
    )
}