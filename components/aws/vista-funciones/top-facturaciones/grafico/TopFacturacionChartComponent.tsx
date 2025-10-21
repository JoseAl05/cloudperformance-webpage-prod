'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import * as echarts from 'echarts'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

interface LegendCfg {
    type?: 'plain' | 'scroll'
    orient?: 'horizontal' | 'vertical'
    top?: number | string
    bottom?: number | string
    left?: number | string
    right?: number | string
}

interface UiTuning {
    yLabelStrategy?: 'truncate' | 'fit'
    yLabelMaxChars?: number
    yLabelFontSize?: number
    gridMinLeft?: number
    gridMaxLeft?: number
    axisLabelInterval?: number | 'auto'
    legend?: LegendCfg
}

interface TopFacturacionChartComponentProps {
    data: unknown[] | { data?: unknown[] }
    selectedFamily: string
    setSelectedFamily: React.Dispatch<React.SetStateAction<string | null>>
    tipoCosto: 'costo_neto' | 'costo_bruto'
    topLimit: number | 'all'
    uiTuning?: UiTuning
    detailsEnabled?: boolean
    isBilling?: boolean;
}

type CostKey = 'costo_neto' | 'costo_bruto'

const toNumber = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
}

const getStr = (v: unknown) => (typeof v === 'string' ? v : String(v ?? ''))

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

export const TopFacturacionChartComponent = ({
    data,
    selectedFamily,
    setSelectedFamily,
    tipoCosto,
    topLimit,
    uiTuning,
    detailsEnabled = true,
    isBilling = true
}: TopFacturacionChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme || theme
    const isDark = currentTheme === 'dark'

    const chartRef = useRef<HTMLDivElement>(null)

    const unitMeasure = isBilling ? '$' : '';

    const rows: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { data?: unknown[] })?.data)
            ? ((data as { data?: unknown[] }).data as unknown[])
            : []
    const filteredData = useMemo(() => {
        const key: CostKey = tipoCosto
        return rows.filter((item) => toNumber((item as Record<string, unknown>)[key]) > 0)
    }, [rows, tipoCosto])

    const mainView = useMemo(() => {
        const key: CostKey = tipoCosto

        const services = Array.from(
            new Set(filteredData.map((item) => getStr((item as Record<string, unknown>).service_dimension)))
        )


        const dataMap = new Map<string, Map<string, number>>()

        const familyTotals: Record<string, number> = {}

        filteredData.forEach((raw) => {
            const row = raw as Record<string, unknown>
            const family = getStr(row.dimension) || 'N/D'
            const service = getStr(row.service_dimension) || 'N/D'
            const cost = toNumber(row[key])

            familyTotals[family] = (familyTotals[family] || 0) + cost

            if (!dataMap.has(family)) dataMap.set(family, new Map<string, number>())
            const serviceMap = dataMap.get(family)!
            serviceMap.set(service, (serviceMap.get(service) || 0) + cost)
        })


        let sortedFamilies = Object.entries(familyTotals)
            .map(([family, total]) => ({ family, total }))
            .sort((a, b) => b.total - a.total)

        if (topLimit !== 'all') {
            sortedFamilies = sortedFamilies.slice(0, topLimit)
        }

        const enableLargeMode = services.length > 14 || sortedFamilies.length > 20
        const performanceExtra = enableLargeMode
            ? {
                large: true,
                largeThreshold: 200,
                progressive: 600,
                progressiveThreshold: 3000,
                progressiveChunkMode: 'mod' as const,
                animation: false,
                animationDuration: 0,
                animationDurationUpdate: 0,
            }
            : {}

        const seriesData = services.map((service) => ({
            name: service,
            kind: 'bar' as const,
            extra: {
                stack: 'total',
                ...performanceExtra,
            },
            data: sortedFamilies.map(({ family }) => [
                dataMap.get(family)?.get(service) || 0,
                family,
            ]),
        }))

        const yCategories = sortedFamilies.map((f) => f.family)

        return { services, seriesData, yCategories, familyTotals }
    }, [filteredData, tipoCosto, topLimit])

    const detailView = useMemo(() => {
        if (!detailsEnabled || !selectedFamily) return null

        const key: CostKey = tipoCosto
        const familyRows = filteredData.filter(
            (raw) => getStr((raw as Record<string, unknown>).dimension) === selectedFamily
        )

        const serviceTotals: Record<string, number> = {}
        familyRows.forEach((raw) => {
            const row = raw as Record<string, unknown>
            const service = getStr(row.service_dimension) || 'N/D'
            serviceTotals[service] = (serviceTotals[service] || 0) + toNumber(row[key])
        })

        const sortedServices = Object.entries(serviceTotals)
            .map(([service, total]) => ({ service, total }))
            .filter((s) => s.total > 0)
            .sort((a, b) => b.total - a.total)

        const yCategories = sortedServices.map((s) => s.service)
        const enableDetailLargeMode = yCategories.length > 32
        const seriesData = [
            {
                name: 'Costo',
                kind: 'bar' as const,
                data: sortedServices.map((s) => [s.total, s.service]),
                extra: enableDetailLargeMode
                    ? {
                        large: true,
                        largeThreshold: 200,
                        progressive: 500,
                        progressiveThreshold: 2000,
                        progressiveChunkMode: 'mod',
                        animation: false,
                        animationDuration: 0,
                        animationDurationUpdate: 0,
                    }
                    : undefined,
            },
        ]

        return { yCategories, seriesData }
    }, [filteredData, selectedFamily, tipoCosto, detailsEnabled])

    const yLabels = useMemo(() => {
        return detailsEnabled && selectedFamily && detailView ? detailView.yCategories : mainView.yCategories
    }, [detailsEnabled, selectedFamily, detailView, mainView])

    const dynamicLeft = useMemo(() => {
        const fontSize = uiTuning?.yLabelFontSize ?? 12
        const minLeft = uiTuning?.gridMinLeft ?? 150
        const maxLeft = uiTuning?.gridMaxLeft ?? 300
        const factor = 0.62
        const longest = yLabels.reduce((m, lbl) => Math.max(m, getStr(lbl).length), 0)
        const computed = Math.round(longest * fontSize * factor) + 80
        return clamp(computed, minLeft, maxLeft)
    }, [yLabels, uiTuning?.yLabelFontSize, uiTuning?.gridMinLeft, uiTuning?.gridMaxLeft])

    const option = useMemo(() => {
        const isDetail = Boolean(detailsEnabled && selectedFamily && detailView)

        const legendItems = isDetail ? [] : mainView.services
        const base = makeBaseOptions({
            legend: legendItems,
            unitLabel: isBilling ? 'USD' : 'Recursos',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
            legendConfig: {
                type: uiTuning?.legend?.type ?? 'scroll',
                orient: uiTuning?.legend?.orient ?? 'horizontal',
                bottom: uiTuning?.legend?.bottom ?? 8,
                left: uiTuning?.legend?.left ?? 'center',
                right: uiTuning?.legend?.right,
                top: uiTuning?.legend?.top,
                selectedMode: 'multiple',
            },
        })
        const performanceSeries = isDetail ? detailView?.seriesData ?? [] : mainView.seriesData
        const visibleCategories = isDetail ? detailView?.yCategories ?? [] : mainView.yCategories
        const shouldDisableAnimation =
            visibleCategories.length > 25 ||
            (!isDetail && performanceSeries.length > 20)
        if (shouldDisableAnimation) {
            Object.assign(base, {
                animation: false,
                animationDuration: 0,
                animationDurationUpdate: 0,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear',
                animationDelay: 0,
                animationDelayUpdate: 0,
                stateAnimation: { duration: 0 },
                universalTransition: false,
            })
            base.toolbox = undefined
        }

        const readValue = (raw: unknown) => {
            if (Array.isArray(raw)) {
                return toNumber(raw[0])
            }
            return toNumber(raw)
        }

        const tooltipFormatter = (params: unknown) => {
            const list = Array.isArray(params) ? (params as unknown[]) : []
            const visible = list.filter((p) => readValue((p as Record<string, unknown>).value) > 0)
            const sorted = visible.slice().sort((a, b) => {
                const aVal = readValue((a as Record<string, unknown>).value)
                const bVal = readValue((b as Record<string, unknown>).value)
                return bVal - aVal
            })

            const axisValue = getStr((list[0] as Record<string, unknown>)?.axisValue)
            const total = sorted.reduce((sum, p) => sum + readValue((p as Record<string, unknown>).value), 0)
            const lines = sorted.map((p) => {
                const pr = p as Record<string, unknown>
                const marker = getStr(pr.marker)
                const sName = getStr(pr.seriesName)
                const val = readValue(pr.value).toFixed(2)
                return `${marker} ${sName}: ${unitMeasure}${val}`
            })

            const header = isDetail
                ? `<strong>Total: ${unitMeasure}${total.toFixed(2)}</strong>`
                : `<strong>${axisValue} - Total: ${unitMeasure}${total.toFixed(2)}</strong>`

            const bodyContent = lines.length ? lines.join('<br/>') : '<em>Sin datos</em>'
            const scrollable = `<div style="max-height: 220px; overflow-y: auto; margin-top: 6px; padding-right: 6px;">${bodyContent}</div>`

            return `<div>${header}${scrollable}</div>`
        }

        const yFormatterMain = (value: unknown) => {
            const label = getStr(value)
            const max = uiTuning?.yLabelMaxChars ?? 36
            const show =
                uiTuning?.yLabelStrategy === 'truncate' && label.length > max ? `${label.slice(0, max - 1)}…` : label
            const total = mainView.familyTotals[label] || 0
            return `${show} (${unitMeasure}${total.toFixed(2)})`
        }
        const yFormatterDetail = (value: unknown) => {
            const label = getStr(value)
            const max = uiTuning?.yLabelMaxChars ?? 36
            return uiTuning?.yLabelStrategy === 'truncate' && label.length > max ? `${label.slice(0, max - 1)}…` : label
        }

        const gridLeft = uiTuning?.yLabelStrategy === 'fit' ? dynamicLeft : (uiTuning?.gridMinLeft ?? 150)

        const extraOption = isDetail
            ? {
                grid: { left: gridLeft, right: 16, top: 56, bottom: 64, containLabel: true },
                xAxis: { type: 'value', name: isBilling ? 'USD' : 'Recursos' },
                yAxis: {
                    type: 'category',
                    data: detailView?.yCategories ?? [],
                    inverse: true,
                    axisLabel: {
                        interval: uiTuning?.axisLabelInterval ?? 'auto',
                        fontSize: uiTuning?.yLabelFontSize ?? 12,
                        formatter: yFormatterDetail,
                    },
                },
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        filterMode: 'weakFilter',
                        width: 15,
                        right: 10,
                        start: 0,
                        end: 100,
                        handleSize: '80%',
                        showDataShadow: false,
                        labelFormatter: '',
                    },
                    { type: 'inside', yAxisIndex: 0, filterMode: 'weakFilter', start: 0, end: 100 },
                ],
                tooltip: {
                    triggerOn: 'mousemove|click',
                    enterable: true,
                    confine: true,
                },
            }
            : {
                grid: { left: gridLeft, right: 16, top: 56, bottom: 64, containLabel: true },
                xAxis: { type: 'value', name: isBilling ? 'USD' : 'Recursos' },
                yAxis: {
                    type: 'category',
                    data: mainView.yCategories,
                    name: 'Categorías',
                    inverse: true,
                    axisLabel: {
                        interval: uiTuning?.axisLabelInterval ?? 'auto',
                        fontSize: uiTuning?.yLabelFontSize ?? 12,
                        formatter: yFormatterMain,
                    },
                },
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        filterMode: 'weakFilter',
                        width: 15,
                        right: 10,
                        start: 0,
                        end: 100,
                        handleSize: '80%',
                        showDataShadow: false,
                        labelFormatter: '',
                    },
                    { type: 'inside', yAxisIndex: 0, filterMode: 'weakFilter', start: 0, end: 100 },
                ],
                tooltip: {
                    triggerOn: 'mousemove|click',
                    enterable: true,
                    confine: true,
                },
            }

        const series = (isDetail ? detailView?.seriesData : mainView.seriesData) ?? []

        const built = createChartOption({
            kind: 'bar',
            legend: !isDetail,
            tooltip: true,
            tooltipFormatter,
            xAxisType: 'value',
            series,
            extraOption,
        })

        return deepMerge(base, built)
    }, [detailView, mainView, selectedFamily, uiTuning, dynamicLeft, detailsEnabled])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

    useEffect(() => {
        if (!detailsEnabled) return
        if (!chartRef.current) return
        const inst = echarts.getInstanceByDom(chartRef.current)
        if (!inst) return

        const handler = (params: unknown) => {
            if (selectedFamily) return
            const p = params as Record<string, unknown>
            const name = getStr(p.name)
            if (name) setSelectedFamily(name)
        }

        const ec = inst as unknown as {
            on: (e: string, h: (p: unknown) => void) => void
            off: (e?: string, h?: (p: unknown) => void) => void
        }

        ec.off('click')
        ec.on('click', handler)

        return () => {
            ec.off('click', handler)
        }
    }, [detailsEnabled, selectedFamily, setSelectedFamily, option])

    return (
        <>
            {detailsEnabled && selectedFamily && (
                <Button
                    onClick={() => setSelectedFamily(null)}
                    className="absolute top-4 left-4 px-3 py-1 rounded text-sm z-10 bg-blue-600 text-white hover:bg-blue-700"
                >
                    ← Volver
                </Button>
            )}
            <div ref={chartRef} className="w-full h-[600px]" />
        </>
    )
}
