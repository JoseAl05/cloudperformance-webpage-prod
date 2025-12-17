'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { ArrowRight, Users, PlusCircle, DollarSign, Key } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const ACTIONS = [
    {
        name: 'Listado de Usuarios',
        description: 'Revisa, edita y elimina los usuarios existentes de tu competencia.',
        icon: Users,
        href: '/perfilamiento/usuarios',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-600',
        role: ['admin_global', 'admin_empresa'],
    },
    {
        name: 'Crear Nuevo Usuario',
        description: 'Añade un nuevo usuario y asigna sus permisos y rol.',
        icon: PlusCircle,
        href: '/perfilamiento/usuarios/crear',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-600',
        role: ['admin_global', 'admin_empresa'],
    },
    {
        name: 'Crear Nueva Licencia',
        description: 'Da de alta una nueva empresa y establece sus límites de usuario.',
        icon: Key,
        href: '/perfilamiento/licencias/crear',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-600',
        role: ['admin_global'], 
    },

    {
        name: 'Gestión de Licencias (Empresas)',
        description: 'Administrar planes de servicio y límites por defecto.',
        icon: DollarSign,
        href: '/perfilamiento/licencias', 
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-600',
        role: ['admin_global'],
    },
];

export default function PerfilamientoIndexPage() {
    const { user, isLoading } = useSession(); 
    
    if (isLoading) return <div className="mx-auto max-w-5xl px-4 py-8 text-center text-gray-500">Cargando módulo...</div>;

    if (!user || (user.role !== 'admin_global' && user.role !== 'admin_empresa')) {
        return (
             <div className="mx-auto max-w-5xl px-4 py-8 text-center">
                 <div className="p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold">🚫 Acceso Denegado</h1>
                    <p className="mt-2 text-sm">Tu rol ({user.role}) no tiene permisos para acceder a esta área de gestión.</p>
                </div>
            </div>
        );
    }

    const userRole = user.role;
    
    const availableActions = ACTIONS.filter(action => action.role.includes(userRole));

    return (
        <section className="mx-auto max-w-5xl px-4 py-8">
            <header className="mb-8">
                <h2 className="text-2xl font-semibold">Panel de Perfilamiento y Gestión</h2>
                <p className="text-sm text-muted-foreground">
                    Selecciona la tarea de gestión de usuarios o licencias. (Rol: {userRole.toUpperCase().replace('_', ' ')})
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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