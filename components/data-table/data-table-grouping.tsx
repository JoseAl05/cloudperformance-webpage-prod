'use client'

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    type Header
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
    columns: ColumnDef<TData, TValue>[];
    data?: TData[];
    filterColumn?: string;
    filterPlaceholder?: string;
    enableGrouping?: boolean;
    groupByColumn?: string;
    pageSizeGroups?: number;
    pageSizeItems?: number;
    initialSorting?: SortingState;
}

type AnyRow = Record<string, unknown>

interface GroupMetadata {
    totalItems: number
    totalPages: number
    currentPage: number
}

interface ProcessedRow extends AnyRow {
    __rowId: string
    __isGroupRow: boolean
    __groupValue?: string
    __itemCount?: number
    __isChildRow?: boolean
    __parentGroup?: string
}

type ColumnMeta = {
    isDefaultSort?: boolean
    defaultSortDesc?: boolean
}

const comparator = (a: unknown, b: unknown): number => {
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1
    if (typeof a === 'number' && typeof b === 'number') return a - b
    if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? 1 : -1
    const dateA = typeof a === 'string' ? Date.parse(a) : NaN
    const dateB = typeof b === 'string' ? Date.parse(b) : NaN
    if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) return dateA - dateB
    if (typeof a === 'string' && typeof b === 'string') {
        const numA = Number(a),
            numB = Number(b)
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

const sortData = <T extends AnyRow>(data: T[], sortState: SortingState): T[] => {
    if (!sortState?.length) return data
    return [...data].sort((a, b) => {
        for (const rule of sortState) {
            const valueA = a[rule.id]
            const valueB = b[rule.id]
            const result = comparator(valueA, valueB)
            if (result !== 0) return rule.desc ? -result : result
        }
        return 0
    })
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const useGroupedData = (
    data: AnyRow[],
    sorting: SortingState,
    enableGrouping: boolean,
    groupByColumn?: string,
    expandedGroups?: Set<string>,
    currentPage?: number,
    groupPageSize?: number,
    itemsPageSize?: number,
    groupPages?: Map<string, number>
) => {
    return useMemo(() => {
        if (!enableGrouping || !groupByColumn || data.length === 0) {
            const sortedData = sortData(data, sorting)
            const startIndex = (currentPage || 0) * (groupPageSize || 10)
            const endIndex = Math.min(startIndex + (groupPageSize || 10), sortedData.length)
            const processedData = sortedData.slice(startIndex, endIndex).map((item, index) => ({
                ...item,
                __rowId: `item-${startIndex + index}`,
                __isGroupRow: false,
            }))
            return {
                processedData: processedData as ProcessedRow[],
                totalGroups: 0,
                groupMetadata: {} as Record<string, GroupMetadata>,
            }
        }

        const groups = data.reduce((acc, item) => {
            const groupValue = String(item[groupByColumn] ?? '—')
            if (!acc[groupValue]) acc[groupValue] = []
            acc[groupValue].push(item)
            return acc
        }, {} as Record<string, AnyRow[]>)

        let groupEntries = Object.entries(groups)
        const groupSorting = sorting.find((s) => s.id === groupByColumn)
        if (groupSorting) {
            groupEntries = groupEntries.sort((a, b) => {
                const result = comparator(a[0], b[0])
                return groupSorting.desc ? -result : result
            })
        }

        const startGroupIndex = (currentPage || 0) * (groupPageSize || 10)
        const endGroupIndex = Math.min(startGroupIndex + (groupPageSize || 10), groupEntries.length)
        const pageGroups = groupEntries.slice(startGroupIndex, endGroupIndex)

        const itemSorting = sorting.filter((s) => s.id !== groupByColumn)

        const processedData: ProcessedRow[] = []
        const groupMetadata: Record<string, GroupMetadata> = {}

        pageGroups.forEach(([groupValue, rawItems]) => {
            const sortedItems = sortData(rawItems, itemSorting)
            processedData.push({
                __rowId: `group-${groupValue}`,
                __isGroupRow: true,
                __groupValue: groupValue,
                __itemCount: sortedItems.length,
                [groupByColumn]: groupValue,
            })
            const totalItems = sortedItems.length
            const totalPages = Math.max(1, Math.ceil(totalItems / (itemsPageSize || 10)))
            const currentChildPage = Math.min(groupPages?.get(groupValue) ?? 0, totalPages - 1)
            groupMetadata[groupValue] = {
                totalItems,
                totalPages,
                currentPage: currentChildPage,
            }
            if (expandedGroups?.has(groupValue)) {
                const startIndex = currentChildPage * (itemsPageSize || 10)
                const endIndex = Math.min(startIndex + (itemsPageSize || 10), totalItems)
                const pageItems = sortedItems.slice(startIndex, endIndex)
                pageItems.forEach((item, index) => {
                    processedData.push({
                        ...item,
                        __rowId: `item-${groupValue}-${startIndex + index}`,
                        __isGroupRow: false,
                        __parentGroup: groupValue,
                        __isChildRow: true,
                    })
                })
            }
        })

        return {
            processedData,
            totalGroups: groupEntries.length,
            groupMetadata,
        }
    }, [
        data,
        sorting,
        enableGrouping,
        groupByColumn,
        expandedGroups,
        currentPage,
        groupPageSize,
        itemsPageSize,
        groupPages,
    ])
}

const usePagination = (totalItems: number, pageSize: number) => {
    const [currentPage, setCurrentPage] = useState(0)
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const canPrevious = currentPage > 0
    const canNext = currentPage < totalPages - 1

    const goToPrevious = useCallback(() => {
        if (canPrevious) setCurrentPage((p) => p - 1)
    }, [canPrevious])

    const goToNext = useCallback(() => {
        if (canNext) setCurrentPage((p) => p + 1)
    }, [canNext])

    const resetPage = useCallback(() => setCurrentPage(0), [])

    return {
        currentPage,
        totalPages,
        canPrevious,
        canNext,
        goToPrevious,
        goToNext,
        resetPage,
        setCurrentPage,
    }
}

const ResizeHandle = ({ header }: { header: Header<unknown, unknown> }) => {
    const isResizing = header.column.getIsResizing()
    return (
        <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            onDoubleClick={() => header.column.resetSize()}
            className="absolute right-0 top-0 h-full w-4 -right-2 z-20 cursor-col-resize select-none touch-none flex justify-center items-center group/resizer outline-none"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className={`
                    w-px transition-all duration-200 rounded-full
                    ${isResizing
                        ? 'bg-blue-600 h-full w-[2px] opacity-100'
                        : 'h-6 bg-slate-300 dark:bg-slate-700 opacity-60 group-hover/resizer:bg-blue-400 group-hover/resizer:opacity-100 group-hover/resizer:h-8'
                    }
                `}
            />
        </div>
    )
}

const SortableHeader = ({ header }: { header: unknown }) => {
    const canSort = header.column.getCanSort?.() ?? true
    const sorted = header.column.getIsSorted?.() as false | 'asc' | 'desc'
    const label = flexRender(header.column.columnDef.header, header.getContext())

    return (
        <div className="flex items-center justify-between w-full h-full group/sortable">
            {!canSort ? (
                <span className="truncate">{label}</span>
            ) : (
                <Button
                    variant="ghost"
                    className="h-8 -ml-2 px-2 flex items-center gap-1 w-full justify-start hover:bg-transparent"
                    onClick={header.column.getToggleSortingHandler()}
                    aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                    <span className="truncate">{label}</span>
                    <ArrowUpDown className={`h-4 w-4 shrink-0 transition-opacity ${sorted ? 'opacity-100' : 'opacity-30 group-hover/sortable:opacity-70'}`} />
                </Button>
            )}
        </div>
    )
}

const PageButtons = ({
    current,
    total,
    onPageChange,
}: {
    current: number
    total: number
    onPageChange: (page: number) => void
}) => {
    if (total <= 1) return null
    const windowSize = 5
    const half = Math.floor(windowSize / 2)
    let start = clamp(current - half, 0, total - 1)
    const end = clamp(start + windowSize - 1, 0, total - 1)
    if (end - start + 1 < windowSize) start = clamp(end - windowSize + 1, 0, total - 1)

    const buttons: JSX.Element[] = []
    if (start > 0) {
        buttons.push(
            <Button key="first" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onPageChange(0)}>
                1
            </Button>
        )
        if (start > 1) {
            buttons.push(
                <span key="pre-ellipsis" className="px-1 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </span>
            )
        }
    }
    for (let i = start; i <= end; i++) {
        buttons.push(
            <Button
                key={`p-${i}`}
                variant={i === current ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onPageChange(i)}
            >
                {i + 1}
            </Button>
        )
    }
    if (end < total - 1) {
        if (end < total - 2) {
            buttons.push(
                <span key="post-ellipsis" className="px-1 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </span>
            )
        }
        buttons.push(
            <Button
                key="last"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onPageChange(total - 1)}
            >
                {total}
            </Button>
        )
    }
    return <>{buttons}</>
}

const GroupRow = ({
    groupValue,
    itemCount,
    isExpanded,
    metadata,
    onToggle,
    onPreviousPage,
    onNextPage,
    onPageChange,
    itemsPageSize,
    onItemsPageSizeChange,
    columnsLength,
}: {
    groupValue: string
    itemCount: number
    isExpanded: boolean
    metadata?: GroupMetadata
    onToggle: () => void
    onPreviousPage: () => void
    onNextPage: () => void
    onPageChange: (page: number) => void
    itemsPageSize: number
    onItemsPageSizeChange: (size: number) => void
    columnsLength: number
}) => (
    <TableRow className="">
        <TableCell colSpan={columnsLength} className="font-semibold">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-6 w-6 p-0 cursor-pointer"
                    aria-label={isExpanded ? 'Colapsar grupo' : 'Expandir grupo'}
                >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <span className="truncate max-w-[30ch]">{groupValue}</span>
                <span className="text-sm text-muted-foreground">({itemCount} registros)</span>
                {isExpanded && metadata && (
                    <div className="flex flex-wrap items-center gap-2 pl-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={onPreviousPage}
                            disabled={metadata.currentPage <= 0}
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                            <PageButtons current={metadata.currentPage} total={metadata.totalPages} onPageChange={onPageChange} />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={onNextPage}
                            disabled={metadata.currentPage >= metadata.totalPages - 1}
                        >
                            Siguiente
                        </Button>
                        <div className="flex items-center gap-2 pl-2">
                            <span className="text-xs text-muted-foreground">Items/grupo:</span>
                            <Select value={String(itemsPageSize)} onValueChange={(val) => onItemsPageSizeChange(Number(val))}>
                                <SelectTrigger className="h-7 w-[110px]">
                                    <SelectValue placeholder={itemsPageSize} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50, 100].map((n) => (
                                        <SelectItem key={n} value={String(n)}>
                                            {n}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="ml-2 text-xs text-muted-foreground">
                            Mostrando {Math.min(metadata.currentPage * itemsPageSize + 1, metadata.totalItems)}-
                            {Math.min((metadata.currentPage + 1) * itemsPageSize, metadata.totalItems)} de {metadata.totalItems}
                        </span>
                    </div>
                )}
            </div>
        </TableCell>
    </TableRow>
)

export function DataTableGrouping<TData, TValue>({
    columns,
    data = [],
    filterColumn,
    filterPlaceholder = 'Buscar...',
    enableGrouping = false,
    groupByColumn,
    pageSizeGroups = 10,
    pageSizeItems = 10,
    initialSorting = []
}: DataTableGroupingProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
    const [groupPages, setGroupPages] = useState<Map<string, number>>(new Map())
    const [groupPageSize, setGroupPageSize] = useState(pageSizeGroups)
    const [itemsPageSize, setItemsPageSize] = useState(pageSizeItems)

    const safeData = Array.isArray(data) ? data : []
    const filteredData = useMemo(() => {
        const filterValue = columnFilters.find(f => f.id === filterColumn)?.value as string
        if (!filterColumn || !filterValue) return safeData

        return safeData.filter(item => {
            const val = item[filterColumn as keyof TData]
            return String(val ?? '').toLowerCase().includes(filterValue.toLowerCase())
        })
    }, [safeData, columnFilters, filterColumn])
    const totalGroupsForPagination = enableGrouping
        ? new Set(filteredData.map((r: unknown) => String(r[groupByColumn] ?? '—'))).size
        : filteredData.length

    const [sorting, setSorting] = useState<SortingState>(() => {
        const defaultCol = columns.find(col => (col.meta as ColumnMeta)?.isDefaultSort);

        if (defaultCol) {
            return [{
                id: (defaultCol.id ?? (defaultCol as unknown).accessorKey) as string,
                desc: (defaultCol.meta as ColumnMeta)?.defaultSortDesc ?? false
            }];
        }
        return [];
    })

    const { currentPage, totalPages, canPrevious, canNext, goToPrevious, goToNext, resetPage } =
        usePagination(totalGroupsForPagination, groupPageSize)

    useEffect(() => {
        resetPage()
        setGroupPages(new Map())
    }, [sorting, resetPage])

    const { processedData, totalGroups, groupMetadata } = useGroupedData(
        filteredData as AnyRow[],
        sorting,
        enableGrouping,
        groupByColumn,
        expandedGroups,
        currentPage,
        groupPageSize,
        itemsPageSize,
        groupPages
    )

    const toggleGroup = useCallback((groupValue: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev)
            if (next.has(groupValue)) {
                next.delete(groupValue)
                setGroupPages((prevPages) => {
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

    const setGroupPage = useCallback(
        (groupValue: string, page: number) => {
            setGroupPages((prev) => {
                const clone = new Map(prev)
                const metadata = groupMetadata[groupValue]
                if (metadata) clone.set(groupValue, clamp(page, 0, metadata.totalPages - 1))
                return clone
            })
        },
        [groupMetadata]
    )

    const handleGroupPrevious = useCallback(
        (groupValue: string) => {
            const metadata = groupMetadata[groupValue]
            if (metadata && metadata.currentPage > 0) setGroupPage(groupValue, metadata.currentPage - 1)
        },
        [groupMetadata, setGroupPage]
    )

    const handleGroupNext = useCallback(
        (groupValue: string) => {
            const metadata = groupMetadata[groupValue]
            if (metadata && metadata.currentPage < metadata.totalPages - 1) setGroupPage(groupValue, metadata.currentPage + 1)
        },
        [groupMetadata, setGroupPage]
    )

    const table = useReactTable({
        data: processedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        columnResizeMode: 'onChange',
        state: { columnFilters, sorting },
        getRowId: (row: ProcessedRow) => row.__rowId,
        manualPagination: true,
        manualFiltering: true
    })

    const outerTotalPages = enableGrouping
        ? Math.max(1, Math.ceil(totalGroups / groupPageSize))
        : Math.max(1, Math.ceil(filteredData.length / groupPageSize))

    return (
        <div className="space-y-4">
            {filterColumn && (
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
            )}
            <div className="rounded-md border overflow-auto relative w-full">
                <Table className="table-fixed caption-bottom text-sm" style={{ width: table.getTotalSize() }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="relative group bg-background"
                                        style={{ width: header.getSize() }}
                                    >
                                        {
                                            header.isPlaceholder ? null : (
                                                <>
                                                    <SortableHeader header={header} />
                                                    <ResizeHandle header={header} />
                                                </>
                                            )
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const rowData = row.original as ProcessedRow
                                if (rowData.__isGroupRow && rowData.__groupValue) {
                                    return (
                                        <GroupRow
                                            key={row.id}
                                            groupValue={rowData.__groupValue}
                                            itemCount={rowData.__itemCount || 0}
                                            isExpanded={expandedGroups.has(rowData.__groupValue)}
                                            metadata={groupMetadata[rowData.__groupValue]}
                                            onToggle={() => toggleGroup(rowData.__groupValue!)}
                                            onPreviousPage={() => handleGroupPrevious(rowData.__groupValue!)}
                                            onNextPage={() => handleGroupNext(rowData.__groupValue!)}
                                            onPageChange={(page) => setGroupPage(rowData.__groupValue!, page)}
                                            itemsPageSize={itemsPageSize}
                                            onItemsPageSizeChange={setItemsPageSize}
                                            columnsLength={columns.length}
                                        />
                                    )
                                }
                                const isChild = enableGrouping && rowData.__isChildRow
                                return (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className={isChild ? 'border-l-4 border-l-blue-200' : ''}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`truncate ${isChild ? 'pl-8' : ''}`}
                                                style={{ width: cell.column.getSize() }}
                                            >
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPrevious} disabled={!canPrevious}>
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {enableGrouping ? <>Página {currentPage + 1} de {outerTotalPages} ({totalGroups} grupos)</> : <>Página {currentPage + 1} de {outerTotalPages}</>}
                    </span>
                    <Button variant="outline" size="sm" onClick={goToNext} disabled={!canNext}>
                        Siguiente
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {enableGrouping ? 'Grupos por página:' : 'Items por página:'}
                    </span>
                    <Select
                        value={String(groupPageSize)}
                        onValueChange={(val) => {
                            setGroupPageSize(Number(val))
                            resetPage()
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder={groupPageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50, 100].map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}