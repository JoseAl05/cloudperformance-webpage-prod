'use client'

import { useMemo } from 'react'
import {
    Bell,
    Bot,
    Cable,
    Cloud,
    House,
    Mail,
    Shield,
    ShieldCheck,
    SplitSquareHorizontal,
    Users,
} from 'lucide-react'
import { SidebarNav, type NavItem } from '@/components/SidebarNav'
import type { Sidebar } from '@/components/ui/sidebar'
import { useSession } from '@/hooks/useSession'

const BASE_ITEMS: NavItem[] = [
    { label: 'Inicio', icon: House, href: '/perfil' },
    { label: 'Modificar Contraseña', icon: Shield, href: '#' },
    { label: 'Modificar Correo', icon: Mail, href: '#' },
    { label: 'Conectores', icon: Cable, href: '/perfil/conectores', prefix: true },
    { label: 'Nubes', icon: Cloud, href: '/perfil/nubes', prefix: true },
    { label: 'Servicios IA', icon: Bot, href: '/perfil/servicios-ia', prefix: true },
]

const MULTITENANT_ITEM: NavItem = {
    label: 'Comparación Nubes',
    icon: SplitSquareHorizontal,
    href: '/comparacion-nubes',
    prefix: true,
}

const PROFILING_ITEM: NavItem = {
    label: 'Perfilamiento',
    icon: Users,
    href: '/perfilamiento',
    prefix: true,
}

const ONPREM_LICENSES_ITEM: NavItem = {
    label: 'Licencias OnPremises',
    icon: ShieldCheck,
    href: '/op-licencias',
    prefix: true,
}

const ALERTS_ITEM: NavItem = {
    label: 'Alertas',
    icon: Bell,
    href: '/alertas',
    prefix: true,
}

export const SidebarProfileComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const { user } = useSession()

    const canAccessProfiling = user?.role === 'admin_global' || user?.role === 'admin_empresa'
    const canAccessOPLicencias = user?.role === 'admin_global'
    const hasMultitenant = Boolean(user?.is_aws_multi_tenant || user?.is_azure_multi_tenant)

    const items = useMemo<NavItem[]>(
        () => [
            ...BASE_ITEMS,
            ...(hasMultitenant ? [MULTITENANT_ITEM] : []),
            ...(canAccessProfiling ? [PROFILING_ITEM] : []),
            ...(canAccessOPLicencias ? [ONPREM_LICENSES_ITEM] : []),
            ALERTS_ITEM,
        ],
        [hasMultitenant, canAccessProfiling, canAccessOPLicencias]
    )

    return <SidebarNav items={items} {...props} />
}