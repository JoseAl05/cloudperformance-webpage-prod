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

export const SidebarComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    const { state, open } = useSidebar()
    const isExpanded = open || state === 'mobile'
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
        { label: 'Eventos', icon: Zap, href: '/aws/eventos' },
        { label: 'Vista Advisor', icon: Pyramid, href: '/aws/advisor' },
        {
            label: 'Vista Saving Plans',
            icon: HandCoins,
            href: '/aws/saving-plan',
        },
    ]

    const recursos = [
        { label: 'Instancias EC2', icon: Computer, href: '/aws/recursos/instancias-ec2', color: 'text-orange-500' },
        { label: 'Auto Scaling groups', icon: TrendingUp, href: '/aws/recursos/autoscaling-groups', color: 'text-emerald-500' },
        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/recursos/instancias-rds-pg', color: 'text-blue-600' },
        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/recursos/instancias-rds-mysql', color: 'text-emerald-600' },
        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/recursos/instancias-rds-sqlserver', color: 'text-purple-600' },
        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/recursos/instancias-rds-oracle', color: 'text-red-600' },
        { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/recursos/instancias-rds-mariadb', color: 'text-amber-600' },
    ]

    const topFacturaciones = [
        { label: 'Top Facturaciones por Región', href: '/aws/funciones/top-dolares-region', icon: Earth, color: 'text-purple-500' },
        { label: 'Top Facturaciones por SO', href: '/aws/funciones/top-dolares-so', icon: Database, color: 'text-purple-500' },
        { label: 'Top Facturaciones por Tipo de Instancia', href: '/aws/funciones/top-dolares-por-tipo-de-instancia', icon: Computer, color: 'text-teal-600' },
        { label: 'Top Facturaciones por Familia de Instancias', href: '/aws/funciones/top-dolares-por-familia-de-instancia', icon: Box, color: 'text-indigo-600' },
        { label: 'Top Facturaciones por Tipo de Compra', href: '/aws/funciones/top-dolares-por-tipo-de-compra', icon: HandCoins, color: 'text-amber-600' },
        { label: 'Top Facturaciones por Tipo de Cobro', href: '/aws/funciones/top-dolares-por-tipo-de-cobro', icon: Zap, color: 'text-red-500' },
        { label: 'Top Facturaciones por Recursos', href: '/aws/funciones/top-dolares-por-id-recurso', icon: Grid2X2, color: 'text-blue-500' },
        { label: 'Top Recursos', href: '/aws/funciones/top-recursos', icon: Grid2X2, color: 'text-blue-500' },
    ]

    const consumoHorario = [
        { label: 'Consumo Instancias EC2', href: '/aws/funciones/consumo-ec2-horario-habil-vs-no-habil', icon: Computer, color: 'text-green-500' },
        { label: 'Consumo Instancias EC2 AutoscalingGroups', href: '/aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil', icon: Computer, color: 'text-green-500' },
        { label: 'Consumo Instancias EC2 Nodos EKS', href: '/aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil', icon: Computer, color: 'text-green-500' },
        { label: 'Consumo Instancias RDS Postgresql', href: '/aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Consumo Instancias RDS Mysql', href: '/aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Consumo Instancias RDS SQL Server', href: '/aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Consumo Instancias RDS Oracle', href: '/aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Consumo Instancias RDS MariaDB', href: '/aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
    ]

    const consumeSubItems = [
        { label: 'Consumo EC2', icon: Computer, href: '/aws/consumos/ec2' },
        { label: 'Consumo ASG EC2', icon: Computer, href: '/aws/consumos/asg' },
        { label: 'Consumo EKS', icon: Computer, href: '/aws/consumos/eks' },
        { label: 'Consumo RDS Postgresql', icon: Database, href: '/aws/consumos/rds/postgresql' },
        { label: 'Consumo RDS Mysql', icon: Database, href: '/aws/consumos/rds/mysql' },
        { label: 'Consumo RDS Oracle', icon: Database, href: '/aws/consumos/rds/oracle' },
        { label: 'Consumo RDS SQL Server', icon: Database, href: '/aws/consumos/rds/sqlserver' },
        { label: 'Consumo RDS MariaDB', icon: Database, href: '/aws/consumos/rds/mariadb' }
    ]

    const consumes = [{ label: 'Consumos', subItems: consumeSubItems, icon: Zap }]

    const funciones = [
        { label: 'Top Facturaciones', subItems: topFacturaciones, icon: Zap },
        { label: 'Consumo horario hábil vs no hábil', subItems: consumoHorario, icon: Clock },
        { label: 'Spot vs Vm', href: '/aws/funciones/spot-vs-vm', icon: Database },
        { label: 'Top S3 Buckets', href: '/aws/funciones/top-s3-buckets', icon: Server },
        { label: 'Ebs No Utilizados', href: '/aws/funciones/ebs-no-utilizados', icon: HardDrive }
    ]
    const funcionesConSub = funciones.filter(f => f.subItems && f.subItems.length)
    const funcionesSimples = funciones.filter(f => f.href)

    const defaultOpenRecursos = recursos.some((r) => r.href === pathname)
    const [isRecursosOpen, setIsRecursosOpen] = useState(defaultOpenRecursos)

    const defaultOpenFunciones = funciones.some((f) =>
        (f.href && f.href === pathname) || f.subItems?.some((sub) => sub.href === pathname)
    )
    const [isFuncionesOpen, setIsFuncionesOpen] = useState(defaultOpenFunciones)

    const defaultOpenConsumes = consumes.some((f) =>
        f.subItems?.some((sub) => sub.href === pathname)
    )
    const [isConsumesOpen, setIsConsumesOpen] = useState(defaultOpenConsumes)

    const initialOpenByGroup = useMemo(() => {
        return funcionesConSub.reduce<Record<string, boolean>>((acc, grupo) => {
            acc[grupo.label] = grupo.subItems?.some((sub) => sub.href === pathname) ?? false
            return acc
        }, {})
    }, [funcionesConSub, pathname])

    const [openByGroup, setOpenByGroup] = useState<Record<string, boolean>>(initialOpenByGroup)

    useEffect(() => {
        if (state === 'collapsed' && state !== 'mobile') {
            setIsRecursosOpen(false)
            setIsFuncionesOpen(false)
            setOpenByGroup(prev => {
                const closed = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
                return closed
            })
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
                                            {funcionesConSub.map((grupo) => {
                                                const isGroupOpen = openByGroup[grupo.label] ?? false
                                                return (
                                                    <Collapsible
                                                        key={grupo.label}
                                                        open={isGroupOpen}
                                                        onOpenChange={(open) =>
                                                            setOpenByGroup(prev => ({ ...prev, [grupo.label]: open }))
                                                        }
                                                    >
                                                        <CollapsibleTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="w-full flex items-center justify-between px-3 py-2 pl-6 rounded-md cursor-pointer bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:translate-x-1"
                                                                variant='default'
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <grupo.icon className="h-5 w-5 text-blue-400" />
                                                                    <span className="text-sm font-medium">
                                                                        {grupo.label}
                                                                    </span>
                                                                </div>
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'h-4 w-4 transition-transform duration-300 ease-in-out',
                                                                        isGroupOpen && 'rotate-180'
                                                                    )}
                                                                />
                                                            </button>
                                                        </CollapsibleTrigger>

                                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                            {grupo.subItems!.map((sub) => {
                                                                const isSubActive = pathname === sub.href
                                                                return (
                                                                    <Link
                                                                        key={sub.label}
                                                                        href={sub.href}
                                                                        className={cn(
                                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-10 border-l-2 transition-all duration-200 ease-in-out transform border-current",
                                                                            sub.color,
                                                                            getMenuItemClasses(isSubActive),
                                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                                        )}
                                                                    >
                                                                        <sub.icon className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                                                                        <span className="text-sm">{sub.label}</span>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )
                                            })}
                                            {funcionesSimples.map((f) => {
                                                const isActive = pathname === f.href
                                                return (
                                                    <Link
                                                        key={f.label}
                                                        href={f.href!}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-6 transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isActive),
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <f.icon className="h-4 w-4 text-blue-400" />
                                                        <span className="text-sm">{f.label}</span>
                                                    </Link>
                                                )
                                            })}
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
                                                        <subItem.icon className={cn("h-4 w-4 text-blue-400 transition-transform duration-200 hover:scale-110", subItem.color)} />
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
