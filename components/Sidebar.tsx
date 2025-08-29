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
import { Grid2X2, Home, LineChart, PieChart, Zap, Box, Computer, Database, Pyramid, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname()
    const { state, open } = useSidebar()

    const routes = [
        { label: 'Inicio', icon: Grid2X2, href: '/aws/facturacion/tendencia-facturacion', color: 'text-sky-500' },
        { label: 'Funciones', icon: Home, href: '/aws/ahorro', color: 'text-teal-500' },
        { label: 'Consumo', icon: LineChart, href: '/aws/consumos', color: 'text-green-600' },
        { label: 'Quotas', icon: PieChart, href: '/aws/quotas', color: 'text-violet-500' },
        { label: 'Deployments', icon: Zap, href: '/aws/deployments', color: 'text-pink-500' },
        { label: 'Vista Asesor', icon: Pyramid, href: '/aws/advisor', color: 'text-[#3258de]' },
    ]

    const recursos = [
        { label: 'Instancias EC2', icon: Computer, href: '/aws/recursos/instancias-ec2', color: 'text-orange-500' },
        { label: 'Autoscaling Groups', icon: Computer, href: '/aws/recursos/autoscaling-groups', color: 'text-orange-500' },
        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/recursos/instancias-rds-pg', color: 'text-orange-600' },
        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/recursos/instancias-rds-mysql', color: 'text-orange-600' },
        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/recursos/instancias-rds-sqlserver', color: 'text-orange-600' },
        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/recursos/instancias-rds-oracle', color: 'text-orange-600' },
    ]

    // Detectar si la ruta actual está en Recursos para abrir el collapsible automáticamente
    const defaultOpen = recursos.some(r => r.href === pathname)
    const [isRecursosOpen, setIsRecursosOpen] = useState(defaultOpen)
    useEffect(() => { if (state === 'collapsed') { setIsRecursosOpen(false) } }, [state])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className='flex flex-col items-center gap-2'>
                <Image width={100} height={100} alt='Logo Cloud Performance' src='/logo.png' className='object-cover' /> {open && <span className='text-xl font-bold'>Cloud Performance</span>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {routes.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a className={cn(
                                            'flex items-center gap-2 p-2 rounded-md cursor-pointer',
                                            isActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
                                        )} href={item.href}>
                                            <item.icon className={cn('h-5 w-5', item.color)} />
                                            <span className='text-sm'>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        <SidebarMenuItem>
                            <Collapsible open={isRecursosOpen} onOpenChange={setIsRecursosOpen}>
                                <SidebarGroup className='gap-2'>
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger className='flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50'>
                                            <span className='font-semibold'>Recursos</span>
                                            <ChevronDown className={cn(
                                                'transition-transform',
                                                isRecursosOpen ? 'rotate-180' : ''
                                            )} />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>

                                    {recursos.map(subItem => {
                                        const isActive = pathname === subItem.href
                                        return (
                                            <CollapsibleContent key={subItem.label} asChild>
                                                <a href={subItem.href} className={cn(
                                                    'flex items-center gap-2 p-2 rounded-md cursor-pointer pl-4',
                                                    isActive ? 'bg-blue-500 text-white' : 'hover:bg-accent/50'
                                                )}>
                                                    <subItem.icon className={cn('h-5 w-5', subItem.color)} />
                                                    <span className='text-sm'>{subItem.label}</span>
                                                </a>
                                            </CollapsibleContent>
                                        )
                                    })}
                                </SidebarGroup>
                            </Collapsible>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
