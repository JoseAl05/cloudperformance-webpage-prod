"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Cpu,
  MemoryStick,
  MapPin,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingDown,
  Server,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type CloudProvider = "AWS" | "Azure" | "GCP"

export interface VmMatch {
  instance_type: string
  os: string
  region: string
  vcpus: number
  memory_gb: number
  hourly_usd: number
  monthly_usd_730h: number
  precision_treshold: string
  precision_treshold_description: string
}

export interface InterCloudVm {
  instance_id: string
  instance_type: string
  instance_os: string
  instance_region: string
  instance_arch: string
  instance_name: string
  last_sync: string
  type_vcpu: number
  type_memory: number
  type_memory_gb: number
  azure_vms_match?: VmMatch[]
  gcp_vms_match?: VmMatch[]
  aws_vms_match?: VmMatch[]
}

export interface InterCloudVmCardsComponentProps {
  data: InterCloudVm[]
  sourceCloud: CloudProvider
}

const CLOUD_META: Record<
  CloudProvider,
  {
    label: string
    dot: string
    bg: string
    border: string
    text: string
  }
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

function formatHourly(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value)
}

function formatMonthly(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function PrecisionBadge({ match }: { match: VmMatch }) {
  const isHigh = match.precision_treshold === "HIGH"
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "gap-1 cursor-help font-medium",
              isHigh
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-amber-300 bg-amber-50 text-amber-700"
            )}
          >
            <Info className="h-3 w-3" />
            {isHigh ? "Precisión alta" : "Precisión baja"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">
            {match.precision_treshold_description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function MatchRow({
  match,
  provider,
  isCheapest,
}: {
  match: VmMatch
  provider: CloudProvider
  isCheapest: boolean
}) {
  const meta = CLOUD_META[provider]
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border p-3 transition-all hover:shadow-sm md:flex-row md:items-center md:justify-between",
        isCheapest
          ? "border-emerald-300 bg-emerald-50/40"
          : "border-slate-200 bg-white"
      )}
    >
      {isCheapest && (
        <Badge className="absolute -top-2 left-3 gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
          <TrendingDown className="h-3 w-3" />
          Más económica
        </Badge>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.dot }}
          />
          <span className="font-mono text-sm font-semibold text-slate-900">
            {match.instance_type}
          </span>
          <PrecisionBadge match={match} />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3 text-slate-400" />
            {match.vcpus} vCPU
          </span>
          <span className="inline-flex items-center gap-1">
            <MemoryStick className="h-3 w-3 text-slate-400" />
            {match.memory_gb} GB
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            {match.region}
          </span>
          <span className="inline-flex items-center gap-1">
            <Monitor className="h-3 w-3 text-slate-400" />
            {match.os}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-right md:border-l md:border-slate-200 md:pl-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Por hora
          </p>
          <p className="font-mono text-sm font-semibold text-slate-900">
            {formatHourly(match.hourly_usd)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Mensual (730h)
          </p>
          <p className="font-mono text-base font-bold text-slate-900">
            {formatMonthly(match.monthly_usd_730h)}
          </p>
        </div>
      </div>
    </div>
  )
}

function VmOriginalHeader({
  vm,
  sourceCloud,
}: {
  vm: InterCloudVm
  sourceCloud: CloudProvider
}) {
  const meta = CLOUD_META[sourceCloud]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
              meta.bg,
              meta.border
            )}
          >
            <Server className={cn("h-5 w-5", meta.text)} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {vm.instance_name}
            </h3>
            <p className="truncate font-mono text-xs text-slate-500">
              {vm.instance_id}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 font-medium uppercase",
            meta.bg,
            meta.text,
            meta.border
          )}
        >
          {meta.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Tipo
          </p>
          <p className="truncate font-mono text-xs font-semibold text-slate-900">
            {vm.instance_type}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Recursos
          </p>
          <p className="truncate text-xs font-semibold text-slate-900">
            {vm.type_vcpu} vCPU · {vm.type_memory_gb} GB
          </p>
        </div>
        <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Región
          </p>
          <p className="truncate text-xs font-semibold text-slate-900">
            {vm.instance_region}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            SO
          </p>
          <p className="truncate text-xs font-semibold text-slate-900">
            {vm.instance_os}
          </p>
        </div>
      </div>
    </div>
  )
}

function VmCard({
  vm,
  sourceCloud,
}: {
  vm: InterCloudVm
  sourceCloud: CloudProvider
}) {
  const [expanded, setExpanded] = useState(false)

  const providers = useMemo(() => {
    const list: { key: CloudProvider; matches: VmMatch[] }[] = []
    const order: CloudProvider[] = ["AWS", "Azure", "GCP"]
    for (const key of order) {
      if (key === sourceCloud) continue
      const field = CLOUD_FIELD_MAP[key]
      const matches = (vm[field] as VmMatch[] | undefined) ?? []
      if (matches.length > 0) {
        const sorted = [...matches].sort(
          (a, b) => a.monthly_usd_730h - b.monthly_usd_730h
        )
        list.push({ key, matches: sorted })
      }
    }
    return list
  }, [vm, sourceCloud])

  const hasMatches = providers.length > 0
  const defaultTab = providers[0]?.key

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="space-y-0 pb-3">
        <VmOriginalHeader vm={vm} sourceCloud={sourceCloud} />
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600">
              Coincidencias:
            </span>
            {!hasMatches && (
              <span className="text-xs italic text-slate-500">
                Sin sugerencias disponibles
              </span>
            )}
            {providers.map((p) => {
              const meta = CLOUD_META[p.key]
              return (
                <Badge
                  key={p.key}
                  variant="outline"
                  className={cn(
                    "gap-1.5 font-medium",
                    meta.bg,
                    meta.text,
                    meta.border
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.dot }}
                  />
                  {meta.label} · {p.matches.length}
                </Badge>
              )
            })}
          </div>

          {hasMatches && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              className="h-7 shrink-0 gap-1 text-xs"
            >
              {expanded ? (
                <>
                  Ocultar
                  <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Ver detalle
                  <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </div>

        {expanded && hasMatches && defaultTab && (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${providers.length}, minmax(0, 1fr))`,
              }}
            >
              {providers.map((p) => {
                const meta = CLOUD_META[p.key]
                return (
                  <TabsTrigger key={p.key} value={p.key} className="gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: meta.dot }}
                    />
                    {meta.label}
                    <span className="text-[10px] text-slate-500">
                      ({p.matches.length})
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {providers.map((p) => (
              <TabsContent
                key={p.key}
                value={p.key}
                className="mt-3 space-y-3"
              >
                {p.matches.map((m, idx) => (
                  <MatchRow
                    key={`${m.instance_type}-${m.region}-${idx}`}
                    match={m}
                    provider={p.key}
                    isCheapest={idx === 0}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

export function InterCloudVmCardsComponent({
  data,
  sourceCloud,
}: InterCloudVmCardsComponentProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
        <Server className="mb-2 h-8 w-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          No hay instancias para comparar
        </p>
        <p className="text-xs text-slate-500">
          Una vez que existan coincidencias, aparecerán aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {data.map((vm) => (
        <VmCard key={vm.instance_id} vm={vm} sourceCloud={sourceCloud} />
      ))}
    </div>
  )
}

export default InterCloudVmCardsComponent