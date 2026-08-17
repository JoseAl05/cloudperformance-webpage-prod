'use client'

import React, { useMemo } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Database, Package, HardDrive, AlertCircle, Layers } from 'lucide-react'
import { TopS3BucketsChart } from '@/components/aws/vista-funciones/top-s3-buckets/grafico/TopS3BucketsChart'
import { TrendLineChart } from '@/components/aws/vista-funciones/top-s3-buckets/grafico/TrendLineChart'
import { S3StorageTypeChart } from '@/components/aws/vista-funciones/top-s3-buckets/grafico/S3StorageTypeChart'
import { S3VersioningTableComponent } from '@/components/aws/vista-funciones/top-s3-buckets/table/S3VersioningTableComponent'
import { S3LifecycleTableComponent } from '@/components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleTableComponent'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { S3MetricItem, S3VersioningItem, S3LifecycleItem } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces'

interface S3InfoItem {
  total_size_gb?: number
  total_objects?: number
  total_buckets?: number
  [key: string]: unknown
}

interface TopS3BucketsProps {
  startDate: Date
  endDate: Date
  region?: string
  buckets?: string 
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())

export const TopS3BucketsComponent = ({
  startDate,
  endDate,
  region,
  buckets,
}: TopS3BucketsProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  const hasSelectedBucket = Boolean(buckets && buckets.trim() !== '')

  const s3Info = useSWR<S3InfoItem[]>(
    hasSelectedBucket
      ? `/api/aws/bridge/s3/top_s3_buckets/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region || ''}&resources=${buckets}`
      : null,
    fetcher
  )

  const s3Tops = useSWR<S3MetricItem[]>(
    hasSelectedBucket
      ? `/api/aws/bridge/s3/top_s3_buckets/tops?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region || ''}&resources=${buckets}`
      : null,
    fetcher
  )

  const s3Metrics = useSWR<S3MetricItem[]>(
    hasSelectedBucket
      ? `/api/aws/bridge/s3/top_s3_buckets/metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region || ''}&resources=${buckets}`
      : null,
    fetcher
  )

  const s3Versioning = useSWR<S3VersioningItem[]>(
    hasSelectedBucket
      ? `/api/aws/bridge/s3/top_s3_buckets/versioning?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region || ''}&resources=${buckets}`
      : null,
    fetcher
  )

  const s3Lifecycle = useSWR<S3LifecycleItem[]>(
    hasSelectedBucket
      ? `/api/aws/bridge/s3/top_s3_buckets/lifecycle?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region || ''}&resources=${buckets}`
      : null,
    fetcher
  )

  const anyLoading =
    s3Info.isLoading ||
    s3Tops.isLoading ||
    s3Metrics.isLoading ||
    s3Versioning.isLoading ||
    s3Lifecycle.isLoading

  const anyError =
    !!s3Info.error ||
    !!s3Tops.error ||
    !!s3Metrics.error ||
    !!s3Versioning.error ||
    !!s3Lifecycle.error

  const totalSizeGB = s3Info.data?.[0]?.total_size_gb ?? 0
  const totalObjects = s3Info.data?.[0]?.total_objects ?? 0
  const totalBuckets = s3Info.data?.[0]?.total_buckets ?? 0

  const s3TopsInfo = Array.isArray(s3Tops.data) ? s3Tops.data : []
  const s3MetricsInfo = Array.isArray(s3Metrics.data) ? s3Metrics.data : []
  const s3VersioningInfo = Array.isArray(s3Versioning.data) ? s3Versioning.data : []
  const s3LifecycleInfo = Array.isArray(s3Lifecycle.data) ? s3Lifecycle.data : []

  const storageTypes = useMemo(() => {
    const unique = new Set<string>()
    s3TopsInfo.forEach(item => {
      if (typeof item.storage_type === 'string' && item.storage_type !== '') unique.add(item.storage_type)
    })
    return Array.from(unique).sort()
  }, [s3TopsInfo])

  const hasStorageType = storageTypes.length > 0

  if (anyLoading) {
    return <LoaderComponent />
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
      {hasSelectedBucket ? (
        <div className="space-y-8">
          <div className={`grid grid-cols-1 gap-6 ${hasStorageType ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'}`}>
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

            {hasStorageType && (
              <Card className="border-l-4 border-l-amber-500 shadow-lg rounded-2xl">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clases de Almacenamiento</p>
                    <p className="text-2xl font-bold text-amber-600">{storageTypes.length.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Tipos detectados en el rango</p>
                  </div>
                  <Layers className="h-8 w-8 text-amber-500" />
                </CardContent>
              </Card>
            )}
          </div>

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

          {hasStorageType && (
            <div className="grid grid-cols-1 gap-6">
              <S3StorageTypeChart
                data={s3TopsInfo}
                metric="BucketSizeBytes Average"
                title="Top Buckets por Clase de Almacenamiento"
              />
            </div>
          )}

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

          <S3VersioningTableComponent data={s3VersioningInfo} />

          <S3LifecycleTableComponent data={s3LifecycleInfo} />
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-slate-500 font-medium">
            Selecciona un bucket en el filtro superior para visualizar las métricas y gráficos.
          </p>
        </div>
      )}
    </div>
  )
}