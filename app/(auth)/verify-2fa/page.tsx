import Image from 'next/image'
import { Suspense } from 'react'
import { Verify2FaComponent } from '@/components/auth/Verify2FaComponent'

export default function Verify2FaPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <Image src="/logo-intac.svg" alt="Logo Intac" width={70} height={70} />
            </div>
            Cloudperformance
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<div>Cargando...</div>}>
              <Verify2FaComponent />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/logo-cloudperformance.svg"
          alt="Logo Cloudperformance Grande"
          fill
          priority
          quality={100}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 object-contain object-center select-none pointer-events-none
                     filter-none dark:filter-none grayscale-0 dark:grayscale-0 brightness-100 dark:brightness-100"
          draggable={false}
        />
      </div>
    </div>
  )
}
