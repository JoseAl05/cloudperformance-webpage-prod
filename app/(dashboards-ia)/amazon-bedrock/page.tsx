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

export default function DashboardAwsBedrockPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="relative h-18 w-18 md:h-20 md:w-20">
                            <Image src="/bedrock.svg" alt="AWSBedrock" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard Amazon Bedrock</h1>
                            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                Recorre las secciones y funciones de Cloud Performance!.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Todos los Módulos</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Explora todas las funciones y recursos disponibles en tu dashboard Amazon Bedrock.
                    </p>
                </section>
            </div>
        </div>
    )
}
