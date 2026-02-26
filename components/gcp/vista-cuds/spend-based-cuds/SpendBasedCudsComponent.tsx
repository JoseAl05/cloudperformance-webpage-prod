'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ChartBar,
  Info,
  AlertCircle,
} from 'lucide-react'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'
import { FlexibleCudLineChartComponent } from './graficos/FlexibleCudLineChartComponent' 
import { SpendBasedCudsTable } from './table/SpendBasedCudsTable'
// Asumiendo que tienes un MessageCard como en el ejemplo
import { MessageCard } from '@/components/aws/cards/MessageCards'

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

interface ComponentDiscounted {
  key: string
  value: string
}

interface TableDetail {
  instance_name: string
  project_id: string
  region: string
  saved_amount_usd: number
  components_discounted: ComponentDiscounted[]
}

export interface ChartTrend {
  date: string
  commitment_fee_usd: number
  savings_generated_usd: number
  net_impact_usd: number
}

interface CardsKpis {
  cud_name: string
  hourly_commitment_usd: number
  total_commitment_cost_usd: number
  total_savings_generated_usd: number
  net_impact_usd: number
  utilization_percentage: number
  status: string
}

interface SpendBasedCudData {
  cards_kpis: CardsKpis
  chart_trend: ChartTrend[]
  table_details: TableDetail[]
  message?: string
}

interface SpendBasedCudsComponentProps {
  startDate: Date
  endDate: Date
}

/* ======================
   Component
====================== */

export const SpendBasedCudsComponent = ({ startDate, endDate }: SpendBasedCudsComponentProps) => {
  // Preparamos las fechas
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  // Llamada al endpoint
  const { data, isLoading, error } = useSWR<SpendBasedCudData>(
    `/api/gcp/bridge/gcp/cud/cud_flexible?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  // 1. Manejo de Estado de Carga (Responsivo y alineado al ejemplo)
  if (isLoading) {
    return <LoaderComponent />
  }

  // 2. Manejo de Errores
  if (error || !data) {
    return (
      <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
          <MessageCard
              icon={AlertCircle}
              title="Error al cargar datos"
              description="Hubo un problema cargando la información del CUD Flexible (Spend-Based). Intenta nuevamente."
              tone="error"
          />
      </div>
    )
  }

  // 3. Manejo de Datos Vacíos o Mensajes del Backend
  if (data.message || !data.cards_kpis) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
          <MessageCard
              icon={Info}
              title="Sin datos para mostrar"
              description={data.message || "No encontramos datos del CUD Flexible en el rango seleccionado."}
              tone="warn"
          />
      </div>
    )
  }

  // --- Extracción de Datos ---
  const { cards_kpis, chart_trend, table_details } = data
  const isProfitable = cards_kpis.status === 'Rentable'
  const totalSavingsPositive = Math.abs(cards_kpis.total_savings_generated_usd)

  return (
      // CLAVE DEL FIX: w-full min-w-0 px-4 py-6 (Exactamente igual que RecommenderComponent)
      // Eliminamos max-w-7xl o cualquier restricción de ancho máximo
      <div className="w-full min-w-0 px-4 py-6 space-y-6">
        
        {/* 1. HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <ChartBar className="h-7 w-7 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Análisis: Spend-Based CUDs</h1>
        </div>

        {/* 2. DIAGNÓSTICO INTELIGENTE */}
        <div className={`w-full p-4 rounded-xl border-l-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm ${
            isProfitable ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
          }`}>
            <div className={`p-2.5 rounded-full shrink-0 ${isProfitable ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              {isProfitable ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-base sm:text-lg font-bold ${isProfitable ? 'text-green-800' : 'text-orange-800'}`}>
                Estado: {cards_kpis.status} {/*({cards_kpis.utilization_percentage}% de uso)*/}
              </h3>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                {isProfitable 
                  ? `¡Excelente! Estás exprimiendo el valor de tu contrato. El ahorro total (${formatCurrency(totalSavingsPositive)}) supera el costo fijo del plan.` 
                  : `Atención: Pagaste ${formatCurrency(cards_kpis.total_commitment_cost_usd)} por el descuento, pero las máquinas solo lograron absorber ${formatCurrency(totalSavingsPositive)}. Tienes capacidad sobrante.`
                }
              </p>
            </div>
        </div>

        {/* 3. TARJETAS DE INDICADORES (KPIs) - GRID FLUIDA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">

          <Card className="border-l-4 border-l-purple-500 shadow-sm flex flex-col justify-between w-full">
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Compromiso</p>
                <Clock className="h-5 w-5 text-purple-500 opacity-80" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
                {formatCurrency(cards_kpis.hourly_commitment_usd)}
                <span className="text-xs sm:text-sm text-gray-500 font-normal ml-1">/hr</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm flex flex-col justify-between w-full">
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Costo Fijo Acumulado del CUD</p>
                <DollarSign className="h-5 w-5 text-blue-500 opacity-80" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
                {formatCurrency(cards_kpis.total_commitment_cost_usd)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-sm flex flex-col justify-between w-full">
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Ahorro (Cobertura)</p>
                <TrendingUp className="h-5 w-5 text-emerald-500 opacity-80" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 truncate">
                {formatCurrency(totalSavingsPositive)}
              </p>
            </CardContent>
          </Card>

          {/* <Card className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${isProfitable ? 'border-l-green-600' : 'border-l-red-500'}`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Impacto Neto</p>
                {isProfitable ? <PieChart className="h-5 w-5 text-green-600 opacity-80" /> : <XCircle className="h-5 w-5 text-red-500 opacity-80" />}
              </div>
              <p className={`text-2xl sm:text-3xl font-bold truncate ${isProfitable ? 'text-green-700' : 'text-red-600'}`}>
                {isProfitable ? '+' : '-'}{formatCurrency(Math.abs(cards_kpis.net_impact_usd))}
              </p>
            </CardContent>
          </Card> */}
          <Card
            className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${
              isProfitable ? 'border-l-green-600' : 'border-l-red-500'
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Impacto Neto
                </p>
                {isProfitable ? (
                  <PieChart className="h-5 w-5 text-green-600 opacity-80" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 opacity-80" />
                )}
              </div>

              <p
                className={`text-2xl sm:text-3xl font-bold truncate ${
                  isProfitable ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {isProfitable ? '+' : '-'}
                {formatCurrency(Math.abs(cards_kpis.net_impact_usd))}
              </p>

              {/* 👇 TEXTO CON ICONO lucide */}
              <div
                className={`mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium ${
                  isProfitable ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {isProfitable ? (
                  <>
                    <TrendingDown className="h-4 w-4" />
                    <span>
                      Te has ahorrado{" "}
                      {formatCurrency(Math.abs(cards_kpis.net_impact_usd))} en este período
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      Has pagado{" "}
                      {formatCurrency(Math.abs(cards_kpis.net_impact_usd))} de más en este período
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. GRÁFICO DE TENDENCIA */}
        <div className="w-full">
          <FlexibleCudLineChartComponent data={chart_trend} />
        </div>

        {/* 5. TABLA DE DETALLES */}
        <div className="w-full">
          <SpendBasedCudsTable 
              data={table_details} 
              startDate={startDate} 
              endDate={endDate} 
          />
        </div>

      </div>
    )
  }