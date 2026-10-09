'use client';

import { SWRConfig } from 'swr';
import { FetchError } from '@/lib/fetcher';

const MAX_ERROR_RETRIES = 2;
const ERROR_RETRY_INTERVAL_MS = 5000;

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig
            value={{
                // Desactiva la revalidación al enfocar la ventana (soluciona tu problema)
                revalidateOnFocus: false,

                // Opcional: Evita recargar al recuperar conexión a internet
                revalidateOnReconnect: false,

                // lib/fetcher lanza error en respuestas no-2xx: un 4xx no se reintenta (repetirlo no
                // cambia el resultado) y los 5xx / errores de red se reintentan como máximo 2 veces.
                onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
                    if (error instanceof FetchError && error.status >= 400 && error.status < 500) return;
                    if (retryCount >= MAX_ERROR_RETRIES) return;
                    setTimeout(() => revalidate({ retryCount }), ERROR_RETRY_INTERVAL_MS);
                },
            }}
        >
            {children}
        </SWRConfig>
    );
};