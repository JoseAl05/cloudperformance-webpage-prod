'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type ServiceData = {
  id: string
  namespace: string
  subscription: string
}

export const tableServicesColumns: ColumnDef<ServiceData>[] = [
  {
    accessorKey: 'namespace',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Nombre Recurso
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableSorting: true,
    cell: ({ row }) => {
      const namespace = row.getValue('namespace') as string
      return (
        <div className="font-medium">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {namespace}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: 'subscription',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Suscripción
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('subscription')}</div>
    }
  },
  {
    accessorKey: 'id',
    header: 'ID del Recurso',
    enableSorting: false,
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return (
        <div className="text-xs text-muted-foreground font-mono truncate max-w-md" title={id}>
          {id}
        </div>
      )
    }
  }
]