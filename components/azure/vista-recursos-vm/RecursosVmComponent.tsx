'use client'
import useSWR from 'swr'
import React from "react"
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Hash, Tag, Clock, FolderTree, Cloud } from 'lucide-react'
import { VmCpuUsageComponent, VmMemoryUsageComponent, VmDiskUsageComponent } from '@/components/azure/vista-recursos-vm/graficos/VmMetricChartsComponent'
import { VmDeploymentsChartComponent } from '@/components/azure/vista-recursos-vm/graficos/VmDeploymetsChartComponent'
import { VmDeploymentsTableComponent } from '@/components/azure/vista-recursos-vm/table/VmDeploymentsTableComponent'
import { VmBillingChartComponent } from '@/components/azure/vista-recursos-vm/graficos/VmBillingChartComponent'
import { VmMeasuresChartComponent } from '@/components/azure/vista-recursos-vm/graficos/VmMeasuresChartComponent'
import { VmBillingPropertiesComponent } from '@/components/azure/vista-recursos-vm/graficos/VmBillingPropertiesComponent'

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

interface RecursosVmProps {
  startDate: Date;
  endDate: Date;
  selectedVm: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

export const RecursosVmComponent = ({ startDate, endDate, selectedVm }: RecursosVmProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/recursos/vm/propiedades?date_from=${startDateFormatted}&date_to=${endDateFormatted}&vm_id=${selectedVm}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  if (isLoading) return <LoaderComponent />
  if (error) return <div className="text-red-500 p-4">Error al cargar datos de la VM</div>
  if (!data || data.length === 0) return <div className="p-4">No hay datos disponibles</div>

  const vmData = data?.[0] ?? {};

  return (
    <div className="w-full min-w-0 px-4 py-6 space-y-6">
      {/* ========== HEADER CON NOMBRE DE VM ========== */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <Cloud className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {vmData.nombre_vm}
            </h1>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Última modificación: {vmData.ultima_modificacion}
            </p>
          </div>
        </div>
      </div>

      {/* ========== SECCIÓN: PROPIEDADES DEL RECURSO ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-blue-500">
          Propiedades del Recurso
        </h2>
        
        <div className="space-y-4">
          {/* Grid compacto - Fila 1: 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ubicación */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Ubicación</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{vmData.ubicacion}</p>
                  </div>
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Fecha de Creación */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Fecha Creación</p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      {new Date(vmData.fecha_creacion).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Edad del Recurso */}
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Edad Recurso (días)</p>
                    <p className="text-lg font-bold text-purple-600 mt-1">{vmData.edad_recurso_dias}</p>
                  </div>
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            {/* Grupo de Recursos */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Grupo de Recursos</p>
                    <p className="text-lg font-bold text-orange-600 mt-1">{vmData.grupo_recursos}</p>
                  </div>
                  <FolderTree className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ID de Suscripción - Ancho completo */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">ID de Suscripción</p>
                  <p className="text-sm font-bold text-cyan-600 font-mono mt-1 break-all">
                    {vmData.id_suscripcion}
                  </p>
                </div>
                <Hash className="h-6 w-6 text-cyan-500 flex-shrink-0 ml-4" />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {vmData.tags && Object.keys(vmData.tags).length > 0 && (
            <Card className="border-l-4 border-l-pink-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-pink-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(vmData.tags).map(([key, value]) => (
                        <div key={key} className="bg-pink-50 dark:bg-pink-950 px-3 py-2 rounded border border-pink-200 dark:border-pink-800">
                          <span className="text-xs text-muted-foreground font-medium">{key}: </span>
                          <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ========== SECCIÓN: MÉTRICAS DE CONSUMO ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-green-500">
          Métricas de Consumo
        </h2>
        <div className="space-y-4">
          {/* Primera fila: CPU y Memoria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <VmCpuUsageComponent
              startDate={startDate}
              endDate={endDate}
              vmName={selectedVm}
            />
            <VmMemoryUsageComponent
              startDate={startDate}
              endDate={endDate}
              vmName={selectedVm}
            />
          </div>
          {/* Segunda fila: Disco solo */}
          <div>
            <VmDiskUsageComponent
              startDate={startDate}
              endDate={endDate}
              vmName={selectedVm}
            />
          </div>
        </div>
      </section>



      {/* ========== SECCIÓN: DEPLOYMENTS ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-purple-500">
          Historial de Deployments
        </h2>
        <div className="space-y-4">
          <VmDeploymentsChartComponent
            startDate={startDate}
            endDate={endDate}
            vmName={selectedVm}
          />
          <VmDeploymentsTableComponent
            startDate={startDate}
            endDate={endDate}
            vmName={selectedVm}
          />
        </div>
      </section>

      {/* ========== SECCIÓN: FACTURACIÓN Y COSTOS ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-amber-500">
          Facturación Recursos Costo Acumulado Pago por Uso y Costo Acumulado Fijo
        </h2>
        <VmBillingChartComponent 
          startDate={startDate}
          endDate={endDate}
          instanceName={selectedVm}
        />
      </section>

      {/* ========== SECCIÓN: MEDIDAS COSTOS NO CUANTIFICABLES ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-indigo-500">
          Medidas Costos No Cuantificables
        </h2>
        <VmMeasuresChartComponent 
          startDate={startDate}
          endDate={endDate}
          instanceName={selectedVm}
        />
      </section>

      {/* ========== SECCIÓN: PROPIEDADES DE FACTURACIÓN ========== */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-cyan-500">
          Propiedades de Facturación
        </h2>
        <VmBillingPropertiesComponent 
          startDate={startDate}
          endDate={endDate}
          instanceName={selectedVm}
        />
      </section>
    </div>
  )
}