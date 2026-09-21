'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowDownUp, DollarSign, LayoutDashboard, TrendingUp } from 'lucide-react'
import { SidebarNav, resolveNav, type NavItem } from '@/components/SidebarNav'
import type { Sidebar } from '@/components/ui/sidebar'

type Service = 'amazon-bedrock' | 'microsoft-foundry' | 'google-vertex'

const NAV: Record<Service, NavItem[]> = {
    'amazon-bedrock': [
        { label: 'Inicio', icon: LayoutDashboard, href: '/amazon-bedrock' },
        { label: 'Costo y Optimización', icon: DollarSign, href: '/amazon-bedrock/costo-optimizacion' },
    ],
    'microsoft-foundry': [
        { label: 'Inicio', icon: LayoutDashboard, href: '/microsoft-foundry' },
        { label: 'Costo y Optimización', icon: DollarSign, href: '/microsoft-foundry/costo-optimizacion' },
        { label: 'Comparación', icon: ArrowDownUp, href: '/microsoft-foundry/comparacion' },
        { label: 'Prompt Optimization', icon: TrendingUp, href: '/microsoft-foundry/prompt-opt' },
    ],
    'google-vertex': [
        { label: 'Inicio', icon: LayoutDashboard, href: '/google-vertex' },
        { label: 'Costo y Optimización', icon: DollarSign, href: '/google-vertex/costo-optimizacion' },
        { label: 'Comparación', icon: ArrowDownUp, href: '/google-vertex/comparacion' },
    ]
}

export const SidebarDashboardServiciosIaComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname() ?? ''
    const items = useMemo(() => resolveNav(NAV, pathname), [pathname])

    return <SidebarNav items={items} {...props} />
}