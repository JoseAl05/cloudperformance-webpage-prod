"use client"

import { useState, type ReactNode } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  TrendingDown,
  TrendingUp,
  Equal,
  Activity,
  AlertTriangle,
  Gauge,
  Cpu,
  Clock,
  CircleDollarSign,
  Info,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  CloudProvider,
  InterCloudVm,
  VmMatch,
} from "./InterCloudVmCardsComponent"

const CLOUD_META: Record<
  CloudProvider,
  { label: string; dot: string; bg: string; border: string; text: string }
> = {
  AWS: {
    label: "AWS",
    dot: "#FF9900",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  Azure: {
    label: "Azure",
    dot: "#0078D4",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  GCP: {
    label: "GCP",
    dot: "#4285F4",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
  },
}

const CLOUD_FIELD_MAP: Record<CloudProvider, keyof InterCloudVm> = {
  AWS: "aws_vms_match",
  Azure: "azure_vms_match",
  GCP: "gcp_vms_match",
}

const PROVIDER_ORDER: CloudProvider[] = ["AWS", "Azure", "GCP"]

type CommitmentTerm = "on_demand" | "1y" | "3y"

const COMMITMENT_DISCOUNTS: Record<
  CloudProvider,
  Record<Exclude<CommitmentTerm, "on_demand">, number>
> = {
  AWS: { "1y": 0.28, "3y": 0.52 },
  Azure: { "1y": 0.36, "3y": 0.62 },
  GCP: { "1y": 0.37, "3y": 0.55 },
}

const COMMITMENT_LABELS: Record<CommitmentTerm, string> = {
  on_demand: "On-demand",
  "1y": "1 año reservado",
  "3y": "3 años reservado",
}

const COMMITMENT_SHORT_LABELS: Record<CommitmentTerm, string> = {
  on_demand: "On-demand",
  "1y": "1 año",
  "3y": "3 años",
}

const applyCommitment = (
  amount: number | null,
  provider: CloudProvider,
  term: CommitmentTerm
): number | null => {
  if (amount === null || amount === undefined) return null
  if (term === "on_demand") return amount
  const discount = COMMITMENT_DISCOUNTS[provider][term]
  return amount * (1 - discount)
}

const computeProjectedCost = (
  match: VmMatch,
  provider: CloudProvider,
  term: CommitmentTerm
): number | null => applyCommitment(match.projected_cost_30d, provider, term)

const computeSavingsVsActual = (
  match: VmMatch,
  vm: InterCloudVm,
  provider: CloudProvider,
  term: CommitmentTerm
): number | null => {
  if (term === "on_demand") return match.savings_vs_actual_30d
  const projected = computeProjectedCost(match, provider, term)
  if (projected === null || vm.actual_vm_cost_30d === null) return null
  return vm.actual_vm_cost_30d - projected
}

const computeSavingsVsOnDemand = (
  match: VmMatch,
  vm: InterCloudVm,
  provider: CloudProvider,
  term: CommitmentTerm
): { amount: number | null; pct: number | null } => {
  if (term === "on_demand") {
    return {
      amount: match.savings_vs_on_demand_30d,
      pct: match.savings_pct_vs_on_demand,
    }
  }
  const projected = computeProjectedCost(match, provider, term)
  if (projected === null || vm.on_demand_equivalent_cost_30d === null) {
    return { amount: null, pct: null }
  }
  const amount = vm.on_demand_equivalent_cost_30d - projected
  const pct =
    vm.on_demand_equivalent_cost_30d > 0
      ? (amount / vm.on_demand_equivalent_cost_30d) * 100
      : null
  return { amount, pct }
}

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const formatSignedMoney = (value: number): string => {
  const formatted = formatMoney(Math.abs(value))
  if (value > 0) return `−${formatted}`
  if (value < 0) return `+${formatted}`
  return formatted
}

const formatHours = (value: number): string =>
  new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)

const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`

type ConfidenceLevel = VmMatch["confidence"]

const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { label: string; classes: string; description: string }
> = {
  high: {
    label: "Alta",
    classes: "border-emerald-300 bg-emerald-50 text-emerald-700",
    description:
      "El uso de CPU se mantuvo bajo el 80%. La instancia destino debería absorber el workload sin problemas.",
  },
  medium: {
    label: "Media",
    classes: "border-amber-300 bg-amber-50 text-amber-700",
    description:
      "El uso de CPU estuvo entre 80% y 95%, o el origen es burstable y agotó créditos contra un destino también burstable. Migración viable, pero con menos margen.",
  },
  low: {
    label: "Baja",
    classes: "border-red-300 bg-red-50 text-red-700",
    description:
      "El uso de CPU superó el 95%. El workload está al límite y un equivalente directo podría experimentar throttling.",
  },
  unknown: {
    label: "Sin datos",
    classes: "border-slate-300 bg-slate-50 text-slate-500",
    description:
      "No hay métricas suficientes para evaluar la confianza de esta recomendación.",
  },
}

type ProjectionStatus = InterCloudVm["projection_status"]

const STATUS_META: Record<
  ProjectionStatus,
  { label: string; description: string; tone: "ok" | "warning" | "error" }
> = {
  ok: {
    label: "Datos completos",
    description: "Hay datos de facturación y métricas para los últimos 30 días.",
    tone: "ok",
  },
  missing_billing: {
    label: "Sin facturación",
    description:
      "No hay datos de facturación en el período. Las proyecciones de costo no están disponibles.",
    tone: "error",
  },
  missing_metrics: {
    label: "Sin métricas",
    description:
      "No hay métricas de CloudWatch en el período. Las proyecciones se calcularon sobre los datos de facturación, pero la confianza es desconocida.",
    tone: "warning",
  },
  missing_both: {
    label: "Sin datos",
    description:
      "No hay datos de facturación ni métricas en el período. No se pueden calcular proyecciones.",
    tone: "error",
  },
  error: {
    label: "Error",
    description: "Ocurrió un error al calcular la proyección para esta instancia.",
    tone: "error",
  },
}

const STATUS_TONE_CLASSES: Record<"ok" | "warning" | "error", string> = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
}

const InfoHint = ({
  children,
  side = "top",
}: {
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="ml-1 inline h-3 w-3 cursor-help text-slate-400 align-middle" />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <div className="text-xs leading-relaxed">{children}</div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const ConfidenceBadge = ({ match }: { match: VmMatch }) => {
  const meta = CONFIDENCE_META[match.confidence] ?? CONFIDENCE_META.unknown
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "h-5 gap-1 cursor-help font-medium text-[10px]",
              meta.classes
            )}
          >
            <Gauge className="h-3 w-3" />
            {meta.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">{meta.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SavingsCell = ({
  amount,
  percent,
}: {
  amount: number | null
  percent?: number | null
}) => {
  if (amount === null || amount === undefined) {
    return <span className="text-[10px] text-slate-400">—</span>
  }

  const isSaving = amount > 0
  const isLoss = amount < 0

  if (!isSaving && !isLoss) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
        <Equal className="h-3 w-3" />
        Igual
      </span>
    )
  }

  const Icon = isSaving ? TrendingDown : TrendingUp
  const colorClass = isSaving ? "text-emerald-700" : "text-red-600"

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={cn(
          "inline-flex items-center gap-1 font-mono text-xs font-semibold tabular-nums",
          colorClass
        )}
      >
        <Icon className="h-3 w-3" />
        {formatSignedMoney(-amount)}
      </span>
      {percent !== null && percent !== undefined && (
        <span className={cn("text-[10px] tabular-nums", colorClass)}>
          {formatPercent(-percent)}
        </span>
      )}
    </div>
  )
}

const ProjectionContextStrip = ({ vm }: { vm: InterCloudVm }) => {
  const status = STATUS_META[vm.projection_status] ?? STATUS_META.error
  const completeness =
    vm.billing_days_with_data > 0
      ? `${vm.billing_days_with_data}/30 días`
      : "Sin datos"
  const partialData =
    vm.billing_days_with_data > 0 && vm.billing_days_with_data < 28

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          <Clock className="h-3 w-3" />
          Horas facturadas (30d)
          <InfoHint>
            <p className="mb-1 font-semibold">Horas facturadas reales</p>
            <p>
              Suma de horas-instancia facturadas por la nube origen durante los
              últimos 30 días, según los registros de Cost Explorer. Refleja
              uso real (incluye apagados, reinicios, scaling). Es el eje
              temporal sobre el que se calculan todas las proyecciones.
            </p>
          </InfoHint>
        </div>
        <p
          className={cn(
            "font-mono text-sm font-bold tabular-nums",
            partialData ? "text-amber-700" : "text-slate-900"
          )}
        >
          {vm.billed_hours_30d !== null ? formatHours(vm.billed_hours_30d) : "—"}
        </p>
        <p className="text-[10px] text-slate-500">
          {completeness}
          <InfoHint>
            <p>
              Días dentro de la ventana de 30 días que tienen registros de
              facturación. Si es menor a 28, las proyecciones podrían estar
              subestimadas por brechas en los datos sincronizados.
            </p>
          </InfoHint>
        </p>
      </div>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          <CircleDollarSign className="h-3 w-3" />
          Costo real (30d)
          <InfoHint>
            <p className="mb-1 font-semibold">Costo real facturado</p>
            <p>
              Lo que efectivamente se pagó a la nube origen por esta instancia
              en los últimos 30 días (campo <code>netamortizedcost</code>).
              Incluye descuentos por reservas, Savings Plans o CUDs si los hay.
            </p>
          </InfoHint>
        </div>
        <p className="font-mono text-sm font-bold tabular-nums text-slate-900">
          {vm.actual_vm_cost_30d !== null
            ? formatMoney(vm.actual_vm_cost_30d)
            : "—"}
        </p>
        <p className="text-[10px] text-slate-500">Lo que pagaste</p>
      </div>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          <CircleDollarSign className="h-3 w-3" />
          On-demand equivalente
          <InfoHint>
            <p className="mb-1 font-semibold">Costo a precio de lista</p>
            <p className="mb-1">
              Lo que costarían las mismas horas facturadas si se pagaran al
              precio público on-demand de la SKU origen, sin descuentos.
            </p>
            <p className="font-mono text-[11px]">
              horas facturadas × tarifa por hora del catálogo
            </p>
            <p className="mt-1">
              Sirve como referencia para comparar de forma justa contra los
              precios on-demand de las nubes destino.
            </p>
          </InfoHint>
        </div>
        <p className="font-mono text-sm font-bold tabular-nums text-slate-900">
          {vm.on_demand_equivalent_cost_30d !== null
            ? formatMoney(vm.on_demand_equivalent_cost_30d)
            : "—"}
        </p>
        <p className="text-[10px] text-slate-500">Mismas horas a precio lista</p>
      </div>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          <Cpu className="h-3 w-3" />
          CPU máx / prom
          <InfoHint>
            <p className="mb-1 font-semibold">Utilización de CPU (30d)</p>
            <p>
              <strong>Máx:</strong> el peak de uso de CPU registrado en los
              últimos 30 días. <br />
              <strong>Prom:</strong> promedio sobre todos los datapoints del
              período.
            </p>
            <p className="mt-1">
              Ambas métricas alimentan el cálculo de <em>confianza</em> de cada
              recomendación. Una CPU máxima alta indica menos margen para
              instancias destino más pequeñas.
            </p>
          </InfoHint>
        </div>
        <p className="font-mono text-sm font-bold tabular-nums text-slate-900">
          {vm.cpu_utilization_max_30d !== null
            ? `${vm.cpu_utilization_max_30d.toFixed(1)}%`
            : "—"}
          <span className="text-slate-400 mx-1">/</span>
          {vm.cpu_utilization_avg_30d !== null
            ? `${vm.cpu_utilization_avg_30d.toFixed(1)}%`
            : "—"}
        </p>
        <p className="text-[10px] text-slate-500">
          {status.tone === "ok" ? "Última ventana de 30 días" : status.label}
        </p>
      </div>
    </div>
  )
}

const SourceBaselineCard = ({
  vm,
  sourceCloud,
}: {
  vm: InterCloudVm
  sourceCloud: CloudProvider
}) => {
  const meta = CLOUD_META[sourceCloud]
  const discountPct =
    vm.actual_vm_cost_30d !== null &&
      vm.on_demand_equivalent_cost_30d !== null &&
      vm.on_demand_equivalent_cost_30d > 0
      ? ((vm.on_demand_equivalent_cost_30d - vm.actual_vm_cost_30d) /
        vm.on_demand_equivalent_cost_30d) *
      100
      : null

  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        meta.bg,
        meta.border
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.dot }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
            Original ({meta.label})
          </span>
          <Badge
            variant="outline"
            className="h-5 bg-white font-mono text-[10px] font-medium text-slate-700"
          >
            {vm.instance_type}
          </Badge>
          <span className="text-[11px] text-slate-600">
            {vm.type_vcpu} vCPU · {vm.type_memory_gb} GB · {vm.instance_region}
          </span>
        </div>
        {discountPct !== null && discountPct > 1 && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="h-5 cursor-help border-emerald-300 bg-white text-[10px] font-medium text-emerald-700"
                >
                  {discountPct.toFixed(1)}% bajo on-demand (RI/SP)
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="mb-1 text-xs font-semibold">
                  Descuento efectivo detectado
                </p>
                <p className="text-xs leading-relaxed">
                  Diferencia porcentual entre el costo real y el equivalente
                  on-demand:
                </p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed">
                  (on-demand − real) / on-demand × 100
                </p>
                <p className="mt-1 text-xs leading-relaxed">
                  Sugiere que esta instancia está cubierta por una reserva,
                  Savings Plan o CUD activo.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Costo real (30d)
            <InfoHint>
              <p>
                Lo que pagaste por esta instancia en los últimos 30 días según
                Cost Explorer (<code>netamortizedcost</code>).
              </p>
            </InfoHint>
          </p>
          <p className="font-mono text-base font-bold tabular-nums text-slate-900">
            {vm.actual_vm_cost_30d !== null
              ? formatMoney(vm.actual_vm_cost_30d)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            On-demand equivalente
            <InfoHint>
              <p className="mb-1 font-semibold">Costo on-demand de referencia</p>
              <p className="font-mono text-[11px]">
                horas facturadas × tarifa por hora del catálogo
              </p>
              <p className="mt-1">
                Permite comparar de forma justa contra los precios on-demand de
                las nubes destino.
              </p>
            </InfoHint>
          </p>
          <p className="font-mono text-base font-bold tabular-nums text-slate-900">
            {vm.on_demand_equivalent_cost_30d !== null
              ? formatMoney(vm.on_demand_equivalent_cost_30d)
              : "—"}
          </p>
        </div>
      </div>
    </div>
  )
}

const ProjectionTable = ({
  matches,
  provider,
  vm,
  term,
}: {
  matches: VmMatch[]
  provider: CloudProvider
  vm: InterCloudVm
  term: CommitmentTerm
}) => {
  const meta = CLOUD_META[provider]

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-xs text-slate-500">
          No hay coincidencias en {meta.label} para proyectar.
        </p>
      </div>
    )
  }

  const sorted = [...matches].sort((a, b) => {
    const ca = computeProjectedCost(a, provider, term)
    const cb = computeProjectedCost(b, provider, term)
    if (ca === null && cb === null) return 0
    if (ca === null) return 1
    if (cb === null) return -1
    return ca - cb
  })

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Instance type</th>
              <th className="px-3 py-2 text-left">Región</th>
              <th className="px-3 py-2 text-left">Recursos</th>
              <th className="px-3 py-2 text-right">
                Proyección 30d
                {term !== "on_demand" && (
                  <span className="ml-1 font-normal normal-case text-slate-400">
                    ({COMMITMENT_SHORT_LABELS[term]}, est.)
                  </span>
                )}
                <InfoHint>
                  <p className="mb-1 font-semibold">Proyección de costo a 30 días</p>
                  <p className="mb-1">
                    Lo que costaría esta instancia destino, durante las mismas
                    horas facturadas reales del origen:
                  </p>
                  <p className="font-mono text-[11px]">
                    horas facturadas × tarifa por hora destino
                  </p>
                  <p className="mt-2">
                    En vista <em>on-demand</em>: usa la tarifa de catálogo del
                    destino. <br />
                    En vistas <em>1 año</em> o <em>3 años</em>: aplica un
                    descuento estimado por compromiso (1y ≈ 28-37%, 3y ≈
                    52-62% según la nube).
                  </p>
                </InfoHint>
              </th>
              <th className="px-3 py-2 text-right">
                Ahorro vs actual
                <InfoHint>
                  <p className="mb-1 font-semibold">Ahorro real proyectado</p>
                  <p className="font-mono text-[11px]">
                    costo real (origen) − proyección 30d (destino)
                  </p>
                  <p className="mt-1">
                    Diferencia respecto al monto que efectivamente se pagó en
                    la nube origen (ya considera reservas/SP/CUDs activos en el
                    origen). Verde = ahorro; rojo = aumento de costo.
                  </p>
                </InfoHint>
              </th>
              <th className="px-3 py-2 text-right">
                Ahorro vs on-demand
                <InfoHint>
                  <p className="mb-1 font-semibold">Ahorro a precio de lista</p>
                  <p className="font-mono text-[11px]">
                    on-demand equivalente (origen) − proyección 30d (destino)
                  </p>
                  <p className="mt-1">
                    Comparación on-demand contra on-demand, sin descuentos del
                    lado origen. Útil para contrastar de forma justa cuando el
                    origen tiene reservas/SP/CUDs activos. Bajo el monto se
                    muestra el porcentaje sobre el on-demand equivalente.
                  </p>
                </InfoHint>
              </th>
              <th className="px-3 py-2 text-left">
                Confianza
                <InfoHint>
                  <p className="mb-1 font-semibold">Confianza de la recomendación</p>
                  <p>
                    Indica qué tan apropiada parece la SKU destino para
                    absorber el workload, basándose en la utilización de CPU
                    del origen:
                  </p>
                  <p className="mt-1">
                    <strong>Alta:</strong> CPU máx &lt; 80%. <br />
                    <strong>Media:</strong> CPU máx 80-95%, o origen burstable
                    sin créditos contra destino burstable. <br />
                    <strong>Baja:</strong> CPU máx &gt; 95%, riesgo de
                    throttling en el destino. <br />
                    <strong>Sin datos:</strong> faltan métricas para evaluar.
                  </p>
                </InfoHint>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((m, idx) => {
              const projected = computeProjectedCost(m, provider, term)
              const savingsActual = computeSavingsVsActual(m, vm, provider, term)
              const savingsOnDemand = computeSavingsVsOnDemand(
                m,
                vm,
                provider,
                term
              )
              const isCheapest = idx === 0 && projected !== null
              const isLowConfidenceCommit =
                term !== "on_demand" && m.confidence === "low"

              return (
                <tr
                  key={`${m.instance_type}-${m.region}-${idx}`}
                  className={cn(
                    "text-xs transition-colors hover:bg-slate-50",
                    isCheapest && "bg-emerald-50/50 hover:bg-emerald-50",
                    isLowConfidenceCommit && "bg-red-50/30"
                  )}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {isCheapest && (
                        <Badge className="h-5 gap-0.5 bg-emerald-600 px-1.5 text-[9px] text-white hover:bg-emerald-600">
                          <TrendingDown className="h-2.5 w-2.5" />
                          Mejor
                        </Badge>
                      )}
                      {isLowConfidenceCommit && (
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="h-5 gap-0.5 cursor-help bg-red-600 px-1.5 text-[9px] text-white hover:bg-red-600">
                                <ShieldAlert className="h-2.5 w-2.5" />
                                Riesgo
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-xs leading-relaxed">
                                Comprometer {COMMITMENT_LABELS[term].toLowerCase()}{" "}
                                en una recomendación con confianza baja es
                                arriesgado: el workload está cerca del límite de
                                CPU y la instancia destino podría experimentar
                                throttling antes de que termine el período de
                                compromiso.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <span className="font-mono font-semibold text-slate-900">
                        {m.instance_type}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                    {m.region}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                    {m.vcpus} vCPU · {m.memory_gb} GB
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    {projected !== null ? (
                      <span
                        className={cn(
                          "font-mono font-semibold tabular-nums",
                          isCheapest ? "text-emerald-700" : "text-slate-900"
                        )}
                      >
                        {formatMoney(projected)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <SavingsCell amount={savingsActual} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <SavingsCell
                      amount={savingsOnDemand.amount}
                      percent={savingsOnDemand.pct}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ConfidenceBadge match={m} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export interface InterCloudVmProjectionComponentProps {
  vm: InterCloudVm
  sourceCloud: CloudProvider
}

export const InterCloudVmProjectionComponent = ({
  vm,
  sourceCloud,
}: InterCloudVmProjectionComponentProps) => {
  const [term, setTerm] = useState<CommitmentTerm>("on_demand")
  const status = STATUS_META[vm.projection_status] ?? STATUS_META.error
  const statusToneClasses = STATUS_TONE_CLASSES[status.tone]

  const destinations = PROVIDER_ORDER.filter((p) => p !== sourceCloud).map(
    (key) => {
      const field = CLOUD_FIELD_MAP[key]
      const matches = (vm[field] as VmMatch[] | undefined) ?? []
      return { key, matches }
    }
  )

  const defaultTab = destinations[0]?.key
  const cannotProject =
    vm.projection_status === "missing_billing" ||
    vm.projection_status === "missing_both" ||
    vm.projection_status === "error"

  const TERM_OPTIONS: CommitmentTerm[] = ["on_demand", "1y", "3y"]

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100">
            <Activity className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Proyección de costos
            </h4>
            <p className="text-[11px] text-slate-500">
              Proyección de costos de las instancias recomendadas, basada en las
              horas facturadas reales de los últimos 30 días.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("h-6 gap-1 font-medium text-[10px]", statusToneClasses)}
        >
          {status.tone === "ok" ? (
            <Activity className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}
          {status.label}
        </Badge>
      </div>

      {status.tone !== "ok" && (
        <div
          className={cn(
            "mb-3 flex items-start gap-2 rounded-md border px-3 py-2 text-[11px]",
            statusToneClasses
          )}
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="leading-relaxed">{status.description}</p>
        </div>
      )}

      <div className="mb-4">
        <ProjectionContextStrip vm={vm} />
      </div>

      {!cannotProject && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Simulación de compromiso
            </p>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-xs leading-relaxed">
                    Las proyecciones reservadas usan descuentos representativos
                    publicados (~{Math.round(COMMITMENT_DISCOUNTS.AWS["1y"] * 100)}%
                    AWS, ~{Math.round(COMMITMENT_DISCOUNTS.Azure["1y"] * 100)}%
                    Azure, ~{Math.round(COMMITMENT_DISCOUNTS.GCP["1y"] * 100)}%
                    GCP a 1 año). Los descuentos reales varían por SKU y región
                    en algunos puntos porcentuales.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
            {TERM_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                className={cn(
                  "rounded px-3 py-1 text-[11px] font-medium transition-colors",
                  term === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {COMMITMENT_LABELS[t]}
                {t !== "on_demand" && (
                  <span className="ml-1 text-[9px] text-slate-400">est.</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {cannotProject ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-xs text-slate-500">
            No se pueden calcular proyecciones para esta instancia en el período.
          </p>
        </div>
      ) : (
        defaultTab && (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${destinations.length}, minmax(0, 1fr))`,
              }}
            >
              {destinations.map((d) => {
                const meta = CLOUD_META[d.key]
                return (
                  <TabsTrigger key={d.key} value={d.key} className="gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: meta.dot }}
                    />
                    {meta.label}
                    <span className="text-[10px] text-slate-500">
                      ({d.matches.length})
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {destinations.map((d) => (
              <TabsContent
                key={d.key}
                value={d.key}
                className="mt-3 space-y-3"
              >
                <SourceBaselineCard vm={vm} sourceCloud={sourceCloud} />
                <ProjectionTable
                  matches={d.matches}
                  provider={d.key}
                  vm={vm}
                  term={term}
                />
              </TabsContent>
            ))}
          </Tabs>
        )
      )}
    </Card>
  )
}