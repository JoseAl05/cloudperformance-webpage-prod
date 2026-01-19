// app/gcp/page.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileChartColumn,
    Server,
    Zap,
    HandCoins,
    Pyramid,
    Clock,
    Globe2,
    Database,
    Box,
    LineChart,
    Gauge,
    CalendarClock,
    Monitor,
    Layers,
    ShoppingCart,
    Receipt,
    Stars,
    TrendingUp,
    Boxes,
    MapPin,
    HardDrive,
    Container, // Nuevo icono para GKE/contenedores
} from "lucide-react"

export default function DashboardGCPPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        {/* Asegúrate de tener un icono gcp.svg en tu carpeta public o cambia el src */}
                        <div className="relative h-18 w-18 md:h-20 md:w-20">
                            <Image src="/gcp.svg" alt="GCP" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard GCP</h1>
                            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                Recorre las secciones y funciones de Cloud Performance para Google Cloud.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 md:p-8 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col items-start gap-3 w-full">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
                            <Stars className="h-6 w-6 text-primary" /> Módulos Recomendados
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Módulos recomendados para el análisis de consumo y búsqueda de oportunidades de ahorro en GCP.
                        </p>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full mt-4">
                            {/* Card 1: Billing */}
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            Facturación GCP
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Visualiza y analiza la evolución de tus costos en Google Cloud.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/gcp/facturacion/tendencia-pago-por-uso">
                                            <Button
                                                size="default"
                                                variant="default"
                                                className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <LineChart className="h-4 w-4" /> Ver Tendencias
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Advisor / Recommender */}
                            <Card className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <Pyramid className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            Recommender
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
                                        Consejos potenciados por Active Assist para optimizar costos y seguridad.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/gcp/advisor">
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

                            {/* Card 3: Savings / CUDs */}
                            <Card className="lg:col-span-2 border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                                <HandCoins className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            Ahorro y Optimización
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                                ⭐ Recomendado
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Maximiza tus ahorros con CUDs (Committed Use Discounts) y análisis de Spot VMs.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Descuentos por Uso</div>
                                            <Link href="/gcp/saving-plan">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <HandCoins className="h-4 w-4" /> CUDs Analysis
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Comparativa de Costos</div>
                                            <Link href="/gcp/funciones/spot-vs-standard-vm">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <Zap className="h-4 w-4" /> Spot vs Standard VMs
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 4: Storage */}
                            <Card className="lg:col-span-2 border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                                <HardDrive className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            Cloud Storage & Discos
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-base">
                                        Identifica recursos de storage, clases de almacenamiento y discos persistentes huérfanos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Análisis de Storage</div>
                                            <Link href="/gcp/funciones/storage-classes-analysis">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <Box className="h-4 w-4" /> Storage Classes
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Discos Huérfanos</div>
                                            <Link href="/gcp/funciones/unused-resources/persistent-disks">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <HardDrive className="h-4 w-4" /> Discos no utilizados
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Todos los Módulos GCP</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Explora todas las funciones y recursos disponibles en tu dashboard Google Cloud.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileChartColumn className="h-4 w-4" /> Costos & Actividad
                            </CardTitle>
                            <CardDescription>Explora facturación, cuotas y salud del servicio</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Link href="/gcp/facturacion/tendencia-pago-por-uso">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <LineChart className="h-4 w-4" /> Tendencia de Facturación
                                </Button>
                            </Link>
                            <Link href="/gcp/quotas">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <Gauge className="h-4 w-4" /> Cuotas (Quotas)
                                </Button>
                            </Link>
                            <Link href="/gcp/deployments">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <CalendarClock className="h-4 w-4" /> Deployments (Cloud Build)
                                </Button>
                            </Link>
                            <Link href="/gcp/advisor">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <Pyramid className="h-4 w-4" /> Recommender (Advisor)
                                </Button>
                            </Link>
                            <Link href="/gcp/saving-plan">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <HandCoins className="h-4 w-4" /> CUDs
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Funciones de Análisis
                            </CardTitle>
                            <CardDescription>Comparativas y top de consumo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Top de Facturación
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/gcp/funciones/top-10-recursos-uso">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Stars className="h-4 w-4" /> Top Recursos
                                        </Button>
                                    </Link>
                                    <Link href="/gcp/funciones/promedio-por-localizacion">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Globe2 className="h-4 w-4" /> Por Región
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Consumo: hábil vs no hábil
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/gcp/funciones/analisis-vms-horario">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Clock className="h-4 w-4" /> Compute Engine
                                        </Button>
                                    </Link>
                                    <Link href="/gcp/consumo-sql">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> Cloud SQL
                                        </Button>
                                    </Link>
                                    <Link href="/gcp/consumo-gke">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Container className="h-4 w-4" /> GKE Clusters
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Posibilidad de ahorro
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Link href="/gcp/funciones/spot-vs-standard-vm">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="justify-start gap-2 cursor-pointer w-full bg-transparent"
                                        >
                                            <Zap className="h-4 w-4" /> Comparativa Spot vs Standard
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Server className="h-4 w-4" /> Recursos por Tipo
                            </CardTitle>
                            <CardDescription>Inventario y detalle por categoría GCP</CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/gcp/recursos-vm" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Server className="h-4 w-4" /> Compute Engine (VMs)
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias y métricas</div>
                                </div>
                            </Link>

                            <Link href="/gcp/funciones/unused-resources/instance-groups" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <TrendingUp className="h-4 w-4" /> Instance Groups (MIGs)
                                    </div>
                                    <div className="text-xs text-muted-foreground">Grupos de escalado</div>
                                </div>
                            </Link>

                            <Link href="/gcp/consumo-sql" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> Cloud SQL (PostgreSQL)
                                    </div>
                                    <div className="text-xs text-muted-foreground">Base de datos relacionales</div>
                                </div>
                            </Link>

                            <Link href="/gcp/consumo-sql" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> Cloud SQL (MySQL)
                                    </div>
                                    <div className="text-xs text-muted-foreground">Base de datos relacionales</div>
                                </div>
                            </Link>

                             <Link href="/gcp/consumo-sql" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> Cloud SQL (SQL Server)
                                    </div>
                                    <div className="text-xs text-muted-foreground">Base de datos relacionales</div>
                                </div>
                            </Link>

                            <Link href="/gcp/funciones/unused-resources/persistent-disks" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <HardDrive className="h-4 w-4" /> Persistent Disks
                                    </div>
                                    <div className="text-xs text-muted-foreground">Almacenamiento en bloque</div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}