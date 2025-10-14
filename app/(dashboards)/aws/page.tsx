// app/aws/page.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileHeartIcon as FileChartColumn,
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
} from "lucide-react"

export default function DashboardAwsPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="relative h-18 w-18 md:h-20 md:w-20">
                            <Image src="/aws3.svg" alt="AWS" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard AWS</h1>
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
                            <Stars className="h-6 w-6 text-primary" /> Módulos Recomendados
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Modulos recomendados para el analisis de consumo y buscar posibilidades de ahorro.
                        </p>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full mt-4">
                            <Card className="relative border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <div className="absolute right-4 top-4">
                                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                        ⭐ Recomendado
                                    </Badge>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        Tendencia de Facturación
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Visualiza y analiza la evolución de tus costos en AWS a lo largo del tiempo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/aws/facturacion/tendencia-facturacion">
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
                            <Card className="relative border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <div className="absolute right-4 top-4">
                                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                        ⭐ Recomendado
                                    </Badge>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                            <Pyramid className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        Recomendaciones
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Obtén consejos personalizados de AWS Advisor para optimizar costos y rendimiento.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                        <Link href="/aws/advisor">
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
                            <Card className="relative lg:col-span-2 border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <div className="absolute right-4 top-4">
                                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                        ⭐ Recomendado
                                    </Badge>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <HandCoins className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        Ahorro y Optimización
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Maximiza tus ahorros con Saving Plans y comparativas de costos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Saving Plans</div>
                                            <Link href="/aws/saving-plan">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <HandCoins className="h-4 w-4" /> Cobertura (Saving Plans)
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">Comparativa de Costos</div>
                                            <Link href="/aws/funciones/spot-vs-vm">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <Zap className="h-4 w-4" /> Spot vs VM
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="relative lg:col-span-2 border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                                <div className="absolute right-4 top-4">
                                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md px-3 py-1">
                                        ⭐ Recomendado
                                    </Badge>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <HardDrive className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        Storage
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Identifica recursos de storage e identifica y soluciona sobre o infra utilización de tus servicios de Storage.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">Acciones Rápidas</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">TOP S3 Buckets</div>
                                            <Link href="/aws/funciones/top-s3-buckets">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <HandCoins className="h-4 w-4" /> TOP S3 Buckets
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:from-primary/10 dark:to-primary/20">
                                            <div className="text-xs font-semibold text-primary mb-1">EBS No utilizados</div>
                                            <Link href="/aws/funciones/ebs-no-utilizados">
                                                <Button
                                                    size="default"
                                                    variant="default"
                                                    className="w-full gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <Zap className="h-4 w-4" /> EBS No utilizados
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
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Todos los Módulos</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Explora todas las funciones y recursos disponibles en tu dashboard AWS.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileChartColumn className="h-4 w-4" /> Costos & Actividad
                            </CardTitle>
                            <CardDescription>Explora costos, cuotas de servicio, eventos y consejos</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Link href="/aws/facturacion/tendencia-facturacion">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <LineChart className="h-4 w-4" /> Tendencia de Facturación (Costos)
                                </Button>
                            </Link>
                            <Link href="/aws/quotas">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <Gauge className="h-4 w-4" /> Cuotas de Servicio (Quotas)
                                </Button>
                            </Link>
                            <Link href="/aws/eventos">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <CalendarClock className="h-4 w-4" /> Eventos y Actividad (Events)
                                </Button>
                            </Link>
                            <Link href="/aws/advisor">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                    <Pyramid className="h-4 w-4" /> Recomendaciones (Advisor)
                                </Button>
                            </Link>
                            <Link href="/aws/saving-plan">
                                <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
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
                            <CardDescription>Comparativas de costos y patrones de consumo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Top de Facturación
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/aws/funciones/top-dolares-region">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Globe2 className="h-4 w-4" /> Por Región
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-so">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Monitor className="h-4 w-4" /> Por Sistema Operativo
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-por-tipo-de-instancia">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Server className="h-4 w-4" /> Por Tipo de Instancia
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-por-familia-de-instancia">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Layers className="h-4 w-4" /> Por Familia de Instancia
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-por-tipo-de-compra">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <ShoppingCart className="h-4 w-4" /> Por Tipo de Compra
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-por-tipo-de-cobro">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Receipt className="h-4 w-4" /> Por Tipo de Cobro
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-dolares-por-id-recurso">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Boxes className="h-4 w-4" /> Por Recurso
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/top-recursos">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Stars className="h-4 w-4" /> Top Recursos
                                        </Button>
                                    </Link>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Descubre qué regiones, familias o compras impulsan tu gasto.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Consumo: hábil vs no hábil
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/aws/funciones/consumo-ec2-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Clock className="h-4 w-4" /> EC2
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <TrendingUp className="h-4 w-4" /> ASG
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Boxes className="h-4 w-4" /> EKS
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> RDS PostgreSQL
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> RDS MySQL
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> RDS SQL Server
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> RDS Oracle
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil">
                                        <Button size="sm" variant="outline" className="gap-2 cursor-pointer bg-transparent">
                                            <Database className="h-4 w-4" /> RDS MariaDB
                                        </Button>
                                    </Link>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Compara comportamiento de carga entre horario hábil y no hábil.
                                </p>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground my-3">
                                    Consumo: por región
                                </div>
                                <Link href="/aws/funciones/avg-uso-loc-inst-ec2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="justify-start gap-2 cursor-pointer w-full bg-transparent"
                                    >
                                        <MapPin className="h-4 w-4" /> Uso por Localización (EC2)
                                    </Button>
                                </Link>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Compara comportamiento de servicios en distintas regiones.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                                    Storage
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Link href="/aws/funciones/top-s3-buckets">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="justify-start gap-2 cursor-pointer w-full bg-transparent"
                                        >
                                            <Box className="h-4 w-4" /> Top S3 Buckets
                                        </Button>
                                    </Link>
                                    <Link href="/aws/funciones/ebs-no-utilizados">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="justify-start gap-2 cursor-pointer w-full bg-transparent"
                                        >
                                            <HardDrive className="h-4 w-4" /> EBS no utilizados
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
                                    <Link href="/aws/funciones/spot-vs-vm">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="justify-start gap-2 cursor-pointer w-full bg-transparent"
                                        >
                                            <Zap className="h-4 w-4" /> Comparativa Spot vs VM
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
                            <CardDescription>Inventario y detalle por categoría</CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/aws/recursos/instancias-ec2" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Server className="h-4 w-4" /> Instancias EC2
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/autoscaling-groups" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <TrendingUp className="h-4 w-4" /> Auto Scaling Groups
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, templates, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/instancias-rds-pg" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> RDS PostgreSQL
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/instancias-rds-mysql" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> RDS MySQL
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/instancias-rds-sqlserver" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> RDS SQL Server
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/instancias-rds-oracle" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> RDS Oracle
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>

                            <Link href="/aws/recursos/instancias-rds-mariadb" className="group">
                                <div className="rounded-xl border p-3 hover:bg-muted transition">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Database className="h-4 w-4" /> RDS MariaDB
                                    </div>
                                    <div className="text-xs text-muted-foreground">Instancias, historial y métricas</div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
