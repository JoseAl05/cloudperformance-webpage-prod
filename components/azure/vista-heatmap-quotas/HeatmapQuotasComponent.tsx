'use client'

import useSWR from 'swr'
import { useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import type { EChartsOption } from 'echarts'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

interface HeatmapQuotasComponentProps {
    startDate: Date
    endDate: Date | null
    region: string
    subscription: string
}

type SizeBy = 'quotas' | 'maxUsage'

interface AzureQuotaRow {
    timestamp?: { $date?: string } | string
    quota_name?: string
    usage_value?: number
    limit_value?: number
    porcentaje_consumo?: number
    location_custom?: string
    location?: string
    subscription_id?: string
}

interface AzureQuotaEntry {
    quotaName: string
    usagePct: number | null
    usageValue: number | null
    limitValue: number | null
    location: string
    subscriptionId: string
}

interface DateGroup {
    label: string
    order: number
    locations: Map<string, Map<string, AzureQuotaEntry>>
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

const fmtPct = (v: number | null | undefined) =>
    typeof v === 'number' && !Number.isNaN(v) ? `${v.toFixed(1)}%` : 'N/A'

const ellipsize = (s: string, max = 28) =>
    s?.length > max ? `${s.slice(0, Math.max(0, max - 3))}...` : s

const buildThemeColors = (isDark: boolean) =>
    (isDark
        ? {
            visualMap: ['#2dd4bf', '#f59e0b', '#ef4444'],
            text: '#e5e7eb',
            subText: '#cbd5e1',
            border: '#475569',
            borderEmph: '#e5e7eb',
            bgLvl1: 'rgba(148,163,184,0.10)',
            bgLvl2: 'rgba(148,163,184,0.18)',
            bgLvl3: 'rgba(148,163,184,0.25)',
            breadcrumb: '#e5e7eb',
            tooltipBg: 'rgba(15,23,42,0.95)',
            labelBg: 'rgba(2,6,23,0.55)',
            labelBorder: 'rgba(148,163,184,0.35)',
        }
        : {
            visualMap: ['#16a34a', '#f59e0b', '#dc2626'],
            text: '#0f172a',
            subText: '#334155',
            border: '#94a3b8',
            borderEmph: '#0f172a',
            bgLvl1: 'rgba(2,6,23,0.05)',
            bgLvl2: 'rgba(2,6,23,0.08)',
            bgLvl3: 'rgba(2,6,23,0.12)',
            breadcrumb: '#0f172a',
            tooltipBg: 'rgba(255,255,255,0.98)',
            labelBg: 'rgba(255,255,255,0.75)',
            labelBorder: 'rgba(15,23,42,0.20)',
        }) as const

export const HeatmapQuotasComponent = ({ startDate, endDate, region, subscription }: HeatmapQuotasComponentProps) => {
    const { theme, resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme ?? theme
    const isDark = currentTheme === 'dark'

    const chartRef = useRef<HTMLDivElement>(null)
    const [sizeBy, setSizeBy] = useState<SizeBy>('maxUsage')
    const [onlyWithUsage, setOnlyWithUsage] = useState(true)

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const locationParam = encodeURIComponent(region)
    const subscriptionParam = encodeURIComponent(subscription)

    const { data, error, isLoading } = useSWR(
        `/api/azure/bridge/azure/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${locationParam}&subscription_id=${subscriptionParam}`,
        fetcher
    )

    const treemapData = useMemo(() => {
        if (!Array.isArray(data)) return []

        const grouped = new Map<string, DateGroup>()
        const defaultSubscription = (subscription ?? '').trim()

        data.forEach((item: AzureQuotaRow) => {
            if (!item) return

            const timestampValue =
                (typeof item?.timestamp === 'object' && item?.timestamp && '$date' in item.timestamp
                    ? (item.timestamp as { $date?: string })?.$date
                    : item?.timestamp) ?? null

            const parsedDate = timestampValue ? new Date(timestampValue) : null
            const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime())
            const dayStart = hasValidDate
                ? new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
                : null

            const groupKey = dayStart ? dayStart.toISOString() : 'sin-fecha'
            const groupLabel = hasValidDate ? parsedDate.toLocaleDateString() : 'Sin fecha'
            const groupOrder = dayStart ? dayStart.getTime() : Number.NEGATIVE_INFINITY

            const regionTrimmed = (region ?? '').trim()
            const locationCandidate =
                typeof item?.location_custom === 'string' && item.location_custom.trim().length > 0
                    ? item.location_custom
                    : typeof item?.location === 'string' && item.location.trim().length > 0
                        ? item.location
                        : regionTrimmed
            const locationName =
                locationCandidate && locationCandidate.trim().length > 0
                    ? locationCandidate.trim()
                    : 'Sin región'

            const quotaName =
                typeof item?.quota_name === 'string' && item.quota_name.trim().length > 0
                    ? item.quota_name.trim()
                    : 'Quota'

            const usagePct =
                typeof item?.porcentaje_consumo === 'number' && !Number.isNaN(item.porcentaje_consumo)
                    ? item.porcentaje_consumo * 100
                    : null
            const usageValue =
                typeof item?.usage_value === 'number' && !Number.isNaN(item.usage_value) ? item.usage_value : null
            const limitValue =
                typeof item?.limit_value === 'number' && !Number.isNaN(item.limit_value) ? item.limit_value : null
            const subscriptionId =
                typeof item?.subscription_id === 'string' && item.subscription_id.trim().length > 0
                    ? item.subscription_id.trim()
                    : defaultSubscription || 'N/A'

            const group = grouped.get(groupKey) ?? { label: groupLabel, order: groupOrder, locations: new Map() }
            const locationGroup = group.locations.get(locationName) ?? new Map<string, AzureQuotaEntry>()

            const existing = locationGroup.get(quotaName)
            if (!existing || (usagePct ?? -Infinity) > (existing.usagePct ?? -Infinity)) {
                locationGroup.set(quotaName, {
                    quotaName,
                    usagePct,
                    usageValue,
                    limitValue,
                    location: locationName,
                    subscriptionId,
                })
            }

            group.locations.set(locationName, locationGroup)
            grouped.set(groupKey, group)
        })

        return Array.from(grouped.values())
            .sort((a, b) => a.order - b.order)
            .map((group) => {
                const locationNodes = Array.from(group.locations.entries()).map(([locationName, quotasMap]) => {
                    const quotasRaw = Array.from(quotasMap.values())

                    let quotasFiltered = onlyWithUsage
                        ? quotasRaw.filter((quota) => typeof quota.usagePct === 'number')
                        : quotasRaw

                    quotasFiltered = [...quotasFiltered].sort((a, b) => {
                        const va = typeof a.usagePct === 'number' ? a.usagePct : -Infinity
                        const vb = typeof b.usagePct === 'number' ? b.usagePct : -Infinity
                        return va - vb
                    })

                    const maxUsage = quotasFiltered.reduce((max, quota) => {
                        const usage = typeof quota.usagePct === 'number' ? quota.usagePct : null
                        return typeof usage === 'number' && usage > max ? usage : max
                    }, 0)

                    const areaValue =
                        sizeBy === 'quotas' ? Math.max(quotasFiltered.length, 1) : Math.max(maxUsage, 1)

                    const quotaCount = quotasFiltered.length

                    const quotaChildren = quotasFiltered.map((quota) => {
                        const usage = typeof quota.usagePct === 'number' ? quota.usagePct : 0
                        return {
                            name: quota.quotaName,
                            value: [1, usage],
                            tooltipData: {
                                quota: quota.quotaName,
                                usagePct: usage,
                                usageValue: quota.usageValue,
                                limitValue: quota.limitValue,
                                location: quota.location,
                                subscriptionId: quota.subscriptionId,
                            },
                            label: {
                                show: true,
                                formatter: () => `${ellipsize(quota.quotaName, 26)}\n${fmtPct(usage)}`,
                                fontSize: 12,
                            },
                        }
                    })

                    return {
                        name: locationName,
                        value: [areaValue, maxUsage],
                        children: quotaChildren,
                        label: {
                            show: true,
                            formatter: (params: unknown) => {
                                const labelName = typeof params?.name === 'string' ? params.name : ''
                                const [, colorPct] = (params?.data?.value as number[]) ?? [0, 0]
                                return `${ellipsize(labelName, 22)}\n${quotaCount} quotas - max ${fmtPct(colorPct)}`
                            },
                            fontSize: 12,
                        },
                    }
                })

                const sortedLocations = locationNodes.sort((a, b) => {
                    const va = Array.isArray(a?.value) ? a.value[1] ?? -Infinity : -Infinity
                    const vb = Array.isArray(b?.value) ? b.value[1] ?? -Infinity : -Infinity
                    return va - vb
                })

                const dayArea = sortedLocations.reduce(
                    (total, loc) => total + (Array.isArray(loc?.value) ? loc.value[0] ?? 0 : 0),
                    0
                )
                const dayMax = sortedLocations.reduce(
                    (max, loc) => Math.max(max, Array.isArray(loc?.value) ? loc.value[1] ?? 0 : 0),
                    0
                )

                return {
                    name: group.label,
                    value: [Math.max(dayArea, 1), dayMax],
                    children: sortedLocations,
                    label: {
                        show: true,
                        formatter: (params: unknown) => {
                            const labelName = typeof params?.name === 'string' ? params.name : ''
                            const [, colorPct] = (params?.data?.value as number[]) ?? [0, 0]
                            return `${ellipsize(labelName, 24)}\nmax ${fmtPct(colorPct)}`
                        },
                        fontSize: 14,
                    },
                }
            })
    }, [data, onlyWithUsage, sizeBy, region, subscription])

    const hasChartData = useMemo(() => {
        return treemapData.some(
            (day) =>
                Array.isArray(day.children) &&
                day.children.some((loc: unknown) => Array.isArray(loc.children) && loc.children.length > 0)
        )
    }, [treemapData])

    const themeColors = useMemo(() => buildThemeColors(isDark), [isDark])

    const baseOption = useMemo(
        () =>
            makeBaseOptions({
                legend: false,
                showDataZoom: false,
                showToolbox: false,
                useUTC: true,
                metricType: 'percent',
            }),
        []
    )

    const option = useMemo<EChartsOption>(() => {
        const stableUpper = {
            show: true,
            position: 'inside',
            height: 22,
            color: themeColors.text,
            backgroundColor: themeColors.labelBg,
            borderColor: themeColors.labelBorder,
            borderWidth: 1,
            borderRadius: 6,
            padding: [2, 6],
            fontWeight: 600,
        } as const

        const levels = [
            {
                itemStyle: {
                    borderWidth: 1,
                    borderColor: themeColors.border,
                    borderRadius: 6,
                    gapWidth: 2,
                    color: themeColors.bgLvl1,
                },
                upperLabel: { ...stableUpper, fontSize: 16 },
                emphasis: {
                    itemStyle: {
                        borderColor: themeColors.borderEmph,
                        borderWidth: 1.2,
                        shadowBlur: 10,
                        shadowColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)',
                        borderRadius: 6,
                    },
                    upperLabel: { ...stableUpper },
                    label: { color: themeColors.text, backgroundColor: 'transparent' },
                },
            },
            {
                itemStyle: {
                    borderColor: themeColors.border,
                    borderWidth: 1,
                    borderRadius: 6,
                    gapWidth: 2,
                    color: themeColors.bgLvl2,
                },
                upperLabel: { ...stableUpper, fontSize: 14 },
                emphasis: {
                    itemStyle: {
                        borderColor: themeColors.borderEmph,
                        borderWidth: 1.2,
                        shadowBlur: 12,
                        shadowColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
                        borderRadius: 6,
                    },
                    upperLabel: { ...stableUpper },
                    label: { color: themeColors.text, backgroundColor: 'transparent' },
                },
            },
            {
                itemStyle: {
                    borderWidth: 1,
                    borderColor: themeColors.border,
                    borderRadius: 6,
                    gapWidth: 1,
                    color: themeColors.bgLvl3,
                },
                upperLabel: {
                    show: true,
                    color: themeColors.text,
                    fontSize: 12,
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                },
            },
        ]

        return deepMerge(baseOption, {
            backgroundColor: 'transparent',
            textStyle: { color: themeColors.text },
            title: {
                text: 'Azure Heatmap Quotas',
                left: 'center',
                textStyle: { color: themeColors.text },
            },
            xAxis: undefined,
            yAxis: undefined,
            toolbox: {
                show: true,
                orient: 'horizontal',
                feature: { restore: { show: true }, saveAsImage: { show: true } },
                right: 10,
                iconStyle: { borderColor: themeColors.text },
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                appendToBody: true,
                backgroundColor: themeColors.tooltipBg,
                borderColor: themeColors.border,
                borderWidth: 1,
                textStyle: { color: themeColors.text },
                formatter: (params: unknown) => {
                    const level = params?.treePathInfo?.length ?? 0
                    const name = typeof params?.name === 'string' ? params.name : ''
                    const valueArray: number[] = params?.data?.value ?? []
                    const areaVal = valueArray[0] ?? 0
                    const colorPct = valueArray[1] ?? 0

                    if (level === 4 && params?.data?.tooltipData) {
                        const info = params.data.tooltipData as {
                            quota: string
                            usagePct: number
                            usageValue: number | null
                            limitValue: number | null
                            location: string
                            subscriptionId: string
                        }
                        const usageValueText =
                            typeof info.usageValue === 'number' ? info.usageValue.toLocaleString() : 'N/A'
                        const limitValueText =
                            typeof info.limitValue === 'number' ? info.limitValue.toLocaleString() : 'N/A'
                        const subscriptionText =
                            info.subscriptionId && info.subscriptionId.length > 0 ? info.subscriptionId : 'N/A'
                        const locationText =
                            info.location && info.location.length > 0 ? info.location : 'N/A'

                        return `
                            <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(info.quota, 60)}</div>
                            <div><b>Consumo máx.:</b> ${fmtPct(info.usagePct)}</div>
                            <div><b>Uso:</b> ${usageValueText}</div>
                            <div><b>Límite:</b> ${limitValueText}</div>
                            <div><b>Región:</b> ${ellipsize(locationText, 48)}</div>
                            <div><b>Subscription:</b> ${ellipsize(subscriptionText, 48)}</div>
                        `
                    }

                    const unitArea = sizeBy === 'quotas' ? 'Area=#quotas' : 'Area=max % uso'
                    return `
                        <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(name, 64)}</div>
                        <div><b>${unitArea}:</b> ${areaVal}</div>
                        <div><b>Color (max % uso):</b> ${fmtPct(colorPct)}</div>
                    `
                },
            },
            visualMap: {
                min: 0,
                max: 100,
                type: 'continuous',
                orient: 'vertical',
                right: 10,
                top: 60,
                formatter: (v: number) => `${v}%`,
                text: ['alto uso', 'bajo'],
                textStyle: { color: themeColors.subText },
                calculable: true,
                inRange: { color: themeColors.visualMap },
                outOfRange: { color: ['#9ca3af'] },
            },
            series: [
                {
                    type: 'treemap',
                    visibleMin: 0,
                    roam: true,
                    nodeClick: 'zoomToNode',
                    breadcrumb: {
                        show: true,
                        left: 10,
                        top: 10,
                        itemStyle: { color: 'transparent', textStyle: { color: themeColors.breadcrumb } },
                    },
                    squareRatio: 1.0,
                    leafDepth: 3,
                    visualDimension: 1,
                    visualMin: 0,
                    visualMax: 100,
                    colorMappingBy: 'value',
                    itemStyle: {
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: themeColors.border,
                        gapWidth: 1,
                    },
                    label: {
                        show: true,
                        color: themeColors.text,
                        backgroundColor: 'transparent',
                        formatter: (params: unknown) => {
                            const labelName = typeof params?.data?.name === 'string' ? params.data.name : ''
                            const value = params?.data?.value as number[]
                            const level = params?.treePathInfo?.length ?? 0
                            const pct = fmtPct(value?.[1])
                            if (level === 2) return `${ellipsize(labelName, 24)}\nmax ${pct}`
                            if (level === 3) return `${ellipsize(labelName, 22)}\nmax ${pct}`
                            if (level === 4) return `${ellipsize(labelName, 26)}\n${pct}`
                            return labelName
                        },
                        fontSize: 12,
                    },
                    upperLabel: {
                        show: true,
                        height: 22,
                        color: themeColors.text,
                        backgroundColor: themeColors.labelBg,
                        borderColor: themeColors.labelBorder,
                        borderWidth: 1,
                        borderRadius: 6,
                        padding: [2, 6],
                        formatter: (params: unknown) => (params?.name === '' ? 'Quotas' : params?.name),
                    },
                    emphasis: {
                        itemStyle: {
                            borderRadius: 6,
                            borderWidth: 1.2,
                            borderColor: themeColors.borderEmph,
                            shadowBlur: 14,
                            shadowColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)',
                        },
                        label: {
                            color: themeColors.text,
                            backgroundColor: 'transparent',
                        },
                        upperLabel: {
                            show: true,
                            color: themeColors.text,
                            backgroundColor: themeColors.labelBg,
                            borderColor: themeColors.labelBorder,
                            borderWidth: 1,
                            borderRadius: 6,
                            padding: [2, 6],
                        },
                    },
                    levels,
                    data: hasChartData ? treemapData : [],
                },
            ],
            animation: true,
        })
    }, [baseOption, themeColors, treemapData, hasChartData, sizeBy, isDark])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

    if (error)
        return (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                Error al cargar datos de Azure.
            </div>
        )

    return (
        <div className="flex flex-col gap-4 p-5 mt-10">
            <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-lg font-semibold">Heatmap</h1>

                <div className="ml-auto flex flex-wrap items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="heatmap-size-by" className="text-xs font-medium uppercase text-muted-foreground">
                            Area por
                        </Label>
                        <Select value={sizeBy} onValueChange={(value) => setSizeBy(value as SizeBy)}>
                            <SelectTrigger id="heatmap-size-by" className="h-9 min-w-[200px]">
                                <SelectValue placeholder="Selecciona criterio" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="quotas">Numero de quotas</SelectItem>
                                <SelectItem value="maxUsage">Max. % de uso</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <Checkbox
                            id="heatmap-only-with-usage"
                            checked={onlyWithUsage}
                            onCheckedChange={(checked) => setOnlyWithUsage(Boolean(checked))}
                        />
                        <Label htmlFor="heatmap-only-with-usage" className="text-sm leading-none">
                            Solo quotas con uso
                        </Label>
                    </div>
                </div>
            </div>

            <div className="relative min-h-[480px]">
                {!isLoading && !hasChartData && (
                    <div className="absolute inset-0 z-20 grid place-items-center rounded-lg border border-dashed bg-background/70 text-sm text-muted-foreground">
                        No hay datos disponibles para el rango seleccionado.
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 z-30 grid place-items-center rounded-lg bg-background/60 backdrop-blur-sm dark:bg-background/70">
                        <LoaderComponent />
                    </div>
                )}

                <div ref={chartRef} className="h-[100vh] min-h-[480px] w-full rounded-lg" />
            </div>
        </div>
    )
}



// 'use client'

// import useSWR from 'swr'
// import { useMemo, useRef, useState } from 'react'
// import { useTheme } from 'next-themes'
// import type { EChartsOption } from 'echarts'
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Label } from '@/components/ui/label'
// import { deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

// interface HeatmapQuotasComponentProps {
//     startDate: Date
//     endDate: Date | null
//     region: string
//     subscription: string
// }

// type SizeBy = 'quotas' | 'maxUsage'

// interface AzureQuotaRow {
//     timestamp?: { $date?: string } | string
//     quota_name?: string
//     usage_value?: number
//     limit_value?: number
//     porcentaje_consumo?: number
//     location_custom?: string
//     location?: string
//     subscription_id?: string
// }

// interface AzureQuotaEntry {
//     quotaName: string
//     usagePct: number | null
//     usageValue: number | null
//     limitValue: number | null
//     location: string
//     subscriptionId: string
// }

// interface DateGroup {
//     label: string
//     order: number
//     quotasMap: Map<string, AzureQuotaEntry[]>
// }

// const fetcher = (url: string) =>
//     fetch(url, {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             'Content-Type': 'application/json',
//         },
//     }).then((res) => res.json())

// const fmtPct = (v: number | null | undefined) =>
//     typeof v === 'number' && !Number.isNaN(v) ? `${v.toFixed(1)}%` : 'N/A'

// const ellipsize = (s: string, max = 28) =>
//     s?.length > max ? `${s.slice(0, Math.max(0, max - 3))}...` : s

// // Helper para identificar si una location es Global
// const isLocationGlobal = (loc: string | undefined | null) => {
//     if (!loc) return false
//     const normalized = loc.trim().toLowerCase()
//     return normalized === 'global' || normalized === 'all regions' || normalized === ''
// }

// const buildThemeColors = (isDark: boolean) =>
//     (isDark
//         ? {
//             visualMap: ['#2dd4bf', '#f59e0b', '#ef4444'],
//             text: '#e5e7eb',
//             subText: '#cbd5e1',
//             border: '#475569',
//             borderEmph: '#e5e7eb',
//             bgLvl1: 'rgba(148,163,184,0.10)',
//             bgLvl2: 'rgba(148,163,184,0.18)',
//             bgLvl3: 'rgba(148,163,184,0.25)',
//             breadcrumb: '#e5e7eb',
//             tooltipBg: 'rgba(15,23,42,0.95)',
//             labelBg: 'rgba(2,6,23,0.55)',
//             labelBorder: 'rgba(148,163,184,0.35)',
//             badgeBg: 'rgba(51, 65, 85, 0.8)',
//             badgeBorder: 'rgba(148,163,184,0.5)',
//         }
//         : {
//             visualMap: ['#16a34a', '#f59e0b', '#dc2626'],
//             text: '#0f172a',
//             subText: '#334155',
//             border: '#94a3b8',
//             borderEmph: '#0f172a',
//             bgLvl1: 'rgba(2,6,23,0.05)',
//             bgLvl2: 'rgba(2,6,23,0.08)',
//             bgLvl3: 'rgba(2,6,23,0.12)',
//             breadcrumb: '#0f172a',
//             tooltipBg: 'rgba(255,255,255,0.98)',
//             labelBg: 'rgba(255,255,255,0.75)',
//             labelBorder: 'rgba(15,23,42,0.20)',
//             badgeBg: 'rgba(241, 245, 249, 0.9)',
//             badgeBorder: 'rgba(203, 213, 225, 0.8)',
//         }) as const

// export const HeatmapQuotasComponent = ({ startDate, endDate, region, subscription }: HeatmapQuotasComponentProps) => {
//     const { theme, resolvedTheme } = useTheme()
//     const currentTheme = resolvedTheme ?? theme
//     const isDark = currentTheme === 'dark'

//     const chartRef = useRef<HTMLDivElement>(null)
//     const [sizeBy, setSizeBy] = useState<SizeBy>('maxUsage')
//     const [onlyWithUsage, setOnlyWithUsage] = useState(true)

//     const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
//     const locationParam = encodeURIComponent(region)
//     const subscriptionParam = encodeURIComponent(subscription)

//     const { data, error, isLoading } = useSWR(
//         `/api/azure/bridge/azure/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${locationParam}&subscription_id=${subscriptionParam}`,
//         fetcher
//     )

//     const treemapData = useMemo(() => {
//         if (!Array.isArray(data)) return []

//         const grouped = new Map<string, DateGroup>()
//         const defaultSubscription = (subscription ?? '').trim()

//         data.forEach((item: AzureQuotaRow) => {
//             if (!item) return

//             const timestampValue =
//                 (typeof item?.timestamp === 'object' && item?.timestamp && '$date' in item.timestamp
//                     ? (item.timestamp as { $date?: string })?.$date
//                     : item?.timestamp) ?? null

//             const parsedDate = timestampValue ? new Date(timestampValue) : null
//             const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime())
//             const dayStart = hasValidDate
//                 ? new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
//                 : null

//             const groupKey = dayStart ? dayStart.toISOString() : 'sin-fecha'
//             const groupLabel = hasValidDate ? parsedDate.toLocaleDateString() : 'Sin fecha'
//             const groupOrder = dayStart ? dayStart.getTime() : Number.NEGATIVE_INFINITY

//             const regionTrimmed = (region ?? '').trim()
//             const locationCandidate =
//                 typeof item?.location_custom === 'string' && item.location_custom.trim().length > 0
//                     ? item.location_custom
//                     : typeof item?.location === 'string' && item.location.trim().length > 0
//                         ? item.location
//                         : regionTrimmed
//             const locationName =
//                 locationCandidate && locationCandidate.trim().length > 0
//                     ? locationCandidate.trim()
//                     : 'Sin región'

//             const quotaName =
//                 typeof item?.quota_name === 'string' && item.quota_name.trim().length > 0
//                     ? item.quota_name.trim()
//                     : 'Quota'

//             const usagePct =
//                 typeof item?.porcentaje_consumo === 'number' && !Number.isNaN(item.porcentaje_consumo)
//                     ? item.porcentaje_consumo * 100
//                     : null
//             const usageValue =
//                 typeof item?.usage_value === 'number' && !Number.isNaN(item.usage_value) ? item.usage_value : null
//             const limitValue =
//                 typeof item?.limit_value === 'number' && !Number.isNaN(item.limit_value) ? item.limit_value : null
//             const subscriptionId =
//                 typeof item?.subscription_id === 'string' && item.subscription_id.trim().length > 0
//                     ? item.subscription_id.trim()
//                     : defaultSubscription || 'N/A'

//             const group = grouped.get(groupKey) ?? { label: groupLabel, order: groupOrder, quotasMap: new Map() }

//             const quotaList = group.quotasMap.get(quotaName) ?? []
//             quotaList.push({
//                 quotaName,
//                 usagePct,
//                 usageValue,
//                 limitValue,
//                 location: locationName,
//                 subscriptionId,
//             })
//             group.quotasMap.set(quotaName, quotaList)
//             grouped.set(groupKey, group)
//         })

//         return Array.from(grouped.values())
//             .sort((a, b) => a.order - b.order)
//             .map((group) => {
//                 const quotasNodes = Array.from(group.quotasMap.entries()).map(([qName, qList]) => {

//                     let regionsFiltered = onlyWithUsage
//                         ? qList.filter((q) => typeof q.usagePct === 'number')
//                         : qList

//                     regionsFiltered = regionsFiltered.sort((a, b) => {
//                         const va = typeof a.usagePct === 'number' ? a.usagePct : -Infinity
//                         const vb = typeof b.usagePct === 'number' ? b.usagePct : -Infinity
//                         return va - vb
//                     })

//                     // --- NUEVA LOGICA DE SUMA INTELIGENTE ---

//                     // 1. Detectar si la familia de quotas es Global
//                     const isGlobalQuota = regionsFiltered.some(r => isLocationGlobal(r.location))

//                     let totalUsageVal = 0

//                     if (isGlobalQuota) {
//                         // SI ES GLOBAL:
//                         // Asumimos que si aparece múltiples veces para la misma suscripción, son datos repetidos.
//                         // Sumamos el uso SOLO si la suscripción es diferente.
//                         const uniqueUsageBySub = new Map<string, number>()
//                         regionsFiltered.forEach(r => {
//                             if (!uniqueUsageBySub.has(r.subscriptionId)) {
//                                 uniqueUsageBySub.set(r.subscriptionId, r.usageValue ?? 0)
//                             }
//                         })
//                         totalUsageVal = Array.from(uniqueUsageBySub.values()).reduce((acc, v) => acc + v, 0)
//                     } else {
//                         // SI ES REGIONAL:
//                         // Sumamos todo, ya que cada fila representa una región distinta (East US, West Europe, etc.)
//                         // y sus consumos son aditivos.
//                         totalUsageVal = regionsFiltered.reduce((acc, r) => acc + (r.usageValue ?? 0), 0)
//                     }

//                     // 2. Suma de Limites (Solo suma si son suscripciones distintas, no regiones distintas)
//                     const uniqueLimits = new Map<string, number>()
//                     regionsFiltered.forEach((r) => {
//                         const subId = r.subscriptionId
//                         const lim = r.limitValue ?? 0
//                         // Clave única: Suscripción
//                         if (lim > 0 && !uniqueLimits.has(subId)) {
//                             uniqueLimits.set(subId, lim)
//                         }
//                     })
//                     const totalLimitVal = Array.from(uniqueLimits.values()).reduce((acc, v) => acc + v, 0)

//                     const globalPct = totalLimitVal > 0 ? (totalUsageVal / totalLimitVal) * 100 : 0
//                     // ----------------------------------------

//                     const maxUsageInFamily = regionsFiltered.reduce((max, r) => {
//                         const u = typeof r.usagePct === 'number' ? r.usagePct : null
//                         return typeof u === 'number' && u > max ? u : max
//                     }, 0)

//                     const childrenRegions = regionsFiltered.map(r => {
//                         const usage = typeof r.usagePct === 'number' ? r.usagePct : 0
//                         const area = sizeBy === 'quotas' ? 1 : Math.max(usage, 1)
//                         return {
//                             name: r.location,
//                             value: [area, usage],
//                             tooltipData: r,
//                             label: {
//                                 show: true,
//                                 formatter: () => `${ellipsize(r.location, 14)}\n${fmtPct(usage)}`,
//                                 fontSize: 11
//                             }
//                         }
//                     })

//                     if (childrenRegions.length === 0) return null

//                     const familyArea = childrenRegions.reduce((acc, curr) => acc + (curr.value[0] || 0), 0)

//                     return {
//                         name: qName,
//                         value: [familyArea, maxUsageInFamily],
//                         customData: {
//                             totalUsage: totalUsageVal,
//                             totalLimit: totalLimitVal,
//                             globalPct: globalPct,
//                             isGlobal: isGlobalQuota // Pasamos flag por si queremos mostrarlo en tooltip
//                         },
//                         children: childrenRegions,
//                         label: {
//                             show: true,
//                             formatter: (params: unknown) => {
//                                 const name = typeof params?.name === 'string' ? params.name : ''
//                                 const val = params?.data?.value as number[]
//                                 const pct = val?.[1]
//                                 return `${ellipsize(name, 20)}\nMax: ${fmtPct(pct)}`
//                             },
//                             fontSize: 13,
//                             fontWeight: 600
//                         }
//                     }
//                 }).filter(Boolean) as unknown[]

//                 const dayArea = quotasNodes.reduce((acc, curr) => acc + (curr.value[0] || 0), 0)
//                 const dayMax = quotasNodes.reduce((max, curr) => Math.max(max, curr.value[1] || 0), 0)

//                 return {
//                     name: group.label,
//                     value: [dayArea, dayMax],
//                     children: quotasNodes,
//                     label: {
//                         show: true,
//                         formatter: (params: unknown) => {
//                             const name = typeof params?.name === 'string' ? params.name : ''
//                             return `${name}`
//                         },
//                         fontSize: 14,
//                     },
//                 }
//             })
//     }, [data, onlyWithUsage, sizeBy, region, subscription])

//     const hasChartData = useMemo(() => {
//         return treemapData.some(
//             (day) =>
//                 Array.isArray(day.children) && day.children.length > 0
//         )
//     }, [treemapData])

//     const themeColors = useMemo(() => buildThemeColors(isDark), [isDark])

//     const baseOption = useMemo(
//         () =>
//             makeBaseOptions({
//                 legend: false,
//                 showDataZoom: false,
//                 showToolbox: false,
//                 useUTC: true,
//                 metricType: 'percent',
//             }),
//         []
//     )

//     const option = useMemo<EChartsOption>(() => {
//         const stableUpper = {
//             show: true,
//             position: 'inside',
//             height: 22,
//             color: themeColors.text,
//             backgroundColor: themeColors.labelBg,
//             borderColor: themeColors.labelBorder,
//             borderWidth: 1,
//             borderRadius: 6,
//             padding: [2, 6],
//             fontWeight: 600,
//         } as const

//         const levels = [
//             {
//                 itemStyle: {
//                     borderWidth: 0,
//                     gapWidth: 2,
//                     borderColor: themeColors.border,
//                 },
//                 upperLabel: { ...stableUpper, fontSize: 16 },
//             },
//             {
//                 itemStyle: {
//                     borderColor: themeColors.border,
//                     borderWidth: 2,
//                     borderRadius: 6,
//                     gapWidth: 2,
//                     color: themeColors.bgLvl1,
//                 },
//                 upperLabel: { ...stableUpper, fontSize: 14 },
//                 emphasis: {
//                     itemStyle: {
//                         borderColor: themeColors.borderEmph,
//                         borderWidth: 2,
//                     },
//                 },
//             },
//             {
//                 itemStyle: {
//                     borderColor: themeColors.border,
//                     borderWidth: 1,
//                     borderRadius: 4,
//                     gapWidth: 1,
//                     color: themeColors.bgLvl2,
//                 },
//                 upperLabel: {
//                     show: true,
//                     fontSize: 12,
//                     fontWeight: 'bold',
//                     color: themeColors.text,
//                     backgroundColor: 'transparent'
//                 },
//                 label: {
//                     show: true,
//                     position: 'inside',
//                     color: themeColors.text
//                 },
//                 emphasis: {
//                     itemStyle: {
//                         borderColor: themeColors.borderEmph,
//                         borderWidth: 1.5,
//                         shadowBlur: 5,
//                     },
//                 },
//             },
//             {
//                 itemStyle: {
//                     borderWidth: 1,
//                     borderColor: 'rgba(255,255,255,0.2)',
//                     borderRadius: 2,
//                     gapWidth: 0,
//                 },
//                 label: {
//                     show: true,
//                     fontSize: 10,
//                     color: '#fff',
//                     textShadowColor: 'black',
//                     textShadowBlur: 2
//                 },
//             },
//         ]

//         return deepMerge(baseOption, {
//             backgroundColor: 'transparent',
//             textStyle: { color: themeColors.text },
//             title: {
//                 text: 'Azure Heatmap Quotas',
//                 left: 'center',
//                 textStyle: { color: themeColors.text },
//             },
//             xAxis: undefined,
//             yAxis: undefined,
//             toolbox: {
//                 show: true,
//                 orient: 'horizontal',
//                 feature: { restore: { show: true }, saveAsImage: { show: true } },
//                 right: 10,
//                 iconStyle: { borderColor: themeColors.text },
//             },
//             tooltip: {
//                 trigger: 'item',
//                 confine: true,
//                 appendToBody: true,
//                 backgroundColor: themeColors.tooltipBg,
//                 borderColor: themeColors.border,
//                 borderWidth: 1,
//                 textStyle: { color: themeColors.text },
//                 formatter: (params: unknown) => {
//                     const level = params?.treePathInfo?.length ?? 0
//                     const name = typeof params?.name === 'string' ? params.name : ''
//                     const valueArray: number[] = params?.data?.value ?? []
//                     const colorPct = valueArray[1] ?? 0

//                     if (level === 4 && params?.data?.tooltipData) {
//                         const info = params.data.tooltipData as AzureQuotaEntry
//                         const usageValueText =
//                             typeof info.usageValue === 'number' ? info.usageValue.toLocaleString() : 'N/A'
//                         const limitValueText =
//                             typeof info.limitValue === 'number' ? info.limitValue.toLocaleString() : 'N/A'

//                         return `
//                             <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(info.quotaName, 60)}</div>
//                             <div><b>Región:</b> ${info.location}</div>
//                             <div><b>Consumo:</b> ${fmtPct(info.usagePct)}</div>
//                             <div><b>Uso/Límite:</b> ${usageValueText} / ${limitValueText}</div>
//                         `
//                     }

//                     if (level === 3) {
//                         const children = (params?.data?.children || []) as { name: string; value: number[] }[]
//                         const custom = params?.data?.customData as { totalUsage: number; totalLimit: number; globalPct: number; isGlobal: boolean } | undefined

//                         const globalPctStr = custom ? fmtPct(custom.globalPct) : 'N/A'
//                         const totalUsageStr = custom ? custom.totalUsage.toLocaleString() : 'N/A'
//                         const totalLimitStr = custom ? custom.totalLimit.toLocaleString() : 'N/A'
//                         const typeLabel = custom?.isGlobal ? '(Recurso Global)' : '(Recurso Regional)'

//                         const limitTags = 12
//                         const visibleChildren = children.slice(0, limitTags)
//                         const remaining = children.length - limitTags

//                         const badgesHtml = visibleChildren.map(child => {
//                             return `<span style="
//                                 display: inline-block;
//                                 padding: 2px 6px;
//                                 margin: 2px;
//                                 border-radius: 4px;
//                                 background-color: ${themeColors.badgeBg};
//                                 border: 1px solid ${themeColors.badgeBorder};
//                                 font-size: 10px;
//                                 color: ${themeColors.text};
//                                 white-space: nowrap;
//                             ">${ellipsize(child.name, 12)}</span>`
//                         }).join('')

//                         const moreHtml = remaining > 0
//                             ? `<span style="font-size:10px;color:${themeColors.subText};margin-left:4px;">+${remaining} más...</span>`
//                             : ''

//                         return `
//                             <div style="font-weight:700;margin-bottom:2px;color:${themeColors.text}">${ellipsize(name, 60)}</div>
//                             <div style="font-size:10px;color:${themeColors.subText};margin-bottom:6px;">Familia de Quota ${typeLabel}</div>
//                             <div style="margin-bottom:2px;"><b>Consumo total:</b> ${globalPctStr}</div>
//                             <div style="margin-bottom:6px; font-size:11px; opacity:0.8;"><b>Acumulado (Uso / Limite):</b> ${totalUsageStr} / ${totalLimitStr}</div>
                            
//                             <div style="margin-top:4px;display:flex;flex-wrap:wrap;align-items:center;max-width:280px;">
//                                 ${badgesHtml}
//                                 ${moreHtml}
//                             </div>
//                         `
//                     }

//                     return `
//                         <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(name, 64)}</div>
//                         <div><b>Max %:</b> ${fmtPct(colorPct)}</div>
//                     `
//                 },
//             },
//             visualMap: {
//                 min: 0,
//                 max: 100,
//                 type: 'continuous',
//                 orient: 'vertical',
//                 right: 10,
//                 top: 60,
//                 formatter: (v: number) => `${v}%`,
//                 text: ['Alto', 'Bajo'],
//                 textStyle: { color: themeColors.subText },
//                 calculable: true,
//                 inRange: { color: themeColors.visualMap },
//                 outOfRange: { color: ['#9ca3af'] },
//             },
//             series: [
//                 {
//                     type: 'treemap',
//                     visibleMin: 0,
//                     roam: true,
//                     nodeClick: 'zoomToNode',
//                     breadcrumb: {
//                         show: true,
//                         left: 10,
//                         top: 10,
//                         itemStyle: { color: 'transparent', textStyle: { color: themeColors.breadcrumb } },
//                     },
//                     squareRatio: 1.0,
//                     leafDepth: 2,
//                     visualDimension: 1,
//                     visualMin: 0,
//                     visualMax: 100,
//                     colorMappingBy: 'value',
//                     itemStyle: {
//                         borderRadius: 4,
//                         borderWidth: 1,
//                         borderColor: themeColors.border,
//                         gapWidth: 1,
//                     },
//                     upperLabel: {
//                         show: true,
//                         height: 22,
//                         color: themeColors.text,
//                         backgroundColor: themeColors.labelBg,
//                         borderColor: themeColors.labelBorder,
//                         borderWidth: 1,
//                         borderRadius: 6,
//                         padding: [2, 6],
//                     },
//                     levels,
//                     data: hasChartData ? treemapData : [],
//                 },
//             ],
//             animation: true,
//         })
//     }, [baseOption, themeColors, treemapData, hasChartData, sizeBy, isDark])

//     useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

//     if (error)
//         return (
//             <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
//                 Error al cargar datos de Azure.
//             </div>
//         )

//     return (
//         <div className="flex flex-col gap-4 p-5 mt-10">
//             <div className="flex flex-wrap items-start gap-3">
//                 <h1 className="text-lg font-semibold">Heatmap</h1>

//                 <div className="ml-auto flex flex-wrap items-center gap-3">
//                     <div className="flex flex-col gap-1">
//                         <Label htmlFor="heatmap-size-by" className="text-xs font-medium uppercase text-muted-foreground">
//                             Area por
//                         </Label>
//                         <Select value={sizeBy} onValueChange={(value) => setSizeBy(value as SizeBy)}>
//                             <SelectTrigger id="heatmap-size-by" className="h-9 min-w-[200px]">
//                                 <SelectValue placeholder="Selecciona criterio" />
//                             </SelectTrigger>
//                             <SelectContent align="end">
//                                 <SelectItem value="quotas">Igualdad (1 región = 1 unidad)</SelectItem>
//                                 <SelectItem value="maxUsage">Uso (% de consumo)</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="flex items-center gap-2 rounded-md border px-3 py-2">
//                         <Checkbox
//                             id="heatmap-only-with-usage"
//                             checked={onlyWithUsage}
//                             onCheckedChange={(checked) => setOnlyWithUsage(Boolean(checked))}
//                         />
//                         <Label htmlFor="heatmap-only-with-usage" className="text-sm leading-none">
//                             Solo quotas con uso
//                         </Label>
//                     </div>
//                 </div>
//             </div>

//             <div className="relative min-h-[480px]">
//                 {!isLoading && !hasChartData && (
//                     <div className="absolute inset-0 z-20 grid place-items-center rounded-lg border border-dashed bg-background/70 text-sm text-muted-foreground">
//                         No hay datos disponibles para el rango seleccionado.
//                     </div>
//                 )}

//                 {isLoading && (
//                     <div className="absolute inset-0 z-30 grid place-items-center rounded-lg bg-background/60 backdrop-blur-sm dark:bg-background/70">
//                         <LoaderComponent />
//                     </div>
//                 )}

//                 <div ref={chartRef} className="h-[100vh] min-h-[480px] w-full rounded-lg" />
//             </div>
//         </div>
//     )
// }