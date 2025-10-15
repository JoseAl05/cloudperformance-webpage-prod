'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type ResourceGroupData = {
  id: string
  name: string
  location: string
  subscription: string
}

export const tableResourceGroupsColumns: ColumnDef<ResourceGroupData>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Nombre de grupo
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
      return <div className="font-medium">{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Ubicación
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
      const location = row.getValue('location') as string
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {location}
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