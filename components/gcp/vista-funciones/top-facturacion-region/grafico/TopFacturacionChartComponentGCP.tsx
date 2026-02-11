'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import * as echarts from 'echarts'
import {
  createChartOption,
  deepMerge,
  makeBaseOptions,
  useECharts,
} from '@/lib/echartsGlobalConfig'

/* =========================
   Types
========================= */

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

interface TopFacturacionChartComponentGCPProps {
  data: unknown[] | { data?: unknown[] }
  selectedRegion: string | null
  setSelectedRegion: React.Dispatch<React.SetStateAction<string | null>>
  tipoCosto: 'cost_net_usd' | 'cost_gross_usd'
  topLimit: number | 'all'
  uiTuning?: UiTuning
  detailsEnabled?: boolean
  isBilling?: boolean
}

type CostKey = 'cost_net_usd' | 'cost_gross_usd'

/* =========================
   Utils
========================= */

const toNumber = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const getStr = (v: unknown) => (typeof v === 'string' ? v : String(v ?? ''))

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

/* =========================
   Component
========================= */

export const TopFacturacionChartComponentGCP = ({
  data,
  selectedRegion,
  setSelectedRegion,
  tipoCosto,
  topLimit,
  uiTuning,
  detailsEnabled = true,
  isBilling = true,
}: TopFacturacionChartComponentGCPProps) => {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === 'dark'

  const chartRef = useRef<HTMLDivElement>(null)
  const unitMeasure = isBilling ? '$' : ''

  const rows: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown[] })?.data)
    ? ((data as { data?: unknown[] }).data as unknown[])
    : []

  /* =========================
     Filtrado base
  ========================= */

  const filteredData = useMemo(() => {
    const key: CostKey = tipoCosto
    return rows.filter((r) => toNumber((r as Record<string, unknown>)[key]) > 0)
  }, [rows, tipoCosto])

  /* =========================
     Vista principal (Regiones)
  ========================= */

  const mainView = useMemo(() => {
    const key: CostKey = tipoCosto

    const services = Array.from(
      new Set(
        filteredData.map((r) =>
          getStr((r as Record<string, unknown>).service_description),
        ),
      ),
    )

    const regionTotals: Record<string, number> = {}
    const dataMap = new Map<string, Map<string, number>>()

    filteredData.forEach((raw) => {
      const row = raw as Record<string, unknown>
      const region = getStr(row.location_region) || 'N/D'
      const service = getStr(row.service_description) || 'N/D'
      const cost = toNumber(row[key])

      regionTotals[region] = (regionTotals[region] || 0) + cost

      if (!dataMap.has(region)) dataMap.set(region, new Map())
      const m = dataMap.get(region)!
      m.set(service, (m.get(service) || 0) + cost)
    })

    let sortedRegions = Object.entries(regionTotals)
      .map(([region, total]) => ({ region, total }))
      .sort((a, b) => b.total - a.total)

    if (topLimit !== 'all') {
      sortedRegions = sortedRegions.slice(0, topLimit)
    }

    const seriesData = services.map((service) => ({
      name: service,
      kind: 'bar' as const,
      extra: { stack: 'total' },
      data: sortedRegions.map(({ region }) => [
        dataMap.get(region)?.get(service) || 0,
        region,
      ]),
    }))

    return {
      services,
      seriesData,
      regions: sortedRegions.map((r) => r.region),
      totals: regionTotals,
    }
  }, [filteredData, tipoCosto, topLimit])

  /* =========================
     Vista detalle (Servicios)
  ========================= */

  const detailView = useMemo(() => {
    if (!detailsEnabled || !selectedRegion) return null

    const key: CostKey = tipoCosto
    const rowsRegion = filteredData.filter(
      (r) =>
        getStr((r as Record<string, unknown>).location_region) === selectedRegion,
    )

    const totals: Record<string, number> = {}
    rowsRegion.forEach((raw) => {
      const row = raw as Record<string, unknown>
      const service = getStr(row.service_description) || 'N/D'
      totals[service] = (totals[service] || 0) + toNumber(row[key])
    })

    const sorted = Object.entries(totals)
      .map(([service, total]) => ({ service, total }))
      .sort((a, b) => b.total - a.total)

    return {
      categories: sorted.map((s) => s.service),
      seriesData: [
        {
          name: 'Costo',
          kind: 'bar' as const,
          data: sorted.map((s) => [s.total, s.service]),
        },
      ],
    }
  }, [filteredData, selectedRegion, tipoCosto, detailsEnabled])

  /* =========================
     Labels & grid dinámico
  ========================= */

  const yLabels = useMemo(
    () =>
      detailsEnabled && selectedRegion && detailView
        ? detailView.categories
        : mainView.regions,
    [detailsEnabled, selectedRegion, detailView, mainView],
  )

  const dynamicLeft = useMemo(() => {
    const fontSize = uiTuning?.yLabelFontSize ?? 12
    const minLeft = uiTuning?.gridMinLeft ?? 150
    const maxLeft = uiTuning?.gridMaxLeft ?? 320
    const longest = yLabels.reduce(
      (m, l) => Math.max(m, getStr(l).length),
      0,
    )
    const computed = Math.round(longest * fontSize * 0.62) + 80
    return clamp(computed, minLeft, maxLeft)
  }, [yLabels, uiTuning])

  /* =========================
     Option
  ========================= */

  const option = useMemo(() => {
    const isDetail = Boolean(detailsEnabled && selectedRegion && detailView)

    const base = makeBaseOptions({
      legend: isDetail ? [] : mainView.services,
      unitLabel: 'USD',
      showToolbox: true,
      legendConfig: {
        type: uiTuning?.legend?.type ?? 'scroll',
        orient: 'horizontal',
        bottom: 40, 
        left: 'center',
      },
    })

    const built = createChartOption({
      kind: 'bar',
      legend: !isDetail,
      xAxisType: 'value',
      tooltip: true,
      series: isDetail
        ? detailView?.seriesData ?? []
        : mainView.seriesData,
      extraOption: {
      grid: {
        left: 10,
        right: 16,
        top: 56,
        bottom: 120, 
        containLabel: true,
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: isDetail
            ? detailView?.categories ?? []
            : mainView.regions,
        },
        xAxis: {
          type: 'value',
          name: 'USD',
        },
        dataZoom: [
          { type: 'inside', yAxisIndex: 0 },
          { type: 'slider', yAxisIndex: 0, right: 6, width: 12 },
        ],
      },
    })

    return deepMerge(base, built)
  }, [
    mainView,
    detailView,
    selectedRegion,
    detailsEnabled,
    dynamicLeft,
    uiTuning,
  ])

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

/* =========================
      Click drilldown
  ========================= */

  useEffect(() => {
    if (!detailsEnabled || !chartRef.current) return

    const inst = echarts.getInstanceByDom(chartRef.current)
    if (!inst) return

    const handler = (params: unknown) => {
      if (selectedRegion) return 
      
      const p = params as { name?: string }
      if (p.name) setSelectedRegion(p.name)
    }

    inst.off('click')
    inst.on('click', handler)

    return () => {
      inst.off('click', handler)
    }
    
  }, [detailsEnabled, selectedRegion, setSelectedRegion, option])

  /* =========================
     Render
  ========================= */

  return (
      <div className="relative w-full">
        {detailsEnabled && selectedRegion && (
          // Envolvemos el botón y el título en un div contenedor
          <div className="absolute top-2 left-2 z-20 flex items-center gap-3">
            <Button
              onClick={() => setSelectedRegion(null)}
              size="sm"
              variant="secondary"
              className="shadow-sm"
            >
              ← Volver
            </Button>
            
            {/* Aquí agregamos el título dinámico */}
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md border shadow-sm">
              <span className="text-sm text-muted-foreground mr-1">Detalle:</span>
              <span className="font-bold text-foreground">{selectedRegion}</span>
            </div>
          </div>
        )}

        <div ref={chartRef} className="w-full h-[600px]" />
      </div>
    )
}