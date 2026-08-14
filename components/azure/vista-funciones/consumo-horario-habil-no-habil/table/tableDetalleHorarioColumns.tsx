'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type HorarioData = {
  vm_name: string
  Tipo_Horario: string
  Fecha: string
  Hora: string
  metric_name: string
}

export const createTableDetalleHorarioColumns = (
  selectedVM: string | null,
  onSelectVM: (vmName: string) => void
): ColumnDef<HorarioData>[] => [
  {
    accessorKey: 'vm_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Nombre VM
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
      const vmName = row.getValue('vm_name') as string
      const isSelected = selectedVM === vmName
      
      return (
        <div 
          className={`font-medium cursor-pointer hover:text-blue-600 transition-colors ${
            isSelected ? 'text-blue-600 font-bold' : ''
          }`}
          onClick={() => onSelectVM(vmName)}
        >
          {vmName}
          {isSelected && (
            <Badge className="ml-2 bg-blue-500 text-white">Seleccionada</Badge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'Tipo_Horario',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Tipo Horario
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
      const tipo = row.getValue('Tipo_Horario') as string
      const esHabil = tipo?.includes('Hábil') || tipo?.includes('HÃ¡bil')
      
      return (
        <Badge 
          variant={esHabil ? 'default' : 'secondary'}
          className={esHabil ? 'bg-blue-500' : 'bg-indigo-500'}
        >
          {tipo}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'Fecha',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Fecha
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
    sortingFn: (rowA, rowB) => {
      const fechaA = rowA.getValue('Fecha') as string
      const fechaB = rowB.getValue('Fecha') as string
      
      // Convertir DD/MM/YYYY a Date para comparar correctamente
      const [diaA, mesA, anioA] = fechaA.split('/')
      const [diaB, mesB, anioB] = fechaB.split('/')
      
      const dateA = new Date(parseInt(anioA), parseInt(mesA) - 1, parseInt(diaA))
      const dateB = new Date(parseInt(anioB), parseInt(mesB) - 1, parseInt(diaB))
      
      return dateA.getTime() - dateB.getTime()
    },
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('Fecha')}</div>
    }
  },
  {
    accessorKey: 'Hora',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Hora del Día
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
    sortingFn: (rowA, rowB) => {
      const horaA = rowA.getValue('Hora') as string
      const horaB = rowB.getValue('Hora') as string
      
      return horaA.localeCompare(horaB)
    },
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('Hora')}</div>
    }
  },
  {
    accessorKey: 'metric_name',
    header: 'Recurso',
    enableSorting: false,
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{row.getValue('metric_name')}</div>
    }
  }
]