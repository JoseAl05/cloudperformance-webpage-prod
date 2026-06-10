'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { ArrowRight, FileJson, UserCog, LayoutDashboard, History } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const ACTIONS = [
    {
        name: 'Gestión de Partner',
        description: 'Busca un partner, revisa sus UCs licenciadas y agrega o renueva unidades de cómputo manualmente.',
        icon: UserCog,
        href: '/op-licencias/partner',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-600',
        role: ['admin_global'],
    },
    {
        name: 'Carga de Solicitud',
        description: 'Importa el archivo solicitud.json generado por la plataforma OnPremises, revisa y genera el .lic.',
        icon: FileJson,
        href: '/op-licencias/importar',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-600',
        role: ['admin_global'],
    },
    {
        name: 'Estado de Licencias',
        description: 'Vista global de todos los partners y el estado actual de sus unidades de cómputo licenciadas.',
        icon: LayoutDashboard,
        href: '/op-licencias/estado',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-600',
        role: ['admin_global'],
    },
    {
        name: 'Historial de Entregas',
        description: 'Revisa los archivos .lic generados anteriormente por partner y fecha con opción de redownload.',
        icon: History,
        href: '/op-licencias/historial',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-600',
        role: ['admin_global'],
    },
];

export default function OpLicenciasPage() {
    const { user, isLoading } = useSession(); 
    
    if (isLoading) return (
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-muted-foreground">
            Cargando módulo...
        </div>
    );

    if (!user || user.role !== 'admin_global') {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 text-center">
                <div className="p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold">🚫 Acceso Denegado</h1>
                    <p className="mt-2 text-sm">Esta sección es exclusiva para administradores de INTAC.</p>
                </div>
            </div>
        );
    }

    const availableActions = ACTIONS.filter(action => action.role.includes(user.role));

    return (
        <section className="mx-auto max-w-5xl px-4 py-8">
            <header className="mb-8">
                <h2 className="text-2xl font-semibold">Licencias OnPremises</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona las licencias de CloudPerformance para partners OnPremises.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {availableActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                        <Link
                            key={action.name}
                            href={action.href}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-lg",
                                action.bgColor 
                            )}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <IconComponent className={cn("h-6 w-6 mb-2", action.textColor)} />
                                    <h3 className="text-lg font-semibold">{action.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                                <ArrowRight className={cn("h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1", action.textColor)} />
                            </div>
                            <div className={cn("absolute -right-8 -top-8 h-20 w-20 rounded-full blur-xl opacity-20", action.bgColor)} />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}