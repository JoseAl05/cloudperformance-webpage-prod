import Image from "next/image"


export default function DashboardMicrosoftFoundryPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white md:p-8 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="relative h-18 w-18 md:h-20 md:w-20">
                            <Image src="/microsoft-foundry.svg" alt="MicrosoftFoundry" fill className="object-contain" priority />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard Microsoft Foundry</h1>
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
                        Explora todas las funciones y recursos disponibles en tu dashboard Microsoft Foundry.
                    </p>
                </section>
            </div>
        </div>
    )
}