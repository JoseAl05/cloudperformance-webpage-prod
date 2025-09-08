import { FiltersComponent } from '@/components/general/filters/FiltersComponent';
import { ChartLine } from 'lucide-react';
import { RdsPgInstancesConsumeComponent } from './RdsPgInstancesConsumeComponent';

interface MainViewConsumeRdsComponentProps {
    rdsType: string;
}

export const MainViewConsumeRdsComponent = ({ rdsType }: MainViewConsumeRdsComponentProps) => {
    let instancesService = '';
    let collection = '';
    let tagColumnName = '';

    switch (rdsType) {
        case 'postgresql':
            instancesService = 'rds-pg';
            collection = 'aws_rds_postgresql';
            tagColumnName = 'TagList';
            break;
        default:
            break;
    }

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
                                    Consumo/No Consumo Instancias RDS Postgresql
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={RdsPgInstancesConsumeComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService={instancesService}
                    isInstanceMultiSelect
                    tagsFilter
                    collection={collection}
                    tagColumnName={tagColumnName}
                />
            </div>
        </div>
    )
}