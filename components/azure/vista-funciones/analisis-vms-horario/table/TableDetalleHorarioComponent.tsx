'use client'

import { DataTableSingle } from '@/components/general_aws/data-table/data-table-single'
import { createTableDetalleHorarioColumns, HorarioData } from '@/components/azure/vista-funciones/analisis-vms-horario/table/tableDetalleHorarioColumns'
import { useMemo } from 'react'

interface TableDetalleHorarioProps {
  datos: unknown[]
  selectedVM: string | null
  onSelectVM: (vmName: string) => void
}

export const TableDetalleHorarioComponent = ({
  datos,
  selectedVM,
  onSelectVM
}: TableDetalleHorarioProps) => {
  const datosFormateados = useMemo(() => {
    if (!datos || datos.length === 0) return []

    const formatted = datos.map((item) => ({
      vm_name: item.vm_name,
      Tipo_Horario: item.Tipo_Horario,
      Fecha: item.Fecha,
      Hora: item.Hora || '10:00:00',
      metric_name: item.metric_name
    })) as HorarioData[]

    // Ordenar por Fecha descendente (más reciente primero)
    return formatted.sort((a, b) => {
      const [diaA, mesA, anioA] = a.Fecha.split('/')
      const [diaB, mesB, anioB] = b.Fecha.split('/')

      const dateA = new Date(parseInt(anioA), parseInt(mesA) - 1, parseInt(diaA))
      const dateB = new Date(parseInt(anioB), parseInt(mesB) - 1, parseInt(diaB))

      return dateB.getTime() - dateA.getTime() // desc
    })
  }, [datos])

  const columns = useMemo(
    () => createTableDetalleHorarioColumns(selectedVM, onSelectVM),
    [selectedVM, onSelectVM]
  )

  if (!datos || datos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay datos disponibles para mostrar
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <DataTableSingle
        columns={columns}
        data={datosFormateados}
        filterColumn="vm_name"
        filterPlaceholder="Filtrar por nombre de VM..."
      />
    </div>
  )
}