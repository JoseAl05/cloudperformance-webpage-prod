import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export const LoaderComponent = () => {
    return (
        <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-0 animate-pulse">
                <Image
                    alt='Logo Cloudperformance'
                    src='/logo-cloudperformance.png'
                    width={80}
                    height={80}
                />
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs text-muted-foreground pt-2">Cargando datos de la instancia…</span>
            </div>
        </div>
    )
}