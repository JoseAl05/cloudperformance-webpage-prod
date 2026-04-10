import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { ConsumoEC2HorarioComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/ConsumoEC2HorarioComponent'
import { Computer } from 'lucide-react'
import { ConsumoRdsHorarioComponent } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/ConsumoRdsHorarioComponent'

export const MainViewConsumoRdsHorario = ({ dbType }: { dbType: string }) => {
    let dbCollection = ''

    switch (dbType) {
        case 'rds-pg':
            dbCollection = 'aws_rds_postgresql'
            break;
        case 'rds-mysql':
            dbCollection = 'aws_rds_mysql'
            break;
        case 'rds-oracle':
            dbCollection = 'aws_rds_oracle'
            break;
        case 'rds-sqlserver':
            dbCollection = 'aws_rds_sqlserver'
            break;
        case 'rds-mariadb':
            dbCollection = 'aws_rds_mariadb'
            break;
        default:
            break;
    }

    return (
        <div className='w-full min-w-2 space-y-9'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                                <Computer className='h-6 w-6 text-green-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Consumo {dbType.toLocaleUpperCase()}
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Comparación de consumo en horario hábil vs no hábil
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FiltersComponent
                Component={ConsumoRdsHorarioComponent}
                dateFilter
                regionFilter
                isRegionMultiSelect
                instancesFilter
                instancesService={dbType}
                isInstanceMultiSelect
                dbType={dbType}
                tagsFilter
                tagColumnName='TagList'
                collection={dbCollection}
                localService='Amazon Relational Database Service'
            />
        </div>
    )
}
