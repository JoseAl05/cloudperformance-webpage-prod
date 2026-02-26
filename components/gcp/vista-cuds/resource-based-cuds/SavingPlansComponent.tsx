'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  TrendingUp,
  AlertTriangle,
  Cpu,
  MemoryStick,
  MapPin,
  Calendar,
  DollarSign,
  Server,
  PieChart,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'

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
    minimumFractionDigits: 2
  }).format(amount)
}

/* ======================
   Types
====================== */

interface CommitmentResource {
  type_: 'VCPU' | 'MEMORY'
  amount: string
}

interface CoveredInstance {
  vm_name: string
  total_saved_usd: number
}

interface GcpCommitment {
  commitment_id: string
  commitment_name: string
  status: string
  plan_type: string
  region: string
  project_id: string
  start_timestamp: string
  end_timestamp: string
  resources: CommitmentResource[]
  billing_period_cost: number
  covered_instances: CoveredInstance[]
  currency: string
}

interface Props {
  startDate: Date
  endDate: Date
}

/* ======================
   Component
====================== */

export const GcpCommitmentsViewComponent = ({ startDate, endDate }: Props) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  const { data: commitments, isLoading, error } = useSWR<GcpCommitment[]>(
    `/api/gcp/bridge/gcp/vista/savings_plans?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (commitments && commitments.length > 0 && !selectedId) {
      setSelectedId(commitments[0].commitment_id)
    }
  }, [commitments, selectedId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12 h-64">
        <LoaderComponent size="large" />
      </div>
    )
  }

  if (error || !commitments) return (
    <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
      <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
      <p>Hubo un problema cargando la información financiera.</p>
    </div>
  )

  // --- Lógica de Negocio ---
  const selected = commitments.find(c => c.commitment_id === selectedId) || commitments[0]

  const cost = selected?.billing_period_cost || 0
  const totalSavings = Math.abs(
    selected?.covered_instances?.reduce((acc, curr) => acc + curr.total_saved_usd, 0) || 0
  )
  const netResult = totalSavings - cost
  const isProfitable = netResult >= 0

  const vcpu = selected?.resources?.find(r => r.type_ === 'VCPU')?.amount ?? '0'
  const memoryMb = selected?.resources?.find(r => r.type_ === 'MEMORY')?.amount ?? '0'

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      
      {/* 1. Header con Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Análisis de Planes de Ahorro</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Revisa si tus contratos de descuento están generando valor real.
            </p>
         </div>

         {commitments.length > 1 && (
           <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
             <span className="text-xs font-semibold text-gray-500 uppercase">Viendo Plan:</span>
             <select 
                className="bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
                value={selectedId || ''}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {commitments.map(c => (
                  <option key={c.commitment_id} value={c.commitment_id}>
                    {c.commitment_name} ({c.region})
                  </option>
                ))}
              </select>
           </div>
         )}
      </div>

      {/* 2. DIAGNÓSTICO INTELIGENTE (Nuevo) */}
      <div className={`p-4 rounded-xl border-l-4 flex items-start gap-4 shadow-sm ${
          isProfitable ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
        }`}>
          <div className={`p-2 rounded-full ${isProfitable ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            {isProfitable ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isProfitable ? 'text-green-800' : 'text-orange-800'}`}>
              {isProfitable ? 'Conclusión: Este plan es rentable' : 'Atención: Estás perdiendo dinero'}
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              {isProfitable 
                ? `¡Excelente! El descuento que obtienes (${formatCurrency(totalSavings)}) es mayor a lo que pagas por el plan. Estás ahorrando dinero real.` 
                : `Cuidado. Estás pagando ${formatCurrency(cost)} por el plan, pero solo estás usando ${formatCurrency(totalSavings)} en descuentos. Revisa si tus máquinas están encendidas.`
              }
            </p>
          </div>
      </div>

      {/* 3. TARJETAS DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Costo */}
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Costo del Plan</p>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(cost)}</p>
            <div className="mt-3 text-xs p-2 bg-blue-50 text-blue-700 rounded-md">
              Lo que le pagas a GCP.
            </div>
          </CardContent>
        </Card>

        {/* Ahorro */}
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Descuento Obtenido</p>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalSavings)}</p>
            <div className="mt-3 text-xs p-2 bg-emerald-50 text-emerald-700 rounded-md">
              Lo que te descontaron de la factura.
            </div>
          </CardContent>
        </Card>

        {/* Resultado Neto */}
        <Card className={`border-l-4 shadow-md hover:shadow-lg transition-shadow ${isProfitable ? 'border-l-green-600' : 'border-l-red-500'}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Balance Final</p>
              {isProfitable ? <PieChart className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-500" />}
            </div>
            <p className={`text-3xl font-bold ${isProfitable ? 'text-green-700' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{formatCurrency(netResult)}
            </p>
            <div className={`mt-3 text-xs p-2 rounded-md ${isProfitable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isProfitable ? 'Dinero real ahorrado.' : 'Dinero perdido.'}
            </div>
          </CardContent>
        </Card>

        {/* Estado */}
        <Card className="border-l-4 border-l-gray-400 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Vigencia</p>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-xl font-bold text-gray-700 truncate">{selected?.status ?? 'N/A'}</p>
            <div className="mt-3 text-xs p-2 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
               <Info className="h-3 w-3" /> Vence: {selected?.end_timestamp?.split('T')[0]}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. DETALLES DIVIDIDOS (Explicativos) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Panel Izquierdo: Qué contraté */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">1</div>
            <h3 className="text-lg font-bold text-gray-800">¿Qué incluye este plan?</h3>
          </div>
          
          <Card className="rounded-2xl border shadow-sm">
             <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-purple-50 rounded-xl">
                      <Cpu className="text-purple-600 h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Capacidad de Procesamiento</p>
                      <p className="text-lg font-bold text-gray-900">{vcpu} vCPU</p>
                      <p className="text-xs text-gray-400">Potencia reservada para tus servidores.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="p-3 bg-indigo-50 rounded-xl">
                      <MemoryStick className="text-indigo-600 h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Memoria RAM</p>
                      <p className="text-lg font-bold text-gray-900">{(Number(memoryMb) / 1024).toFixed(1)} GB</p>
                      <p className="text-xs text-gray-400">Memoria reservada.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="p-3 bg-cyan-50 rounded-xl">
                      <MapPin className="text-cyan-600 h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Ubicación</p>
                      <p className="text-lg font-bold text-gray-900">{selected?.region}</p>
                      <p className="text-xs text-gray-400">Solo aplica a máquinas en esta región.</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Panel Derecho: Quién lo usa */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">2</div>
            <h3 className="text-lg font-bold text-gray-800">¿Quién está usando el descuento?</h3>
          </div>

          <Card className="rounded-2xl border shadow-sm h-full overflow-hidden">
             <CardContent className="p-0">
                {selected?.covered_instances && selected.covered_instances.length > 0 ? (
                   <div>
                      <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-500 uppercase">Nombre de la Máquina (Instancia)</span>
                         <span className="text-xs font-bold text-gray-500 uppercase">Ahorro Generado</span>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[400px] overflow-auto">
                        {selected.covered_instances.map((vm, idx) => (
                           <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-green-100 rounded-lg">
                                    <Server className="h-4 w-4 text-green-700" />
                                 </div>
                                 <div>
                                    <p className="font-semibold text-gray-800 text-sm">{vm.vm_name.split('/').pop()}</p>
                                    <p className="text-xs text-gray-400">Instancia activa</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-green-600">{formatCurrency(Math.abs(vm.total_saved_usd))}</p>
                                 <p className="text-xs text-green-600/70">ahorrado</p>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                ) : (
                   <div className="flex flex-col items-center justify-center h-64 p-8 text-center bg-gray-50/50">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <AlertTriangle className="h-8 w-8 text-orange-400" />
                      </div>
                      <h4 className="font-bold text-gray-800">No hay máquinas usando este plan</h4>
                      <p className="text-sm text-gray-500 max-w-sm mt-2">
                        Actualmente ninguna instancia cumple con los requisitos (Región {selected?.region} y Familia adecuada) para recibir este descuento.
                      </p>
                   </div>
                )}
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}