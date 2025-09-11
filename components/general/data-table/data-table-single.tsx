'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import * as React from 'react'
import { MoreHorizontal } from 'lucide-react'

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  /** Tamaños disponibles para el selector de página */
  pageSizeOptions?: number[]
  /** Tamaño de página inicial */
  initialPageSize?: number
}

export function DataTableSingle<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = 'Buscar...',
  pageSizeOptions = [5, 10, 20, 50, 100],
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  })

  // Totales y rango visible
  const totalRows = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const start = totalRows ? Math.min(pageIndex * pageSize + 1, totalRows) : 0
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRows / pageSize || 1)),
    [totalRows, pageSize]
  )

  // Helpers para paginación numerada (ventana)
  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
  const windowSize = 5
  const pageWindow = useMemo(() => {
    if (totalPages <= 1) return []
    const half = Math.floor(windowSize / 2)
    let startIdx = clamp(pageIndex - half, 0, totalPages - 1)
    const endIdx = clamp(startIdx + windowSize - 1, 0, totalPages - 1)
    if (endIdx - startIdx + 1 < windowSize) {
      startIdx = clamp(endIdx - windowSize + 1, 0, totalPages - 1)
    }
    return { startIdx, endIdx }
  }, [pageIndex, totalPages])

  return (
    <div>
      {filterColumn && (
        <div className="flex items-center py-4">
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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

      {/* Footer de paginación */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        {/* Rango visible */}
        <div className="text-sm text-muted-foreground">
          {totalRows > 0 ? (
            <>Mostrando {start}-{end} de {totalRows}</>
          ) : (
            <>Sin Resultados</>
          )}
        </div>

        {/* Controles: prev / números / next */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          {/* Botones numerados */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Ir al primero si la ventana no empieza en 0 */}
              {pageWindow.startIdx > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => table.setPageIndex(0)}
                  >
                    1
                  </Button>
                  {pageWindow.startIdx > 1 && (
                    <span className="px-1 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}

              {/* Ventana central */}
              {Array.from(
                { length: pageWindow.endIdx - pageWindow.startIdx + 1 },
                (_, i) => pageWindow.startIdx + i
              ).map((i) => {
                const active = i === pageIndex
                return (
                  <Button
                    key={`p-${i}`}
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => table.setPageIndex(i)}
                  >
                    {i + 1}
                  </Button>
                )
              })}

              {/* Ir al último si la ventana no termina en el último */}
              {pageWindow.endIdx < totalPages - 1 && (
                <>
                  {pageWindow.endIdx < totalPages - 2 && (
                    <span className="px-1 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => table.setPageIndex(totalPages - 1)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>

        {/* Selector de items por página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items por página:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              table.setPageSize(Number(val))
              table.setPageIndex(0) // volver al inicio al cambiar tamaño
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
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
