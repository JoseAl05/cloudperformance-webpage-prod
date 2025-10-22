import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { MainViewConsumoRdsSqlHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-sql-horario-habil-vs-no-habil/ConsumoRdsSqlHorarioComponent'
import { Database } from 'lucide-react'

export const ViewConsumoRdsSqlHorario = () => {
  return (
    <div className="w-full min-w-2 space-y-9">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Consumo RDS SQL
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Comparación de consumo en horario hábil vs no hábil
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros + gráfico */}
      <FiltersComponent
        Component={MainViewConsumoRdsSqlHorario}
        dateFilter
        rdsFilter
        engine="sql"
        instancesFilter
        instancesService='rds-sqlserver'
        isInstanceMultiSelect
      />
    </div>
  )
}
