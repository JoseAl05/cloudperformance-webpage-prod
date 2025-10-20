'use client'

import useSWR from 'swr'
import React, { useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import type { EChartsOption } from 'echarts'
import { LoaderComponent } from '@/components/general/LoaderComponent'

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

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

interface HeatmapQuotasComponentProps {
    startDate: Date
    endDate: Date | null
}

type SizeBy = 'quotas' | 'maxUsage'

const fmtPct = (v: number | null | undefined) =>
    typeof v === 'number' && !Number.isNaN(v) ? `${v.toFixed(1)}%` : 'N/A'

const ellipsize = (s: string, max = 28) =>
    s?.length > max ? `${s.slice(0, Math.max(0, max - 3))}...` : s

const extractResources = (input: unknown): string[] => {
    if (!Array.isArray(input)) return []
    return input
        .map((item) => {
            if (item && typeof item === 'object' && 'Resource' in item) {
                const value = (item as { Resource?: unknown }).Resource
                return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
            }
            return null
        })
        .filter((value): value is string => Boolean(value))
}

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

export const HeatmapQuotasComponent = ({ startDate, endDate }: HeatmapQuotasComponentProps) => {
    const { theme, resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme ?? theme
    const isDark = currentTheme === 'dark'

    const chartRef = useRef<HTMLDivElement>(null)
    const [sizeBy, setSizeBy] = useState<SizeBy>('maxUsage')
    const [onlyWithUsage, setOnlyWithUsage] = useState(true)

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const { data, error, isLoading } = useSWR(
        `/api/aws/bridge/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by_quota=true`,
        fetcher
    )

    const treemapData = useMemo(() => {
        if (!Array.isArray(data)) return []

        return data.map((day) => {
            const dateName = new Date(day?.sync_time?.$date ?? Date.now()).toLocaleDateString()
            const services = Array.isArray(day?.services) ? day.services : []

            const serviceNodes = services.map((svc) => {
                const quotasRaw = Array.isArray(svc?.Quotas) ? svc.Quotas : []

                let quotasFiltered = onlyWithUsage
                    ? quotasRaw.filter((q) => typeof q?.Quota_Usage_Percentage === 'number')
                    : quotasRaw

                quotasFiltered = [...quotasFiltered].sort((a, b) => {
                    const va = typeof a?.Quota_Usage_Percentage === 'number' ? a.Quota_Usage_Percentage : -Infinity
                    const vb = typeof b?.Quota_Usage_Percentage === 'number' ? b.Quota_Usage_Percentage : -Infinity
                    return va - vb
                })

                const maxUsage = quotasFiltered.reduce((max, quota) => {
                    const usage = typeof quota?.Quota_Usage_Percentage === 'number' ? quota.Quota_Usage_Percentage : null
                    return typeof usage === 'number' && usage > max ? usage : max
                }, 0)

                const areaValue =
                    sizeBy === 'quotas' ? Math.max(quotasFiltered.length, 1) : Math.max(maxUsage, 1)

                const quotaChildren = quotasFiltered.map((quota) => {
                    const usage = typeof quota?.Quota_Usage_Percentage === 'number' ? quota.Quota_Usage_Percentage : 0
                    const resources = extractResources(quota?.Resources)
                    return {
                        name: quota?.QuotaName ?? 'Quota',
                        value: [1, usage],
                        tooltipData: {
                            service: svc?.ServiceName ?? 'Service',
                            quota: quota?.QuotaName ?? 'Quota',
                            usage,
                            value: quota?.Value,
                            resources,
                        },
                        label: {
                            show: true,
                            formatter: () => `${ellipsize(quota?.QuotaName ?? 'Quota', 26)}\n${fmtPct(usage)}`,
                            fontSize: 12,
                        },
                    }
                })

                return {
                    name: svc?.ServiceName ?? 'Service',
                    value: [areaValue, maxUsage],
                    children: quotaChildren,
                    label: {
                        show: true,
                        formatter: (params: unknown) => {
                            const [area, colorPct] = (params?.data?.value as number[]) ?? [0, 0]
                            const quotaCount = quotasFiltered.length
                            const labelName = typeof params?.name === 'string' ? params.name : ''
                            return `${ellipsize(labelName, 22)}\n${quotaCount} quotas - max ${fmtPct(colorPct)}`
                        },
                        fontSize: 12,
                    },
                }
            })

            const sortedServices = serviceNodes.sort((a: unknown, b: unknown) => {
                const va = Array.isArray(a?.value) ? a.value[1] ?? -Infinity : -Infinity
                const vb = Array.isArray(b?.value) ? b.value[1] ?? -Infinity : -Infinity
                return va - vb
            })

            const dayArea = sortedServices.reduce((total: number, svc: unknown) => total + (svc?.value?.[0] ?? 0), 0)
            const dayMax = sortedServices.reduce(
                (max: number, svc: unknown) => Math.max(max, svc?.value?.[1] ?? 0),
                0
            )

            return {
                name: dateName,
                value: [Math.max(dayArea, 1), dayMax],
                children: sortedServices,
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
    }, [data, sizeBy, onlyWithUsage])

    const hasChartData = useMemo(() => {
        return treemapData.some(
            (day) =>
                Array.isArray(day.children) &&
                day.children.some(
                    (svc: unknown) => Array.isArray(svc.children) && svc.children.length > 0
                )
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
                text: 'Heatmap Quotas',
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
                            service: string
                            quota: string
                            usage: number
                            value: unknown
                            resources: string[]
                        }
                        const resources = info.resources?.length ? info.resources.join(', ') : 'N/A'
                        return `
                            <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(info.quota, 60)}</div>
                            <div><b>Servicio:</b> ${ellipsize(info.service, 48)}</div>
                            <div><b>Uso:</b> ${fmtPct(info.usage)}</div>
                            <div><b>Valor cuota:</b> ${info.value ?? 'N/A'}</div>
                            <div><b>Recursos:</b> ${resources}</div>
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
                Error al cargar datos.
            </div>
        )

    return (
        <div className="flex flex-col gap-4 p-5">
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
