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
    Layers,
    LineChart,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'

// helper para estilos dinámicos
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

export const SidebarComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    const { state, open } = useSidebar()
    const isExpanded = open || state === 'mobile' // <- clave
    const { getMenuItemClasses } = useMenuStyles();
    const [isMounted, setIsMounted] = useState(false);

    const routes = [
        {
            label: 'Inicio',
            icon: Grid2X2,
            href: '/aws/facturacion/tendencia-facturacion',
        },
        { label: 'Quotas', icon: PieChart, href: '/aws/quotas' },
        { label: 'Deployments', icon: Zap, href: '/aws/deployments' },
        { label: 'Vista Asesor', icon: Pyramid, href: '/aws/advisor' },
        {
            label: 'Vista Saving Plans',
            icon: HandCoins,
            href: '/aws/saving-plan',
        },
    ]

    const recursos = [
        {
            label: 'Instancias EC2',
            icon: Computer,
            href: '/aws/recursos/instancias-ec2',
        },
        {
            label: 'Autoscaling Groups',
            icon: Computer,
            href: '/aws/recursos/autoscaling-groups',
        },
        {
            label: 'Instancias RDS Postgresql',
            icon: Database,
            href: '/aws/recursos/instancias-rds-pg',
        },
        {
            label: 'Instancias RDS Mysql',
            icon: Database,
            href: '/aws/recursos/instancias-rds-mysql',
        },
        {
            label: 'Instancias RDS SQL Server',
            icon: Database,
            href: '/aws/recursos/instancias-rds-sqlserver',
        },
        {
            label: 'Instancias RDS Oracle',
            icon: Database,
            href: '/aws/recursos/instancias-rds-oracle',
        },
    ]

    const topFacturaciones = [
        {
            label: 'Top Facturaciones por Región',
            href: '/aws/funciones/top-dolares-region',
            icon: Earth,
        },
        {
            label: 'Top Facturaciones por SO',
            href: '/aws/funciones/top-dolares-so',
            icon: Database,
        },
        {
            label: 'Top Facturaciones por Tipo de Instancia',
            href: '/aws/funciones/top-tipo-instancia',
            icon: Computer,
        },
        {
            label: 'Top Facturaciones por Familia de Instancias',
            href: '/aws/funciones/top-familia-instancias',
            icon: Box,
        },
        {
            label: 'Top Facturaciones por Tipo de Compra',
            href: '/aws/funciones/top-tipo-compra',
            icon: HandCoins,
        },
        {
            label: 'Top Facturaciones por Tipo de Cobro',
            href: '/aws/funciones/top-tipo-cobro',
            icon: Zap,
        },
        {
            label: 'Top Facturaciones por ID Recurso',
            href: '/aws/funciones/top-id-recurso',
            icon: Grid2X2,
        },
    ]

    const consumeSubItems = [
        { label: 'Consumo EC2', icon: Computer, href: '/aws/consumos/ec2' },
        { label: 'Consumo ASG EC2', icon: Layers, href: '/aws/consumos/asg' },
        { label: 'Consumo RDS Postgresql', icon: Database , href: '/aws/consumos/rds/postgresql'}
    ]

    const consumes = [{ label: 'Consumos', subItems: consumeSubItems, icon: Zap }]
    const funciones = [
        { label: 'Top Facturaciones', subItems: topFacturaciones, icon: Zap },
    ]

    const defaultOpenRecursos = recursos.some((r) => r.href === pathname)
    const [isRecursosOpen, setIsRecursosOpen] = useState(defaultOpenRecursos)

    const defaultOpenFunciones = funciones.some((f) =>
        f.subItems?.some((sub) => sub.href === pathname)
    )
    const [isFuncionesOpen, setIsFuncionesOpen] = useState(defaultOpenFunciones)

    const defaultOpenConsumes = consumes.some((f) =>
        f.subItems?.some((sub) => sub.href === pathname)
    )
    const [isConsumesOpen, setIsConsumesOpen] = useState(defaultOpenConsumes)

    const defaultOpenTopFacturaciones = topFacturaciones.some(
        (t) => t.href === pathname
    )
    const [isTopFacturacionesOpen, setIsTopFacturacionesOpen] =
        useState(defaultOpenTopFacturaciones)

    useEffect(() => {
        if (state === 'collapsed' && state !== 'mobile') {
            setIsRecursosOpen(false)
            setIsFuncionesOpen(false)
            setIsTopFacturacionesOpen(false)
        }
    }, [state])

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
                    alt="Logo Cloud Performance"
                    src="/logo.png"
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
                                            <item.icon className="h-5 w-5 text-blue-500" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}

                        {isExpanded && (
                            <>
                                <SidebarMenuItem className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <Collapsible open={isConsumesOpen} onOpenChange={setIsConsumesOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <LineChart className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Consumos</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isConsumesOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
                                                "mt-1 space-y-1",
                                            )}
                                        >
                                            {consumeSubItems.map((sub) => {
                                                const isSubActive = pathname === sub.href
                                                return (
                                                    <Link
                                                        key={sub.label}
                                                        href={sub.href}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-8 border-l transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isSubActive),
                                                            "border-blue-200 dark:border-blue-800",
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <sub.icon className="h-4 w-4 text-blue-400 transition-transform duration-200 group-hover:scale-110" />
                                                        <span className="text-sm">{sub.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>

                                <SidebarMenuItem className="mt-2">
                                    <Collapsible open={isFuncionesOpen} onOpenChange={setIsFuncionesOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Funciones</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isFuncionesOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            <Collapsible
                                                open={isTopFacturacionesOpen}
                                                onOpenChange={setIsTopFacturacionesOpen}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <div className="flex items-center justify-between px-3 py-2 pl-6 rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:translate-x-1">
                                                        <div className="flex items-center gap-2">
                                                            <Zap className="h-5 w-5 text-blue-400 transition-transform duration-200 hover:scale-110" />
                                                            <span className="text-sm font-medium">
                                                                Top Facturaciones
                                                            </span>
                                                        </div>
                                                        <ChevronDown
                                                            className={cn(
                                                                'h-4 w-4 transition-transform duration-300 ease-in-out',
                                                                isTopFacturacionesOpen && 'rotate-180'
                                                            )}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                    {topFacturaciones.map((sub) => {
                                                        const isSubActive = pathname === sub.href
                                                        return (
                                                            <Link
                                                                key={sub.label}
                                                                href={sub.href}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-10 border-l transition-all duration-200 ease-in-out transform",
                                                                    getMenuItemClasses(isSubActive),
                                                                    "border-blue-200 dark:border-blue-800",
                                                                    "hover:scale-[1.02] hover:translate-x-1",
                                                                )}
                                                            >
                                                                <sub.icon className="h-4 w-4 text-blue-400 transition-transform duration-200 hover:scale-110" />
                                                                <span className="text-sm">{sub.label}</span>
                                                            </Link>
                                                        )
                                                    })}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                                <SidebarMenuItem className="mt-2">
                                    <Collapsible open={isRecursosOpen} onOpenChange={setIsRecursosOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Recursos</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isRecursosOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            {recursos.map((subItem) => {
                                                const isActive = pathname === subItem.href
                                                return (
                                                    <Link
                                                        key={subItem.label}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-8 border-l transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isActive),
                                                            "border-blue-200 dark:border-blue-800",
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <subItem.icon className="h-4 w-4 text-blue-400 transition-transform duration-200 hover:scale-110" />
                                                        <span className="text-sm">{subItem.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
