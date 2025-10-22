'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Database, Package, HardDrive, AlertCircle } from 'lucide-react'
import { TopS3BucketsChart } from '@/components/aws/vista-funciones/top-s3-buckets/grafico/TopS3BucketsChart'
import { TrendLineChart } from '@/components/aws/vista-funciones/top-s3-buckets/grafico/TrendLineChart'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

interface TopS3BucketsProps {
  startDate: Date
  endDate: Date
  region?: string
  buckets?: string
}

export const TopS3BucketsComponent = ({
  startDate,
  endDate,
  region,
  buckets,
}: TopS3BucketsProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  // 🔹 Endpoint para métricas globales (tarjetas)
  const s3Info = useSWR(
    `/api/aws/bridge/s3/top_s3_buckets/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resources=${buckets}`,
    fetcher
  )

  const s3Tops = useSWR(
    `/api/aws/bridge/s3/top_s3_buckets/tops?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resources=${buckets}`,
    fetcher
  );

  const s3Metrics = useSWR(
    `/api/aws/bridge/s3/top_s3_buckets/metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resources=${buckets}`,
    fetcher
  )

  const anyLoading =
    s3Info.isLoading ||
    s3Tops.isLoading ||
    s3Metrics.isLoading

  const anyError =
    !!s3Info.error ||
    !!s3Tops.error ||
    !!s3Metrics.error

  const totalSizeGB = s3Info.data?.[0]?.total_size_gb ?? 0
  const totalObjects = s3Info.data?.[0]?.total_objects ?? 0
  const totalBuckets = s3Info.data?.[0]?.total_buckets ?? 0

  const s3TopsInfo = Array.isArray(s3Tops.data) ? s3Tops.data : [];
  const s3MetricsInfo = Array.isArray(s3Metrics.data) ? s3Metrics.data : [];


  if (anyLoading) {
    return (
      <LoaderComponent />
    )
  }

  if (anyError) {
    return (
      <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
        <MessageCard
          icon={AlertCircle}
          title="Error al cargar datos"
          description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
          tone="error"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4">
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tamaño Objetos</p>
              <p className="text-2xl font-bold text-indigo-600">{totalSizeGB.toFixed(2)} GB</p>
              <p className="text-xs text-muted-foreground">Espacio ocupado en S3</p>
            </div>
            <HardDrive className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total S3 Buckets</p>
              <p className="text-2xl font-bold text-green-600">{totalBuckets.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Buckets únicos detectados</p>
            </div>
            <Database className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total S3 Objetos</p>
              <p className="text-2xl font-bold text-blue-600">{totalObjects.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Archivos almacenados</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Top reutilizando componente independiente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopS3BucketsChart
          data={s3TopsInfo}
          metric="NumberOfObjects Average"
          title="Top Buckets por Número de Objetos"
        />

        <TopS3BucketsChart
          data={s3TopsInfo}
          metric="BucketSizeBytes Average"
          title="Top Buckets por Tamaño"
        />
      </div>

      {/* Gráficos de Tendencia - vertical */}
      <div className="grid grid-cols-1 gap-6">
        <TrendLineChart
          data={s3MetricsInfo}
          metric="NumberOfObjects Average"
          title="Tendencia Cantidad Objetos S3 Buckets"
          yAxisLabel="Objetos"
        />

        <TrendLineChart
          data={s3MetricsInfo}
          metric="BucketSizeBytes Average"
          title="Tendencia Tamaño S3 Buckets"
          yAxisLabel="Tamaño (GB)"
        />
      </div>
    </div>
  )
}
