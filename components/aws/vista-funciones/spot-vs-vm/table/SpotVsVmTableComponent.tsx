"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type InstanceData = {
  InstanceId: string
  InstancePurchaseMethod: string
  belong_to_asg: boolean
  belong_to_eks: boolean
  AutoScalingGroupName: string | null
  clusterName: string | null
}

type SpotVsVmApiResponse = {
  sync_time: string
  total_spot: number
  total_instancias: number
  instancias: InstanceData[]
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const TableComponentSpotVsVm = ({
  startDateFormatted,
  endDateFormatted,
}: {
  startDateFormatted: string
  endDateFormatted: string
}) => {
  const { data, error, isLoading } = useSWR<SpotVsVmApiResponse[]>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/vm/spot_vs_vm?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=all_regions`
      : null,
    fetcher
  )

  // 🔎 Flatten: cada fila será una instancia con su fecha asociada
  const flattenedData =
    data?.flatMap((item) =>
      item.instancias.map((instancia) => ({
        sync_time: item.sync_time,
        InstanceId: instancia.InstanceId,
        InstancePurchaseMethod: instancia.InstancePurchaseMethod,
        belong_to_asg: instancia.belong_to_asg,
        belong_to_eks: instancia.belong_to_eks,
        AutoScalingGroupName: instancia.AutoScalingGroupName,
        clusterName: instancia.clusterName,
      }))
    ) ?? []

  const columns: ColumnDef<typeof flattenedData[0]>[] = [
    {
      accessorKey: "sync_time",
      header: ({ column }) => (
        <span
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Fecha
        </span>
      ),
      cell: (info) => {
        const date = new Date(info.getValue() as string)
        return date.toLocaleDateString("es-CL", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      },
    },
    {
      accessorKey: "InstanceId",
      header: "Instance ID",
    },
    {
      accessorKey: "InstancePurchaseMethod",
      header: "Tipo",
    },
    {
      accessorKey: "belong_to_asg",
      header: "ASG",
      cell: (info) => (info.getValue() ? "✔️" : "—"),
    },
    {
      accessorKey: "belong_to_eks",
      header: "EKS",
      cell: (info) => (info.getValue() ? "✔️" : "—"),
    },
    {
      accessorKey: "AutoScalingGroupName",
      header: "AutoScaling Group",
      cell: (info) => info.getValue() ?? "—",
    },
    {
      accessorKey: "clusterName",
      header: "Cluster",
      cell: (info) => info.getValue() ?? "—",
    },
  ]

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error cargando datos</p>

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              💻 Historial Spot vs Máquinas Virtuales
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Instancias agrupadas por fecha de sincronización
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableGrouping
          columns={columns}
          data={flattenedData}
          filterColumn="InstanceId"
          filterPlaceholder="Buscar instancia…"
          enableGrouping={true}
          groupByColumn="sync_time"   //fecha
        />

        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {flattenedData && (
              <div className="text-sm text-muted-foreground">
                Mostrando {flattenedData.length} instancias
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Período: {startDateFormatted} - {endDateFormatted}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
