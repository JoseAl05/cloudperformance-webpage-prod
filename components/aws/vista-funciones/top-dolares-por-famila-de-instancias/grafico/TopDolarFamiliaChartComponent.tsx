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

interface TopDolarFamiliaChartComponentProps {
    data: unknown[] | { data?: unknown[] }
    selectedFamily: string
    setSelectedFamily: React.Dispatch<React.SetStateAction<string | null>>
    tipoCosto: 'costo_neto' | 'costo_bruto'
    topLimit: number | 'all'
    uiTuning?: UiTuning
    detailsEnabled?: boolean
    isBilling?:boolean;
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

export const TopDolarFamiliaChartComponent = ({
    data,
    selectedFamily,
    setSelectedFamily,
    tipoCosto,
    topLimit,
    uiTuning,
    detailsEnabled = true,
    isBilling = true
}: TopDolarFamiliaChartComponentProps) => {
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

        const seriesData = services.map((service) => ({
            name: service,
            kind: 'bar' as const,
            extra: { stack: 'total' },
            data: sortedFamilies.map(({ family }) => dataMap.get(family)?.get(service) || 0),
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
        const seriesData = [
            {
                name: 'Costo',
                kind: 'bar' as const,
                data: sortedServices.map((s) => s.total),
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

        const tooltipFormatter = (params: unknown) => {
            const list = Array.isArray(params) ? (params as unknown[]) : []
            const visible = list.filter((p) => toNumber((p as Record<string, unknown>).value) > 0)

            const axisValue = getStr((list[0] as Record<string, unknown>)?.axisValue)
            const total = visible.reduce((sum, p) => sum + toNumber((p as Record<string, unknown>).value), 0)
            const lines = visible.map((p) => {
                const pr = p as Record<string, unknown>
                const marker = getStr(pr.marker)
                const sName = getStr(pr.seriesName)
                const val = toNumber(pr.value).toFixed(2)
                return `${marker} ${sName}: ${unitMeasure}${val}`
            })

            const header = isDetail
                ? `<strong>Total: ${unitMeasure}${total.toFixed(2)}</strong>`
                : `<strong>${axisValue} - Total: ${unitMeasure}${total.toFixed(2)}</strong>`

            return `${header}<br/>${lines.length ? lines.join('<br/>') : '<em>Sin datos</em>'}`
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
