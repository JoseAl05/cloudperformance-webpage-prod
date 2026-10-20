import { fetchJson } from '@/lib/fetcher';
import { ClientConnector } from '@/types/db';
import useSWR from 'swr';

const fetcher = <T = unknown>(url: string) =>
    fetchJson<T>(url, { credentials: 'include' });

export function useConnector() {
  const { data, error, isLoading, mutate } = useSWR<{ user?: { connectors?: ClientConnector[] } }>('/api/auth/me', fetcher, { revalidateOnFocus: true });
  return {
    connectors: data?.user?.connectors ?? null,
    error,
    isLoading,
    refresh: mutate
  };
}