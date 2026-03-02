'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import {
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutGrid,
  Info,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { ReservationsTable } from './table/ReservationsTable'
import { ReservationsBarChartComponent } from './graficos/ReservationsBarChartComponent'

/* ======================
   Utils & Formatters
====================== */

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.json())

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/* ======================
   Types
====================== */

export interface ReservationData {
  nombre_reserva: string
  zona: string
  tipo_maquina: string
  cantidad_vms: number
  estado: string
  horas_inactivas: number
  dinero_perdido_usd: number
}

interface ReservationsComponentProps {
  startDate: Date
  endDate: Date
}

/* ======================
   Component
====================== */

export const ReservationsAnalysisComponent = ({ startDate, endDate }: ReservationsComponentProps) => {
  // Preparamos las fechas
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  // Llamada al endpoint
  const { data, isLoading, error } = useSWR<unknown>(
    `/api/gcp/bridge/gcp/vista/reservas?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  // 1. Manejo de Carga
  if (isLoading) {
    return <LoaderComponent />
  }

  // 2. Manejo de Errores de Red
  if (error || !data) {
    return (
      <div className="w-full min-w-0 px-4 py-10">
        <MessageCard
          icon={AlertCircle}
          title="Error al cargar datos"
          description="Hubo un problema de conexión. Intenta nuevamente."
          tone="error"
        />
      </div>
    )
  }

  // ==========================================
  // 3. ADAPTACIÓN AL FORMATO DEL ENDPOINT 
  // ==========================================

// DATA FICTICIA PARA FORZAR LOS GRÁFICOS
  // const MOCK_DATA: ReservationData[] = [
  //   {
  //     nombre_reserva: "cpinfra-reservation-1",
  //     zona: "us-central1-c",
  //     tipo_maquina: "e2-micro",
  //     cantidad_vms: 1,
  //     estado: "READY",
  //     horas_inactivas: 90.0,
  //     dinero_perdido_usd: 0.0
  //   },
  //   {
  //     nombre_reserva: "database-prod-res",
  //     zona: "us-east1-b",
  //     tipo_maquina: "n2-standard-16",
  //     cantidad_vms: 2,
  //     estado: "READY",
  //     horas_inactivas: 144.5,
  //     dinero_perdido_usd: 520.80
  //   },
  //   {
  //     nombre_reserva: "ml-model-training",
  //     zona: "us-central1-a",
  //     tipo_maquina: "a2-highgpu-1g",
  //     cantidad_vms: 1,
  //     estado: "READY",
  //     horas_inactivas: 24.0,
  //     dinero_perdido_usd: 85.50
  //   },
  //   {
  //     nombre_reserva: "k8s-cluster-nodes",
  //     zona: "southamerica-east1-a",
  //     tipo_maquina: "e2-standard-4",
  //     cantidad_vms: 5,
  //     estado: "READY",
  //     horas_inactivas: 310.0,
  //     dinero_perdido_usd: 210.25
  //   },
  //   {
  //     nombre_reserva: "qa-env-forgotten",
  //     zona: "us-west1-b",
  //     tipo_maquina: "c2-standard-8",
  //     cantidad_vms: 1,
  //     estado: "READY",
  //     horas_inactivas: 500.0,
  //     dinero_perdido_usd: 150.00
  //   }
  // ];

  // let reservasArray: ReservationData[] = MOCK_DATA; 

  let reservasArray: ReservationData[] = [];

  if (Array.isArray(data)) {
    // Escenario Ideal: El endpoint devolvió la lista directamente
    reservasArray = data;
  } else if (typeof data === 'object') {
    // Escenario Alternativo: Viene envuelto (ej. { data: [...] } ) o es un mensaje de error
    reservasArray = data.data || data.items || data.results || [];
    
    // Si sigue vacío y detectamos un error de FastAPI (detail/message)
    if (reservasArray.length === 0 && (data.detail || data.message)) {
      const errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail || data.message);
      return (
        <div className="w-full min-w-0 px-4 py-6">
          <MessageCard
            icon={AlertCircle}
            title="Aviso del Servidor"
            description={`El endpoint respondió con: ${errorMsg}`}
            tone="warn"
          />
        </div>
      )
    }
  }

  // 4. Validación de datos vacíos (Sin reservas)
  if (reservasArray.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <MessageCard
          icon={Info}
          title="Sin reservas activas"
          description="No detectamos reservas configuradas en este rango de fechas."
          tone="info"
        />
      </div>
    )
  }

  // ==========================================
  // 5. CÁLCULO DE KPIs (A prueba de fallos)
  // ==========================================
  // Ahora usamos 'reservasArray', garantizando que SIEMPRE es una lista
  const totalReservas = reservasArray.length
  const totalVMs = reservasArray.reduce((sum, item) => sum + (item.cantidad_vms || 0), 0)
  const totalHorasInactivas = reservasArray.reduce((sum, item) => sum + (item.horas_inactivas || 0), 0)
  const totalDineroPerdido = reservasArray.reduce((sum, item) => sum + (item.dinero_perdido_usd || 0), 0)

  // Lógica de estado
  const isPerfect = totalDineroPerdido === 0 && totalHorasInactivas === 0
  const isProfitable = totalDineroPerdido === 0 

  return (
    <div className="w-full min-w-0 px-4 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Server className="h-7 w-7 text-indigo-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Análisis: Reservas de Capacidad</h1>
      </div>

      {/* DIAGNÓSTICO INTELIGENTE */}
      <div className={`w-full p-4 rounded-xl border-l-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm ${
        isPerfect ? 'bg-green-50 border-green-500' : isProfitable ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'
      }`}>
        <div className={`p-2.5 rounded-full shrink-0 ${
          isPerfect ? 'bg-green-100 text-green-600' : isProfitable ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
        }`}>
          {isProfitable ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <h3 className={`text-base sm:text-lg font-bold ${
            isPerfect ? 'text-green-800' : isProfitable ? 'text-yellow-800' : 'text-red-800'
          }`}>
            Estado: {isPerfect ? 'Óptimo' : isProfitable ? 'Con inactividad (Sin impacto)' : 'Crítico (Fuga de capital)'}
          </h3>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            {isPerfect 
              ? `Tus reservas están siendo utilizadas al 100%.` 
              : isProfitable
                ? `Tienes hardware apartado que no estás usando (${totalHorasInactivas} horas vacías), pero gracias al tipo de máquina, no te está generando cobros extra.`
                : `Atención: La inactividad ya te ha costado ${formatCurrency(totalDineroPerdido)} en el periodo seleccionado.`
            }
          </p>
        </div>
      </div>

      {/* TARJETAS DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Tarjeta 1 */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm flex flex-col justify-between w-full">
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Reservas Activas</p>
              <LayoutGrid className="h-5 w-5 text-indigo-500 opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
              {totalReservas} <span className="text-xs sm:text-sm text-gray-500 font-normal ml-1">zonas</span>
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 2 */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm flex flex-col justify-between w-full">
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Capacidad Apartada</p>
              <Cpu className="h-5 w-5 text-blue-500 opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
              {totalVMs} <span className="text-xs sm:text-sm text-gray-500 font-normal ml-1">VMs</span>
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 3 */}
        <Card className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${totalHorasInactivas > 0 ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Horas Inactivas</p>
              <Clock className={`h-5 w-5 opacity-80 ${totalHorasInactivas > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold truncate ${totalHorasInactivas > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {totalHorasInactivas} <span className="text-xs sm:text-sm font-normal">hrs</span>
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 4 */}
        <Card className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${isProfitable ? 'border-l-green-600' : 'border-l-red-500'}`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Dinero Perdido</p>
              {isProfitable ? <CheckCircle2 className="h-5 w-5 text-green-600 opacity-80" /> : <XCircle className="h-5 w-5 text-red-500 opacity-80" />}
            </div>
            <p className={`text-2xl sm:text-3xl font-bold truncate ${isProfitable ? 'text-green-700' : 'text-red-600'}`}>
              {formatCurrency(totalDineroPerdido)}
            </p>
            <div className={`mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium ${isProfitable ? 'text-green-600' : 'text-red-500'}`}>
              {isProfitable ? <><TrendingDown className="h-4 w-4" /><span>Sin penalizaciones</span></> : <><TrendingUp className="h-4 w-4" /><span>Costos por recursos ociosos</span></>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICO DE ECHARTS */}
      <div className="w-full">
         <ReservationsBarChartComponent data={reservasArray} />
      </div>

      {/* TABLA DE DETALLES */}
      <div className="w-full">
        {/* Le pasamos reservasArray, garantizando que la tabla nunca se rompa */}
        <ReservationsTable data={reservasArray} />
      </div>

    </div>
  )
}