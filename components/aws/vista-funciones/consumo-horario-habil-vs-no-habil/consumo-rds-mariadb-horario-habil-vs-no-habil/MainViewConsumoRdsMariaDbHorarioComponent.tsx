import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { MainViewConsumoRdsMariaDbHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-mariadb-horario-habil-vs-no-habil/ConsumoRdsMariaDbHorarioComponent'
import { Database } from 'lucide-react'

export const ViewConsumoRdsMariaDbHorario = () => {
  return (
    <div className='w-full min-w-2 space-y-9'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Database className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  Consumo RDS MariaDB
                </h1>
                <p className='text-gray-500 dark:text-gray-400'>
                  Comparación de consumo en horario hábil vs no hábil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros + gráfico */}
      <FiltersComponent
        Component={MainViewConsumoRdsMariaDbHorario}
        dateFilter
        rdsFilter
        engine="mariadb"
        instancesFilter
        instancesService='rds-mariadb'
        isInstanceMultiSelect
      />
    </div>
  )
}
