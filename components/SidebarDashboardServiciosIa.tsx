'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { DollarSign, LayoutDashboard } from 'lucide-react'
import { SidebarNav, resolveNav, type NavItem } from '@/components/SidebarNav'
import type { Sidebar } from '@/components/ui/sidebar'

type Service = 'amazon-bedrock'

const NAV: Record<Service, NavItem[]> = {
    'amazon-bedrock': [
        { label: 'Inicio', icon: LayoutDashboard, href: '/amazon-bedrock' },
        { label: 'Costo y Optimización', icon: DollarSign, href: '/amazon-bedrock/costo-optimizacion' },
    ],
}

export const SidebarDashboardServiciosIaComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname() ?? ''
    const items = useMemo(() => resolveNav(NAV, pathname), [pathname])

    return <SidebarNav items={items} {...props} />
}