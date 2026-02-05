'use client'

import { useMemo } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from '@/components/data-table/data-table-grouping'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Bucket {
  name: string
  storage_class: string
  location: string
  location_type: string
  tamano_gb?: number
  costo_total?: number
  currency?: string
  sin_uso?: boolean
  has_lifecycle_rules?: boolean
  recomendacion?: string
  ahorro_potencial?: number
  object_count?: number
  sync_time: { $date: string }
}

interface BucketsHistoricalTableProps {
  data: Bucket[]
  startDate?: string
  endDate?: string
}

export const BucketsHistoricalTable = ({ data, startDate, endDate }: BucketsHistoricalTableProps) => {

  const flattenedData = useMemo(() => {
    return data.map(bucket => {
      const date = new Date(bucket.sync_time.$date)

      return {
        sync_time: date.toISOString(),
        sync_time_formatted: date.toLocaleString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        name: bucket.name,
        storage_class: bucket.storage_class,
        location: bucket.location,
        location_type: bucket.location_type,
        size_gb: bucket.tamano_gb ?? 0,
        object_count: bucket.object_count ?? 0,
        costo_total: bucket.costo_total ?? 0,
        currency: bucket.currency ?? 'USD',
        sin_uso: bucket.sin_uso,
        has_lifecycle_rules: bucket.has_lifecycle_rules,
        recomendacion: bucket.recomendacion,
        ahorro_potencial: bucket.ahorro_potencial ?? 0
      }
    })
  }, [data])

  const getStorageBadge = (storage: string) => {
    const map: Record<string, string> = {
      STANDARD: 'bg-blue-100 text-blue-700',
      NEARLINE: 'bg-emerald-100 text-emerald-700',
      COLDLINE: 'bg-indigo-100 text-indigo-700',
      ARCHIVE: 'bg-gray-200 text-gray-800'
    }

    return (
      <Badge className={`${map[storage] || 'bg-gray-100 text-gray-700'} text-xs`}>
        {storage}
      </Badge>
    )
  }

  const getRecommendationBadge = (rec?: string) => {
    if (!rec) return <span className="text-xs text-muted-foreground">-</span>

    const map: Record<string, string> = {
      CAMBIAR_A_NEARLINE: 'bg-emerald-100 text-emerald-700',
      CAMBIAR_A_COLDLINE: 'bg-indigo-100 text-indigo-700',
      CAMBIAR_A_ARCHIVE: 'bg-gray-300 text-gray-900',
      CONFIGURAR_LIFECYCLE: 'bg-amber-100 text-amber-700'
    }

    return (
      <Badge className={`${map[rec] || 'bg-gray-100 text-gray-700'} text-xs`}>
        {rec.replaceAll('_', ' ')}
      </Badge>
    )
  }

  const columns: ColumnDef<typeof flattenedData[0]>[] = [
    {
      accessorKey: "sync_time_formatted",
      header: "Fecha",
      cell: info => <span className="text-sm">{info.getValue() as string}</span>
    },
    {
      accessorKey: "name",
      header: "Bucket",
      cell: info => <span className="text-sm font-mono">{info.getValue() as string}</span>
    },
    {
      accessorKey: "storage_class",
      header: "Clase",
      cell: info => getStorageBadge(info.getValue() as string)
    },
    {
      accessorKey: "size_gb",
      header: "Tamaño",
      cell: info => (
        <span className="text-sm">
          {Number(info.getValue()).toFixed(2)} GB
        </span>
      )
    },
    {
      accessorKey: "object_count",
      header: "Objetos",
      cell: info => (
        <span className="text-sm text-muted-foreground">
          {info.getValue() as number}
        </span>
      )
    },
    {
      accessorKey: "sin_uso",
      header: "Uso",
      cell: info =>
        info.getValue() ? (
          <Badge className="bg-red-100 text-red-700 text-xs">Sin uso</Badge>
        ) : (
          <Badge className="bg-green-100 text-green-700 text-xs">En uso</Badge>
        )
    },
    {
      accessorKey: "has_lifecycle_rules",
      header: "Lifecycle",
      cell: info =>
        info.getValue() ? (
          <Badge className="bg-emerald-100 text-emerald-700 text-xs">Configurado</Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700 text-xs">Sin reglas</Badge>
        )
    },
    {
      accessorKey: "costo_total",
      header: "Costo",
      cell: ({ row }) => (
        <span className="text-sm font-semibold">
          {row.original.currency === 'CLP' ? '$' : '$'}
          {row.original.costo_total.toFixed(8)}
        </span>
      )
    },
    {
      accessorKey: "ahorro_potencial",
      header: "Ahorro Potencial",
      cell: info =>
        info.getValue() > 0 ? (
          <span className="text-sm font-semibold text-green-600">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )
    },
    {
      accessorKey: "recomendacion",
      header: "Recomendación",
      cell: info => getRecommendationBadge(info.getValue() as string)
    },
    {
      accessorKey: "location",
      header: "Ubicación",
      cell: info => (
        <span className="text-xs text-muted-foreground">
          {info.row.original.location} ({info.row.original.location_type})
        </span>
      )
    }
  ]

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No hay buckets para mostrar con los filtros aplicados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              🗄️ Historial de Buckets GCP
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Buckets agrupados por fecha de sincronización
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableGrouping
          columns={columns}
          data={flattenedData}
          filterColumn="name"
          filterPlaceholder="Buscar bucket..."
          enableGrouping={true}
          groupByColumn="sync_time_formatted"
          pageSizeItems={10}
        />

        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {flattenedData.length} registros
            </div>
            {startDate && endDate && (
              <div className="text-sm text-muted-foreground">
                Período: {startDate} - {endDate}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
