import { User } from '@/types/db';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher, { revalidateOnFocus: true });
  return {
    user: data?.user as User ?? null,
    error,
    isLoading,
    refresh: mutate
  };
}