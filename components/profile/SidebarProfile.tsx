'use client'

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
    Shield,
    Mail,
    Cloud,
    House,
    CircleDollarSign,
    Users, 
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useSession } from '@/hooks/useSession' 

const useMenuStyles = () => {
    const { resolvedTheme } = useTheme()

    const getMenuItemClasses = (isActive: boolean) => {
        if (isActive) {
            return resolvedTheme === 'dark'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 text-white'
        }
        return resolvedTheme === 'dark'
            ? 'hover:bg-blue-800 hover:text-blue-100 text-gray-300'
            : 'hover:bg-blue-50 hover:text-blue-900 text-gray-700'
    }

    return { getMenuItemClasses }
}

export const SidebarProfileComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    const { state, open } = useSidebar()
    const isExpanded = open || state === 'mobile'
    const { getMenuItemClasses } = useMenuStyles();
    const [isMounted, setIsMounted] = useState(false);
    const [isActive, setIsActive] = useState(false);
    
    // CARGAR SESIÓN para obtener el rol
    const { user, isLoading } = useSession(); 
    
    // Determinar si el usuario tiene permiso para ver el enlace de perfilamiento
    const canAccessProfiling = user && (user.role === 'admin_global' || user.role === 'admin_empresa');

    useEffect(() => {
        // Asegúrate de que este chequeo de pathname también verifique las nuevas rutas
        setIsActive(pathname.startsWith('/perfil/nubes') || pathname.startsWith('/presupuesto') || pathname.startsWith('/perfilamiento'));
    }, [pathname]) // Se actualiza cada vez que la ruta cambia

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoading) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex flex-col items-center gap-2 py-4">
                <Image
                    width={100}
                    height={100}
                    alt="Logo Intac"
                    src="/logo-intac.svg"
                    className="object-cover"
                />
                {open && (
                    <span className="text-xl font-bold tracking-wide">
                        Cloud Performance
                    </span>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    href="/perfil"
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                        getMenuItemClasses(pathname === '/perfil') // Corregir chequeo de activación
                                    )}
                                >
                                    <House className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Inicio</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link
                                    href="#"
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                        getMenuItemClasses(false) // Dejar inactivo
                                    )}
                                >
                                    <Shield className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Modificar Contraseña</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link
                                    href="#"
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                        getMenuItemClasses(false) // Dejar inactivo
                                    )}
                                >
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Modificar Correo</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link
                                    href='/perfil/nubes'
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                        getMenuItemClasses(pathname.startsWith('/perfil/nubes'))
                                    )}
                                >
                                    <Cloud className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Nubes</span>
                                </Link>
                            </SidebarMenuButton>
                            {/* <SidebarMenuButton asChild>
                                <Link
                                    href='/presupuesto'
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                        getMenuItemClasses(pathname.startsWith('/presupuesto'))
                                    )}
                                >
                                    <CircleDollarSign className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Presupuesto</span>
                                </Link>
                            </SidebarMenuButton> */}

                            {/* =================================================== */}
                            {/* NUEVA SECCIÓN: PERFILAMIENTO */}
                            {/* =================================================== */}
                            {canAccessProfiling && (
                                <SidebarMenuButton asChild>
                                    <Link
                                        href='/perfilamiento' 
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                            getMenuItemClasses(pathname.startsWith('/perfilamiento'))
                                        )}
                                    >
                                        <Users className="h-5 w-5 text-blue-500" /> 
                                        <span className="text-sm font-medium">Perfilamiento</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}