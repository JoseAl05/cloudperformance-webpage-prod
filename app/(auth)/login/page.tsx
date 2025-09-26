import Image from 'next/image';
import { LoginFormComponent } from '@/components/auth/LoginFormComponent';
import { Suspense } from 'react';

export default function LoginPage() {

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='text-primary-foreground flex items-center justify-center rounded-md'>
              <Image
                src='/logo.png'
                alt='Logo Cloudperformance Pequeño'
                width={70}
                height={70}
              />
            </div>
            Cloudperformance
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <Suspense fallback={<div>Cargando...</div>}>
              <LoginFormComponent />
            </Suspense>
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <Image
          src='/logo-cloudperformance.svg'
          alt='Logo Cloudperformance Grande'
          fill
          priority
          quality={100}
          // Indica cuánta pantalla ocupa en cada breakpoint para generar srcset correcto.
          sizes='(min-width: 1024px) 50vw, 100vw'
          // Ajusta cómo se encaja la imagen dentro del contenedor.
          className='absolute inset-0 object-contain object-center select-none pointer-events-none
                     dark:brightness-[0.2] dark:grayscale'
          draggable={false}
        />
      </div>
    </div>
  );
}