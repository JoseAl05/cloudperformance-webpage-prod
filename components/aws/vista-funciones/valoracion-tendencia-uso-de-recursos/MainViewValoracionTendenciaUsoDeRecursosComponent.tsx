import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { ValoracionTendenciaUsoDeRecursosComponent }  from './ValoracionTendenciaUsoDeRecursosComponent'
import { Globe } from 'lucide-react'

export const ViewValoracionTendenciaUsoDeRecursos = () => {
  return (
    <div className='w-full min-w-2 space-y-9'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  Dashboard AWS / Variacion tendencia uso de recursos
                </h1>
                <p className='text-gray-500 dark:text-gray-400'>
                  Vista Variacion tendencia uso de recursos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros + gráfico */}
      <FiltersComponent
        Component={ValoracionTendenciaUsoDeRecursosComponent}
        dateFilter
        regionFilter
        // s3Filter
        // serviceFilter
        variationServiceFilter
        variationMetricFilter
      />
    </div>
  )
}
