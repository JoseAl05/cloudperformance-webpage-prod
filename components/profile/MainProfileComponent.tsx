'use client'

import { useMemo } from 'react';
import { useSession } from '@/hooks/useSession';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { ArrowRight, Bell, Bot, Cloud, SplitSquareHorizontal, Stars, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const MainProfileComponent = () => {
    const actualSession = useSession();

    const modules = useMemo(() => {
        const user = actualSession.user;
        const canAccessProfiling = !!user && (user.role === 'admin_global' || user.role === 'admin_empresa');
        const hasMultitenant = !!user && (user.is_aws_multi_tenant || user.is_azure_multi_tenant);

        return [
            {
                key: 'nubes',
                title: 'Nubes',
                description: 'Visualiza y analiza los dashboards de costos de tus nubes.',
                href: '/perfil/nubes',
                icon: Cloud,
                iconWrapClass: 'bg-blue-100 dark:bg-blue-900/30',
                iconClass: 'text-blue-600 dark:text-blue-400',
                glowClass: 'bg-blue-400/40',
                visible: true,
            },
            {
                key: 'servicios-ia',
                title: 'Servicios IA',
                description: 'Explora los dashboards de los principales servicios de IA de tus nubes.',
                href: '/perfil/servicios-ia',
                icon: Bot,
                iconWrapClass: 'bg-violet-100 dark:bg-violet-900/30',
                iconClass: 'text-violet-600 dark:text-violet-400',
                glowClass: 'bg-violet-400/40',
                visible: true,
            },
            {
                key: 'comparacion-nubes',
                title: 'Comparación Nubes',
                description: 'Compara costos y métricas entre tus distintas nubes.',
                href: '/comparacion-nubes',
                icon: SplitSquareHorizontal,
                iconWrapClass: 'bg-emerald-100 dark:bg-emerald-900/30',
                iconClass: 'text-emerald-600 dark:text-emerald-400',
                glowClass: 'bg-emerald-400/40',
                visible: hasMultitenant,
            },
            {
                key: 'perfilamiento',
                title: 'Perfilamiento',
                description: 'Administra usuarios, roles y permisos de acceso.',
                href: '/perfilamiento',
                icon: Users,
                iconWrapClass: 'bg-amber-100 dark:bg-amber-900/30',
                iconClass: 'text-amber-600 dark:text-amber-400',
                glowClass: 'bg-amber-400/40',
                visible: canAccessProfiling,
            },
            {
                key: 'alertas',
                title: 'Alertas',
                description: 'Configura y revisa las alertas de tus recursos.',
                href: '/alertas',
                icon: Bell,
                iconWrapClass: 'bg-rose-100 dark:bg-rose-900/30',
                iconClass: 'text-rose-600 dark:text-rose-400',
                glowClass: 'bg-rose-400/40',
                visible: true,
            },
        ].filter((module) => module.visible);
    }, [actualSession.user]);

    if (actualSession.isLoading) {
        return <LoaderComponent />
    }
    if (actualSession.error) {
        return <p>Error</p>
    }

    const username = actualSession.user?.username;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    ¡Bienvenido, {username}!
                </h1>
                <p className="text-sm text-muted-foreground md:text-base">
                    Accede a los módulos principales de Cloud Performance.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight md:text-2xl">
                    <Stars className="h-6 w-6 text-primary" />
                    Principales Módulos
                </h2>
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
                                        <CardDescription className="text-sm leading-relaxed">
                                            {module.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                                            Acceder
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}