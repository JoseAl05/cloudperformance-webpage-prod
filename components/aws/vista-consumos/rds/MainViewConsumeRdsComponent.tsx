import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent';
import { ChartLine } from 'lucide-react';
import { RdsInstancesConsumeComponent } from '@/components/aws/vista-consumos/rds/RdsInstancesConsumeComponent';

interface MainViewConsumeRdsComponentProps {
    rdsType: string;
}

export const MainViewConsumeRdsComponent = ({ rdsType }: MainViewConsumeRdsComponentProps) => {
    let instancesService = '';
    let resourceType = '';
    let componentTitle = '';

    switch (rdsType) {
        case 'postgresql':
            instancesService = 'rds-pg';
            resourceType = 'rds_postgresql';
            componentTitle = 'Consumo/No Consumo Instancias RDS Postgresql';
            break;
        case 'mysql':
            instancesService = 'rds-mysql';
            resourceType = 'rds_mysql';
            componentTitle = 'Consumo/No Consumo Instancias RDS Mysql';
            break;
        case 'oracle':
            instancesService = 'rds-oracle';
            resourceType = 'rds_oracle';
            componentTitle = 'Consumo/No Consumo Instancias RDS Oracle';
            break;
        case 'sqlserver':
            instancesService = 'rds-sqlserver';
            resourceType = 'rds_sqlserver';
            componentTitle = 'Consumo/No Consumo Instancias RDS SQL Server';
            break;
        case 'mariadb':
            instancesService = 'rds-mariadb';
            resourceType = 'rds_mariadb';
            componentTitle = 'Consumo/No Consumo Instancias RDS MariaDB';
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
                                    {componentTitle}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={RdsInstancesConsumeComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService={instancesService}
                    isInstanceMultiSelect
                    tagsFilter
                    resourceType={resourceType}
                    localService='Amazon Relational Database Service'
                />
            </div>
        </div>
    )
}