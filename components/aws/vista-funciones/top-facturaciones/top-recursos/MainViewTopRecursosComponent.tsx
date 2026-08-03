import { MainViewTopRecursos } from '@/components/aws/vista-funciones/top-facturaciones/top-recursos/TopRecursosComponent'
import { Globe, Info } from 'lucide-react'

export const TopRecursosComponent = () => {
  return (
    <div className='w-full min-w-2 space-y-8'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-6'>
        <div className='flex items-start gap-4'>
          <div className='h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0 shadow-sm'>
            <Globe className='h-6 w-6 text-green-600 dark:text-green-400' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
              Top Recursos AWS
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Distribución y volumen de recursos únicos activos en tu infraestructura.
            </p>
            
            <div className='inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300'>
              <Info className='h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400' />
              <span>
                Muestra visualizada: <strong>Última captura de datos registrada</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <MainViewTopRecursos />
    </div>
  )
}