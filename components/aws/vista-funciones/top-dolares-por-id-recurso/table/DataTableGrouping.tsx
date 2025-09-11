"use client"

import React, { useMemo, useState } from "react"
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  filterColumn?: keyof TData
  filterPlaceholder?: string
  enableGrouping?: boolean
  groupByColumn?: keyof TData
  groupPageSize?: number
  outerPageSize?: number
}

export function DataTableGrouping<TData, TValue>({
  columns,
  data = [],
  filterColumn,
  filterPlaceholder = "Buscar...",
  enableGrouping = false,
  groupByColumn,
  groupPageSize = 5,
  outerPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [filterValue, setFilterValue] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [groupPages, setGroupPages] = useState<Record<string, number>>({})

  // 1️⃣ Filtrar datos antes de agrupar
  const filteredData = useMemo(() => {
    if (!filterColumn || !filterValue) return data
    return data.filter((item) =>
      String(item[filterColumn])
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    )
  }, [data, filterColumn, filterValue])

  // 2️⃣ Agrupar datos
  const { processedData, totalGroups } = useMemo(() => {
    if (!enableGrouping || !groupByColumn || filteredData.length === 0) {
      const processed = filteredData.map((item, index) => ({
        ...item,
        __rowId: `item-${index}`,
        __isGroupRow: false,
      }))
      return { processedData: processed, totalGroups: 0 }
    }

    const groups = filteredData.reduce((acc, item) => {
      const groupValue = String(item[groupByColumn])
      if (!acc[groupValue]) acc[groupValue] = []
      acc[groupValue].push(item)
      return acc
    }, {} as Record<string, TData[]>)

    const groupEntries = Object.entries(groups)
    const startGroupIndex = currentPage * outerPageSize
    const endGroupIndex = startGroupIndex + outerPageSize
    const pageGroups = groupEntries.slice(startGroupIndex, endGroupIndex)

    const result: any[] = []
    pageGroups.forEach(([groupValue, items]) => {
      result.push({
        __rowId: `group-${groupValue}`,
        __isGroupRow: true,
        __groupValue: groupValue,
        __itemCount: items.length,
        __items: items,
      })
    })

    return { processedData: result, totalGroups: groupEntries.length }
  }, [filteredData, enableGrouping, groupByColumn, currentPage, outerPageSize])

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => row.__rowId,
  })

  const totalPages = enableGrouping
    ? Math.ceil(totalGroups / outerPageSize)
    : Math.ceil(filteredData.length / outerPageSize)

  const previousPage = () => setCurrentPage((p) => Math.max(0, p - 1))
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
  const toggleGroup = (groupValue: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupValue)) newSet.delete(groupValue)
      else newSet.add(groupValue)
      return newSet
    })
  }

  return (
    <div>
      {filterColumn && (
        <div className="flex items-center py-4">
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const rowData = row.original as any
                if (rowData.__isGroupRow) {
                  const isExpanded = expandedGroups.has(rowData.__groupValue)
                  const items = rowData.__items || []
                  const groupPage = groupPages[rowData.__groupValue] || 0
                  const start = groupPage * groupPageSize
                  const end = start + groupPageSize
                  const paginatedItems = items.slice(start, end)
                  const totalGroupPages = Math.ceil(items.length / groupPageSize)

                  return (
                    <React.Fragment key={rowData.__rowId}>
                      <TableRow
                        className="bg-muted/50 cursor-pointer"
                        onClick={() => toggleGroup(rowData.__groupValue)}
                      >
                        <TableCell colSpan={columns.length}>
                          <div className="flex items-center gap-2 font-medium">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span>
                              {rowData.__groupValue} ({rowData.__itemCount} ítems)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {isExpanded &&
                        paginatedItems.map((item: any, idx: number) => (
                          <TableRow key={`item-${rowData.__groupValue}-${idx}`}>
                            {columns.map((col, i) => {
                              const accessor = col.accessorKey as string
                              const value = item[accessor]
                              return (
                                <TableCell key={i} className="pl-8">
                                  {col.cell
                                    ? flexRender(col.cell, {
                                        getValue: () => value,
                                        row: { original: item },
                                        column: col,
                                      })
                                    : value}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}

                      {isExpanded && totalGroupPages > 1 && (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Página {groupPage + 1} de {totalGroupPages}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={groupPage === 0}
                                  onClick={() =>
                                    setGroupPages((prev) => ({
                                      ...prev,
                                      [rowData.__groupValue]: Math.max(0, groupPage - 1),
                                    }))
                                  }
                                >
                                  Anterior
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={groupPage >= totalGroupPages - 1}
                                  onClick={() =>
                                    setGroupPages((prev) => ({
                                      ...prev,
                                      [rowData.__groupValue]: Math.min(
                                        totalGroupPages - 1,
                                        groupPage + 1
                                      ),
                                    }))
                                  }
                                >
                                  Siguiente
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                }

                return null
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enableGrouping && totalPages > 1 && (
        <div className="flex justify-between items-center py-4">
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={previousPage} disabled={currentPage === 0}>
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
