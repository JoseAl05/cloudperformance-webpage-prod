'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo, useCallback } from "react"
import * as echarts from "echarts"
import { LoaderComponent } from '@/components/general/LoaderComponent'

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

interface HeatmapQuotasComponentProps {
    startDate: Date,
    endDate: Date | null
}

export const HeatmapQuotasComponent = ({ startDate, endDate }: HeatmapQuotasComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';


    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by_quota=true`,
        fetcher
    )
    const formattedData = data ? data.map(d => {
        return {
            "name": new Date(d.sync_time.$date).toLocaleDateString(),
            "value": d.services.length,
            "children": d.services.map(service => {
                return {
                    "name": service.ServiceName,
                    "value": service.Quotas.length,
                    "children": service.Quotas.map(quota => {
                        return {
                            "name": quota.QuotaName,
                            "value": quota.Quota_Usage_Percentage ? quota.Quota_Usage_Percentage : 0
                        }
                    })
                }
            })
        }
    }) : []
    const handleResize = useCallback(() => {
        if (chartInstance.current) {
            chartInstance.current.resize();
        }
    }, []);

    useEffect(() => {
        const getLevelOption = () => {
            return [
                {
                    itemStyle: {
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2
                    },
                    upperLabel: {
                        show: true,
                        position: 'inside',
                        height: 20,
                        color: '#ffffff',
                        fontSize: 20,
                        backgroundColor: '#2b00ff',
                        borderRadius: 3
                    }
                },
                {
                    itemStyle: {
                        borderColor: '#666',
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2
                    },
                    upperLabel: {
                        show: true,
                        position: 'inside',
                        height: 20,
                        color: '#ffffff',
                        fontSize: 16,
                        backgroundColor: '#12006e',
                        borderRadius: 3
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: '#ddd',
                            borderRadius: 5
                        }
                    }
                },
                {
                    colorSaturation: [0.5, 0.7],
                    itemStyle: {
                        borderWidth: 0.5,
                        borderRadius: 5,
                        gapWidth: 2,
                        borderColorSaturation: 0.6
                    },
                    upperLabel: {
                        show: true,
                        color: '#333333',
                        fontSize: 12
                    }
                }
            ];
        };

        const options: echarts.EChartsOption = {
            title: { text: 'Heatmap Quotas', left: 'center' },
            tooltip: {
                formatter: function (params) {
                    const value = params.value as number;
                    const treePathInfo = params.treePathInfo;
                    const level = treePathInfo.length; // 2=fecha, 3=service, 4=quota
                    const treePath = treePathInfo.slice(1).map(v => v.name).join(' / ');
                    let unit = '';
                    if (level == 2) {
                        unit = ' Servicios';
                    } else if (level === 3) {
                        unit = ' Quotas';
                    } else if (level === 4) {
                        unit = ' %';
                    }
                    return `
                        <div style="font-weight:bold">${treePath}</div>
                        Valor: ${value.toFixed(2)}${unit}
                    `;
                }
            },
            series: [
                {
                    type: 'treemap',
                    visibleMin: 0,
                    itemStyle: {
                        borderRadius: 5,
                        borderWidth: 0.5,
                        gapWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            const name = params.data.name;
                            const value = params.data.value as number;
                            let unit = '';
                            const level = params.treePathInfo.length;
                            if (level == 2) {
                                unit = ' Servicios';
                            } else if (level === 3) {
                                unit = ' Quotas';
                            } else if (level === 4) {
                                unit = ' %';
                            }

                            return `${name}\n${value.toFixed(2)}${unit}`;
                        },
                        fontSize: 12
                    },
                    upperLabel: {
                        show: true,
                        height: 20,
                        formatter: function (params) {
                            if (params.name === "") {
                                return "Quotas"
                            }
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            borderRadius: 5,
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)'
                        }
                    },
                    levels: getLevelOption(),
                    data: formattedData
                }
            ],
            animation: true,
        };

        if (!chartRef.current) return

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption(options);
        }

        window.addEventListener('resize', handleResize);



        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };
    }, [data])

    console.log(`START DATE: ${startDate.toISOString().replace('Z', '').slice(0, -4)}`);
    console.log(`END DATE: ${endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''}`);

    if (isLoading) return <LoaderComponent />
    if (error) return <div>Error al cargar datos</div>
    return (
        <div>
            <div
                ref={chartRef}
                className='w-full h-[100vh]'
            />
        </div>
    )
}
// 'use client'

// import useSWR from 'swr'
// import React, { useEffect, useRef, useMemo, useCallback, useState } from "react"
// import * as echarts from "echarts"
// import { LoaderComponent } from '@/components/general/LoaderComponent'

// // Shadcn UI
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Label } from '@/components/ui/label'

// const fetcher = (url: string) =>
//     fetch(url, {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             "Content-Type": "application/json"
//         }
//     }).then(res => res.json())

// interface HeatmapQuotasComponentProps {
//     startDate: Date,
//     endDate: Date | null
// }

// type SizeBy = 'quotas' | 'maxUsage'

// // Utils
// const fmtPct = (v: number | null | undefined) =>
//     typeof v === 'number' && !Number.isNaN(v) ? `${v.toFixed(1)}%` : 'N/A'

// const ellipsize = (s: string, max = 28) => (s?.length > max ? s.slice(0, max - 1) + '…' : s)

// const isDarkNow = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

// export const HeatmapQuotasComponent = ({ startDate, endDate }: HeatmapQuotasComponentProps) => {
//     const chartRef = useRef<HTMLDivElement>(null);
//     const chartInstance = useRef<echarts.ECharts | null>(null);
//     const resizeObserverRef = useRef<ResizeObserver | null>(null);
//     const themeObserverRef = useRef<MutationObserver | null>(null);

//     const [sizeBy, setSizeBy] = useState<SizeBy>('quotas')
//     const [onlyWithUsage, setOnlyWithUsage] = useState<boolean>(false)
//     const [darkMode, setDarkMode] = useState<boolean>(isDarkNow());

//     const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     const { data, error, isLoading } = useSWR(
//         `${process.env.NEXT_PUBLIC_API_URL}/funcion/heatmap-quotas?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by_quota=true`,
//         fetcher
//     )

//     // Transformación con separación tamaño/color, filtro y orden por % uso (desc)
//     const treemapData = useMemo(() => {
//         if (!Array.isArray(data)) return []

//         return data.map((day) => {
//             const dateName = new Date(day?.sync_time?.$date ?? Date.now()).toLocaleDateString()

//             let servicesChildren = (Array.isArray(day?.services) ? day.services : []).map((svc) => {
//                 const quotasRaw = Array.isArray(svc?.Quotas) ? svc.Quotas : []

//                 let quotasFiltered = onlyWithUsage
//                     ? quotasRaw.filter((q) => typeof q?.Quota_Usage_Percentage === 'number')
//                     : quotasRaw

//                 quotasFiltered = [...quotasFiltered].sort((a, b) => {
//                     const va = typeof a?.Quota_Usage_Percentage === 'number' ? a.Quota_Usage_Percentage : -Infinity
//                     const vb = typeof b?.Quota_Usage_Percentage === 'number' ? b.Quota_Usage_Percentage : -Infinity
//                     return va-vb
//                 })

//                 const maxUsage = quotasFiltered.reduce((m, q) => {
//                     const v = typeof q?.Quota_Usage_Percentage === 'number' ? q.Quota_Usage_Percentage : null
//                     return typeof v === 'number' && v > m ? v : m
//                 }, 0)

//                 const areaValue =
//                     sizeBy === 'quotas'
//                         ? Math.max(quotasFiltered.length, 1)
//                         : Math.max(maxUsage, 1)

//                 const quotaChildren = quotasFiltered.map((q) => {
//                     const usage = typeof q?.Quota_Usage_Percentage === 'number' ? q.Quota_Usage_Percentage : 0
//                     return {
//                         name: q?.QuotaName ?? 'Quota',
//                         value: [1, usage],
//                         tooltipData: {
//                             service: svc?.ServiceName ?? 'Service',
//                             quota: q?.QuotaName ?? 'Quota',
//                             usage,
//                             value: q?.Value,
//                             resources: Array.isArray(q?.Resources) ? q.Resources.map((r: unknown) => r?.Resource).filter(Boolean) : [],
//                         },
//                         label: {
//                             show: true,
//                             formatter: () => `${ellipsize(q?.QuotaName ?? 'Quota', 26)}\n${fmtPct(usage)}`,
//                             fontSize: 12,
//                         },
//                     }
//                 })

//                 return {
//                     name: svc?.ServiceName ?? 'Service',
//                     value: [areaValue, maxUsage],
//                     children: quotaChildren,
//                     label: {
//                         show: true,
//                         formatter: (p: unknown) => {
//                             const [area, colorPct] = (p?.data?.value as number[]) ?? [0, 0]
//                             const qCount = quotasFiltered.length
//                             return `${ellipsize(p.name, 22)}\n${qCount} quotas · max ${fmtPct(colorPct)}`
//                         },
//                         fontSize: 12,
//                     },
//                 }
//             })

//             // Orden servicios por máx % uso (desc)
//             servicesChildren = servicesChildren.sort((a: unknown, b: unknown) => {
//                 const va = Array.isArray(a?.value) ? a.value[1] ?? -Infinity : -Infinity
//                 const vb = Array.isArray(b?.value) ? b.value[1] ?? -Infinity : -Infinity
//                 return va - vb
//             })

//             const dayArea = servicesChildren.reduce((acc: number, s: unknown) => acc + (s?.value?.[0] ?? 0), 0)
//             const dayMax = servicesChildren.reduce((m: number, s: unknown) => Math.max(m, s?.value?.[1] ?? 0), 0)

//             return {
//                 name: dateName,
//                 value: [Math.max(dayArea, 1), dayMax],
//                 children: servicesChildren,
//                 label: {
//                     show: true,
//                     formatter: (p: unknown) => {
//                         const [, colorPct] = (p?.data?.value as number[]) ?? [0, 0]
//                         return `${ellipsize(p.name, 24)}\nmax ${fmtPct(colorPct)}`
//                     },
//                     fontSize: 14,
//                 },
//             }
//         })
//     }, [data, sizeBy, onlyWithUsage])

//     const handleResize = useCallback(() => {
//         chartInstance.current?.resize();
//     }, []);

//     // Observa cambios de tema (Shadcn usa la clase "dark" en <html>)
//     useEffect(() => {
//         const htmlEl = document.documentElement
//         const updateMode = () => setDarkMode(isDarkNow())
//         updateMode()

//         themeObserverRef.current = new MutationObserver(() => {
//             updateMode()
//         })
//         themeObserverRef.current.observe(htmlEl, { attributes: true, attributeFilter: ['class'] })

//         return () => themeObserverRef.current?.disconnect()
//     }, [])

//     useEffect(() => {
//         if (!chartRef.current) return

//         if (!chartInstance.current) {
//             chartInstance.current = echarts.init(chartRef.current);
//             resizeObserverRef.current = new ResizeObserver(handleResize);
//             resizeObserverRef.current.observe(chartRef.current);
//             window.addEventListener('resize', handleResize);
//         }

//         // Paletas de alto contraste y estilos por tema
//         const themeColors = darkMode
//             ? {
//                 visualMap: ['#2dd4bf', '#f59e0b', '#ef4444'],
//                 text: '#e5e7eb',
//                 subText: '#cbd5e1',
//                 border: '#475569',
//                 borderEmph: '#e5e7eb',
//                 bgLvl1: 'rgba(148,163,184,0.10)',
//                 bgLvl2: 'rgba(148,163,184,0.18)',
//                 bgLvl3: 'rgba(148,163,184,0.25)',
//                 breadcrumb: '#e5e7eb',
//                 tooltipBg: 'rgba(15,23,42,0.95)',
//                 // NUEVO: fondos fijos para labels superiores (evita que tomen color del bloque)
//                 labelBg: 'rgba(2,6,23,0.55)', // ~ slate-900 con alpha
//                 labelBorder: 'rgba(148,163,184,0.35)',
//             }
//             : {
//                 visualMap: ['#16a34a', '#f59e0b', '#dc2626'],
//                 text: '#0f172a',
//                 subText: '#334155',
//                 border: '#94a3b8',
//                 borderEmph: '#0f172a',
//                 bgLvl1: 'rgba(2,6,23,0.05)',
//                 bgLvl2: 'rgba(2,6,23,0.08)',
//                 bgLvl3: 'rgba(2,6,23,0.12)',
//                 breadcrumb: '#0f172a',
//                 tooltipBg: 'rgba(255,255,255,0.98)',
//                 // NUEVO
//                 labelBg: 'rgba(255,255,255,0.75)',
//                 labelBorder: 'rgba(15,23,42,0.20)',
//             }

//         // Helper para upperLabel estable (normal + hover)
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

//         const getLevelOption = () => {
//             return [
//                 {
//                     itemStyle: {
//                         borderWidth: 1,
//                         borderColor: themeColors.border,
//                         borderRadius: 6,
//                         gapWidth: 2,
//                         color: themeColors.bgLvl1,
//                     },
//                     upperLabel: { ...stableUpper, fontSize: 16 },
//                     emphasis: {
//                         itemStyle: {
//                             borderColor: themeColors.borderEmph,
//                             borderWidth: 1.2,
//                             shadowBlur: 10,
//                             shadowColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)',
//                             borderRadius: 6,
//                         },
//                         // Mantener label con mismo fondo y color en hover
//                         upperLabel: { ...stableUpper },
//                         label: { color: themeColors.text, backgroundColor: 'transparent' }
//                     }
//                 },
//                 {
//                     itemStyle: {
//                         borderColor: themeColors.border,
//                         borderWidth: 1,
//                         borderRadius: 6,
//                         gapWidth: 2,
//                         color: themeColors.bgLvl2,
//                     },
//                     upperLabel: { ...stableUpper, fontSize: 14 },
//                     emphasis: {
//                         itemStyle: {
//                             borderColor: themeColors.borderEmph,
//                             borderWidth: 1.2,
//                             shadowBlur: 12,
//                             shadowColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
//                             borderRadius: 6,
//                         },
//                         upperLabel: { ...stableUpper },
//                         label: { color: themeColors.text, backgroundColor: 'transparent' }
//                     }
//                 },
//                 {
//                     itemStyle: {
//                         borderWidth: 1,
//                         borderColor: themeColors.border,
//                         borderRadius: 6,
//                         gapWidth: 1,
//                         color: themeColors.bgLvl3,
//                     },
//                     upperLabel: {
//                         show: true,
//                         color: themeColors.text,
//                         fontSize: 12,
//                         fontWeight: 'bold',
//                         verticalAlign: 'middle'
//                     }
//                 }
//             ];
//         };

//         const options: echarts.EChartsOption = {
//             backgroundColor: 'transparent',
//             textStyle: { color: themeColors.text },
//             title: { text: 'Heatmap Quotas', left: 'center', textStyle: { color: themeColors.text } },
//             toolbox: {
//                 show: true,
//                 orient: 'horizontal',
//                 feature: { restore: { show: true }, saveAsImage: { show: true } },
//                 right: 10,
//                 iconStyle: { borderColor: themeColors.text }
//             },
//             tooltip: {
//                 confine: true,
//                 appendToBody: true,
//                 backgroundColor: themeColors.tooltipBg,
//                 borderColor: themeColors.border,
//                 borderWidth: 1,
//                 textStyle: { color: themeColors.text },
//                 formatter: function (params: unknown) {
//                     const treePathInfo = params.treePathInfo;
//                     const level = treePathInfo.length;
//                     const name = params.name as string;

//                     const valArr: number[] = params?.data?.value ?? []
//                     const areaVal = valArr[0] ?? 0
//                     const colorPct = valArr[1] ?? 0

//                     if (level === 4 && params?.data?.tooltipData) {
//                         const info = params.data.tooltipData
//                         const res = Array.isArray(info.resources) && info.resources.length ? info.resources.join(', ') : '—'
//                         return `
//               <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(info.quota, 60)}</div>
//               <div><b>Servicio:</b> ${ellipsize(info.service, 48)}</div>
//               <div><b>Uso:</b> ${fmtPct(info.usage)}</div>
//               <div><b>Valor cuota:</b> ${info.value ?? '—'}</div>
//               <div><b>Recursos:</b> ${res}</div>
//             `
//                     }

//                     const unitArea = (sizeBy === 'quotas') ? 'área=#quotas' : 'área=máx % uso'
//                     return `
//             <div style="font-weight:700;margin-bottom:6px;color:${themeColors.text}">${ellipsize(name, 64)}</div>
//             <div><b>${unitArea}:</b> ${areaVal}</div>
//             <div><b>Color (máx % uso):</b> ${fmtPct(colorPct)}</div>
//           `
//                 }
//             },
//             visualMap: {
//                 min: 0,
//                 max: 100,
//                 type: 'continuous',
//                 orient: 'vertical',
//                 right: 10,
//                 top: 60,
//                 formatter: (v: number) => `${v}%`,
//                 text: ['alto uso', 'bajo'],
//                 textStyle: { color: themeColors.subText },
//                 calculable: true,
//                 inRange: { color: themeColors.visualMap },
//                 outOfRange: { color: ['#9ca3af'] }
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
//                         itemStyle: { color: 'transparent', textStyle: { color: themeColors.breadcrumb } }
//                     },
//                     squareRatio: 1.0,
//                     leafDepth: 3,
//                     visualDimension: 1,
//                     visualMin: 0,
//                     visualMax: 100,
//                     colorMappingBy: 'value',
//                     itemStyle: {
//                         borderRadius: 6,
//                         borderWidth: 1,
//                         borderColor: themeColors.border,
//                         gapWidth: 1
//                     },
//                     label: {
//                         show: true,
//                         color: themeColors.text,
//                         backgroundColor: 'transparent', // evita que copie el color del bloque
//                         formatter: function (params: unknown) {
//                             const nm = params.data.name as string
//                             const val = params.data.value as number[]
//                             const level = params.treePathInfo.length
//                             if (level === 2) return `${ellipsize(nm, 24)}\nmax ${fmtPct(val?.[1])}`
//                             if (level === 3) return `${ellipsize(nm, 22)}\nmax ${fmtPct(val?.[1])}`
//                             if (level === 4) return `${ellipsize(nm, 26)}\n${fmtPct(val?.[1])}`
//                             return nm
//                         },
//                         fontSize: 12
//                     },
//                     upperLabel: {
//                         show: true,
//                         height: 22,
//                         color: themeColors.text,
//                         backgroundColor: themeColors.labelBg, // NUEVO: fondo fijo
//                         borderColor: themeColors.labelBorder,
//                         borderWidth: 1,
//                         borderRadius: 6,
//                         padding: [2, 6],
//                         formatter: function (params: unknown) {
//                             if (params.name === "") return "Quotas"
//                             return params.name
//                         }
//                     },
//                     emphasis: {
//                         itemStyle: {
//                             borderRadius: 6,
//                             borderWidth: 1.2,
//                             borderColor: themeColors.borderEmph,
//                             shadowBlur: 14,
//                             shadowColor: darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)',
//                         },
//                         label: {
//                             color: themeColors.text,
//                             backgroundColor: 'transparent', // mantiene transparencia en hover
//                         },
//                         // Mantener upperLabel con mismo estilo en hover
//                         upperLabel: {
//                             show: true,
//                             color: themeColors.text,
//                             backgroundColor: themeColors.labelBg,
//                             borderColor: themeColors.labelBorder,
//                             borderWidth: 1,
//                             borderRadius: 6,
//                             padding: [2, 6],
//                         }
//                     },
//                     levels: getLevelOption(),
//                     data: treemapData
//                 }
//             ],
//             animation: true,
//         };

//         chartInstance.current?.clear();
//         chartInstance.current.setOption(options, true);

//         return () => { /* noop */ }
//     }, [treemapData, sizeBy, handleResize, darkMode])

//     useEffect(() => {
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             resizeObserverRef.current?.disconnect();
//             chartInstance.current?.dispose();
//             chartInstance.current = null
//         };
//     }, [handleResize])

//     if (error) return <div>Error al cargar datos</div>

//     return (
//         <div>
//             <div className="mb-3 flex flex-wrap items-center gap-3">
//                 <h1 className="text-lg font-semibold">Heatmap</h1>

//                 <div className="ml-auto flex items-center gap-4">
//                     <div className="flex items-center gap-2">
//                         <Label className="text-sm">Área por</Label>
//                         <Select
//                             value={sizeBy}
//                             onValueChange={(v: SizeBy) => setSizeBy(v)}
//                         >
//                             <SelectTrigger className="h-8 w-[190px]">
//                                 <SelectValue placeholder="Área por" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="quotas"># de quotas</SelectItem>
//                                 <SelectItem value="maxUsage">máx. % de uso</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <Checkbox
//                             id="onlyWithUsage"
//                             checked={onlyWithUsage}
//                             onCheckedChange={(checked) => setOnlyWithUsage(Boolean(checked))}
//                         />
//                         <Label htmlFor="onlyWithUsage" className="text-sm">Solo quotas con uso</Label>
//                     </div>
//                 </div>
//             </div>

//             {/* Loader como overlay para no desmontar el div del chart */}
//             <div className="relative">
//                 {isLoading && (
//                     <div className="absolute inset-0 grid place-items-center z-10 bg-black/5 dark:bg-black/20">
//                         <LoaderComponent />
//                     </div>
//                 )}
//                 <div
//                     ref={chartRef}
//                     className='w-full h-[100vh]'
//                 />
//             </div>
//         </div>
//     )
// }
