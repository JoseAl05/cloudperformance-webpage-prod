import { CircleDollarSign } from 'lucide-react'
import MainMenuComponent from '@/components/azure/presupuesto/MainMenuComponent'
// importa tu HomePage.tsx
// import { AdvisorViewComponent } from '@/components/presupuesto/AdvisorViewComponent'

export const MainViewPresupuestoComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            {/* Sección de encabezado */}
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <CircleDollarSign className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Presupuesto
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aquí puedes integrar HomePage como un subcomponente */}
            <div className='w-full'>
                <MainMenuComponent />
            </div>

            {/* Filtros (opcional, comentados por ahora) */}
            {/*
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AdvisorViewComponent}
                    dateFilter
                    regionFilter
                    advisorCategoriesFilter
                    advisorStatusFilter
                    isAdvisorCategoryMultiselect
                    isAdvisorStatusMultiselect
                />
            </div>
            */}
        </div>
    )
}
