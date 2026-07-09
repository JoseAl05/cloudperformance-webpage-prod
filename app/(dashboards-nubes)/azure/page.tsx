// app/azure/page.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileHeartIcon as FileChartColumn,
    Zap,
    HandCoins,
    Pyramid,
    LineChart,
    Gauge,
    CalendarClock,
    Monitor,
    Layers,
    Cylinder,
    TrendingUp,
    MapPin,
    Computer,
    Puzzle,
    Sparkles,
} from "lucide-react"

export default function DashboardAzurePage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 md:h-20 md:w-20">
                            <Image src="/azure.svg" alt="Azure" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard Azure</h1>
                            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                Recorre las secciones y funciones de Cloud Performance!.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 md:p-8 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col items-start gap-3 w-full">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" /> Módulos Recomendados
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Modulos recomendados para el analisis de consumo y buscar posibilidades de ahorro.
                        </p>
                        <div className="grid grid-cols-1 gap-6 w-full mt-4 lg:grid-cols-2">
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <Pyramid className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            Recomendaciones
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md px-3 py-1">
                                                ⭐ Nuevo
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Consejos potenciados por IA de tu Azure Advisor para optimizar costos y rendimiento.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/azure/advisor">
                                            <Button
                                                size="default"
                                                variant="default"
                                                className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <Pyramid className="h-4 w-4" /> Ver Recomendaciones
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                                <FileChartColumn className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            Facturaciones
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Tendencia de pago por uso, análisis de costos y oportunidades de ahorro con planes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            {/* <div className="text-xs font-semibold text-primary mb-1">Tendencia de Costos</div> */}
                                            <Link href="/azure/facturacion/tendencia-pago-por-uso">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <LineChart className="h-4 w-4" /> Tendencia de Facturación
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            {/* <div className="text-xs font-semibold text-primary mb-1">Saving Plans</div> */}
                                            <Link href="/azure/saving-plan">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <HandCoins className="h-4 w-4" /> Cobertura (Saving Plans)
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full mt-4">
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <Cylinder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            Storage
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Comparativas de almacenamiento y variaciones de capacidad/uso.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/azure/funciones/blob-vs-storage-general">
                                            <Button
                                                size="default"
                                                variant="default"
                                                className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <Cylinder className="h-4 w-4" /> Blob vs Storage General
                                            </Button>
                                        </Link>
                                        <Link href="/azure/funciones/variacion-storage">
                                            <Button
                                                size="default"
                                                variant="default"
                                                className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <Cylinder className="h-4 w-4" /> Variación de Storage
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            Spot vs Regular VMs
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Analiza ahorros potenciales y cobertura con instancias Spot.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/azure/funciones/spot-vs-regular-vm">
                                            <Button
                                                size="default"
                                                variant="default"
                                                className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <Layers className="h-4 w-4" /> Comparativa Spot vs Regular
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Todos los Módulos</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Explora todas las funciones y secciones disponibles en el dashboard.
                    </p>
                </section>
                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileChartColumn className="h-4 w-4" /> Costos & Operación
                            </CardTitle>
                            <CardDescription>Explora costos, cuotas, despliegues, Advisor y Savings</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Link href="/azure/facturacion/tendencia-pago-por-uso">
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                    <LineChart className="h-4 w-4" /> Tendencia de Facturación (Costos)
                                </Button>
                            </Link>
                            <Link href="/azure/quotas">
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                    <Gauge className="h-4 w-4" /> Cuotas de Servicio (Quotas)
                                </Button>
                            </Link>
                            <Link href="/azure/deployments">
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                    <CalendarClock className="h-4 w-4" /> Despliegues (Deployments)
                                </Button>
                            </Link>
                            <Link href="/azure/advisor">
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                    <Pyramid className="h-4 w-4" /> Recomendaciones (Advisor)
                                </Button>
                            </Link>
                            <Link href="/azure/saving-plan">
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                    <HandCoins className="h-4 w-4" /> Cobertura (Saving Plans)
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Funciones de Análisis
                            </CardTitle>
                            <CardDescription>Comparativas de almacenamiento, uso y costo</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Storage</div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/azure/funciones/blob-vs-storage-general">
                                        <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                            <Cylinder className="h-4 w-4" /> Blob vs Storage General
                                        </Button>
                                    </Link>
                                    <Link href="/azure/funciones/variacion-storage">
                                        <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                            <Cylinder className="h-4 w-4" /> Variación de Storage
                                        </Button>
                                    </Link>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Compara tipos de almacenamiento y observa cambios de capacidad/uso.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Uso de Recursos</div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/azure/funciones/top-10-recursos-uso">
                                        <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                            <Monitor className="h-4 w-4" /> Top 10 por uso
                                        </Button>
                                    </Link>
                                    <Link href="/azure/funciones/incremento-top-recursos-uso">
                                        <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                            <TrendingUp className="h-4 w-4" /> Incremento de uso
                                        </Button>
                                    </Link>
                                    <Link href="/azure/funciones/promedio-por-localizacion">
                                        <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                            <MapPin className="h-4 w-4" /> Promedio por localización
                                        </Button>
                                    </Link>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Identifica recursos más demandantes y cómo varía su uso por región.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Máquinas Virtuales
                                </div>
                                <div className="space-y-2">
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Analiza ahorros con Spot VMs e identifica recursos sin uso.
                                    </p>
                                    <Link href="/azure/funciones/spot-vs-regular-vm">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full justify-start gap-2 bg-transparent cursor-pointer"
                                        >
                                            <Layers className="h-4 w-4" /> Spot vs Regular VMs
                                        </Button>
                                    </Link>
                                    <div className="rounded-lg border p-2 mt-2">
                                        <div className="text-xs font-medium mb-2 flex items-center gap-2">
                                            <Computer className="h-4 w-4" /> Recursos no utilizados
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Link href="/azure/funciones/unused-resources/vm">
                                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                                    <Computer className="h-4 w-4" /> VM
                                                </Button>
                                            </Link>
                                            <Link href="/azure/funciones/unused-resources/vmss">
                                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                                    <Layers className="h-4 w-4" /> VM Scale Sets
                                                </Button>
                                            </Link>
                                            <Link href="/azure/funciones/unused-resources/extensions">
                                                <Button size="sm" variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                                    <Puzzle className="h-4 w-4" /> Extensiones VM
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
