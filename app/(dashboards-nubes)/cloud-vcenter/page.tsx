import Image from 'next/image';

export default function DashboardVcenterPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border bg-gradient-to-br from-violet-50 to-white p-6 md:p-8 dark:from-violet-950/30 dark:to-slate-950">
                <div className="flex items-start gap-3">
                    <div className="relative h-18 w-18 md:h-20 md:w-20">
                        <Image src="/vcenter.svg" alt="VMware vCenter" fill className="object-contain" priority />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Dashboard vCenter</h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Recorre las secciones y funciones de Cloud Performance!.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
