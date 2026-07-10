'use client'
import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, Bot, ChartLine, DollarSign, Map, User } from 'lucide-react'
import Link from 'next/link'

export const MainViewCostOptimizationComponent = () => {

    const modules = [
        {
            key: 'inference-profiles',
            title: 'Inference Profiles',
            // description: 'Visualiza y analiza los dashboards de costos de tus nubes.',
            href: '/amazon-bedrock/costo-optimizacion/inference-profiles',
            icon: User,
            iconWrapClass: 'bg-blue-100 dark:bg-blue-900/30',
            iconClass: 'text-blue-600 dark:text-blue-400',
            glowClass: 'bg-blue-400/40',
            visible: true,
        },
        {
            key: 'custom-models',
            title: 'Modelos Custom',
            // description: 'Explora los dashboards de los principales servicios de IA de tus nubes.',
            href: '/amazon-bedrock/costo-optimizacion/custom-models',
            icon: Map,
            iconWrapClass: 'bg-violet-100 dark:bg-violet-900/30',
            iconClass: 'text-violet-600 dark:text-violet-400',
            glowClass: 'bg-violet-400/40',
            visible: true,
        },
        {
            key: 'foundation-models',
            title: 'Modelos Foundation',
            // description: 'Compara costos y métricas entre tus distintas nubes.',
            href: '/amazon-bedrock/costo-optimizacion/foundation-models',
            icon: Bot,
            iconWrapClass: 'bg-emerald-100 dark:bg-emerald-900/30',
            iconClass: 'text-emerald-600 dark:text-emerald-400',
            glowClass: 'bg-emerald-400/40',
        }
    ]


    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <DollarSign className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Costo y Optimización
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Link
                            key={module.key}
                            href={module.href}
                            className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Card className="relative h-full overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                                <div
                                    className={cn(
                                        'pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100',
                                        module.glowClass
                                    )}
                                />
                                <CardHeader className="relative pb-3">
                                    <div
                                        className={cn(
                                            'mb-2 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                                            module.iconWrapClass
                                        )}
                                    >
                                        <Icon className={cn('h-6 w-6', module.iconClass)} />
                                    </div>
                                    <CardTitle className="text-lg font-semibold">
                                        {module.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                                        Acceder
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
