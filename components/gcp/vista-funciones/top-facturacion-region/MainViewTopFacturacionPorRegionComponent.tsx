'use client'

import useSWR from 'swr'
import { useRef, useState, useMemo } from "react"
import * as echarts from "echarts"

// UI Components
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button" // Asumiendo que tienes este componente
import { Badge } from "@/components/ui/badge" // Opcional: para etiquetas visuales

// Icons
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    MapPin,
    Info,
    Filter,
    RefreshCcw
} from "lucide-react"

/* === COMPONENTES GCP === */
import { TableComponentTopGCP } from "@/components/gcp/vista-funciones/top-facturacion-region/table/TableComponentTopGCP"
import { TopFacturacionChartComponentGCP } from "@/components/gcp/vista-funciones/top-facturacion-region/grafico/TopFacturacionChartComponentGCP"
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'

/* =======================
   Tipado datos GCP
======================= */
type GCPFacturacionRow = {
    location_region: string
    service_description: string
    usage_date: string
    cost_net_usd: number
    cost_gross_usd: number
}

/* =======================
   Fetcher
======================= */
const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())

interface TopDolaresRegionComponentProps {
    startDate: Date
    endDate: Date
    projects: string;
    tagKey: string | null;
    tagValue: string | null;
}

export const MainViewTopFacturacionPorLocalizacionGCP = ({
    startDate,
    endDate,
    projects,
    tagKey,
    tagValue
}: TopDolaresRegionComponentProps) => {

    // Estados locales
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
    const [tipoCosto, setTipoCosto] = useState<"cost_net_usd" | "cost_gross_usd">("cost_net_usd")
    const [topLimit, setTopLimit] = useState<number | "all">(10)
    const [showInfo, setShowInfo] = useState(false) // Para alternar la vista de definiciones

    // Formateo de fechas
    const startDateFormatted = startDate
        ? startDate.toISOString().replace('Z', '').slice(0, -4)
        : '2025-12-01T00:00:00'

    const endDateFormatted = endDate
        ? endDate.toISOString().replace('Z', '').slice(0, -4)
        : '2026-12-31T23:59:59'

    /* =======================
        SWR – GCP endpoint
    ======================= */
    const { data, error, isLoading } = useSWR<GCPFacturacionRow[]>(
        `/api/gcp/bridge/gcp/funcion/facturacion_por_localizacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&tag_key=${tagKey}&tag_value=${tagValue}`,
        fetcher,
        {
            revalidateOnFocus: false, // Evita recargas innecesarias
        }
    )

    const rows = Array.isArray(data) ? data : []

    /* =======================
        Procesamiento de Datos (Memoized)
       (Usamos useMemo para evitar recálculos en renders innecesarios)
    ======================= */
    const { aggregatedRegions, totalCosto, regionMax, regionMin } = useMemo(() => {
        const toNumber = (v: unknown) => {
            const n = Number(v)
            return Number.isFinite(n) ? n : 0
        }

        const regionMap = new Map<string, number>()

        for (const row of rows) {
            const region = row.location_region ?? "N/D"
            const value = toNumber(row[tipoCosto])
            regionMap.set(region, (regionMap.get(region) ?? 0) + value)
        }

        const aggregated = Array.from(regionMap, ([region, value]) => ({
            region,
            value
        }))

        const total = aggregated.reduce((sum, r) => sum + r.value, 0)

        const max = aggregated.reduce(
            (acc, r) => (r.value > acc.value ? r : acc),
            { region: null as string | null, value: -Infinity }
        )

        const min = aggregated.reduce(
            (acc, r) => (r.value > 0 && r.value < acc.value ? r : acc),
            { region: null as string | null, value: Infinity }
        )

        return { aggregatedRegions: aggregated, totalCosto: total, regionMax: max, regionMin: min }
    }, [rows, tipoCosto])


    const handleTopLimitChange = (value: string) => {
        setTopLimit(value === "all" ? "all" : Number(value))
    }

    // --- Render Loading ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[600px] space-y-4">
                <LoaderComponent size="large" />
                <p className="text-slate-500 animate-pulse">Analizando facturación por regiones...</p>
            </div>
        )
    }

    // --- Render Error ---
    if (error) {
        return (
            <div className="p-6 text-center border border-red-200 bg-red-50 rounded-lg text-red-600">
                <p>Ocurrió un error al cargar los datos de facturación.</p>
            </div>
        )
    }

    // --- Render Main View ---
    return (
        <div className="space-y-8 p-6 bg-slate-50/50 min-h-screen">

            {/* ========================================
        HEADER & KPIS
        ========================================
      */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tablero de Costos Regionales</h2>
                        <p className="text-slate-500 text-sm">Visualización de distribución de gastos por ubicación geográfica en GCP.</p>
                    </div>

                    {/* Botón toggle para mostrar/ocultar definiciones */}
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        {showInfo ? 'Ocultar guía de costos' : '¿Qué significan estos costos?'}
                    </button>
                </div>

                {/* Panel de Definiciones (Condicional) */}
                {showInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Costo Bruto
                            </span>
                            <p className="text-xs text-slate-600">Precio de lista original sin descuentos. Valor comercial retail.</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Costo Neto
                            </span>
                            <p className="text-xs text-slate-600">Monto final a pagar tras aplicar descuentos (CUDs, Free Tier, etc.).</p>
                        </div>
                    </div>
                )}

                {/* Tarjetas KPI (Summary Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* KPI 1: Total */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-indigo-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">
                                    {tipoCosto === "cost_net_usd" ? "Costo Neto Total" : "Costo Bruto Total"}
                                </p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    ${totalCosto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <DollarSign className="h-6 w-6 text-indigo-600" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPI 2: Región Más Cara */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-red-50/30 border-l-4 border-l-red-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Mayor consumo</p>
                                {regionMax.region ? (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 truncate max-w-[150px]" title={regionMax.region}>
                                            {regionMax.region}
                                        </h3>
                                        <p className="text-sm font-semibold text-red-600">
                                            ${regionMax.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                        </p>
                                    </>
                                ) : (
                                    <span className="text-slate-400">Sin datos</span>
                                )}
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <TrendingUp className="h-6 w-6 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPI 3: Región Más Barata */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-green-50/30 border-l-4 border-l-emerald-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Menor consumo</p>
                                {regionMin.region ? (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 truncate max-w-[150px]" title={regionMin.region}>
                                            {regionMin.region}
                                        </h3>
                                        <p className="text-sm font-semibold text-emerald-600">
                                            ${regionMin.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                        </p>
                                    </>
                                ) : (
                                    <span className="text-slate-400">Sin datos</span>
                                )}
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <TrendingDown className="h-6 w-6 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ========================================
        CONTROLS BAR
        ========================================
      */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Filter className="w-5 h-5 text-indigo-500" />
                    <span>Configuración de Vista</span>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-400">Ranking</span>
                        <Select value={topLimit.toString()} onValueChange={handleTopLimitChange}>
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">Top 3 Regiones</SelectItem>
                                <SelectItem value="5">Top 5 Regiones</SelectItem>
                                <SelectItem value="10">Top 10 Regiones</SelectItem>
                                <SelectItem value="all">Ver Todas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-9 w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-400">Moneda</span>
                        <Select
                            value={tipoCosto}
                            onValueChange={(v) => setTipoCosto(v as "cost_net_usd" | "cost_gross_usd")}
                        >
                            <SelectTrigger className="w-[160px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cost_net_usd">Costo Neto (Real)</SelectItem>
                                <SelectItem value="cost_gross_usd">Costo Bruto (Lista)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ========================================
        MAIN CHART SECTION
        ========================================
      */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-4 shadow-md border-0 ring-1 ring-slate-100 rounded-2xl overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    Distribución Geográfica
                                </CardTitle>
                                <CardDescription>
                                    Interactúa con el gráfico para filtrar la tabla inferior.
                                </CardDescription>
                            </div>
                            {selectedRegion && (
                                <button
                                    onClick={() => setSelectedRegion(null)}
                                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
                                >
                                    <RefreshCcw className="w-3 h-3" />
                                    Limpiar filtro: {selectedRegion}
                                </button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 min-h-[500px] relative">
                        <TopFacturacionChartComponentGCP
                            data={rows}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            tipoCosto={tipoCosto}
                            topLimit={topLimit}
                            isBilling
                            detailsEnabled
                        />
                    </CardContent>
                </Card>
            </div>

            {/* ========================================
        TABLE SECTION
        ========================================
      */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="font-semibold text-slate-700">Detalle de Registros</h3>
                </div>
                <div className="p-2">
                    <TableComponentTopGCP
                        startDateFormatted={startDateFormatted}
                        endDateFormatted={endDateFormatted}
                        projects={projects}
                        tagKey={tagKey}
                        tagValue={tagValue}
                    // Idealmente deberías pasar 'selectedRegion' a la tabla para filtrar también
                    // selectedRegion={selectedRegion} 
                    />
                </div>
            </div>

        </div>
    )
}