"use client"

import { useSession } from '@/hooks/useSession'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import Link from 'next/link'
import Image from 'next/image'
import { Cloud, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SelectCloudComponent = () => {
  const actualSession = useSession()

  if (actualSession.isLoading) return <LoaderComponent />
  if (actualSession.error) return <p className="text-sm text-destructive">Error</p>

  const isAzure = actualSession.user?.is_azure
  const isAws = actualSession.user?.is_aws
  const nothing = !isAzure && !isAws

  return (
    <section className="mx-auto max-w-5xl px-4">
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
            href="/azure"
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
                  Costos, recursos, tendencias y funciones especializadas.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        )}

        {isAws && (
          <Link
            href="/aws"
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
            No tienes nubes habilitadas todavía. Solicítalo a un administrador.
          </p>
        </div>
      )}
    </section>
  )
}
