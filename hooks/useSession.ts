import { fetchJson } from '@/lib/fetcher';
import { User } from '@/types/db';
import useSWR from 'swr';

const fetcher = <T = unknown>(url: string) =>
    fetchJson<T>(url, { credentials: 'include' });

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR<{ user?: User }>('/api/auth/me', fetcher, { revalidateOnFocus: true });
  return {
    user: data?.user ?? null,
    error,
    isLoading,
    refresh: mutate
  };
}