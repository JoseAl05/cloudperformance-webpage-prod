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
    Zap,
    Box,
    ChevronDown,
    LineChart,
    LayoutDashboard,
    DollarSign,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'

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
    const getIconClasses = (isActive: boolean, defaultColor: string = 'text-blue-500') => {
        if (isActive) {
            return 'text-white'
        }
        return defaultColor
    }

    return { getMenuItemClasses, getIconClasses }
}

export const SidebarDashboardServiciosIaComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    const { state, open } = useSidebar()
    const isExpanded = open || state === 'mobile'
    const { getMenuItemClasses, getIconClasses } = useMenuStyles();
    const [isMounted, setIsMounted] = useState(false);
    const [isAmazonBedrock, setIsAmazonBedrock] = useState(false);

    const provider = useMemo(() => {
        if (!pathname) return null
        if (pathname.startsWith('/amazon-bedrock')) return 'amazon-bedrock'
        return null
    }, [pathname])

    // Amazon Bedrock

    const amazonBedrockRoutes = {
        routes: [
            { label: 'Inicio', icon: LayoutDashboard, href: '/amazon-bedrock' },
            { label: 'Costo y Optimización', icon: DollarSign, href: '/amazon-bedrock/costo-optimizacion' },
        ]
    }

    const { routes, recursos, consumes, funciones } = useMemo(() => {
        if (isAmazonBedrock) return amazonBedrockRoutes
        return { routes: [] }
    }, [isAmazonBedrock]);


    useEffect(() => {
        if (state === 'collapsed' && state !== 'mobile') {
            // setIsRecursosOpen(false)
            // setIsFuncionesOpen(false)
            // setOpenByGroup(prev => {
            //     const closed = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
            //     return closed
            // })
        }
    }, [state])

    useEffect(() => {
        setIsAmazonBedrock(pathname.startsWith('/amazon-bedrock'))
    }, [pathname])

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
                        {routes.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                                getMenuItemClasses(isActive)
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5", getIconClasses(isActive))} />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        {isExpanded && (
                            <>

                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
