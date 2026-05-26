import { ClientConnector } from '@/types/db';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useConnector() {
  const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher, { revalidateOnFocus: true });
  return {
    connectors: data?.user.connectors as ClientConnector[] ?? null,
    error,
    isLoading,
    refresh: mutate
  };
}