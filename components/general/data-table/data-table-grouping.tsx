'use client'

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    getExpandedRowModel,
    Row,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    filterColumn?: string
    filterPlaceholder?: string
    enableGrouping?: boolean
    groupByColumn?: string
}

interface GroupedRow<T> {
    id: string
    type: 'group' | 'item'
    groupValue?: string
    itemCount?: number
    data?: T
    isExpanded?: boolean
}

export function DataTableGrouping<TData, TValue>({
    columns,
    data = [],
    filterColumn,
    filterPlaceholder = "Buscar...",
    enableGrouping = false,
    groupByColumn
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)

    // Validación de datos
    const safeData = Array.isArray(data) ? data : []

    // Procesar datos para agrupación
    const { processedData, totalGroups } = useMemo(() => {
        if (!enableGrouping || !groupByColumn || safeData.length === 0) {
            const processed = safeData.map((item, index) => ({
                ...item,
                __rowId: `item-${index}`,
                __isGroupRow: false
            }))
            return { processedData: processed, totalGroups: 0 }
        }

        // Agrupar datos por la columna especificada
        const groups = safeData.reduce((acc, item) => {
            const groupValue = (item as unknown)[groupByColumn]
            if (!acc[groupValue]) {
                acc[groupValue] = []
            }
            acc[groupValue].push(item)
            return acc
        }, {} as Record<string, TData[]>)

        const groupEntries = Object.entries(groups)

        // Paginación a nivel de grupos
        const startGroupIndex = currentPage * pageSize
        const endGroupIndex = Math.min(startGroupIndex + pageSize, groupEntries.length)
        const pageGroups = groupEntries.slice(startGroupIndex, endGroupIndex)

        // Crear estructura de filas para la página actual
        const result: unknown[] = []

        pageGroups.forEach(([groupValue, items]) => {
            // Fila de grupo
            const groupRow = {
                __rowId: `group-${groupValue}`,
                __isGroupRow: true,
                __groupValue: groupValue,
                __itemCount: items.length,
                __items: items,
                [groupByColumn]: groupValue
            }
            result.push(groupRow)

            // Todas las filas de items si el grupo está expandido
            if (expandedGroups.has(groupValue)) {
                items.forEach((item, index) => {
                    result.push({
                        ...item,
                        __rowId: `item-${groupValue}-${index}`,
                        __isGroupRow: false,
                        __parentGroup: groupValue,
                        __isChildRow: true
                    })
                })
            }
        })

        return { processedData: result, totalGroups: groupEntries.length }
    }, [safeData, enableGrouping, groupByColumn, expandedGroups, currentPage, pageSize])

    // Configuración de tabla con paginación deshabilitada (manejamos manualmente)
    const table = useReactTable({
        data: processedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        },
        getRowId: (row: unknown) => row.__rowId,
        manualPagination: true, // Paginación manual
    })

    // Funciones de paginación personalizadas
    const totalPages = enableGrouping ? Math.ceil(totalGroups / pageSize) : Math.ceil(safeData.length / pageSize)
    const canPreviousPage = currentPage > 0
    const canNextPage = currentPage < totalPages - 1

    const previousPage = () => {
        if (canPreviousPage) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const nextPage = () => {
        if (canNextPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const toggleGroup = (groupValue: string) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev)
            if (newSet.has(groupValue)) {
                newSet.delete(groupValue)
            } else {
                newSet.add(groupValue)
            }
            return newSet
        })
    }

    return (
        <div>
            {filterColumn && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            )}
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const rowData = row.original as unknown

                                // Fila de grupo
                                if (rowData.__isGroupRow) {
                                    const isExpanded = expandedGroups.has(rowData.__groupValue)
                                    return (
                                        <TableRow key={row.id} className="bg-muted/50 hover:bg-muted/70 sticky-group">
                                            <TableCell colSpan={columns.length} className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleGroup(rowData.__groupValue)}
                                                        className="h-6 w-6 p-0 cursor-pointer"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <span>{rowData.__groupValue}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({rowData.__itemCount} registros)
                                                    </span>
                                                    {expandedGroups.has(rowData.__groupValue) && (
                                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                            Expandido
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                // Fila de item normal
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className={enableGrouping && rowData.__isChildRow ? "bg-background border-l-4 border-l-blue-200" : ""}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={enableGrouping && rowData.__isChildRow ? "pl-8" : ""}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    Sin Resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-between space-x-2 py-4'>
                <div className="text-sm text-muted-foreground">
                    {enableGrouping ? (
                        <span>
                            Página {currentPage + 1} de {totalPages}
                            <span className="ml-2">
                                ({totalGroups} grupos total)
                            </span>
                        </span>
                    ) : (
                        <span>
                            Mostrando {Math.min((currentPage * pageSize) + 1, safeData.length)} - {Math.min((currentPage + 1) * pageSize, safeData.length)} de {safeData.length}
                        </span>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={nextPage}
                        disabled={!canNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )
}