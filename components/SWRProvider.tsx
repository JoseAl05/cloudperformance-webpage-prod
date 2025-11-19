'use client';

import { SWRConfig } from 'swr';

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig
            value={{
                // Desactiva la revalidación al enfocar la ventana (soluciona tu problema)
                revalidateOnFocus: false,

                // Opcional: Evita recargar al recuperar conexión a internet
                revalidateOnReconnect: false,
            }}
        >
            {children}
        </SWRConfig>
    );
};