'use client'
import { FMPromptOptComponent } from '@/components/microsoft-foundry/propmt-opt/FMPromptOptComponent'
import { Sparkles, TrendingUp } from 'lucide-react'

export const MainViewFMPropmptOptComponent = () => {

    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <TrendingUp className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Optimización de Prompts
                                </h1>
                            </div>
                        </div>
                        <p className='max-w-[68ch] text-sm leading-relaxed text-muted-foreground'>
                            En Azure Foundry se paga por cantidad de tokens, no por prompt. Selecciona el modelo que deseas y pega el prompt en la casilla de texto para obtener un detalle de la cantidad de uso de tokens junto con una versión optimizada{' '}
                            <strong className='font-semibold text-slate-700 dark:text-slate-200'>token a token</strong>
                            {' '}contra su versión comprimida, con el mismo tokenizador que usa el modelo que elijas. La
                            compresión sacrifica legibilidad para bajar el conteo, así que el resultado optimizado debe ser revisado con atención antes de utilizarlo en producción.
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FMPromptOptComponent />
            </div>
        </div>
    )
}
