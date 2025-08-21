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
import Image from 'next/image'

export const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const routes = [
        {
            label: 'Inicio',
            icon: Grid2X2,
            href: '/aws/main-view',
            tooltip: 'Vista Principal',
            color: 'text-sky-500',
        },
        {
            label: 'Funciones',
            icon: Home,
            href: '/aws/ahorro',
            tooltip: 'Funciones',
            color: 'text-teal-500',
        },
        {
            label: 'Consumo',
            icon: LineChart,
            href: '/aws/consumos',
            tooltip: 'Vista Consumos',
            color: 'text-green-600',
        },
        {
            label: 'Quotas',
            icon: PieChart,
            href: '/aws/quotas',
            tooltip: 'Vista Quotas',
            color: 'text-violet-500',
        },
        {
            label: 'Deployments',
            icon: Zap,
            href: '/aws/deployments',
            tooltip: 'Vista Deployments',
            color: 'text-pink-500',
        },
        {
            label: 'Vista Asesor',
            icon: Pyramid,
            href: '/aws/advisor',
            tooltip: 'Vista Asesor',
            color: 'text-[#3258de]',
        },
        {
            label: 'Recursos',
            icon: Box,
            isDropdown: true,
            tooltip: 'Vista Recursos',
            color: 'text-orange-600',
            subItems: [
                {
                    label: 'Instancias EC2',
                    icon: Computer,
                    href: '/aws/recursos/instancias-ec2',
                    color: 'text-orange-500',
                },
                {
                    label: 'Autoscaling Groups',
                    icon: Computer,
                    href: '/aws/recursos/autoscaling-groups',
                    color: 'text-orange-500',
                },
                {
                    label: 'Instancias RDS Postgresql',
                    icon: Database,
                    href: '/aws/recursos/instancias-rds-pg',
                    color: 'text-orange-600',
                },
                {
                    label: 'Instancias RDS Mysql',
                    icon: Database,
                    href: '/aws/recursos/instancias-rds-mysql',
                    color: 'text-orange-600',
                },
                {
                    label: 'Instancias RDS SQL Server',
                    icon: Database,
                    href: '/aws/recursos/instancias-rds-sqlserver',
                    color: 'text-orange-600',
                },
                {
                    label: 'Instancias RDS Oracle',
                    icon: Database,
                    href: '/aws/recursos/instancias-rds-oracle',
                    color: 'text-orange-600',
                },
            ],
        },
    ]

    const [isItemCollapseOpen, setIsItemCollapseOpen] = useState(false)
    const { state, open } = useSidebar()

    useEffect(() => {
        if (state === 'collapsed') {
        setIsItemCollapseOpen(false)
        }
    }, [state])
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className='flex flex-col items-center gap-2'>
                    <Image
                        width={100}
                        height={100}
                        alt='Logo Cloud Performance'
                        src='/logo.png'
                        className='object-cover'
                    />
                    {open && <span className='text-xl font-bold'>Cloud Performance</span>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {routes.map((item) =>
                            item.isDropdown ? (
                                <SidebarMenuItem key={item.label}>
                                    <Collapsible
                                        defaultOpen={false}
                                        className='group/collapsible'
                                        open={isItemCollapseOpen}
                                        onOpenChange={setIsItemCollapseOpen}
                                    >
                                        <SidebarGroup className='gap-4'>
                                            <SidebarGroupLabel asChild>
                                                <CollapsibleTrigger className=''>
                                                    {item.label}
                                                    <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                                                </CollapsibleTrigger>
                                            </SidebarGroupLabel>

                                            {item.subItems.map((subItem) => (
                                                <CollapsibleContent key={subItem.label} asChild>
                                                    <a href={subItem.href} className='flex items-center gap-2 cursor-pointer'>
                                                        <subItem.icon className={cn('h-5 w-5', subItem.color)} />
                                                        <span className='text-sm'>
                                                            {subItem.label}
                                                        </span>
                                                    </a>
                                                </CollapsibleContent>
                                            ))}
                                        </SidebarGroup>
                                    </Collapsible>
                                </SidebarMenuItem>
                            ) : (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href} className='flex items-center'>
                                            <item.icon className='mr-2' />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
