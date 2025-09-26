'use client';
import { useSession } from '@/hooks/useSession';

export default function AuthGuardNote() {
  const { user } = useSession();
  return (
    <div className="rounded-xl border p-4 text-sm">
      <p><strong>Estado:</strong> {user ? `Autenticado como ${user.username} (${user.client})` : 'No autenticado'}</p>
    </div>
  );
}