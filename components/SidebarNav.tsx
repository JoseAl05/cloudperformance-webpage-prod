'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight, Search, X } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export type NavItem = {
    label: string
    icon: LucideIcon
    href?: string
    color?: string
    prefix?: boolean
    items?: NavItem[]
}

const FILTER_MIN_ITEMS = 12

export const isItemActive = (item: NavItem, pathname: string) => {
    if (!item.href) return false
    if (item.prefix) return pathname === item.href || pathname.startsWith(`${item.href}/`)
    return pathname === item.href
}

export const containsActive = (items: NavItem[], pathname: string): boolean =>
    items.some((item) =>
        isItemActive(item, pathname) || (item.items ? containsActive(item.items, pathname) : false)
    )

export const resolveNav = <K extends string>(map: Record<K, NavItem[]>, pathname: string): NavItem[] => {
    const key = (Object.keys(map) as K[]).find(
        (candidate) => pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)
    )
    return key ? map[key] : []
}

const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const filterNav = (items: NavItem[], query: string): NavItem[] => {
    if (!query.trim()) return items
    const term = normalize(query.trim())
    const walk = (list: NavItem[]): NavItem[] =>
        list.reduce<NavItem[]>((acc, item) => {
            if (normalize(item.label).includes(term)) {
                acc.push(item)
                return acc
            }
            const children = item.items ? walk(item.items) : []
            if (children.length) acc.push({ ...item, items: children })
            return acc
        }, [])
    return walk(items)
}

const countLeaves = (items: NavItem[]): number =>
    items.reduce((total, item) => total + (item.items ? countLeaves(item.items) : 1), 0)

const rowBase =
    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] leading-tight transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
const rowIdle =
    'text-gray-700 hover:bg-blue-50 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-blue-950/60 dark:hover:text-blue-100'
const rowActive = 'bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-700'
const rowTrail = 'text-blue-700 dark:text-blue-300'

type NavTreeProps = {
    items: NavItem[]
    pathname: string
    openMap: Record<string, boolean>
    onToggle: (id: string, open: boolean) => void
    forceOpen: boolean
    parentId?: string
    depth?: number
}

export const NavTree = ({
    items,
    pathname,
    openMap,
    onToggle,
    forceOpen,
    parentId = '',
    depth = 0,
}: NavTreeProps) => (
    <div className={cn('space-y-0.5', depth === 0 && 'space-y-1')}>
        {items.map((item) => {
            const id = `${parentId}/${item.label}`
            const children = item.items ?? []

            if (children.length === 0) {
                const isActive = isItemActive(item, pathname)
                return (
                    <Link
                        key={id}
                        href={item.href ?? '#'}
                        title={item.label}
                        className={cn(rowBase, isActive ? rowActive : rowIdle)}
                    >
                        <item.icon
                            className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : item.color ?? 'text-blue-500')}
                        />
                        <span className="truncate">{item.label}</span>
                    </Link>
                )
            }

            const hasActive = containsActive(children, pathname)
            const isOpen = forceOpen || (openMap[id] ?? hasActive)

            return (
                <Collapsible key={id} open={isOpen} onOpenChange={(next) => onToggle(id, next)}>
                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            title={item.label}
                            className={cn(rowBase, rowIdle, hasActive && rowTrail, depth === 0 && 'font-medium')}
                        >
                            <item.icon
                                className={cn('h-4 w-4 shrink-0', hasActive ? 'text-blue-500' : item.color ?? 'text-blue-500')}
                            />
                            <span className="flex-1 truncate">{item.label}</span>
                            {hasActive && !isOpen && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
                            <ChevronRight
                                className={cn(
                                    'h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200',
                                    isOpen && 'rotate-90'
                                )}
                            />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <div className="ml-4 mt-0.5 border-l border-blue-100 pl-1.5 dark:border-blue-900/60">
                            <NavTree
                                items={children}
                                pathname={pathname}
                                openMap={openMap}
                                onToggle={onToggle}
                                forceOpen={forceOpen}
                                parentId={id}
                                depth={depth + 1}
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        })}
    </div>
)

type SidebarNavProps = React.ComponentProps<typeof Sidebar> & {
    items: NavItem[]
}

export const SidebarNav = ({ items, ...props }: SidebarNavProps) => {
    const pathname = usePathname()
    const { state, isMobile, setOpen } = useSidebar()
    const isIconMode = state === 'collapsed' && !isMobile
    const [query, setQuery] = useState('')
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

    const showFilter = useMemo(() => countLeaves(items) > FILTER_MIN_ITEMS, [items])
    const visibleItems = useMemo(() => filterNav(items, query), [items, query])

    const handleToggle = (id: string, next: boolean) =>
        setOpenMap((prev) => ({ ...prev, [id]: next }))

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex flex-col items-center gap-2 py-3">
                <Image
                    width={isIconMode ? 28 : 72}
                    height={isIconMode ? 28 : 72}
                    alt="Logo Intac"
                    src="/logo-intac.svg"
                    className="object-contain"
                />
                {!isIconMode && (
                    <span className="text-base font-bold tracking-wide">Cloud Performance</span>
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="gap-2">
                    {!isIconMode && showFilter && (
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
                                placeholder="Buscar en el menú"
                                className="h-8 w-full rounded-md border border-gray-200 bg-transparent pl-7 pr-7 text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-800"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Limpiar búsqueda"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}

                    {isIconMode ? (
                        <SidebarMenu>
                            {items.map((item) => {
                                const children = item.items ?? []
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        {children.length > 0 ? (
                                            <SidebarMenuButton
                                                onClick={() => setOpen(true)}
                                                title={item.label}
                                                className={cn(containsActive(children, pathname) && rowTrail)}
                                            >
                                                <item.icon className="h-4 w-4 text-blue-500" />
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href ?? '#'} title={item.label}>
                                                    <item.icon
                                                        className={cn(
                                                            'h-4 w-4',
                                                            isItemActive(item, pathname) ? 'text-blue-600' : 'text-blue-500'
                                                        )}
                                                    />
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    ) : (
                        <>
                            <NavTree
                                items={visibleItems}
                                pathname={pathname}
                                openMap={openMap}
                                onToggle={handleToggle}
                                forceOpen={query.trim().length > 0}
                            />
                            {query.trim().length > 0 && visibleItems.length === 0 && (
                                <p className="px-2 py-3 text-[13px] text-gray-500">
                                    Sin resultados para “{query}”.
                                </p>
                            )}
                        </>
                    )}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}