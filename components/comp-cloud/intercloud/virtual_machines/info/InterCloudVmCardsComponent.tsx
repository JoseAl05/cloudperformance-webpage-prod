"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Search,
  Info,
  TrendingDown,
  Server,
  ChevronRight,
  TrendingUp,
  Equal,
  Layers,
  Clock,
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
  hourly_usd: number
  monthly_usd_730h: number
  azure_vms_match?: VmMatch[]
  gcp_vms_match?: VmMatch[]
  aws_vms_match?: VmMatch[]
}

export interface InterCloudVmCardsComponentProps {
  data: InterCloudVm[]
  sourceCloud: CloudProvider
}

type CloudMeta = {
  label: string
  dot: string
  bg: string
  border: string
  text: string
}

const CLOUD_META: Record<CloudProvider, CloudMeta> = {
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

const formatHourly = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value)

const formatMonthly = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`

type DiffDirection = "down" | "up" | "equal"

type PriceDiff = {
  delta: number
  absDelta: number
  percent: number
  direction: DiffDirection
}

const computePriceDiff = (
  matchValue: number,
  originalValue: number | undefined | null,
  epsilon: number
): PriceDiff | null => {
  if (
    originalValue === undefined ||
    originalValue === null ||
    !Number.isFinite(originalValue) ||
    originalValue <= 0
  ) {
    return null
  }
  const delta = matchValue - originalValue
  const absDelta = Math.abs(delta)
  const percent = (delta / originalValue) * 100
  const direction: DiffDirection =
    absDelta < epsilon ? "equal" : delta < 0 ? "down" : "up"
  return { delta, absDelta, percent, direction }
}

const PriceDiff = ({
  diff,
  formatter,
  size = "sm",
}: {
  diff: PriceDiff | null
  formatter: (v: number) => string
  size?: "sm" | "md"
}) => {
  if (!diff) {
    return <span className="text-[10px] text-slate-400">—</span>
  }

  const iconSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"
  const textSize = size === "md" ? "text-xs" : "text-[10px]"

  if (diff.direction === "equal") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-medium text-slate-500",
          textSize
        )}
      >
        <Equal className={iconSize} />
        Igual
      </span>
    )
  }

  const isDown = diff.direction === "down"
  const Icon = isDown ? TrendingDown : TrendingUp
  const colorClass = isDown ? "text-emerald-600" : "text-red-600"
  const sign = isDown ? "−" : "+"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium tabular-nums",
        colorClass,
        textSize
      )}
    >
      <Icon className={iconSize} />
      {sign}
      {formatter(diff.absDelta)}
      <span className="opacity-75">({formatPercent(diff.percent)})</span>
    </span>
  )
}

const HOURLY_EPSILON = 0.0001
const MONTHLY_EPSILON = 0.01

const getLatestSyncTime = (data: InterCloudVm[]): Date | null => {
  let latest: number | null = null
  for (const vm of data) {
    if (!vm.last_sync) continue
    const ts = new Date(vm.last_sync).getTime()
    if (!Number.isFinite(ts)) continue
    if (latest === null || ts > latest) latest = ts
  }
  return latest === null ? null : new Date(latest)
}

const formatSyncDate = (date: Date): string =>
  new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date)

const getDestinationProviders = (
  vm: InterCloudVm,
  sourceCloud: CloudProvider
) => {
  const list: {
    key: CloudProvider
    matches: VmMatch[]
    cheapest: VmMatch | null
  }[] = []
  for (const key of PROVIDER_ORDER) {
    if (key === sourceCloud) continue
    const field = CLOUD_FIELD_MAP[key]
    const matches = (vm[field] as VmMatch[] | undefined) ?? []
    const sorted = [...matches].sort(
      (a, b) => a.monthly_usd_730h - b.monthly_usd_730h
    )
    list.push({ key, matches: sorted, cheapest: sorted[0] ?? null })
  }
  return list
}

const PrecisionBadge = ({ match }: { match: VmMatch }) => {
  const isHigh = match.precision_treshold === "HIGH"
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "h-5 gap-1 cursor-help font-medium text-[10px]",
              isHigh
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-amber-300 bg-amber-50 text-amber-700"
            )}
          >
            <Info className="h-3 w-3" />
            {isHigh ? "Alta" : "Baja"}
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

const VmListItem = ({
  vm,
  sourceCloud,
  isSelected,
  onSelect,
}: {
  vm: InterCloudVm
  sourceCloud: CloudProvider
  isSelected: boolean
  onSelect: () => void
}) => {
  const providers = useMemo(
    () => getDestinationProviders(vm, sourceCloud),
    [vm, sourceCloud]
  )
  const sourceMeta = CLOUD_META[sourceCloud]

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all",
        "hover:border-slate-300 hover:bg-slate-50",
        isSelected
          ? "border-slate-900 bg-white shadow-sm ring-2 ring-slate-900/10"
          : "border-slate-200 bg-white"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: sourceMeta.dot }}
            />
            <h4 className="truncate text-sm font-semibold text-slate-900">
              {vm.instance_name}
            </h4>
          </div>
          <p className="truncate font-mono text-[10px] text-slate-400">
            {vm.instance_id}
          </p>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition",
            isSelected ? "text-slate-700" : "text-slate-300"
          )}
        />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600">
        <span className="font-mono font-medium text-slate-700">
          {vm.instance_type}
        </span>
        <span className="text-slate-300">·</span>
        <span>{vm.type_vcpu} vCPU</span>
        <span className="text-slate-300">·</span>
        <span>{vm.type_memory_gb} GB</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {providers.map((p) => {
          const meta = CLOUD_META[p.key]
          if (!p.cheapest) {
            return (
              <div
                key={p.key}
                className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                {meta.label} · sin datos
              </div>
            )
          }
          return (
            <div
              key={p.key}
              className={cn(
                "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                meta.bg,
                meta.text
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: meta.dot }}
              />
              {meta.label}
              <span className="font-mono font-semibold">
                {formatMonthly(p.cheapest.monthly_usd_730h)}
              </span>
            </div>
          )
        })}
      </div>
    </button>
  )
}

const MatchesTable = ({
  matches,
  provider,
  vm_original
}: {
  matches: VmMatch[]
  provider: CloudProvider
  vm_original: InterCloudVm
}) => {
  const meta = CLOUD_META[provider]

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-xs text-slate-500">
          No hay coincidencias disponibles en {meta.label}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Instance type</th>
              <th className="px-3 py-2 text-left">Región</th>
              <th className="px-3 py-2 text-left">vCPU</th>
              <th className="px-3 py-2 text-left">RAM</th>
              <th className="px-3 py-2 text-left">Precisión</th>
              <th className="px-3 py-2 text-right">Por hora</th>
              <th className="px-3 py-2 text-right">Mensual (730h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((m, idx) => {
              const hourlyDiff = computePriceDiff(
                m.hourly_usd,
                vm_original.hourly_usd,
                HOURLY_EPSILON
              )
              const monthlyDiff = computePriceDiff(
                m.monthly_usd_730h,
                vm_original.monthly_usd_730h,
                MONTHLY_EPSILON
              )
              return (
                <tr
                  key={`${m.instance_type}-${m.region}-${idx}`}
                  className={cn(
                    "text-xs transition-colors hover:bg-slate-50",
                    idx === 0 && "bg-emerald-50/50 hover:bg-emerald-50"
                  )}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {idx === 0 && (
                        <Badge className="h-5 gap-0.5 bg-emerald-600 px-1.5 text-[9px] text-white hover:bg-emerald-600">
                          <TrendingDown className="h-2.5 w-2.5" />
                          Mejor
                        </Badge>
                      )}
                      <span className="font-mono font-semibold text-slate-900">
                        {m.instance_type}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                    {m.region}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{m.vcpus}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                    {m.memory_gb} GB
                  </td>
                  <td className="px-3 py-2">
                    <PrecisionBadge match={m} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono text-slate-700 tabular-nums">
                        {formatHourly(m.hourly_usd)}
                      </span>
                      <PriceDiff diff={hourlyDiff} formatter={formatHourly} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span
                        className={cn(
                          "font-mono font-semibold tabular-nums",
                          idx === 0 ? "text-emerald-700" : "text-slate-900"
                        )}
                      >
                        {formatMonthly(m.monthly_usd_730h)}
                      </span>
                      <PriceDiff
                        diff={monthlyDiff}
                        formatter={formatMonthly}
                      />
                    </div>
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

const VmDetailPanel = ({
  vm,
  sourceCloud,
}: {
  vm: InterCloudVm
  sourceCloud: CloudProvider
}) => {
  const sourceMeta = CLOUD_META[sourceCloud]
  const providers = useMemo(
    () => getDestinationProviders(vm, sourceCloud),
    [vm, sourceCloud]
  )
  const defaultTab = providers[0]?.key

  const bestOverall = useMemo(() => {
    let best: { provider: CloudProvider; match: VmMatch } | null = null
    for (const p of providers) {
      if (!p.cheapest) continue
      if (!best || p.cheapest.monthly_usd_730h < best.match.monthly_usd_730h) {
        best = { provider: p.key, match: p.cheapest }
      }
    }
    return best
  }, [providers])

  const bestOverallVsOriginal = (best_monthly: number, original_monthly: number) => {
    const difference = best_monthly - original_monthly;

    if (difference < 0) {
      return (
        <div className='flex items-center justify-center gap-2'>
          <TrendingDown color='green' />
          <span className='text-emerald-700'>{Math.abs(difference).toFixed(2)} menos costoso</span>
        </div>
      )
    } else if (difference > 0) {
      return (
        <div className='flex items-center justify-center gap-2'>
          <TrendingUp color='red' />
          <span className='text-red-700'>{Math.abs(difference).toFixed(2)} más costoso</span>
        </div>
      )
    } else if (difference === 0) {
      return (
        <div className='flex items-center justify-center gap-2'>
          <Equal className='text-slate-700' />
          <span className='text-slate-700'>No hay diferencia de precio.</span>
        </div>
      )
    }
  }



  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                sourceMeta.bg,
                sourceMeta.border
              )}
            >
              <Server className={cn("h-5 w-5", sourceMeta.text)} />
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
              sourceMeta.bg,
              sourceMeta.text,
              sourceMeta.border
            )}
          >
            {sourceMeta.label}
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
            <p className="text-[15px] font-medium uppercase tracking-wider text-slate-500">
              POR HORA
            </p>
            <p className="truncate text-md font-semibold text-slate-900">
              {formatHourly(vm.hourly_usd)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
            <p className="text-[15px] font-medium uppercase tracking-wider text-slate-500">
              MENSUAL (730h)
            </p>
            <p className="truncate text-md font-semibold text-slate-900">
              {formatMonthly(vm.monthly_usd_730h)}
            </p>
          </div>
        </div>
      </Card>

      {bestOverall && (
        <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                Mejor opción entre nubes
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {bestOverall.match.instance_type}
                </span>
                <span className="text-xs text-slate-500">en</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    CLOUD_META[bestOverall.provider].bg,
                    CLOUD_META[bestOverall.provider].text,
                    CLOUD_META[bestOverall.provider].border
                  )}
                >
                  {CLOUD_META[bestOverall.provider].label}
                </Badge>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-700">
                  {bestOverall.match.region}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Mensual
              </p>
              <div className="font-mono text-lg font-bold text-emerald-700">
                {formatMonthly(bestOverall.match.monthly_usd_730h)} {bestOverallVsOriginal(bestOverall.match.monthly_usd_730h, vm.monthly_usd_730h)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {defaultTab && (
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
            <TabsContent key={p.key} value={p.key} className="mt-3">
              <MatchesTable matches={p.matches} provider={p.key} vm_original={vm} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

type InfrastructureSummary = {
  original: {
    hourly: number
    monthly: number
    count: number
    types: { instance_type: string; count: number }[]
  }
  best: {
    hourly: number
    monthly: number
    count: number
    unmatched: number
    breakdown: {
      provider: CloudProvider
      instance_type: string
      count: number
      monthly: number
    }[]
  }
}

const computeInfrastructureSummary = (
  data: InterCloudVm[],
  sourceCloud: CloudProvider
): InfrastructureSummary => {
  let originalHourly = 0
  let originalMonthly = 0
  const originalTypes = new Map<string, number>()

  let bestHourly = 0
  let bestMonthly = 0
  let unmatched = 0
  const bestBreakdown = new Map<
    string,
    { provider: CloudProvider; instance_type: string; count: number; monthly: number }
  >()

  for (const vm of data) {
    originalHourly += vm.hourly_usd ?? 0
    originalMonthly += vm.monthly_usd_730h ?? 0
    originalTypes.set(
      vm.instance_type,
      (originalTypes.get(vm.instance_type) ?? 0) + 1
    )

    const providers = getDestinationProviders(vm, sourceCloud)
    let best: { provider: CloudProvider; match: VmMatch } | null = null
    for (const p of providers) {
      if (!p.cheapest) continue
      if (!best || p.cheapest.monthly_usd_730h < best.match.monthly_usd_730h) {
        best = { provider: p.key, match: p.cheapest }
      }
    }

    if (best) {
      bestHourly += best.match.hourly_usd
      bestMonthly += best.match.monthly_usd_730h
      const key = `${best.provider}::${best.match.instance_type}`
      const existing = bestBreakdown.get(key)
      if (existing) {
        existing.count += 1
        existing.monthly += best.match.monthly_usd_730h
      } else {
        bestBreakdown.set(key, {
          provider: best.provider,
          instance_type: best.match.instance_type,
          count: 1,
          monthly: best.match.monthly_usd_730h,
        })
      }
    } else {
      unmatched += 1
    }
  }

  return {
    original: {
      hourly: originalHourly,
      monthly: originalMonthly,
      count: data.length,
      types: [...originalTypes.entries()]
        .map(([instance_type, count]) => ({ instance_type, count }))
        .sort((a, b) => b.count - a.count || a.instance_type.localeCompare(b.instance_type)),
    },
    best: {
      hourly: bestHourly,
      monthly: bestMonthly,
      count: data.length - unmatched,
      unmatched,
      breakdown: [...bestBreakdown.values()].sort(
        (a, b) => b.count - a.count || b.monthly - a.monthly
      ),
    },
  }
}

const InfrastructureOverview = ({
  data,
  sourceCloud,
}: {
  data: InterCloudVm[]
  sourceCloud: CloudProvider
}) => {
  const summary = useMemo(
    () => computeInfrastructureSummary(data, sourceCloud),
    [data, sourceCloud]
  )
  const sourceMeta = CLOUD_META[sourceCloud]

  const hourlyDiff = computePriceDiff(
    summary.best.hourly,
    summary.original.hourly,
    HOURLY_EPSILON
  )
  const monthlyDiff = computePriceDiff(
    summary.best.monthly,
    summary.original.monthly,
    MONTHLY_EPSILON
  )

  const hasBest = summary.best.count > 0
  const latestSync = useMemo(() => getLatestSyncTime(data), [data])

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
            <Layers className="h-4 w-4 text-slate-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">
            Resumen general
          </h2>
          <span className="text-xs text-slate-500">
            · {summary.original.count}{" "}
            {summary.original.count === 1 ? "instancia" : "instancias"}
          </span>
        </div>
        {latestSync && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>
              Información actualizada a la fecha de{" "}
              <span className="font-medium text-slate-700">
                {formatSyncDate(latestSync)}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div
          className={cn(
            "rounded-lg border p-4",
            sourceMeta.bg,
            sourceMeta.border
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Infraestructura actual
            </p>
            <Badge
              variant="outline"
              className={cn(
                "font-medium uppercase",
                "bg-white",
                sourceMeta.text,
                sourceMeta.border
              )}
            >
              <span
                className="mr-1 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: sourceMeta.dot }}
              />
              {sourceMeta.label}
            </Badge>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Por hora
              </p>
              <p className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {formatHourly(summary.original.hourly)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Mensual (730h)
              </p>
              <p className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {formatMonthly(summary.original.monthly)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Tipos de instancia
            </p>
            <div className="flex flex-wrap gap-1">
              {summary.original.types.map(({ instance_type, count }) => (
                <Badge
                  key={instance_type}
                  variant="outline"
                  className="h-5 gap-1 border-slate-300 bg-white font-mono text-[10px] font-medium text-slate-700"
                >
                  {instance_type}
                  <span className="text-slate-400">× {count}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Mejor alternativa entre nubes
            </p>
            {summary.best.unmatched > 0 && (
              <Badge
                variant="outline"
                className="h-5 border-amber-300 bg-amber-50 text-[10px] font-medium text-amber-700"
              >
                {summary.best.unmatched} sin alternativa
              </Badge>
            )}
          </div>

          {hasBest ? (
            <>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Por hora
                  </p>
                  <p className="font-mono text-lg font-bold text-emerald-700 tabular-nums">
                    {formatHourly(summary.best.hourly)}
                  </p>
                  <div className="mt-0.5">
                    <PriceDiff diff={hourlyDiff} formatter={formatHourly} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Mensual (730h)
                  </p>
                  <p className="font-mono text-lg font-bold text-emerald-700 tabular-nums">
                    {formatMonthly(summary.best.monthly)}
                  </p>
                  <div className="mt-0.5">
                    <PriceDiff
                      diff={monthlyDiff}
                      formatter={formatMonthly}
                      size="md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Mezcla óptima
                </p>
                <div className="flex flex-wrap gap-1">
                  {summary.best.breakdown.map((item) => {
                    const meta = CLOUD_META[item.provider]
                    return (
                      <Badge
                        key={`${item.provider}-${item.instance_type}`}
                        variant="outline"
                        className={cn(
                          "h-5 gap-1 font-mono text-[10px] font-medium",
                          "bg-white",
                          meta.text,
                          meta.border
                        )}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: meta.dot }}
                        />
                        {item.instance_type} ({item.provider})
                        <span className="opacity-60">× {item.count}</span>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-white/60 p-4 text-center">
              <p className="text-xs text-slate-500">
                No se encontraron alternativas en otras nubes para esta
                infraestructura.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export const InterCloudVmCardsComponent = ({
  data,
  sourceCloud,
}: InterCloudVmCardsComponentProps) => {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(
    data?.[0]?.instance_id ?? null
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (vm) =>
        vm.instance_name.toLowerCase().includes(q) ||
        vm.instance_id.toLowerCase().includes(q) ||
        vm.instance_type.toLowerCase().includes(q)
    )
  }, [data, search])

  const selected = useMemo(
    () =>
      filtered.find((vm) => vm.instance_id === selectedId) ??
      filtered[0] ??
      null,
    [filtered, selectedId]
  )

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
    <div className="flex flex-col gap-4">
      <InfrastructureOverview data={data} sourceCloud={sourceCloud} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, ID o tipo..."
              className="h-9 pl-8"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] text-slate-500">
              {filtered.length}{" "}
              {filtered.length === 1 ? "instancia" : "instancias"}
              {search && <> de {data.length}</>}
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-1">
            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
                <p className="text-xs text-slate-500">Sin resultados</p>
              </div>
            )}
            {filtered.map((vm) => (
              <VmListItem
                key={vm.instance_id}
                vm={vm}
                sourceCloud={sourceCloud}
                isSelected={vm.instance_id === selected?.instance_id}
                onSelect={() => setSelectedId(vm.instance_id)}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          {selected ? (
            <VmDetailPanel vm={selected} sourceCloud={sourceCloud} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
              <p className="text-xs text-slate-500">
                Selecciona una instancia de la lista
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}