'use client'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import ClientSelectorComponent from '@/components/general/ClientSelectorComponent'
import Link from 'next/link'
import Image from 'next/image'
import { Cloud, ArrowRight, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SelectCloudComponent = () => {
    const {
        loading,
        isGlobalAdmin,
        connectionData, // Contiene las credenciales activas/seleccionadas
        currentPlanName
    } = useFeatureAccess()

    if (loading) return <LoaderComponent />

    const isAzure = connectionData.isAzureActive
    const isAws = connectionData.isAwsActive
    const nothing = !isAzure && !isAws
    const clientName = connectionData.client

    // Si el Admin Global aún no ha seleccionado un cliente, mostramos mensaje de espera.
    if (isGlobalAdmin && !clientName) {
        return (
            <section className="mx-auto max-w-5xl px-4">
                <ClientSelectorComponent />
                <div className="mt-8 grid place-items-center rounded-2xl border p-10 text-center bg-gray-50">
                    <Briefcase className="h-6 w-6 text-blue-500 mb-3" />
                    <p className="text-sm text-gray-500">
                        Por favor, selecciona un cliente en el menú de arriba para cargar sus nubes.
                    </p>
                </div>
            </section>
        );
    }


    return (
        <section className="mx-auto max-w-5xl px-4">

            {/* Selector visible solo para Admin Global */}
            {isGlobalAdmin && (
                <div className="pb-4 mb-4 border-b">
                    <ClientSelectorComponent />
                    <p className='text-xs text-gray-500 mt-1'>Visualizando datos de: {clientName} (Plan: {currentPlanName.toUpperCase()})</p>
                </div>
            )}


            <header className="mb-6">
                <h2 className="text-2xl font-semibold">Nubes registradas</h2>
                <p className="text-sm text-muted-foreground">Selecciona la nube para redirigirte al dashboard correspondiente.</p>
            </header>

            <div
                className={cn(
                    "grid gap-4",
                    isAzure && isAws ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}
            >
                {isAzure && (
                    <Link
                        href={`/azure?client=${clientName}`}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-xl ring-1 ring-border bg-background grid place-items-center">
                                <Image alt="Azure" src="/azure.svg" width={26} height={26} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Microsoft Azure</h3>
                                <p className="text-xs text-muted-foreground">
                                    {/* Conexión: {connectionData.dbAzureName || 'No configurada'} */}
                                    Costos, recursos, tendencias y funciones especializadas.
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                )}

                {isAws && (
                    <Link
                        href={`/aws?client=${clientName}`}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-xl ring-1 ring-border bg-background grid place-items-center">
                                <Image alt="AWS" src="/aws.svg" width={26} height={26} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Amazon Web Services</h3>
                                <p className="text-xs text-muted-foreground">
                                    {/* Conexión: {connectionData.dbAwsName || 'No configurada'} */}
                                    EC2/RDS/S3, consumos por localización y top facturaciones.
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                )}
            </div>

            {nothing && (
                <div className="mt-8 grid place-items-center rounded-2xl border p-10 text-center">
                    <Cloud className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        El cliente {clientName} no tiene nubes habilitadas para conexión.
                    </p>
                </div>
            )}
        </section>
    )
}