'use client';

import { SWRConfig } from 'swr';
import { toast } from 'sonner';
import { FetchError, isTimeoutError } from '@/lib/fetcher';

const MAX_ERROR_RETRIES = 2;
const ERROR_RETRY_INTERVAL_MS = 5000;

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,

                revalidateOnReconnect: false,

                onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
                    if (error instanceof FetchError && error.status >= 400 && error.status < 500) return;
                    if (isTimeoutError(error)) return;
                    if (retryCount >= MAX_ERROR_RETRIES) return;
                    setTimeout(() => revalidate({ retryCount }), ERROR_RETRY_INTERVAL_MS);
                },

                onError: (error) => {
                    if (isTimeoutError(error)) {
                        toast.error(error.message, { id: 'fetch-timeout', duration: 10_000 });
                    }
                },
            }}
        >
            {children}
        </SWRConfig>
    );
};