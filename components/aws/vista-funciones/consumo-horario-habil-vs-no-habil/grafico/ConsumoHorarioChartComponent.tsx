'use client'
import { useMemo, useRef } from 'react'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'
import { useTheme } from 'next-themes'

interface ConsumoHorarioChartComponentProps {
    data: unknown[];
    metric: string;
    metricUnits: Record<string, string>;
}


export const ConsumoHorarioChartComponent = ({ data, metric, metricUnits }: ConsumoHorarioChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { valoresHabil, valoresNoHabil, times } = useMemo(() => {
        const empty = { valoresHabil: [] as (number | null)[], valoresNoHabil: [] as (number | null)[], times: [] as string[] }

        const raw = (data && (data as unknown).data && Array.isArray((data as unknown).data)) ? (data as unknown).data as unknown[] : null
        if (!raw) return empty

        const bytesToMB = (v: number) => (v ?? 0) / (1024 * 1024)

        const dataFormatted = raw.map((item: unknown) => {
            const rawVal = item.Value ?? item.value ?? 0
            let numericVal = Number(rawVal)

            if (item?.MetricLabel && (item.MetricLabel.includes('NetworkIn') || item.MetricLabel.includes('NetworkOut'))) {
                numericVal = Number(bytesToMB(Number(rawVal)))
            }

            if (Number.isNaN(numericVal)) numericVal = null
            return { ...item, Value: numericVal }
        })
        const grouped: Record<string, { habil: number[]; noHabil: number[] }> = {}

        dataFormatted.forEach((item: unknown) => {
            if (!item?.Timestamp) return
            const ts: string = item.Timestamp
            if (!grouped[ts]) grouped[ts] = { habil: [], noHabil: [] }

            const v = item.Value
            if (v === null || v === undefined) return

            if (item.Horario === 'Habil') grouped[ts].habil.push(Number(v))
            else if (item.Horario === 'No habil') grouped[ts].noHabil.push(Number(v))
        })

        const times: string[] = []
        const valoresHabil: (number | null)[] = []
        const valoresNoHabil: (number | null)[] = []

        Object.keys(grouped)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .forEach((ts) => {
                times.push(new Date(ts).toISOString())

                const habilValues = grouped[ts].habil
                const noHabilValues = grouped[ts].noHabil

                const avgHabil = habilValues.length > 0
                    ? Number((habilValues.reduce((acc, v) => acc + Number(v), 0) / habilValues.length).toFixed(2))
                    : null

                const avgNoHabil = noHabilValues.length > 0
                    ? Number((noHabilValues.reduce((acc, v) => acc + Number(v), 0) / noHabilValues.length).toFixed(2))
                    : null

                valoresHabil.push(avgHabil)
                valoresNoHabil.push(avgNoHabil)
            })

        return { valoresHabil, valoresNoHabil, times }
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Horario Hábil', 'Horario No Hábil'],
            legendPos: 'top',
            unitLabel: metricUnits[metric || ''] || '',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'category',
            legend: true,
            tooltip: true,
            series: [
                {
                    name: 'Horario Hábil',
                    kind: 'line',
                    data: valoresHabil,
                    smooth: true,
                    extra: {
                        symbol: 'circle',
                        symbolSize: 6,
                        lineStyle: { color: '#3b82f6' },
                        itemStyle: { color: '#3b82f6' },
                    }
                },
                {
                    name: 'Horario No Hábil',
                    kind: 'line',
                    data: valoresNoHabil,
                    smooth: true,
                    extra: {
                        symbol: 'circle',
                        symbolSize: 6,
                        lineStyle: { color: '#1e40af' },
                        itemStyle: { color: '#1e40af' },
                    }
                },
            ],
            extraOption: {
                xAxis: {
                    type: 'category',
                    data: times,
                    axisLabel: {
                        formatter: (value: unknown) => {
                            const d = new Date(String(value))
                            const hh = d.getUTCHours()
                            const hhStr = String(hh).padStart(2, '0')
                            return `${d.getUTCDate()}/${d.getUTCMonth() + 1} ${d.getUTCHours()}:00`
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: metricUnits[metric || ''] || '',
                    min: 0,
                    axisLabel: { formatter: (value: unknown) => Number(value).toFixed(2) }
                },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [valoresHabil, valoresNoHabil, times, metric])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const noData = !data || !(data as unknown).data || !Array.isArray((data as unknown).data) || (data as unknown).data.length === 0
    return (
        <>
            {noData ? (
                <div className="text-center text-gray-500 py-6">No hay métricas disponibles.</div>
            ) : (
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            )}
        </>
    )
}