import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { MainViewConsumoEC2AutoscalingGroupsHorario }  from './ConsumoEC2AsgHorarioComponent'
import { Computer } from 'lucide-react'

export const ViewConsumoEC2AutoscalingGroupsHorario = () => {
  return (
    <div className='w-full min-w-2 space-y-9'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Computer className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  Consumo EC2 Autoscaling Groups
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
        Component={MainViewConsumoEC2AutoscalingGroupsHorario}
        dateFilter
        metricFilter
        autoScalingGroupFilter
      />
    </div>
  )
}
