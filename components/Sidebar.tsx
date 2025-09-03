'use client'

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { Grid2X2, Home, LineChart, PieChart, Zap, Box, Computer, Database, Pyramid, ChevronDown, HandCoins, Earth } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname()
    const { state, open } = useSidebar()

    const routes = [
        { label: 'Inicio', icon: Grid2X2, href: '/aws/facturacion/tendencia-facturacion', color: 'text-sky-500' },
        { label: 'Consumo', icon: LineChart, href: '/aws/consumos', color: 'text-green-600' },
        { label: 'Quotas', icon: PieChart, href: '/aws/quotas', color: 'text-violet-500' },
        { label: 'Deployments', icon: Zap, href: '/aws/deployments', color: 'text-pink-500' },
        { label: 'Vista Asesor', icon: Pyramid, href: '/aws/advisor', color: 'text-[#3258de]' },
        { label: 'Vista Saving Plans', icon: HandCoins, href: '/aws/saving-plan', tooltip: 'Vista Saving Plans', color: 'text-[#3258de]' }
    ]

    const recursos = [
        { label: 'Instancias EC2', icon: Computer, href: '/aws/recursos/instancias-ec2', color: 'text-orange-500' },
        { label: 'Autoscaling Groups', icon: Computer, href: '/aws/recursos/autoscaling-groups', color: 'text-orange-500' },
        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/recursos/instancias-rds-pg', color: 'text-orange-600' },
        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/recursos/instancias-rds-mysql', color: 'text-orange-600' },
        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/recursos/instancias-rds-sqlserver', color: 'text-orange-600' },
        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/recursos/instancias-rds-oracle', color: 'text-orange-600' },
    ]

    const topFacturaciones = [
        { label: 'Top Facturaciones por Región', href: '/aws/funciones/top-dolares-region', icon: Earth, color: 'text-purple-500' },
        { label: 'Top Facturaciones por SO', href: '/aws/funciones/top-dolares-so', icon: Database, color: 'text-purple-500' },
        { label: 'Top Facturaciones por Tipo de Instancia', href: '/aws/funciones/top-tipo-instancia', icon: Computer, color: 'text-teal-600' },
        { label: 'Top Facturaciones por Familia de Instancias', href: '/aws/funciones/top-familia-instancias', icon: Box, color: 'text-indigo-600' },
        { label: 'Top Facturaciones por Tipo de Compra', href: '/aws/funciones/top-tipo-compra', icon: HandCoins, color: 'text-amber-600' },
        { label: 'Top Facturaciones por Tipo de Cobro', href: '/aws/funciones/top-tipo-cobro', icon: Zap, color: 'text-red-500' },
        { label: 'Top Facturaciones por ID Recurso', href: '/aws/funciones/top-id-recurso', icon: Grid2X2, color: 'text-blue-500' },
    ]

    const funciones = [
        { label: 'Top Facturaciones', subItems: topFacturaciones, icon: Zap, color: 'text-purple-500' },
    ]

    const defaultOpenRecursos = recursos.some((r) => r.href === pathname)
    const [isRecursosOpen, setIsRecursosOpen] = useState(defaultOpenRecursos)

    const defaultOpenFunciones = funciones.some((f) => f.subItems?.some((sub) => sub.href === pathname))
    const [isFuncionesOpen, setIsFuncionesOpen] = useState(defaultOpenFunciones)

    const defaultOpenTopFacturaciones = topFacturaciones.some((t) => t.href === pathname)
    const [isTopFacturacionesOpen, setIsTopFacturacionesOpen] = useState(defaultOpenTopFacturaciones)

    useEffect(() => {
        if (state === "collapsed") {
            setIsRecursosOpen(false)
            setIsFuncionesOpen(false)
            setIsTopFacturacionesOpen(false)
        }
    }, [state])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex flex-col items-center gap-2">
                <Image width={100} height={100} alt="Logo Cloud Performance" src="/logo.png" className="object-cover" />
                {open && <span className="text-xl font-bold">Cloud Performance</span>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {routes.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-md cursor-pointer",
                                                isActive ? "bg-blue-500 text-white" : "hover:bg-accent/50",
                                            )}
                                            href={item.href}
                                        >
                                            <item.icon className={cn("h-5 w-5", item.color)} />
                                            <span className="text-sm">{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        {
                            open && (
                                <>
                                    <SidebarMenuItem>
                                        <Collapsible open={isFuncionesOpen} onOpenChange={setIsFuncionesOpen}>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton className="w-full justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="h-5 w-5 text-purple-500" />
                                                        <span className="text-sm">Funciones</span>
                                                    </div>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform duration-200 ease-in-out",
                                                            isFuncionesOpen ? "rotate-180" : "",
                                                        )}
                                                    />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-200">
                                                <Collapsible open={isTopFacturacionesOpen} onOpenChange={setIsTopFacturacionesOpen}>
                                                    <CollapsibleTrigger asChild>
                                                        <div className="flex items-center justify-between p-2 pl-6 rounded-md cursor-pointer hover:bg-accent/50 transition-colors duration-150">
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="h-5 w-5 text-purple-500" />
                                                                <span className="text-sm">Top Facturaciones</span>
                                                            </div>
                                                            <ChevronDown
                                                                className={cn(
                                                                    "h-4 w-4 transition-transform duration-200 ease-in-out",
                                                                    isTopFacturacionesOpen ? "rotate-180" : "",
                                                                )}
                                                            />
                                                        </div>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="space-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-200">
                                                        {topFacturaciones.map((sub) => {
                                                            const isSubActive = pathname === sub.href
                                                            return (
                                                                <a
                                                                    key={sub.label}
                                                                    href={sub.href}
                                                                    className={cn(
                                                                        "flex items-center gap-2 p-2 rounded-md cursor-pointer pl-10 transition-colors duration-150",
                                                                        isSubActive ? "bg-blue-500 text-white" : "hover:bg-accent/50",
                                                                    )}
                                                                >
                                                                    <sub.icon className={cn("h-4 w-4", sub.color)} />
                                                                    <span className="text-sm">{sub.label}</span>
                                                                </a>
                                                            )
                                                        })}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Collapsible open={isRecursosOpen} onOpenChange={setIsRecursosOpen}>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton className="w-full justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Box className="h-5 w-5 text-orange-500" />
                                                        <span className="text-sm">Recursos</span>
                                                    </div>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform duration-200 ease-in-out",
                                                            isRecursosOpen ? "rotate-180" : "",
                                                        )}
                                                    />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-200">
                                                {recursos.map((subItem) => {
                                                    const isActive = pathname === subItem.href
                                                    return (
                                                        <a
                                                            key={subItem.label}
                                                            href={subItem.href}
                                                            className={cn(
                                                                "flex items-center gap-2 p-2 rounded-md cursor-pointer pl-6 transition-colors duration-150",
                                                                isActive ? "bg-blue-500 text-white" : "hover:bg-accent/50",
                                                            )}
                                                        >
                                                            <subItem.icon className={cn("h-4 w-4", subItem.color)} />
                                                            <span className="text-sm">{subItem.label}</span>
                                                        </a>
                                                    )
                                                })}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </SidebarMenuItem>
                                </>
                            )
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
        // <Sidebar collapsible="icon" {...props}>
        //     <SidebarHeader className='flex flex-col items-center gap-2'>
        //         <Image width={100} height={100} alt='Logo Cloud Performance' src='/logo.png' className='object-cover' />
        //         {open && <span className='text-xl font-bold'>Cloud Performance</span>}
        //     </SidebarHeader>
        //     <SidebarContent>
        //         <SidebarGroup>
        //             <SidebarMenu>
        //                 {routes.map((item) => {
        //                     const isActive = pathname === item.href

        //                     if (item.label === 'Funciones') {
        //                         return (
        //                             <SidebarMenuItem key={item.label}>
        //                                 <Collapsible open={isFuncionesOpen} onOpenChange={setIsFuncionesOpen}>
        //                                     <SidebarGroup className="gap-2">
        //                                         <SidebarGroupLabel asChild>
        //                                             <CollapsibleTrigger className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50">
        //                                                 <div className="flex items-center gap-2">
        //                                                     <item.icon className={cn('h-5 w-5', item.color)} />
        //                                                     <span className="text-sm">{item.label}</span>
        //                                                 </div>
        //                                                 <ChevronDown
        //                                                     className={cn(
        //                                                         'transition-transform',
        //                                                         isFuncionesOpen ? 'rotate-180' : ''
        //                                                     )}
        //                                                 />
        //                                             </CollapsibleTrigger>
        //                                         </SidebarGroupLabel>

        //                                         {funciones.map((funcion) => (
        //                                             <CollapsibleContent key={funcion.label} asChild>
        //                                                 <div className="flex flex-col">
        //                                                     <div className="flex items-center gap-2 p-2 pl-6 font-medium">
        //                                                         <funcion.icon className={cn('h-5 w-5', funcion.color)} />
        //                                                         <span className="text-sm">{funcion.label}</span>
        //                                                     </div>
        //                                                     {funcion.subItems?.map((sub) => {
        //                                                         const isSubActive = pathname === sub.href
        //                                                         return (
        //                                                             <a
        //                                                                 key={sub.label}
        //                                                                 href={sub.href}
        //                                                                 className={cn(
        //                                                                     'flex items-center gap-2 p-2 rounded-md cursor-pointer pl-10',
        //                                                                     isSubActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
        //                                                                 )}
        //                                                             >
        //                                                                 <sub.icon className={cn('h-5 w-5', sub.color)} />
        //                                                                 <span className="text-sm">{sub.label}</span>
        //                                                             </a>
        //                                                         )
        //                                                     })}
        //                                                 </div>
        //                                             </CollapsibleContent>
        //                                         ))}
        //                                     </SidebarGroup>
        //                                 </Collapsible>
        //                             </SidebarMenuItem>
        //                         )
        //                     }

        //                     return (
        //                         <SidebarMenuItem key={item.label}>
        //                             <SidebarMenuButton asChild>
        //                                 <a
        //                                     className={cn(
        //                                         'flex items-center gap-2 p-2 rounded-md cursor-pointer',
        //                                         isActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
        //                                     )}
        //                                     href={item.href}
        //                                 >
        //                                     <item.icon className={cn('h-5 w-5', item.color)} />
        //                                     <span className="text-sm">{item.label}</span>
        //                                 </a>
        //                             </SidebarMenuButton>
        //                         </SidebarMenuItem>
        //                     )
        //                 })}
        //                 {/* Funciones */}
        //                 <SidebarMenuItem>
        //                     <Collapsible open={isFuncionesOpen} onOpenChange={setIsFuncionesOpen}>
        //                         <SidebarGroup className="gap-2">
        //                             <SidebarGroupLabel asChild>
        //                                 <CollapsibleTrigger className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50">
        //                                     <span className="font-semibold">Funciones</span>
        //                                     <ChevronDown
        //                                         className={cn(
        //                                             'transition-transform',
        //                                             isFuncionesOpen ? 'rotate-180' : ''
        //                                         )}
        //                                     />
        //                                 </CollapsibleTrigger>
        //                             </SidebarGroupLabel>

        //                             {funciones.map((funcion) => (
        //                                 <CollapsibleContent key={funcion.label} asChild>
        //                                     <div className="flex flex-col">
        //                                         <div className="flex items-center gap-2 p-2 pl-6 font-medium">
        //                                             <funcion.icon className={cn('h-5 w-5', funcion.color)} />
        //                                             <span className="text-sm">{funcion.label}</span>
        //                                         </div>
        //                                         {funcion.subItems?.map((sub) => {
        //                                             const isSubActive = pathname === sub.href
        //                                             return (
        //                                                 <a
        //                                                     key={sub.label}
        //                                                     href={sub.href}
        //                                                     className={cn(
        //                                                         'flex items-center gap-2 p-2 rounded-md cursor-pointer pl-10',
        //                                                         isSubActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
        //                                                     )}
        //                                                 >
        //                                                     <sub.icon className={cn('h-5 w-5', sub.color)} />
        //                                                     <span className="text-sm">{sub.label}</span>
        //                                                 </a>
        //                                             )
        //                                         })}
        //                                     </div>
        //                                 </CollapsibleContent>
        //                             ))}
        //                         </SidebarGroup>
        //                     </Collapsible>
        //                 </SidebarMenuItem>
        //                 {/* Recursos */}
        //                 <SidebarMenuItem>
        //                     <Collapsible open={isRecursosOpen} onOpenChange={setIsRecursosOpen}>
        //                         <SidebarGroup className="gap-2">
        //                             <SidebarGroupLabel asChild>
        //                                 <CollapsibleTrigger className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50">
        //                                     <span className="font-semibold">Recursos</span>
        //                                     <ChevronDown
        //                                         className={cn(
        //                                             'transition-transform',
        //                                             isRecursosOpen ? 'rotate-180' : ''
        //                                         )}
        //                                     />
        //                                 </CollapsibleTrigger>
        //                             </SidebarGroupLabel>

        //                             {recursos.map((subItem) => {
        //                                 const isActive = pathname === subItem.href
        //                                 return (
        //                                     <CollapsibleContent key={subItem.label} asChild>
        //                                         <a
        //                                             href={subItem.href}
        //                                             className={cn(
        //                                                 'flex items-center gap-2 p-2 rounded-md cursor-pointer pl-4',
        //                                                 isActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
        //                                             )}
        //                                         >
        //                                             <subItem.icon className={cn('h-5 w-5', subItem.color)} />
        //                                             <span className="text-sm">{subItem.label}</span>
        //                                         </a>
        //                                     </CollapsibleContent>
        //                                 )
        //                             })}
        //                         </SidebarGroup>
        //                     </Collapsible>
        //                 </SidebarMenuItem>
        //             </SidebarMenu>
        //         </SidebarGroup>
        //     </SidebarContent>
        // </Sidebar>
    )
}
