'use client'
import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { IncrementoTopRecursosUsoChartComponent } from '@/components/azure/vista-funciones/incremento-top-recursos-uso/IncrementoTopRecursosUsoChartComponent'
import { TrendingUp } from 'lucide-react'

export const MainViewIncrementoTopRecursosUsoComponent = () => {
  return (
    <div className='w-full min-w-2 space-y-9'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  Dashboard Azure / Uso de Recursos
                </h1>
                <p className='text-gray-500 dark:text-gray-400'>
                  Incremento (%) en el uso de recursos en comparación con el mes anterior (línea de tiempo)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros + gráfico */}
      <FiltersComponent
        Component={IncrementoTopRecursosUsoChartComponent}
        dateFilter
        metricsFilter
        metricsCollection='custom_db_metrics_logs'
        resourceTypeFilter
        resourcesFilter  
      />
    </div>
  )
}