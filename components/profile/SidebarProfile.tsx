'use client'

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import {
    Grid2X2,
    PieChart,
    Zap,
    Box,
    Computer,
    Database,
    Pyramid,
    ChevronDown,
    HandCoins,
    Earth,
    LineChart,
    TrendingUp,
    Server,
    HardDrive,
    Clock,
    Map,
    TrendingDown,
    Shield,
    Mail,
    Cloud,
    House,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

    useEffect(() => {
        setIsActive(pathname === '/azure/profile')
    })

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
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
                                        getMenuItemClasses(isActive)
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
                                        getMenuItemClasses(isActive)
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
                                        getMenuItemClasses(isActive)
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
                                        getMenuItemClasses(isActive)
                                    )}
                                >
                                    <Cloud className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Nubes</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
