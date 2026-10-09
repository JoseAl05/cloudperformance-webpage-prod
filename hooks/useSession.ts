import { fetchJson } from '@/lib/fetcher';
import { User } from '@/types/db';
import useSWR from 'swr';

const fetcher = (url: string) =>
    fetchJson(url, { credentials: 'include' });

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher, { revalidateOnFocus: true });
  return {
    user: data?.user as User ?? null,
    error,
    isLoading,
    refresh: mutate
  };
}