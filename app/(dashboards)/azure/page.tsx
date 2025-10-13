// app/azure/page.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Compass,
    FileChartColumn,
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
} from "lucide-react"

export default function DashboardAzurePage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="relative h-18 w-18 md:h-20 md:w-20">
                            <Image src="/azure.svg" alt="Azure" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                                Dashboard Azure
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                Recorre las secciones y funciones de Cloud Performance!.
                            </p>
                        </div>
                    </div>
                </div>
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
                        <Link href="/azure/facturacion/tendencia-facturacion">
                            <Button size="sm" variant="outline" className="gap-2">
                                <LineChart className="h-4 w-4" /> Tendencia de Facturación (Costos)
                            </Button>
                        </Link>
                        <Link href="/azure/quotas">
                            <Button size="sm" variant="outline" className="gap-2">
                                <Gauge className="h-4 w-4" /> Cuotas de Servicio (Quotas)
                            </Button>
                        </Link>
                        <Link href="/azure/deployments">
                            <Button size="sm" variant="outline" className="gap-2">
                                <CalendarClock className="h-4 w-4" /> Despliegues (Deployments)
                            </Button>
                        </Link>
                        <Link href="/azure/advisor">
                            <Button size="sm" variant="outline" className="gap-2">
                                <Pyramid className="h-4 w-4" /> Recomendaciones (Advisor)
                            </Button>
                        </Link>
                        <Link href="/azure/saving-plan">
                            <Button size="sm" variant="outline" className="gap-2">
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
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                Storage
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/azure/funciones/blob-vs-storage-general">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Cylinder className="h-4 w-4" /> Blob vs Storage General
                                    </Button>
                                </Link>
                                <Link href="/azure/funciones/variacion-storage">
                                    <Button size="sm" variant="outline" className="gap-2">
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
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                Uso de Recursos
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/azure/funciones/top-10-recursos-uso">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Monitor className="h-4 w-4" /> Top 10 por uso
                                    </Button>
                                </Link>
                                <Link href="/azure/funciones/incremento-top-recursos-uso">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <TrendingUp className="h-4 w-4" /> Incremento de uso
                                    </Button>
                                </Link>
                                <Link href="/azure/funciones/promedio-por-localizacion">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <MapPin className="h-4 w-4" /> Promedio por localización
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Identifica recursos más demandantes y cómo varía su uso por región.
                            </p>
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                            <Link href="/azure/funciones/spot-vs-regular-vm">
                                <Button size="sm" variant="outline" className="justify-start gap-2">
                                    <Layers className="h-4 w-4" /> Spot vs Regular VMs
                                </Button>
                            </Link>
                            <div className="rounded-lg border p-2">
                                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                                    <Computer className="h-4 w-4" /> Recursos no utilizados
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/azure/funciones/unused-resources/vm">
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Computer className="h-4 w-4" /> VM
                                        </Button>
                                    </Link>
                                    <Link href="/azure/funciones/unused-resources/vmss">
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Layers className="h-4 w-4" /> VM Scale Sets
                                        </Button>
                                    </Link>
                                    <Link href="/azure/funciones/unused-resources/extensions">
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Puzzle className="h-4 w-4" /> Extensiones VM
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
