'use client'

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
} from '@tanstack/react-table'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChevronDown, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface DataTableGroupingProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    filterColumn?: string
    filterPlaceholder?: string
    enableGrouping?: boolean
    groupByColumn?: string
    pageSizeGroups?: number
    pageSizeItems?: number
}

type AnyRow = Record<string, unknown>

export function DataTableGrouping<TData, TValue>({
    columns,
    data = [],
    filterColumn,
    filterPlaceholder = 'Buscar...',
    enableGrouping = false,
    groupByColumn,
    pageSizeGroups = 10,
    pageSizeItems = 10,
}: DataTableGroupingProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

    // Sorting global (usado visualmente en headers y para no-agrupado).
    // En agrupado lo separamos para NO reordenar grupos.
    const [sorting, setSorting] = useState<SortingState>([])

    // Paginación de grupos (tabla general)
    const [currentPage, setCurrentPage] = useState(0)
    const [groupPageSize, setGroupPageSize] = useState<number>(pageSizeGroups)

    // Paginación por grupo (ítems dentro del grupo)
    const [groupPages, setGroupPages] = useState<Map<string, number>>(new Map())
    const [itemsPageSize, setItemsPageSize] = useState<number>(pageSizeItems)

    const safeData = Array.isArray(data) ? data : []

    useEffect(() => {
        setCurrentPage(0)
        setGroupPages(new Map())
    }, [sorting])

    const toggleGroup = useCallback((groupValue: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev)
            if (next.has(groupValue)) {
                next.delete(groupValue)
                setGroupPages(prevPages => {
                    const clone = new Map(prevPages)
                    clone.set(groupValue, 0)
                    return clone
                })
            } else {
                next.add(groupValue)
            }
            return next
        })
    }, [])

    const setGroupPage = useCallback((groupValue: string, page: number | ((prev: number) => number)) => {
        setGroupPages(prev => {
            const clone = new Map(prev)
            const current = clone.get(groupValue) ?? 0
            const nextVal = typeof page === 'function' ? page(current) : page
            clone.set(groupValue, nextVal)
            return clone
        })
    }, [])

    // Comparador robusto
    const cmp = (a: unknown, b: unknown): number => {
        if (a == null && b == null) return 0
        if (a == null) return -1
        if (b == null) return 1
        if (typeof a === 'number' && typeof b === 'number') return a - b
        if (typeof a === 'boolean' && typeof b === 'boolean') return (a === b) ? 0 : a ? 1 : -1
        const ad = typeof a === 'string' ? Date.parse(a) : NaN
        const bd = typeof b === 'string' ? Date.parse(b) : NaN
        if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd
        if (typeof a === 'string' && typeof b === 'string') {
            const na = Number(a), nb = Number(b)
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        }
        return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
    }

    const sortArray = <R extends AnyRow>(arr: R[], sortState: SortingState): R[] => {
        if (!sortState?.length) return arr
        const rules = [...sortState]
        return [...arr].sort((ra, rb) => {
            for (const rule of rules) {
                const va = (ra as AnyRow)[rule.id as string]
                const vb = (rb as AnyRow)[rule.id as string]
                const res = cmp(va, vb)
                if (res !== 0) return rule.desc ? -res : res
            }
            return 0
        })
    }

    const {
        processedData,
        totalGroups,
        perGroupMeta,
    } = useMemo(() => {
        // SIN AGRUPACIÓN: ordenar toda la fuente normalmente y paginar
        if (!enableGrouping || !groupByColumn || safeData.length === 0) {
            const sortedAll = sortArray(safeData as AnyRow[], sorting)
            const startIndex = currentPage * groupPageSize
            const endIndex = Math.min(startIndex + groupPageSize, sortedAll.length)
            const pageItems = sortedAll.slice(startIndex, endIndex).map((item, index) => ({
                ...item,
                __rowId: `item-${startIndex + index}`,
                __isGroupRow: false,
            }))
            return {
                processedData: pageItems,
                totalGroups: 0,
                perGroupMeta: {} as Record<string, { totalItems: number; totalPages: number; currentPage: number }>,
            }
        }

        // ⚠️ CON AGRUPACIÓN:
        // 1) Construimos los grupos desde los DATOS ORIGINALES (sin ordenar globalmente),
        //    de modo que el orden de la tabla general (los grupos) permanezca estable.
        const groups = safeData.reduce((acc, item: AnyRow) => {
            const groupValue = item[groupByColumn as string]
            const key = String(groupValue ?? '—')
            if (!acc[key]) acc[key] = []
            acc[key].push(item)
            return acc
        }, {} as Record<string, AnyRow[]>)

        let groupEntries = Object.entries(groups) // [groupValue, items[]]
        const groupSorting = sorting.find(s => s.id === groupByColumn)
        if (groupSorting) {
            groupEntries = [...groupEntries].sort((a, b) => {
                const res = cmp(a[0], b[0]) // a[0] y b[0] son los valores del grupo
                return groupSorting.desc ? -res : res
            })
        } // [groupValue, items[]]
        // 🔒 Ya NO reordenamos groupEntries por el "sorting" para mantener fijo el orden de la tabla general.

        // 2) Paginación de GRUPOS (tabla general)
        const startGroupIndex = currentPage * groupPageSize
        const endGroupIndex = Math.min(startGroupIndex + groupPageSize, groupEntries.length)
        const pageGroups = groupEntries.slice(startGroupIndex, endGroupIndex)

        // 3) Sorting SOLO de ítems dentro de cada grupo.
        //    Quitamos la columna de agrupación del sorting para que no afecte al orden global de grupos.
        const itemSorting = sorting.filter(s => s.id !== groupByColumn)

        const result: AnyRow[] = []
        const meta: Record<string, { totalItems: number; totalPages: number; currentPage: number }> = {}

        pageGroups.forEach(([groupValue, rawItems]) => {
            const items = itemSorting.length ? sortArray(rawItems, itemSorting) : rawItems

            // Cabecera del grupo
            result.push({
                __rowId: `group-${groupValue}`,
                __isGroupRow: true,
                __groupValue: groupValue,
                __itemCount: items.length,
                __items: items,
                [groupByColumn as string]: groupValue,
            })

            if (expandedGroups.has(groupValue)) {
                const totalItems = items.length
                const totalPages = Math.max(1, Math.ceil(totalItems / itemsPageSize))
                const currentChildPage = Math.min(groupPages.get(groupValue) ?? 0, totalPages - 1)
                const start = currentChildPage * itemsPageSize
                const end = Math.min(start + itemsPageSize, totalItems)
                const slice = items.slice(start, end)

                meta[groupValue] = {
                    totalItems,
                    totalPages,
                    currentPage: currentChildPage,
                }

                slice.forEach((item, index) => {
                    result.push({
                        ...(item as AnyRow),
                        __rowId: `item-${groupValue}-${start + index}`,
                        __isGroupRow: false,
                        __parentGroup: groupValue,
                        __isChildRow: true,
                    })
                })
            } else {
                const totalItems = items.length
                meta[groupValue] = {
                    totalItems,
                    totalPages: Math.max(1, Math.ceil(totalItems / itemsPageSize)),
                    currentPage: groupPages.get(groupValue) ?? 0,
                }
            }
        })

        return {
            processedData: result,
            totalGroups: groupEntries.length,
            perGroupMeta: meta,
        }
    }, [
        safeData,
        sorting,
        enableGrouping,
        groupByColumn,
        expandedGroups,
        currentPage,
        groupPageSize,
        itemsPageSize,
        groupPages,
    ])

    const table = useReactTable({
        data: processedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: { columnFilters, sorting },
        getRowId: (row: AnyRow) => row.__rowId as string,
        manualPagination: true,
    })

    const totalPagesGroups = enableGrouping
        ? Math.max(1, Math.ceil(totalGroups / groupPageSize))
        : Math.max(1, Math.ceil((Array.isArray(data) ? data.length : 0) / groupPageSize))

    const canPreviousPage = currentPage > 0
    const canNextPage = currentPage < totalPagesGroups - 1

    const previousPage = () => {
        if (canPreviousPage) setCurrentPage(p => p - 1)
    }
    const nextPage = () => {
        if (canNextPage) setCurrentPage(p => p + 1)
    }

    const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
    const prevGroupPage = (groupValue: string) => {
        const meta = perGroupMeta[groupValue]
        if (!meta) return
        if (meta.currentPage > 0) {
            setGroupPage(groupValue, p => clamp(p - 1, 0, meta.totalPages - 1))
        }
    }
    const nextGroupPage = (groupValue: string) => {
        const meta = perGroupMeta[groupValue]
        if (!meta) return
        if (meta.currentPage < meta.totalPages - 1) {
            setGroupPage(groupValue, p => clamp(p + 1, 0, meta.totalPages - 1))
        }
    }
    const goToGroupPage = (groupValue: string, pageIndex: number) => {
        const meta = perGroupMeta[groupValue]
        if (!meta) return
        setGroupPage(groupValue, clamp(pageIndex, 0, meta.totalPages - 1))
    }

    const renderPageButtons = (groupValue: string, current: number, total: number) => {
        if (total <= 1) return null
        const windowSize = 5
        const half = Math.floor(windowSize / 2)
        let start = clamp(current - half, 0, total - 1)
        const end = clamp(start + windowSize - 1, 0, total - 1)
        if (end - start + 1 < windowSize) {
            start = clamp(end - windowSize + 1, 0, total - 1)
        }
        const buttons: JSX.Element[] = []
        if (start > 0) {
            buttons.push(
                <a key="first" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => goToGroupPage(groupValue, 0)}>
                    1
                </a>
            )
            if (start > 1) {
                buttons.push(<span key="pre-ellipsis" className="px-1 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></span>)
            }
        }
        for (let i = start; i <= end; i++) {
            const isActive = i === current
            buttons.push(
                <Button
                    key={`p-${i}`}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => goToGroupPage(groupValue, i)}
                >
                    {i + 1}
                </Button>
            )
        }
        if (end < total - 1) {
            if (end < total - 2) {
                buttons.push(<span key="post-ellipsis" className="px-1 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></span>)
            }
            buttons.push(
                <Button
                    key="last"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => goToGroupPage(groupValue, total - 1)}
                >
                    {total}
                </Button>
            )
        }
        return buttons
    }

    const renderSortableHeader = (header: unknown) => {
        const canSort = header.column.getCanSort?.() ?? true
        const sorted = header.column.getIsSorted?.() as false | 'asc' | 'desc'
        const label = flexRender(header.column.columnDef.header, header.getContext())
        if (!canSort) return label
        return (
            <Button
                variant="ghost"
                className="h-8 -ml-2 px-2 flex items-center gap-1"
                onClick={header.column.getToggleSortingHandler()}
                aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
                aria-label="Ordenar columna"
            >
                <span className="truncate">{label}</span>
                <ArrowUpDown className={`h-4 w-4 transition-opacity ${sorted ? 'opacity-100' : 'opacity-50'}`} />
                {sorted && <span className="sr-only">{sorted === 'asc' ? 'Ascendente' : 'Descendente'}</span>}
            </Button>
        )
    }

    return (
        <div>
            {filterColumn && (
                <div className="flex flex-wrap items-center gap-2 py-4">
                    <Input
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
            )}

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : renderSortableHeader(header)}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const rowData = row.original as AnyRow

                                if (rowData.__isGroupRow) {
                                    const groupValue: string = rowData.__groupValue as string
                                    const isExpanded = expandedGroups.has(groupValue)
                                    const gMeta = perGroupMeta[groupValue]

                                    return (
                                        <TableRow key={row.id} className="bg-muted/50 hover:bg-muted/70">
                                            <TableCell colSpan={columns.length} className="font-semibold">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleGroup(groupValue)}
                                                        className="h-6 w-6 p-0"
                                                        aria-label={isExpanded ? 'Colapsar grupo' : 'Expandir grupo'}
                                                    >
                                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </Button>

                                                    <span className="truncate max-w-[30ch]">{groupValue}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({rowData.__itemCount as number} registros)
                                                    </span>

                                                    {isExpanded && gMeta && (
                                                        <div className="flex flex-wrap items-center gap-2 pl-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs"
                                                                onClick={() => prevGroupPage(groupValue)}
                                                                disabled={gMeta.currentPage <= 0}
                                                            >
                                                                Anterior
                                                            </Button>

                                                            <div className="flex items-center gap-1">
                                                                {renderPageButtons(groupValue, gMeta.currentPage, gMeta.totalPages)}
                                                            </div>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs"
                                                                onClick={() => nextGroupPage(groupValue)}
                                                                disabled={gMeta.currentPage >= gMeta.totalPages - 1}
                                                            >
                                                                Siguiente
                                                            </Button>

                                                            <div className="flex items-center gap-2 pl-2">
                                                                <span className="text-xs text-muted-foreground">Items/grupo:</span>
                                                                <Select
                                                                    value={String(itemsPageSize)}
                                                                    onValueChange={(val) => {
                                                                        const next = Number(val)
                                                                        setItemsPageSize(next)
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="h-7 w-[110px]">
                                                                        <SelectValue placeholder={itemsPageSize} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[5, 10, 20, 50, 100].map(n => (
                                                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                Mostrando{' '}
                                                                {Math.min(gMeta.currentPage * itemsPageSize + 1, gMeta.totalItems)}-
                                                                {Math.min((gMeta.currentPage + 1) * itemsPageSize, gMeta.totalItems)} de {gMeta.totalItems}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="ml-auto" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                const isChild = enableGrouping && rowData.__isChildRow
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className={isChild ? 'bg-background border-l-4 border-l-blue-200' : ''}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={isChild ? 'pl-8' : ''}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin Resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={previousPage} disabled={currentPage <= 0}>
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {enableGrouping ? (
                            <>Página {currentPage + 1} de {Math.max(1, Math.ceil(totalGroups / groupPageSize))} ({totalGroups} grupos)</>
                        ) : (
                            <>Página {currentPage + 1} de {Math.max(1, Math.ceil((Array.isArray(data) ? data.length : 0) / groupPageSize))}</>
                        )}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage >= Math.max(1, Math.ceil(totalGroups / groupPageSize)) - 1 && enableGrouping}
                    >
                        Siguiente
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {enableGrouping ? 'Grupos por página:' : 'Items por página (tabla):'}
                    </span>
                    <Select
                        value={String(groupPageSize)}
                        onValueChange={(val) => {
                            const next = Number(val)
                            setGroupPageSize(next)
                            setCurrentPage(0)
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder={groupPageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50, 100].map(n => (
                                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
